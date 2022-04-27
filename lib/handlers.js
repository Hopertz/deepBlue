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
       _data.read('users',phone,(err,data)=>{
           if (!err && data){
              delete data.hashedPassword;
              callback(200,data);
           }else {
             callback(400,{'Error':"User does not exist"}) 
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
            callback(400,{'Error':'Missing required fields'});
        }

    }else{
        callback(400,{'Error':'Missing required fields'});
    }
    
}

handlers._users.DELETE = (data,callback)=>{
    const phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim():false;
    if (phone) {
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
        callback(400,{'Error':' Missing required fields '});
    }
    
    
}
module.exports = handlers;