const http = require('http');
const https = require('https');
const url =  require('url');
const config = require('./config');
const fs = require('fs');
const handlers = require('./handlers');
const helpers = require('./helpers');
const path = require('path');


const server = {};
server.httpServer = http.createServer((req,res)=>{
     server.unifiedServer(req,res);
});

server.httpsServerOptions = {
    'key': fs.readFileSync(path.join(__dirname,'/../https/key.pem')),
    'cert': fs.readFileSync(path.join(__dirname,'/../https/cert.pem'))
}

server.httpsServer = https.createServer(server.httpsServerOptions,(req,res)=>{
    server.unifiedServer(req,res);
});

server.unifiedServer = (req,res) => {
    const parsedUrl = url.parse(req.url,true);
    const path = parsedUrl.pathname
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method;
    const queryStringObject = parsedUrl.query;
    const headers = req.headers;
    const buffer = [];
    req.on("data", (data) => {
        buffer.push(data);
    });
    req.on("end", () => {
        body = Buffer.concat(buffer).toString('utf8');
       
        const choosenHandler = typeof(server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;

        const data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'payload': helpers.parseJsonToObject(body),
            'headers': headers,
        };
     
        choosenHandler(data,(statusCode,payLoad)=>{
            
            statusCode = typeof(statusCode) === 'number' ? statusCode : 200; 
            payLoad = typeof(payLoad) == 'object' ? payLoad : {};
            payLoad = JSON.stringify(payLoad);
            
            res.setHeader('Content-Type','application/json');
            res.writeHead(statusCode);
            res.end(payLoad);
            console.log('Returning this response', statusCode,payLoad);
        });
 });


};



server.router = {
    'ping' : handlers.ping,
    'users' : handlers.users,
    'tokens' : handlers.tokens,
    'checks' : handlers.checks,
};



 // Init script
server.init = () => {
    // Start the HTTP server
    server.httpServer.listen(config.httpPort,()=>{
        console.log(`Server listening at port ${config.httpPort}`);
    });
  
    // Start the HTTPS server
    server.httpsServer.listen(config.httpsPort,()=>{
        console.log(`Server listening at port ${config.httpsPort}`);
    });
  };
  
  
// Export the module
module.exports = server;
