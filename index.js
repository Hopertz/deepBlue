const http = require('http');
const url =  require('url');
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
    console.log('Request received on path '+ trimmedPath + ' with method '+ 
        method+ ' and with these query parameters %s',queryStringObject);
    console.log('Also with the following headers', headers)
    console.log(`Request received with this payload: ${body}`);
 });

    res.end('Hello World!');

});

server.listen(port,()=>{
    console.log('Server listening at port %s.',port);
});


