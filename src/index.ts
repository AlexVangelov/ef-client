import AWSMqtt = require('aws-mqtt-client');
import { USBDevice } from './device/usb';

export class EfClient {
  awsMqtt :any;
  device :any;

  constructor(options: any = {}) {
    this.awsMqtt = new AWSMqtt.default({
      accessKeyId: options.accessKeyId,
      secretAccessKey: options.secretAccessKey,
      //sessionToken: AWS_SESSION_TOKEN,
      endpointAddress: options.endpointAddress,
      region: options.region
    });

    this.awsMqtt.on('connect', () => {
      this.awsMqtt.subscribe('abcdef');
      console.log('connected to iot mqtt websocket');
    });

    let self = this;
    this.awsMqtt.on('message', (topic, message)=> {
      console.log(message.toString());
      console.log(message);
      self.device.write(message, ()=> {
        console.log('Transfer done!');
      });
    });

    this.device = new USBDevice();

    this.device.open(()=> {
      console.log('Device ready!');
    });
  }
}
