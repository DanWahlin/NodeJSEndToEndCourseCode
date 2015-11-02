var fs      = require('fs'),
    os      = require('os'),
    path    = require('path');

console.log('Node version: ' + process.version);
console.log('System info (using os): ' + os.hostname() + ' ' + os.type() + ' ' + os.arch());
console.log('');
console.log('Script directory (using __dirname): ' + __dirname);
console.log('Script name (using __filename): ' + __filename);
console.log('');
console.log('Script directory (using path.basename(__filename)): ' + path.basename(__filename));
console.log('Script name (using path.basename(__dirname)): ' + path.basename(__dirname));
console.log('');

fs.readFile('data.txt', 'UTF-8', function(err, fileData) {
    if (err) {
        console.log(err);
        return;
    }
    else {
        console.log('Retrieved file data: ' + fileData);
    }
});
