const _data = require('./data');
const helpers = require('./helpers');
const config = require('./config');

const handlers = {};

handlers.ping = (data,callback)=>{
       callback(200);

};

handlers.notFound = (data,callback)=>{
    callback(404);
};


handlers.users = (data,callback)=>{
    const acceptableMethods = ['PUT','GET','POST','DELETE'];
    if (acceptableMethods.indexOf(data.method)>-1) {
       handlers._users[data.method](data,callback);

    }else {
      callback(405)
    }

};


handlers._users = {};

handlers._users.POST = (data,callback)=>{

   const firstName = typeof(data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim():false;
   const lastName = typeof(data.payload.lastName) === 'string' && data.payload.lastName.trim().length  > 0 ? data.payload.lastName.trim():false;
   const phone = typeof(data.payload.phone) === 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim():false;
   const password = typeof(data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim():false;
   const tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement === true ? true:false;


   if (firstName && lastName && phone && password && tosAgreement){

      _data.read('users',phone,(err,data) => {
          if (err) {
              const hashedPassword = helpers.hash(password);
          
              if (hashedPassword){

                 userObject = {
                     "firstName" : firstName,
                     "lastName" : lastName,
                     "phone" :  phone,
                     "hashedPassword" : hashedPassword,
                     "tosAgreement" : tosAgreement
                 }

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
                callback(400,{'Error':' Password Hashing Failed'});
              }

          } else {
              callback(400,{'Error':' A user with that phone number arleady exist '});
          }

      });

   } else{
       callback(400,{'Error':' Missing required fields '});
   }

}

handlers._users.GET = (data,callback)=>{
    const phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim():false;

    if (phone) {

        const token = typeof(data.headers.token) == 'string' ? data.headers.token : false



        handlers._tokens.verifyToken(token,phone,(tokenIsValid)=>{
            if (tokenIsValid){

                _data.read('users',phone,(err,data)=>{
                    if (!err && data){
                       delete data.hashedPassword;
                       callback(200,data);
                    }else {
                      callback(400,{'Error':"User does not exist"}) 
                    }
                });
         

            }else{
                callback(400,{'Error':"Invalid token or Missing token in header"}) 
            }

        });
       
    }else{
        callback(400,{'Error':' Missing required fields '});
    }
    
};

handlers._users.PUT = (data,callback)=>{
    const phone = typeof(data.payload.phone) === 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim():false;


    const firstName = typeof(data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim():false;
    const lastName = typeof(data.payload.lastName) === 'string' && data.payload.lastName.trim().length  > 0 ? data.payload.lastName.trim():false;
    const password = typeof(data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim():false;
    

    if(phone){
        if (firstName || lastName|| password){
            
            const token = typeof(data.headers.token) == 'string' ? data.headers.token : false

            handlers._tokens.verifyToken(token,phone,(tokenIsValid)=>{
                if (tokenIsValid){
    
                    _data.read('users',phone,(err,userData)=>{
                        if (!err && userData){
                           if (firstName){
                               userData.firstName = firstName;
                           }
            
                           if (lastName){
                            userData.lastName = lastName;
                           }
            
                           if (password){
                            userData.hashedPassword = helpers.hash(password);
                           }
                           _data.update('users',phone,userData,(err)=>{
                               if (!err){
                                   callback(200);
                               }else{
                                 callback(500,{'Error':"Failed to update user"})  
                               }
                           });
                        }else {
                          callback(400,{'Error':"User does not exist"}) 
                        }
                    });
        
                }else{
                    callback(400,{'Error':"Invalid token or Missing token in header"}) 
                }
    
            });

          
        }else{
            callback(400,{'Error':'Missing required fields'});
        }

    }else{
        callback(400,{'Error':'Missing required fields'});
    }
    
}

handlers._users.DELETE = (data,callback)=>{
    const phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim():false;
    if (phone) {
        const token = typeof(data.headers.token) == 'string' ? data.headers.token : false

        handlers._tokens.verifyToken(token,phone,(tokenIsValid)=>{
            if (tokenIsValid){

                _data.read('users',phone,(err,userData)=>{
                    if (!err && userData){
                       _data.delete('users',phone,(err)=>{
                           if(!err){
                               const userChecks = typeof(userData.checks)== 'object' && userData.checks instanceof Array ? userData.checks : [];
                               const checksToDelete = userChecks.length;
                               if (checksToDelete > 0){
                                  let checksDeleted = 0;
                                  const deletionErrors = false;

                                  userChecks.forEach(checkId => {
                                      _data.delete('checks', checkId,(err)=>{
                                          if (err) {
                                              deletionErrors = true;
                                          }
                                          checksDeleted++;
                                          if(checksDeleted == checksToDelete){
                                              if(!deletionErrors){
                                                callback(200);
                                              }else{
                                                callback(500,{'Error':"Errors encountered while attempting to delete all user checks.Some check coul have not be deleted "}) 

                                              }
                                          }
                                      });
                                      
                                  });
                               }else{
                                 callback(200);
                               }
                           }else{
                             callback(500,{'Error':"Failure to delete the user"}) 
                           }
                       });
         
                    }else {
                      callback(400,{'Error':"User does not exist"}) 
                    }
                });
         

            }else{
                callback(400,{'Error':"Invalid token or Missing token in header"}) 
            }

        });
    
    }else{
        callback(400,{'Error':' Missing required fields '});
    }
    
    
}


handlers._tokens = {};

handlers._tokens.POST = (data,callback)=>{
    const phone = typeof(data.payload.phone) === 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim():false;
    const password = typeof(data.payload.password) === 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim():false;

    if (phone && password){
       _data.read('users',phone,(err,userData)=>{
           if(!err && userData){
               const hashedPassword = helpers.hash(password);
               if (hashedPassword == userData.hashedPassword){

                  const tokenId = helpers.createRandomString(20);
                  const expires = Date.now() + 1000 * 60 * 60;

                  tokenObject = {
                      'phone': phone,
                      'id': tokenId,
                      'expires': expires
                  };

                  _data.create('tokens',tokenId,tokenObject,(err)=>{
                      if (!err){
                          callback(200,tokenObject);
                      }else{
                         callback(400,{'Error':' Failed to create token '});   
                      }
                  });

               }else{
                callback(400,{'Error':' User password does not match the stored password '});
               }
              
           }else{
               callback(400,{'Error':' Could not find the user '});
           }
       })

    }else{

        callback(400,{'Error':' Missing required fields '});

    }
};

handlers._tokens.GET = (data,callback)=>{
    const id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim():false;

    if (id) {
       _data.read('tokens',id,(err,tokenData)=>{
           if (!err && tokenData){
              callback(200,tokenData);
           }else {
             callback(400,{'Error':"User does not exist"}) 
           }
       });

    }else{
        callback(400,{'Error':' Missing required fields '});
    }
};

handlers._tokens.PUT = (data,callback)=>{
    const id = typeof(data.payload.id) === 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim():false;
    const extend = typeof(data.payload.extend) == 'boolean' && data.payload.extend === true ? true:false;

    if (id && extend){

        _data.read('tokens',id,(err,tokenData)=>{
            if(!err && tokenData){
                if(tokenData.expires > Date.now()){
                    tokenData.expires = Date.now() + 1000*60*60

                    _data.update('tokens',id,tokenData,(err)=>{
                        if(!err){
                            callback(200);

                            

                        }else{
                            callback(400,{'Error':' Update failed '}); 
                        }
                    });
                }else{
                    callback(400,{'Error':'token has expired and cannot be extended'})
                }
            }else{
                callback(400,{'Error': 'Invalid token'});
            }
        });

    }else{
        callback(400,{'Error':' Missing required fields '});
    }

};

handlers._tokens.DELETE = (data,callback)=>{
    
    const id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim():false;

    if (id) {
       _data.read('tokens',id,(err,data)=>{
           if (!err && data){
              _data.delete('tokens',id,(err)=>{
                  if(!err){
                      callback(200);
                  }else{
                    callback(500,{'Error':"Failure to delete the token"}) 
                  }
              });

           }else {
             callback(400,{'Error':"token does not exist"}) 
           }
       });

    }else{
        callback(400,{'Error':' Missing required fields '});
    }
};



handlers.tokens = (data,callback)=>{
    const acceptableMethods = ['PUT','GET','POST','DELETE'];
    if (acceptableMethods.indexOf(data.method)>-1) {
       handlers._tokens[data.method](data,callback);

    }else {
      callback(405)
    }

};

handlers._tokens.verifyToken = (id,phone,callback) => {
    _data.read('tokens',id,(err,tokenData)=>{
        if(!err && tokenData){

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

handlers.checks = (data,callback)=>{
    const acceptableMethods = ['PUT','GET','POST','DELETE'];
    if (acceptableMethods.indexOf(data.method)>-1) {
       handlers._checks[data.method](data,callback);

    }else {
      callback(405)
    }

};

handlers._checks = {};

handlers._checks.POST = (data,callback)=>{
   
    const protocol = typeof(data.payload.protocol) == 'string' && ['http','https'].indexOf(data.payload.protocol)>-1 ? data.payload.protocol:false;
    const method = typeof(data.payload.method) == 'string' &&  ['PUT','GET','POST','DELETE'].indexOf(data.payload.method)>-1 ? data.payload.method:false;
    const url =  typeof(data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim():false; 
    const successCode = typeof(data.payload.successCode) == 'object' && data.payload.successCode instanceof Array && data.payload.successCode.length > 0 ? data.payload.successCode : false;
    const timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 == 0 && data.payload.timeoutSeconds >=1 && data.payload.timeoutSeconds <=5 ? data.payload.timeoutSeconds : false;
    
    if (protocol && method && url && successCode && timeoutSeconds){
        const token = typeof(data.headers.token) == 'string'? data.headers.token : false;
        _data.read('tokens',token,(err,tokenData) => {
            if (!err && tokenData) {
               const userPhone = tokenData.phone;
               _data.read('users',userPhone,(err,userData)=>{
                
                   if (!err && userData){

                       const userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
                       if (userChecks.length < config.maxChecks){
                          const checkId = helpers.createRandomString(20);
                          const checkObject = {
                              'id':checkId,
                              'userPhone': userPhone,
                              'protocol' : protocol,
                              'url': url,
                              'method': method,
                              'succesCodes' : successCode,
                              'timeoutSeconds' : timeoutSeconds
                          } 

                          _data.create('checks',checkId,checkObject,(err)=>{
                               if(!err){

                                  userData.checks = userChecks;
                                  userData.checks.push(checkId);

                                  _data.update('Users',userPhone,userData,(err)=>{
                                       if (!err){
                                    
                                          callback(200,checkObject);

                                       }else{
                                          callback(500,{"Error": "Could update user with new check"})
                                       }
                                   });

                                }else{
                                  callback(500);
                           }
                           });

                        }else{
                            callback(500,{'Error': 'The user already has maximum number of checks(' + config.maxChecks+')'})
                          }
                   }else{

                       callback(403,{"Error": "No such user with that token"})

                   }

               })

            }else{
               callback(403,{"Error": "Invalid token"})
            }
        })

    }else{
        callback(400,{'Error': "Missing required inputs or inputs are invalid"})
    }
}

handlers._checks.GET = (data,callback)=>{
    const id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim():false;

    if (id) {

        _data.read('checks',id,(err,checkData)=>{
            if (!err && checkData) {

              const token = typeof(data.headers.token) == 'string' ? data.headers.token : false

              handlers._tokens.verifyToken(token,checkData.userPhone,(tokenIsValid)=>{
              if (tokenIsValid){
                 callback(200, checkData);
               
              }else{
                callback(403,{'Error':"Invalid token or Missing token in header"}) 
              }

        });

            }else{
                callback(404)
            }

        });

        
       
    }else{
        callback(400,{'Error':' Missing required fields '});
    }
    
};

handlers._checks.PUT = (data,callback) =>{
    const id = typeof(data.payload.id) === 'string' && data.payload.id.trim().length == 20 ? data.payload.id.trim():false;
    
    const protocol = typeof(data.payload.protocol) == 'object' && ['http','https'].indexOf(data.payload.protocol) ? data.payload.protocol:false;
    const method = typeof(data.payload.method) == 'object' &&  ['PUT','GET','POST','DELETE'].indexOf(data.payload.method) ? data.payload.method:false;
    const url =  typeof(data.payload.url) == 'string' && data.payload.url.trim().length > 0 ? data.payload.url.trim():false; 
    const successCode = typeof(data.payload.successCode) == 'object' && data.payload.successCode instanceof Array && data.payload.successCode > 0 ? data.payload.successCode : false;
    const timeoutSeconds = typeof(data.payload.timeoutSeconds) == 'number' && data.payload.timeoutSeconds % 1 == 0 && data.payload.timeoutSeconds >=1 && data.payload.timeoutSeconds <=5 ? data.payload.timeoutSeconds : false;

    if (id){

        if (protocol || url || method || successCode || timeoutSeconds){
            _data.read('checks',id,(err,checkData)=>{
                if(!err && checkData){
                    const token = typeof(data.headers.token) == 'string' ? data.headers.token : false

                    handlers._tokens.verifyToken(token,checkData.userPhone,(tokenIsValid)=>{
                       if (tokenIsValid){
                          if (protocol){
                              checkData.protocol= protocol;
                          }
                          if (method){
                            checkData.method = method;
                        }
                          if (url){
                            checkData.url = url;
                          }
                          if (successCode){
                            checkData.succesCodes = successCode;
                          }
                          if (timeoutSeconds){
                            checkData.timeoutSeconds = timeoutSeconds;
                          }
                        _data.update('checks',id,checkData,(err)=>{
                            if(!err){
                                callback(200);

                            }else{
                                callback(403,{'Error':""}) 
                            }
                        })
                       }else{
                         callback(500,{'Error':"Could not update check"}) 
                       }

                    });

                }else{
                    callback(400,{'Error':'Check Id did not exist'});

                }
            })

        }else{
            callback(400,{'Error':' Missing to update '});
        }

    }else{
        callback(400,{'Error':' Missing required fields '});
    }
    

};

handlers._checks.DELETE = (data,callback)=>{
    const id = typeof(data.queryStringObject.id) == 'string' && data.queryStringObject.id.trim().length == 20 ? data.queryStringObject.id.trim():false;
    if (id) {

        _data.read('checks',id,(err,checkData)=>{
            if(!err && checkData){
              
               const token = typeof(data.headers.token) == 'string' ? data.headers.token : false

               handlers._tokens.verifyToken(token,checkData.userPhone,(tokenIsValid)=>{
               if (tokenIsValid){
              
                _data.delete("checks",id,(err) =>{
                  if (!err){

                    _data.read('users',checkData.userPhone,(err,userData)=>{
                        if (!err && userData){
                            const userChecks = typeof(userData.checks) == 'object' && userData.checks instanceof Array ? userData.checks : [];
                           
                            const checkPosition = userChecks.indexOf(id);
                            if (checkPosition > -1){
                               userChecks.splice(checkPosition,1);
                               userData.checks = userChecks;
                               _data.update('users',checkData.userPhone,userData, (err)=>{
                                if(!err){
                                    callback(200);
                                }else{
                                  callback(500,{'Error':"Failure to update the user"}) 
                                }
                            });
                            }else{
                                callback(500,{"Error":"Could not find check on the user's object,hence we can not remove"});
                            }
 
             
                        }else {
                          callback(500,{'Error':"Could find user who created the check, so we could no t removes the check "}) 
                        }
                    });
             

                  }else{
                    callback(500,{'Error':"Could not delete check data"}) 
                  }

                } );

             

            }else{
                callback(400,{'Error':"Invalid token or Missing token in header"}) 
            }

        });
            
            }else{
                callback(400,{'Error':'Check Id did not exist'});
            }
        });
    
    }else{
        callback(400,{'Error':' Missing required fields '});
    }
    
    
}




module.exports = handlers;