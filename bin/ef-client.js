#! /usr/bin/env node
var EfClient = require("./index").EfClient;

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_IOT_ENDPOINT) 
  throw new Error('AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY & AWS_IOT_ENDPOINT (env) required');

new EfClient({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  endpointAddress: process.env.AWS_IOT_ENDPOINT,
  region: process.env.AWS_REGION || 'us-east-1'
});
