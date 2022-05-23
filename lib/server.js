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

    // Get the payload,if any
    const buffer = [];
    req.on("data", (data) => {
        buffer.push(data);
    });
    req.on("end", () => {
        body = Buffer.concat(buffer).toString('utf8');
       
         // Check the router for a matching path for a handler. If one is not found, use the notFound handler instead.
        const choosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;
       
        // Construct the data object to send to the handler
        const data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'payload': helpers.parseJsonToObject(body),
            'headers': headers,
        };
     
        // Route the request to the handler specified in the router
        choosenHandler(data,(statusCode,payLoad)=>{
            
             // Use the status code returned from the handler, or set the default status code to 200
            statusCode = typeof(statusCode) === 'number' ? statusCode : 200; 

            // Use the payload returned from the handler, or set the default payload to an empty object
            payLoad = typeof(payLoad) == 'object' ? payLoad : {};

            // Convert the payload to a string
            payLoad = JSON.stringify(payLoad);
            
            // Return the response
            res.setHeader('Content-Type','application/json');
            res.writeHead(statusCode);
            res.end(payLoad);
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
    'ping' : handlers.ping,
    'users' : handlers.users,
    'tokens' : handlers.tokens,
    'checks' : handlers.checks,
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
