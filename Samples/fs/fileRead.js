var fs      = require('fs');

fs.readFile('data.txt', 'UTF-8', function(err, fileData) {
    if (err) {
        console.log(err);
        return;
    }
    else {
        console.log('Retrieved file data: ' + fileData);
    }
});
