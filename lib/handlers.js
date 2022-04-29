const _data = require('./data');
const helpers = require('./helpers');

handlers = {};

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
      callback(404)
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

                _data.read('users',phone,(err,data)=>{
                    if (!err && data){
                       _data.delete('users',phone,(err)=>{
                           if(!err){
                               callback(200);
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
      callback(404)
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
module.exports = handlers;