const http = require('http');
const fs = require("fs")
const url = require('url');

const myServer = http.createServer((req, res)=>{
    const log = `${Date.now()}: ${req.method} ${req.url}New Req Received \n`;
    const myUrl = url.parse(req.url, true);
    console.log(myUrl);
    fs.appendFile('log.txt', log, (err, data) => {
        switch(myUrl.pathname){
            case '/': 
            if(req.method === "GET") res.end("HomePage");
            break;
            case '/about': 
            const username = myUrl.query.myname;
            res.end(`Hi, ${username}! Welcome to our website.`);
            break;

            case '/search':
                const search = myUrl.query.search_query;
                res.end(`You searched for: ${search}`);
                case '/signup':
                    if(req.method === 'GET') res.end('This is a signup Form ');
                    else if (req.method === "POST") {
                        //DB Query
                        res.end("Success");
                    }
            default:
                res.end("404 No Page Found")

        }

    });
});

myServer.listen(8000, ()=>console.log('server Started!'));
