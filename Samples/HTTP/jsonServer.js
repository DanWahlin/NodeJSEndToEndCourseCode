var jsonServer = function() {

	var http = require('http'),
		url = require('url'),

		start = function(port) {
			var server = http.createServer(function(req, res) {
				var pathname = url.parse(req.url).pathname
				processRequest(res, pathname);
			});
			server.listen(port, function() {
				console.log('Listening on ' + port + '...');
			});
		},

		processRequest = function(res, pathname) {	
			var json = '';		
			switch (pathname) {
				case '/customers':
					json = '[{"firstName":"John", "lastName":"Doe"},{"firstName":"Jane", "lastName":"Doe"}]';
					break;
				case '/orders':
					json = '[{"orderID":"1","quantity":"20"},{"orderID":"2","quantity":"10"}]';
					break;

			}
			res.writeHead(200, {"Content-Type": "application/json"});
		    res.write(json);
		    res.end();
		};

	return {
		start: start		
	}
}();

jsonServer.start(9000);