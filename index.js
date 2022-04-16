const http = require('http');
const url =  require('url');
const port = 3000
const server = http.createServer((req,res)=>{
    
    const parsedUrl = url.parse(req.url,true);
    const path = parsedUrl.pathname
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    res.end('Hello World!');

    console.log('Request received on path',trimmedPath);
});

server.listen(port,()=>{
    console.log('Server listening at port %s.',port);
});


