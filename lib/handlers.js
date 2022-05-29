/*
 * Request Handlers
 *
 */

// Dependencies
const _data = require('./data');
const helpers = require('./helpers');
const config = require('./config');

// Define all the handlers
const handlers = {};

/*
 * HTML Handlers
 *
 */

// Index Handler
handlers.index = (data,callback)=>{
    // Reject any request that isn't a GET
    if(data.method == 'GET'){
      // Prepare data for interpolation
      const templateData = {
        'head.title' : 'Uptime Monitoring - Made Simple',
        'head.description' : 'We offer free, simple uptime monitoring for HTTP/HTTPS sites all kinds. When your site goes down, we\'ll send you a text to let you know',
        'body.class' : 'index'
      };
      // Read in a template as a string
      helpers.getTemplate('index',templateData,(err,str)=>{
        if(!err && str){
          // Add the universal header and footer
          helpers.addUniversalTemplates(str,templateData,(err,str)=>{
            if(!err && str){
              // Return that page as HTML
              callback(200,str,'html');
            } else {
              callback(500,undefined,'html');
            }
          });
        } else {
          callback(500,undefined,'html');
        }
      });
    } else {
      callback(405,undefined,'html');
    }
  };


// Create Account
handlers.accountCreate = (data,callback)=>{
    // Reject any request that isn't a GET
    if(data.method == 'GET'){
      // Prepare data for interpolation
      const templateData = {
        'head.title' : 'Create an Account',
        'head.description' : 'Signup is easy and only takes a few seconds.',
        'body.class' : 'accountCreate'
      };
      // Read in a template as a string
      helpers.getTemplate('accountCreate',templateData,(err,str)=>{
        if(!err && str){
          // Add the universal header and footer
          helpers.addUniversalTemplates(str,templateData,(err,str)=>{
            if(!err && str){
              // Return that page as HTML
              callback(200,str,'html');
            } else {
              callback(500,undefined,'html');
            }
          });
        } else {
          callback(500,undefined,'html');
        }
      });
    } else {
      callback(405,undefined,'html');
    }
  };


// Create New Session
handlers.sessionCreate = (data,callback)=>{
    // Reject any request that isn't a GET
    if(data.method == 'GET'){
      // Prepare data for interpolation
      const templateData = {
        'head.title' : 'Login to your account.',
        'head.description' : 'Please enter your phone number and password to access your account.',
        'body.class' : 'sessionCreate'
      };
      // Read in a template as a string
      helpers.getTemplate('sessionCreate',templateData,(err,str)=>{
        if(!err && str){
          // Add the universal header and footer
          helpers.addUniversalTemplates(str,templateData,(err,str)=>{
            if(!err && str){
              // Return that page as HTML
              callback(200,str,'html');
            } else {
              callback(500,undefined,'html');
            }
          });
        } else {
          callback(500,undefined,'html');
        }
      });
    } else {
      callback(405,undefined,'html');
    }
  }; 



// Session has been deleted
handlers.sessionDeleted = (data,callback)=>{
    // Reject any request that isn't a GET
    if(data.method == 'GET'){
      // Prepare data for interpolation
      const templateData = {
        'head.title' : 'Logged Out',
        'head.description' : 'You have been logged out of your account.',
        'body.class' : 'sessionDeleted'
      };
      // Read in a template as a string
      helpers.getTemplate('sessionDeleted',templateData,(err,str)=>{
        if(!err && str){
          // Add the universal header and footer
          helpers.addUniversalTemplates(str,templateData,(err,str)=>{
            if(!err && str){
              // Return that page as HTML
              callback(200,str,'html');
            } else {
              callback(500,undefined,'html');
            }
          });
        } else {
          callback(500,undefined,'html');
        }
      });
    } else {
      callback(405,undefined,'html');
    }
  };

// Edit Your Account
handlers.accountEdit = (data,callback)=>{
  // Reject any request that isn't a GET
  if(data.method == 'GET'){
    // Prepare data for interpolation
    var templateData = {
      'head.title' : 'Account Settings',
      'body.class' : 'accountEdit'
    };
    // Read in a template as a string
    helpers.getTemplate('accountEdit',templateData,(err,str)=>{
      if(!err && str){
        // Add the universal header and footer
        helpers.addUniversalTemplates(str,templateData,(err,str)=>{
          if(!err && str){
            // Return that page as HTML
            callback(200,str,'html');
          } else {
            callback(500,undefined,'html');
          }
        });
      } else {
        callback(500,undefined,'html');
      }
    });
  } else {
    callback(405,undefined,'html');
  }
};

// Account has been deleted
handlers.accountDeleted = (data,callback)=>{
  // Reject any request that isn't a GET
  if(data.method == 'GET'){
    // Prepare data for interpolation
    var templateData = {
      'head.title' : 'Account Deleted',
      'head.description' : 'Your account has been deleted.',
      'body.class' : 'accountDeleted'
    };
    // Read in a template as a string
    helpers.getTemplate('accountDeleted',templateData,(err,str)=>{
      if(!err && str){
        // Add the universal header and footer
        helpers.addUniversalTemplates(str,templateData,(err,str)=>{
          if(!err && str){
            // Return that page as HTML
            callback(200,str,'html');
          } else {
            callback(500,undefined,'html');
          }
        });
      } else {
        callback(500,undefined,'html');
      }
    });
  } else {
    callback(405,undefined,'html');
  }
};

// Create a new check
handlers.checksCreate = (data,callback)=>{
  // Reject any request that isn't a GET
  if(data.method == 'GET'){
    // Prepare data for interpolation
    var templateData = {
      'head.title' : 'Create a New Check',
      'body.class' : 'checksCreate'
    };
    // Read in a template as a string
    helpers.getTemplate('checksCreate',templateData,(err,str)=>{
      if(!err && str){
        // Add the universal header and footer
        helpers.addUniversalTemplates(str,templateData,(err,str)=>{
          if(!err && str){
            // Return that page as HTML
            callback(200,str,'html');
          } else {
            callback(500,undefined,'html');
          }
        });
      } else {
        callback(500,undefined,'html');
      }
    });
  } else {
    callback(405,undefined,'html');
  }
};

// Dashboard (view all checks)
handlers.checksList = (data,callback)=>{
  // Reject any request that isn't a GET
  if(data.method == 'GET'){
    // Prepare data for interpolation
    var templateData = {
      'head.title' : 'Dashboard',
      'body.class' : 'checksList'
    };
    // Read in a template as a string
    helpers.getTemplate('checksList',templateData,(err,str)=>{
      if(!err && str){
        // Add the universal header and footer
        helpers.addUniversalTemplates(str,templateData,(err,str)=>{
          if(!err && str){
            // Return that page as HTML
            callback(200,str,'html');
          } else {
            callback(500,undefined,'html');
          }
        });
      } else {
        callback(500,undefined,'html');
      }
    });
  } else {
    callback(405,undefined,'html');
  }
};



// Favicon
handlers.favicon = (data,callback)=>{
    // Reject any request that isn't a GET
    if(data.method == 'GET'){
      // Read in the favicon's data
      helpers.getStaticAsset('favicon.ico',(err,data)=>{
        if(!err && data){
          // Callback the data
          callback(200,data,'favicon');
        } else {
          callback(500);
        }
      });
    } else {
      callback(405);
    }
  };



// Public assets
handlers.public = (data,callback)=>{
    // Reject any request that isn't a GET
    if(data.method == 'GET'){
      // Get the filename being requested
      var trimmedAssetName = data.trimmedPath.replace('public/','').trim();
      if(trimmedAssetName.length > 0){
        // Read in the asset's data
        helpers.getStaticAsset(trimmedAssetName,function(err,data){
          if(!err && data){
  
            // Determine the content type (default to plain text)
            let contentType = 'plain';
  
            if(trimmedAssetName.indexOf('.css') > -1){
              contentType = 'css';
            }
  
            if(trimmedAssetName.indexOf('.png') > -1){
              contentType = 'png';
            }
  
            if(trimmedAssetName.indexOf('.jpg') > -1){
              contentType = 'jpg';
            }
  
            if(trimmedAssetName.indexOf('.ico') > -1){
              contentType = 'favicon';
            }
  
            // Callback the data
            callback(200,data,contentType);
          } else {
            callback(404);
          }
        });
      } else {
        callback(404);
      }
  
    } else {
      callback(405);
    }
  };
  
  
/*
 * JSON API Handlers
 *
 */

// Ping
handlers.ping = (data,callback)=>{
       callback(200);

};

// Not-Found
handlers.notFound = (data,callback)=>{
    callback(404);
};


// Users
handlers.users = (data,callback)=>{
    const acceptableMethods = ['PUT','GET','POST','DELETE'];
    if (acceptableMethods.indexOf(data.method)>-1) {
       handlers._users[data.method](data,callback);

    }else {
      callback(405)
    }

};

// Container for all the users methods
handlers._users = {};

// Users - post
// Required data: firstName, lastName, phone, password, tosAgreement
// Optional data: none

handlers._users.POST = (data,callback)=>{
   // Check that all required fields are filled out

   const firstName = typeof(data.payLoad.firstName) === 'string' && data.payLoad.firstName.trim().length > 0 ? data.payLoad.firstName.trim():false;
   const lastName = typeof(data.payLoad.lastName) === 'string' && data.payLoad.lastName.trim().length  > 0 ? data.payLoad.lastName.trim():false;
   const phone = typeof(data.payLoad.phone) === 'string' && data.payLoad.phone.trim().length == 9 ? data.payLoad.phone.trim():false;
   const password = typeof(data.payLoad.password) === 'string' && data.payLoad.password.trim().length > 0 ? data.payLoad.password.trim():false;
   const tosAgreement = typeof(data.payLoad.tosAgreement) == 'boolean' && data.payLoad.tosAgreement === true ? true:false;


   if (firstName && lastName && phone && password && tosAgreement){
      // Make sure the user doesnt already exist
      _data.read('users',phone,(err,data) => {
          if (err) {
              // Hash the password
              const hashedPassword = helpers.hash(password);
          
              if (hashedPassword){
                 // Create the user object
                 userObject = {
                     "firstName" : firstName,
                     "lastName" : lastName,
                     "phone" :  phone,
                     "hashedPassword" : hashedPassword,
                     "tosAgreement" : tosAgreement
                 }
                 
                 // Store the user
                 _data.create('users',phone,userObject,(err)=>{
                     if(!err){
                       callback(200);

                     }else {
                        console.log(err)
                        callback(500,{'Error':'Could not create a new user'}); 
                     }
                 })
                 
              }

              else {
                callback(500,{'Error' : 'Could not hash the user\'s password.'});
              }

          } else {
              // User alread exists
              callback(400,{'Error' : 'A user with that phone number already exists'});
          }

      });

   } else{
       callback(400,{'Error' : 'Missing required fields'});
   }

}


// Required data: phone
// Optional data: none
handlers._users.GET = (data,callback)=>{
    // Check that phone number is valid
    const phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 9 ? data.queryStringObject.phone.trim():false;

    if (phone) {
        // Get token from headers
        const token = typeof(data.headers.token) == 'string' ? data.headers.token : false


         // Verify that the given token is valid for the phone number
        handlers._tokens.verifyToken(token,phone,(tokenIsValid)=>{
            if (tokenIsValid){
                // Lookup the user
                _data.read('users',phone,(err,data)=>{
                    if (!err && data){
                       // Remove the hashed password from the user user object before returning it to the requester
                       delete data.hashedPassword;
                       callback(200,data);
                    }else {
                        callback(404);
                    }
                });
         

            }else{
                callback(403,{"Error" : "Missing required token in header, or token is invalid."})
            }

        });
       
    }else{
        callback(400,{'Error' : 'Missing required field'})
    }
    
};

// Required data: phone
// Optional data: firstName, lastName, password (at least one must be specified)
handlers._users.PUT = (data,callback)=>{
    // Check for required field
    const phone = typeof(data.payLoad.phone) === 'string' && data.payLoad.phone.trim().length == 9 ? data.payLoad.phone.trim():false;

    // Check for optional fields
    const firstName = typeof(data.payLoad.firstName) === 'string' && data.payLoad.firstName.trim().length > 0 ? data.payLoad.firstName.trim():false;
    const lastName = typeof(data.payLoad.lastName) === 'string' && data.payLoad.lastName.trim().length  > 0 ? data.payLoad.lastName.trim():false;
    const password = typeof(data.payLoad.password) === 'string' && data.payLoad.password.trim().length > 0 ? data.payLoad.password.trim():false;
    
    // Error if phone is invalid
    if(phone){
        // Error if nothing is sent to update
        if (firstName || lastName|| password){
            
            // Get token from headers
            const token = typeof(data.headers.token) == 'string' ? data.headers.token : false
           
            // Verify that the given token is valid for the phone number
            handlers._tokens.verifyToken(token,phone,(tokenIsValid)=>{
                if (tokenIsValid){

                    // Lookup the user
                    _data.read('users',phone,(err,userData)=>{
                        if (!err && userData){
                            // Update the fields if necessary
                           if (firstName){
                               userData.firstName = firstName;
                           }
            
                           if (lastName){
                            userData.lastName = lastName;
                           }
            
                           if (password){
                            userData.hashedPassword = helpers.hash(password);
                           }

                           // Store the new updates
                           _data.update('users',phone,userData,(err)=>{
                               if (!err){
                                   callback(200);
                               }else{
                                  callback(500,{'Error' : 'Could not update the user.'});
                               }
                           });
                        }else {
                            callback(400,{'Error' : 'Specified user does not exist.'}); 
                        }
                    });
        
                }else{
                    callback(403,{"Error" : "Missing required token in header, or token is invalid."});
                }
    
            });

          
        }else{
            callback(400,{'Error' : 'Missing fields to update.'});
        }

    }else{
        callback(400,{'Error' : 'Missing required field.'});
    }
    
}


// Required data: phone
// Cleanup old checks associated with the user
handlers._users.DELETE = (data,callback)=>{
    // Check that phone number is valid
    const phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 9 ? data.queryStringObject.phone.trim():false;
    if (phone) {
        // Get token from headers
        const token = typeof(data.headers.token) == 'string' ? data.headers.token : false
        
         // Verify that the given token is valid for the phone number
        handlers._tokens.verifyToken(token,phone,(tokenIsValid)=>{
            if (tokenIsValid){
                // Lookup the user
                _data.read('users',phone,(err,userData)=>{
                    if (!err && userData){
                        // Delete the user's data
                       _data.delete('users',phone,(err)=>{
                           if(!err){
                               // Delete each of the checks associated with the user
                               const userChecks = typeof(userData.checks)== 'object' && userData.checks instanceof Array ? userData.checks : [];
                               const checksToDelete = userChecks.length;
                               if (checksToDelete > 0){
                                  let checksDeleted = 0;
                                  const deletionErrors = false;

                                  // Loop through the checks
                                  userChecks.forEach(checkId => {
                                      // Delete the check
                                      _data.delete('checks', checkId,(err)=>{
                                          if (err) {
                                              deletionErrors = true;
                                          }
                                          checksDeleted++;
                                          if(checksDeleted == checksToDelete){
                                              if(!deletionErrors){
                                                callback(200);
                                              }else{
                                                callback(500,{'Error' : "Errors encountered while attempting to delete all of the user's checks. All checks may not have been deleted from the system successfully."})
                                              }
                                          }
                                      });
                                      
                                  });
                               }else{
                                 callback(200);
                               }
                           }else{
                              callback(500,{'Error' : 'Could not delete the specified user'}); 
                           }
                       });
         
                    }else {
                        callback(400,{'Error' : 'Could not find the specified user.'});
                    }
                });
         

            }else{
                callback(403,{"Error" : "Missing required token in header, or token is invalid."});
            }

        });
    
    }else{
        callback(400,{'Error' : 'Missing required field'})
    }
    
    
}

// Tokens
handlers.tokens = (data,callback)=>{
    const acceptableMethods = ['PUT','GET','POST','DELETE'];
    if (acceptableMethods.indexOf(data.method)>-1) {
       handlers._tokens[data.method](data,callback);

    }else {
      callback(405)
    }

};

// Container for all the tokens methods

handlers._tokens = {};


// Tokens - POST
// Required data: phone, password
// Optional data: none
handlers._tokens.POST = (data,callback)=>{
    const phone = typeof(data.payLoad.phone) === 'string' && data.payLoad.phone.trim().length == 9 ? data.payLoad.phone.trim():false;
    const password = typeof(data.payLoad.password) === 'string' && data.payLoad.password.trim().length > 0 ? data.payLoad.password.trim():false;

    if (phone && password){
        // Lookup the user who matches that phone number
       _data.read('users',phone,(err,userData)=>{
           if(!err && userData){
               // Hash the sent password, and compare it to the password stored in the user object
               const hashedPassword = helpers.hash(password);
               if (hashedPassword == userData.hashedPassword){
                   
                 // If valid, create a new token with a random name. Set an expiration date 24 hours in the future.
                  const tokenId = helpers.createRandomString(20);
                  const expires = Date.now() + 1000 * 60 * 60;

                  tokenObject = {
                      'phone': phone,
                      'id': tokenId,
                      'expires': expires
                  };
                  
                  // Store the token
                  _data.create('tokens',tokenId,tokenObject,(err)=>{
                      if (!err){
                          callback(200,tokenObject);
                      }else{
                        callback(500,{'Error' : 'Could not create the new token'});  
                      }
                  });

               }else{
                callback(400,{'Error' : 'Password did not match the specified user\'s stored password'});
               }
              
           }else{
               callback(400,{'Error' : 'Could not find the specified user.'});
           }
       })

    }else{

        callback(400,{'Error' : 'Missing required field(s).'})

    }
};


// Tokens - GET
// Required data: id
// Optional data: none
handlers._tokens.GET = (data,callback)=>{
    // Check that id is valid
    const id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim():false;

    if (id) {
       // Lookup the token
       _data.read('tokens',id,(err,tokenData)=>{
           if (!err && tokenData){
              callback(200,tokenData);
           }else {
             callback(404); 
           }
       });

    }else{
        callback(400,{'Error' : 'Missing required field, or field invalid'})

    }
};


// Tokens - PUT
// Required data: id, extend
// Optional data: none
handlers._tokens.PUT = (data,callback)=>{
    const id = typeof(data.payLoad.id) === 'string' && data.payLoad.id.trim().length == 20 ? data.payLoad.id.trim():false;
    const extend = typeof(data.payLoad.extend) == 'boolean' && data.payLoad.extend === true ? true:false;

    if (id && extend){
        // Lookup the existing token
        _data.read('tokens',id,(err,tokenData)=>{
            if(!err && tokenData){
                // Check to make sure the token isn't already expired
                if(tokenData.expires > Date.now()){
                    // Set the expiration an 24 hours from now
                    tokenData.expires = Date.now() + 1000*60*60

                    // Store the new updates
                    _data.update('tokens',id,tokenData,(err)=>{
                        if(!err){
                            callback(200);

                        }else{
                            callback(500,{'Error' : 'Could not update the token\'s expiration.'});
                        }
                    });
                }else{
                    callback(400,{"Error" : "The token has already expired, and cannot be extended."});
                }
            }else{
                callback(400,{'Error' : 'Specified user does not exist.'});
            }
        });

    }else{
        callback(400,{"Error": "Missing required field(s) or field(s) are invalid."});
    }

};


// Tokens - DELETE
// Required data: id
// Optional data: none
handlers._tokens.DELETE = (data,callback)=>{
    // Check that id is valid
    const id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim():false;

    if (id) {
       _data.read('tokens',id,(err,data)=>{
           if (!err && data){
              _data.delete('tokens',id,(err)=>{
                  if(!err){
                      callback(200);
                  }else{
                    callback(500,{'Error' : 'Could not delete the specified token'});
                  }
              });

           }else {
              callback(400,{'Error' : 'Could not find the specified token.'});
           }
       });

    }else{
        callback(400,{'Error' : 'Missing required field'})
    }
};



// Verify if a given token id is currently valid for a given user
handlers._tokens.verifyToken = (id,phone,callback) => {
    // Lookup the token
    _data.read('tokens',id,(err,tokenData)=>{
        if(!err && tokenData){
          // Check that the token is for the given user and has not expired
          if (tokenData.phone == phone && tokenData.expires > Date.now()){
              callback(true);
          }else{
              callback(false);
          }

        }else{
            callback(false);
        }
    });
};


// Checks
handlers.checks = (data,callback)=>{
    const acceptableMethods = ['PUT','GET','POST','DELETE'];
    if (acceptableMethods.indexOf(data.method)>-1) {
       handlers._checks[data.method](data,callback);

    }else {
      callback(405)
    }

};

// Container for all the checks methods
handlers._checks = {};


// Checks - POST
// Required data: protocol,url,method,successCodes,timeoutSeconds
// Optional data: none
handlers._checks.POST = (data,callback)=>{
    // Validate inputs
    const protocol = typeof(data.payLoad.protocol) == 'string' && ['http','https'].indexOf(data.payLoad.protocol)>-1 ? data.payLoad.protocol:false;
    const method = typeof(data.payLoad.method) == 'string' &&  ['PUT','GET','POST','DELETE'].indexOf(data.payLoad.method)>-1 ? data.payLoad.method:false;
    const url =  typeof(data.payLoad.url) == 'string' && data.payLoad.url.trim().length > 0 ? data.payLoad.url.trim():false; 
    const successCodes = typeof(data.payLoad.successCodes) == 'object' && data.payLoad.successCodes instanceof Array && data.payLoad.successCodes.length > 0 ? data.payLoad.successCodes : false;
    const timeoutSeconds = typeof(data.payLoad.timeoutSeconds) == 'number' && data.payLoad.timeoutSeconds % 1 == 0 && data.payLoad.timeoutSeconds >=1 && data.payLoad.timeoutSeconds <=5 ? data.payLoad.timeoutSeconds : false;
    
    if (protocol && method && url && successCodes && timeoutSeconds){
         // Get token from headers
        const token = typeof(data.headers.token) == 'string'? data.headers.token : false;

         // Lookup the user phone by reading the token
        _data.read('tokens',token,(err,tokenData) => {
            if (!err && tokenData) {
               const userPhone = tokenData.phone;
               _data.read('users',userPhone,(err,userData)=>{
                
                   if (!err && userData){

                       const userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
                       // Verify that user has less than the number of max-checks per user

                       if (userChecks.length < config.maxChecks){
                          // Create random id for check
                          const checkId = helpers.createRandomString(20);

                          // Create check object including userPhone
                          const checkObject = {
                              'id':checkId,
                              'userPhone': userPhone,
                              'protocol' : protocol,
                              'url': url,
                              'method': method,
                              'successCodes' : successCodes,
                              'timeoutSeconds' : timeoutSeconds
                          } 

                          // Save the object
                          _data.create('checks',checkId,checkObject,(err)=>{
                               if(!err){
                                  // Add check id to the user's object
                                  userData.checks = userChecks;
                                  userData.checks.push(checkId);
                                  
                                  // Save the new user data
                                  _data.update('Users',userPhone,userData,(err)=>{
                                       if (!err){
                                           // Return the data about the new check
                                           callback(200,checkObject);

                                       }else{
                                           callback(500,{'Error' : 'Could not update the user with the new check.'});
                                       }
                                   });

                                }else{
                                    callback(500,{'Error' : 'Could not create the new check'});
                           }
                           });

                        }else{
                            callback(400,{'Error' : 'The user already has the maximum number of checks ('+config.maxChecks+').'})
                          }
                   }else{

                     callback(403);

                   }

               })

            }else{
                callback(403);
            }
        })

    }else{
        callback(400,{'Error' : 'Missing required inputs, or inputs are invalid'});
    }
}


// Checks - GET
// Required data: id
// Optional data: none

handlers._checks.GET = (data,callback)=>{
    // Check that id is valid
    const id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim():false;

    if (id) {
       // Lookup the check
        _data.read('checks',id,(err,checkData)=>{
            if (!err && checkData) {
              // Get the token that sent the request
              const token = typeof(data.headers.token) == 'string' ? data.headers.token : false

              
              // Verify that the given token is valid and belongs to the user who created the check
              handlers._tokens.verifyToken(token,checkData.userPhone,(tokenIsValid)=>{
              if (tokenIsValid){
                 // Return check data
                 callback(200, checkData);
               
              }else{
                callback(403) 
              }

        });

            }else{
                callback(404)
            }

        });

        
       
    }else{
        callback(400,{'Error' : 'Missing required field, or field invalid'})
    }
    
};


// Checks - PUT
// Required data: id
// Optional data: protocol,url,method,successCodes,timeoutSeconds (one must be sent)
handlers._checks.PUT = (data,callback) =>{
    // Check for required field
    const id = typeof(data.payLoad.id) === 'string' && data.payLoad.id.trim().length == 20 ? data.payLoad.id.trim():false;
    
    // Check for optional fields
    const protocol = typeof(data.payLoad.protocol) == 'object' && ['http','https'].indexOf(data.payLoad.protocol) ? data.payLoad.protocol:false;
    const method = typeof(data.payLoad.method) == 'object' &&  ['PUT','GET','POST','DELETE'].indexOf(data.payLoad.method) ? data.payLoad.method:false;
    const url =  typeof(data.payLoad.url) == 'string' && data.payLoad.url.trim().length > 0 ? data.payLoad.url.trim():false; 
    const successCodes = typeof(data.payLoad.successCodes) == 'object' && data.payLoad.successCodes instanceof Array && data.payLoad.successCodes > 0 ? data.payLoad.successCodes : false;
    const timeoutSeconds = typeof(data.payLoad.timeoutSeconds) == 'number' && data.payLoad.timeoutSeconds % 1 == 0 && data.payLoad.timeoutSeconds >=1 && data.payLoad.timeoutSeconds <=5 ? data.payLoad.timeoutSeconds : false;

    // Error if id is invalid
    if (id){
        // Error if nothing is sent to update
        if (protocol || url || method || successCodes || timeoutSeconds){
            // Lookup the check
            _data.read('checks',id,(err,checkData)=>{
                if(!err && checkData){
                    // Get the token that sent the request
                    const token = typeof(data.headers.token) == 'string' ? data.headers.token : false

                    // Verify that the given token is valid and belongs to the user who created the check
                    handlers._tokens.verifyToken(token,checkData.userPhone,(tokenIsValid)=>{
                       if (tokenIsValid){
                          // Update check data where necessary
                          if (protocol){
                              checkData.protocol= protocol;
                          }
                          if (method){
                            checkData.method = method;
                        }
                          if (url){
                            checkData.url = url;
                          }
                          if (successCodes){
                            checkData.successCodes = successCodes;
                          }
                          if (timeoutSeconds){
                            checkData.timeoutSeconds = timeoutSeconds;
                          }

                        // Store the new updates
                        _data.update('checks',id,checkData,(err)=>{
                            if(!err){
                                callback(200);

                            }else{
                                callback(500,{'Error' : 'Could not update the check.'});
                            }
                        })
                       }else{
                          callback(403);
                       }

                    });

                }else{
                    callback(400,{'Error' : 'Check ID did not exist.'});

                }
            })

        }else{
            callback(400,{'Error' : 'Missing fields to update.'});
        }

    }else{
        callback(400,{'Error' : 'Missing required field.'});
    }
    

};

// Checks - DELETE
// Required data: id
// Optional data: none
handlers._checks.DELETE = (data,callback)=>{
    // Check that id is valid
    const id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim():false;
    if (id) {
        // Lookup the check
        _data.read('checks',id,(err,checkData)=>{
            if(!err && checkData){
               // Get the token that sent the request
               const token = typeof(data.headers.token) == 'string' ? data.headers.token : false
               
               // Verify that the given token is valid and belongs to the user who created the check
               handlers._tokens.verifyToken(token,checkData.userPhone,(tokenIsValid)=>{
               if (tokenIsValid){
              
                // Delete the check data
                _data.delete("checks",id,(err) =>{
                  if (!err){
                     // Lookup the user's object to get all their checks
                    _data.read('users',checkData.userPhone,(err,userData)=>{
                        if (!err && userData){
                            const userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
                            
                            // Remove the deleted check from their list of checks
                            const checkPosition = userChecks.indexOf(id);
                            if (checkPosition > -1){
                               userChecks.splice(checkPosition,1);

                               // Re-save the user's data
                               userData.checks = userChecks;
                               _data.update('users',checkData.userPhone,userData, (err)=>{
                                if(!err){
                                    callback(200);
                                }else{
                                  callback(500,{'Error' : 'Could not update the user.'});
                                }
                            });
                            }else{
                                callback(500,{"Error" : "Could not find the check on the user's object, so could not remove it."});
                            }
 
             
                        }else {
                            callback(500,{"Error" : "Could not find the user who created the check, so could not remove the check from the list of checks on their user object."});
                        }
                    });
             

                  }else{
                    callback(500,{"Error" : "Could not delete the check data."})
                  }

                } );

             

            }else{
                callback(403) 
            }

        });
            
            }else{
                callback(400,{"Error" : "The check ID specified could not be found"});
            }
        });
    
    }else{
        callback(400,{"Error" : "Missing valid id"});
    }
    
    
}



// Export the handlers
module.exports = handlers;