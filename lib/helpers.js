const crypto = require('crypto');
const config = require('./config');
const https = require('https');

const helpers = {};

helpers.hash = (password)=>{
    if (typeof(password) === 'string' && password.length > 0){

       const hash = crypto.createHmac('sha256',config.hashingSecret).update(password).digest('hex');
       return hash;

    }else{
        return false;
    }
};


helpers.parseJsonToObject = (str) => {
    try {
        const obj = JSON.parse(str);
        return obj
    } catch (e) {
    return {}

    }
};


helpers.createRandomString = (strLength) => {
    strLength = typeof(strLength) == 'number' &&  strLength > 0 ? strLength : false;

    if (strLength){

        let result  = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for ( var i = 0; i < strLength; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
       }
       return result;

    }else{

        return false;
    }

   
  
}

helpers.sendTwilioSms = function(phone,msg,callback){
    // Validate parameters
    phone = typeof(phone) == 'string' && phone.trim().length == 9 ? phone.trim() : false;
    msg = typeof(msg) == 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false;
    if(phone && msg){
  
      // Configure the request payload
      const payload = {
        'From' : config.twilio.fromPhone,
        'To' : '+255'+phone,
        'Body' : msg
      };
      const payloadObj = new URLSearchParams(payload);
      const stringPayload = payloadObj.toString();
  
  
      // Configure the request details
      const requestDetails = {
        'protocol' : 'https:',
        'hostname' : 'api.twilio.com',
        'method' : 'POST',
        'path' : '/2010-04-01/Accounts/'+config.twilio.accountSid+'/Messages.json',
        'auth' : config.twilio.accountSid+':'+config.twilio.authToken,
        'headers' : {
          'Content-Type' : 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(stringPayload)
        }
      };
  
      // Instantiate the request object
      const req = https.request(requestDetails,(res)=>{
          // Grab the status of the sent request
          const status =  res.statusCode;
          

          // Debuging response body
          //res.setEncoding('utf8');
          //res.on('data', (chunk) => {
          //  console.log(`BODY:  ${chunk}`);
          //});

          // Callback successfully if the request went through
          if(status == 200 || status == 201){
            callback(false);
          } else {
            callback('Status code returned was '+status);
          }
      });
  
      // Bind to the error event so it doesn't get thrown
      req.on('error',(e)=>{
        callback(e);
      });
  
      // Add the payload
      req.write(stringPayload);
  
      // End the request
      req.end();
  
    } else {
      callback('Given parameters were missing or invalid');
    }
  };



module.exports = helpers