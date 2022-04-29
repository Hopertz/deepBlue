const http = require('http');
const https = require('https');
const url =  require('url');
const config = require('./lib/config');
const fs = require('fs');
const handlers = require('./lib/handlers');
const helpers = require('./lib/helpers');

const httpServer = http.createServer((req,res)=>{
     unifiedServer(req,res);
});

httpsServerOptions = {
    "cert" : fs.readFileSync('./https/cert.pem'),
    "key" : fs.readFileSync('./https/key.pem'),
}

const httpsServer = https.createServer(httpsServerOptions,(req,res)=>{
    unifiedServer(req,res);
});

const unifiedServer = (req,res) => {
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
       
        const choosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

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

httpServer.listen(config.httpPort,()=>{
    console.log(`Server listening at port ${config.httpPort}`);
});

httpsServer.listen(config.httpsPort,()=>{
    console.log(`Server listening at port ${config.httpsPort}`);
});


router = {
    'ping' : handlers.ping,
    'users' : handlers.users,
    'tokens' : handlers.tokens,
};
