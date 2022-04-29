const crypto = require('crypto');
const config = require('./config');

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



module.exports = helpers