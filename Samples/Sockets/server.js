var server = require('http').createServer(handler),
    io = require('socket.io')(server),
    fs = require('fs');

server.listen(8080);
console.log('Listening on port 8080');

function handler (req, res) {
  fs.readFile(__dirname + '/index.html', function (err, data) {
      if (err) {
        res.writeHead(500);
        return res.end('Error loading index.html');
      }
      res.writeHead(200);
      res.end(data);
    });
}

io.on('connection', function (socket) {
  socket.emit('news', { news: 'Server says: Here is what is in the news: ...' });
  socket.on('clientdata', function (data) {
    console.log(data);
    socket.emit('echo', { echo: data });
  });
});
