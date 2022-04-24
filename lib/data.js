const fs = require('fs');
const path = require('path');

lib = {};

lib.baseDir = path.join(__dirname,'../.data/');

lib.create = (dir,file,data,callback)=>{
 
    fs.open(lib.baseDir+dir+'/'+file+'.json','wx',(err,fileDescriptor)=>{
      if (!err & fileDescriptor){
         const stringData = JSON.stringify(data);
         fs.writeFile(fileDescriptor,stringData,(err)=>{
            if (!err) {
              fs.close(fileDescriptor,(err)=>{
                  if (!err){
                    callback(false);
                  }else{
                    callback('Error closing to file');
                  }
              });
            } else {
                callback('Error writing to file');
            }
         }
         );
      }else{
          callback('Could not create a new file,it may already exist.');
      }

    });


}

lib.read = (dir,file,callback)=>{
    fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf8',(err,data)=>{
       callback(err,data);

    });

};


lib.update = (dir,file,data,callback)=>{
    fs.open(lib.baseDir+dir+'/'+file+'.json','r+',(err,fileDescriptor)=>{
      if (!err & fileDescriptor){
         const stringData = JSON.stringify(data);

         fs.ftruncate(fileDescriptor,(err)=>{
             if (!err) {
                fs.writeFile(fileDescriptor,stringData,(err)=>{
                    if (!err) {
                      fs.close(fileDescriptor,(err)=>{
                          if (!err){
                            callback(false);
                          }else{
                            callback('Error closing to file');
                          }
                      });
                    } else {
                        callback('Error writing to file');
                    }
                 }
                 );
             }
            else{
                callback('Error truncuating');
            }

         });
        
        
      }else{
          callback('Could not create a update file,it may already exist.');
      }

    });


}

lib.delete = (dir,file,callback) => {
    fs.unlink(lib.baseDir+dir+'/'+file+'.json',(err)=>{
    
        if (!err){
           callback(false);
        }else{
          callback('Error deleting the file')
        }

    });
};
module.exports = lib ;