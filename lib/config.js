const environments = {};

environments.staging = {
    'httpPort':3000,
    'httpsPort':3001,
    'envName': 'staging',
    'hashingSecret' : 'thisIsASecret',
    'maxChecks': 5,
    'twilio' : {
        'accountSid' : 'AC4ba1550cb35c80605074baef95898808',
        'authToken' : '7bee1647d4cf0457b73be80a23361479',
        'fromPhone' : '+15005550006'
      }
}

environments.production = {
    'httpPort':5000,
    'httpsPort':5001,
    'envName': 'production',
    'hashingSecret' : 'thisIsAlsoASecret',
    'maxChecks': 5,
    'twilio' : {
        'accountSid' : 'AC4ba1550cb35c80605074baef95898808',
        'authToken' : '7bee1647d4cf0457b73be80a23361479',
        'fromPhone' : '+15005550006'
      }

}

const currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase(): '';

const envToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

module.exports = envToExport ;