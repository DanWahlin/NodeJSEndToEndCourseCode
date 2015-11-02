'use strict';

var fse = require('fs-extra'),
    ignoreDirs = ['Creating a Node.js HTTP Server', 'Using Express with Node.js'];

function copyDirectory(srcDir, startDir, copyToSubFolderName) {

    //Iterate through directories
    fse.readdirSync(startDir).forEach(function (dir) {
        var directory = startDir + '/' + dir,
            stat = fse.lstatSync(directory);

        if (stat.isDirectory()) {
            if (ignoreDirs.indexOf(dir) === -1) { //Make sure the ignoreDirs aren't involved in the copy operations
                var targetDir = directory + '/' + copyToSubFolderName, //Target directory src should be copied to
                    filesOverlaySrc = directory + '/Files', //If no srcDir is provided then we're overlaying lab files into the targetDir
                    finalSrc = (srcDir) ? srcDir : filesOverlaySrc;

                fse.copySync(finalSrc, targetDir);
                console.log('Copied ' + finalSrc + ' to ' + targetDir);
            }
        }
    });
}

//Copy src into Begin folder of each lab
copyDirectory('./Src', './Labs', 'Begin');

//Copy Files into Begin folder of each lab
copyDirectory(null, './Labs', 'Begin');