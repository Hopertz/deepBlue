/*
 * Server-related tasks
 *
 */

 // Dependencies
const http = require('http');
const https = require('https');
const url =  require('url');
const config = require('./config');
const fs = require('fs');
const handlers = require('./handlers');
const helpers = require('./helpers');
const path = require('path');
const util = require('util');
const debug = util.debuglog('server');


// Instantiate the server module object
const server = {};

// Instantiate the HTTP server
server.httpServer = http.createServer((req,res)=>{
     server.unifiedServer(req,res);
});

// Instantiate the HTTPS server
server.httpsServerOptions = {
    'key': fs.readFileSync(path.join(__dirname,'/../https/key.pem')),
    'cert': fs.readFileSync(path.join(__dirname,'/../https/cert.pem'))
}
server.httpsServer = https.createServer(server.httpsServerOptions,(req,res)=>{
    server.unifiedServer(req,res);
});

 // All the server logic for both the http and https server
server.unifiedServer = (req,res) => {
    
    // Parse the url
    const parsedUrl = url.parse(req.url,true);

    // Get the path
    const path = parsedUrl.pathname
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get the query string as an object
    const queryStringObject = parsedUrl.query;

    // Get the HTTP method
    const method = req.method;
    
    //Get the headers as an object
    const headers = req.headers;

    // Get the payLoad,if any
    const buffer = [];
    req.on("data", (data) => {
        buffer.push(data);
    });
    req.on("end", () => {
        body = Buffer.concat(buffer).toString('utf8');
       
         // Check the router for a matching path for a handler. If one is not found, use the notFound handler instead.
        let choosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;

        // If the request is within the public directory use to the public handler instead
        choosenHandler = trimmedPath.indexOf('public/') > -1 ? handlers.public : choosenHandler;
       
        // Construct the data object to send to the handler
        const data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'payLoad': helpers.parseJsonToObject(body),
            'headers': headers,
        };
     
        // Route the request to the handler specified in the router
        choosenHandler(data,(statusCode,payLoad,contentType)=>{

            // Determine the type of response (fallback to JSON)
            contentType = typeof(contentType) == 'string' ? contentType : 'json';
            
             // Use the status code returned from the handler, or set the default status code to 200
            statusCode = typeof(statusCode) === 'number' ? statusCode : 200; 

             // Return the response parts that are content-type specific
            let payLoadString = '';
            if(contentType == 'json'){
              res.setHeader('Content-Type', 'application/json');
              payLoad = typeof(payLoad) == 'object'? payLoad : {};
              payLoadString = JSON.stringify(payLoad);
            }

            if(contentType == 'html'){
               res.setHeader('Content-Type', 'text/html');
               payLoadString = typeof(payLoad) == 'string'? payLoad : '';
            }
            
            if(contentType == 'favicon'){
              res.setHeader('Content-Type', 'image/x-icon');
              payLoadString = typeof(payLoad) !== 'undefined' ? payLoad : '';
            }

            if(contentType == 'plain'){
              res.setHeader('Content-Type', 'text/plain');
              payLoadString = typeof(payLoad) !== 'undefined' ? payLoad : '';
            }

            if(contentType == 'css'){
              res.setHeader('Content-Type', 'text/css');
              payLoadString = typeof(payLoad) !== 'undefined' ? payLoad : '';
            }

            if(contentType == 'png'){
              res.setHeader('Content-Type', 'image/png');
              payLoadString = typeof(payLoad) !== 'undefined' ? payLoad : '';
            }

            if(contentType == 'jpg'){
               res.setHeader('Content-Type', 'image/jpeg');
               payLoadString = typeof(payLoad) !== 'undefined' ? payLoad : '';
            }


            
            // Return the response
            res.writeHead(statusCode);
            res.end(payLoadString);
               // If the response is 200, print green, otherwise print red
            if(statusCode == 200){
              debug('\x1b[32m%s\x1b[0m',method.toUpperCase()+' /'+trimmedPath+' '+statusCode);
            } else {
              debug('\x1b[31m%s\x1b[0m',method.toUpperCase()+' /'+trimmedPath+' '+statusCode);
            }
        });
 });


};

 // Define the request router
 server.router = {
  '' : handlers.index,
  'account/create' : handlers.accountCreate,
  'account/edit' : handlers.accountEdit,
  'account/deleted' : handlers.accountDeleted,
  'session/create' : handlers.sessionCreate,
  'session/deleted' : handlers.sessionDeleted,
  'checks/all' : handlers.checksList,
  'checks/create' : handlers.checksCreate,
  'checks/edit' : handlers.checksEdit,
  'ping' : handlers.ping,
  'api/users' : handlers.users,
  'api/tokens' : handlers.tokens,
  'api/checks' : handlers.checks,
  'favicon.ico' : handlers.favicon,
  'public' : handlers.public
};



 // Init script
 server.init = ()=>{
    // Start the HTTP server
    server.httpServer.listen(config.httpPort,function(){
      console.log('\x1b[36m%s\x1b[0m','The HTTP server is running on port '+config.httpPort);
    });
  
    // Start the HTTPS server
    server.httpsServer.listen(config.httpsPort,function(){
      console.log('\x1b[35m%s\x1b[0m','The HTTPS server is running on port '+config.httpsPort);
    });
  };
  
  
// Export the module
module.exports = server;
