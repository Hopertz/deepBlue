const http = require('http');
const url =  require('url');
const { callbackify } = require('util');
const port = 3000
const server = http.createServer((req,res)=>{

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
        body = Buffer.concat(buffer).toString();
       
        const choosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        const data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'payload':body,
            'headers': headers,
        }
        choosenHandler(data,(statusCode,payLoad)=>{
            statusCode = typeof(statusCode) === 'number' ? statusCode : 200; //
            payLoad = typeof(payLoad) !== 'object' ? {} : payLoad;
            payLoad = JSON.stringify(payLoad)
            
            res.setHeader('Content-Type','application/json')
            res.writeHead(statusCode);
            res.end(payLoad)
            console.log('Returning this response', statusCode,payLoad);
        });
 });

 

});

server.listen(port,()=>{
    console.log('Server listening at port %s.',port);
});

handlers = {};

handlers.sample = (statusCode,callback)=>{
       callback(200,{'name': 'This is a sample'});

};

handlers.notFound = (statusCode,callback)=>{
    callback(404);
}

router = {
    'sample' : handlers.sample
};
