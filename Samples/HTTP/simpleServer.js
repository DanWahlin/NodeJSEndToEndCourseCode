var server = function() {

	var http = require('http'),
		start = function(port) {
			var server = http.createServer(function(req, res) {
		    	res.end('Hello World from the Server!');
			});
			server.listen(port, function() {
				console.log('Listening on ' + port + '...');
			});
		};

	return {
		start: start		
	}
}();

server.start(9000);

