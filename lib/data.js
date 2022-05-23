const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');

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
      if(!err && data){
        const parsedData = helpers.parseJsonToObject(data); 
        callback(false,parsedData);
      }else{
        callback(err,data);
      }
      

    });

};


// Update data in a file
lib.update = (dir,file,data,callback)=>{

  // Open the file for writing
  fs.open(lib.baseDir+dir+'/'+file+'.json', 'r+', (err, fileDescriptor)=>{
    if(!err && fileDescriptor){
      // Convert data to string
      var stringData = JSON.stringify(data);

      // Truncate the file
      fs.ftruncate(fileDescriptor,(err)=>{
        if(!err){
          // Write to file and close it
          fs.writeFile(fileDescriptor, stringData,(err)=>{
            if(!err){
              fs.close(fileDescriptor,(err)=>{
                if(!err){
                  callback(false);
                } else {
                  callback('Error closing existing file');
                }
              });
            } else {
              callback('Error writing to existing file');
            }
          });  
        } else {
          callback('Error truncating file');
        }
      });
    } else {
      callback('Could not open file for updating, it may not exist yet');
    }
  });

};


lib.delete = (dir,file,callback) => {
    fs.unlink(lib.baseDir+dir+'/'+file+'.json',(err)=>{
    
        if (!err){
           callback(false);
        }else{
          callback('Error deleting the file')
        }

    });
};

// List all the items in a directory
lib.list = (dir,callback)=>{
  fs.readdir(lib.baseDir+dir+'/', (err,data)=>{
    if(!err && data && data.length > 0){
      var trimmedFileNames = [];
      data.forEach((fileName)=>{
        trimmedFileNames.push(fileName.replace('.json',''));
      });
      callback(false,trimmedFileNames);
    } else {
      callback(err,data);
    }
  });
};
module.exports = lib ;