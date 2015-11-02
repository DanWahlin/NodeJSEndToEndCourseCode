var fs = require('fs');

//Open file for appending - 'a'
fs.open('data.txt', 'a', function(err, data) {
  if (err) { throw err; }

  //Buffer new data to write to file
  var buffer = new Buffer('My new buffer text\n');
  writeData(data, buffer);
});

function writeData(data, buffer) {
    var written = 0;
    //fs.write(fd, buffer, offset, length[, position], callback)
    fs.write(data, buffer, 0 + written, buffer.length - written, null, function(err, bytesWritten) {
      if (err) { throw err; }
      written += bytesWritten;
      if (written === buffer.length) {
        return console.log('done');
      } else {
        writeData(data, buffer);
      }
    });
}
