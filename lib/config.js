/*
 * Create and export configuration variables
 *
 */


// Container for all environments
const environments = {};


// Staging (default) environment
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
      },
    'templateGlobals' : {
        'appName' : 'UptimeChecker',
        'companyName' : 'Hopertz, Inc.',
        'yearCreated' : '2022',
        'baseUrl' : 'http://localhost:3000/'
      }
}


// Production environment
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
      },
    'templateGlobals' : {
        'appName' : 'UptimeChecker',
        'companyName' : 'Hopertz, Inc.',
        'yearCreated' : '2022',
        'baseUrl' : 'http://localhost:3000/'
      }

}


// Determine which environment was passed as a command-line argument
const currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase(): '';

// Check that the current environment is one of the environments above, if not default to staging
const envToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = envToExport ;