var http = require('http'),
url = require('url'),
fs = require('fs');

function start(port) {
    var server = http.createServer(function(req, res) {
	    var pathname = url.parse(req.url).pathname;
	    console.log(pathname);
	    if (pathname === '/' || pathname === '/index.html') {
		    processHttpRequest(res);
	    }
	    else {
		    processJsonRequest(res, pathname);
	    }
    });
    server.listen(port, function() {
	    console.log('Listening on ' + port + '...');
    });
}

function processHttpRequest(res) {
    fs.readFile(__dirname + '/index.html', function (err, data) {
	    if (err) {
	    res.writeHead(500);
	    return res.end('Error loading index.html');
	    }
	    res.writeHead(200);
	    res.end(data);
    });
}

function processJsonRequest(res, pathname) {	
    var json = '';		
    switch (pathname) {
	    case '/customers':
		    json = '[{"firstName":"John", "lastName":"Doe"},' +
				    '{"firstName":"Jane", "lastName":"Doe"}]';
		    break;
	    case '/orders':
		    json = '[{"orderID":"1","quantity":"20"},{"orderID":"2","quantity":"10"}]';
		    break;

    }
    res.writeHead(200, {"Content-Type": "application/json"});
    res.write(json);
    res.end();
}

start(9000);