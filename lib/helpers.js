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


module.exports = helpers