var ws = require('websocket.io'),
    http = require('http'),
    fs = require('fs'),
    socketServer = ws.listen(8090);

var server = http.createServer(function(req, res) {
    fs.readFile(__dirname + '/index.html', function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading index.html');
      }
      res.writeHead(200);
      res.end(data);
    });
    console.log('Served index.html');
}).listen(8080);

console.log('Listening on port 8080');

socketServer.on('connection', function (socket) {
    console.log('client connected');
    socket.on('message', function (data) {
        socket.send('(Echo from server): ' + data);
    });
    socket.on('close', function () {
        console.log('client disconnected');
    });
});
