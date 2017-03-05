import usb = require('usb');

export class USBDevice {
  device :any;
  outEndpoint :any;
  inEndpoint :any;

  constructor(options :any = {}) {
    let devices = USBDevice.findPrinter();
    if(devices && devices.length) {
      console.log('USB printer found!');
      this.device = devices[0];
    }
  }

  open(callback ?:Function) {
    let self = this, counter = 0, index = 0;
    this.device.open();
    this.device.interfaces.forEach((iface)=> {
      iface.setAltSetting(iface.altSetting, ()=> {
        if(iface.isKernelDriverActive()) {
          try {
            iface.detachKernelDriver();
          } catch(e) {
            console.error("[ERROR] Could not detatch kernel driver: %s", e)
          }
        }
        iface.claim(); // must be called before using any endpoints of this interface.
        iface.endpoints.filter((endpoint)=> {
          if(endpoint.direction == 'out' && !self.outEndpoint) {
            self.outEndpoint = endpoint;
          }
        });
        if (self.outEndpoint) {
          callback && callback(null, self);
        } else {
          callback && callback(new Error('Can not find endpoint from printer'));
        }
        if (self.inEndpoint) {
          console.log('In endpint found!');
        }
      });
    });
    return this;
  }

  write(data, callback){
    this.outEndpoint.transfer(data, callback);
    return this;
  };

  close = function(callback){
    this.device.close(callback);
    return this;
  };

  static findPrinter() {
    return usb.getDeviceList().filter((device)=> {
      try {
        return device.configDescriptor.interfaces.filter((iface)=> {
          return iface.filter((conf)=> {
            return conf.bInterfaceClass === 0x07; //printer
          }).length;
        }).length;
      } catch(e) {
        console.warn(e);
        return false;
      }
    });
  }
}