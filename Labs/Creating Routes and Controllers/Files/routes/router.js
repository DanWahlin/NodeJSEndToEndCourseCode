'use strict';

var fs = require('fs'),
    path = require('path'),
    express = require('express');

var routes = function () {

    var startFolder = null,

    //Called once during initial server startup
    load = function (app, folderName) {

        if (!startFolder) startFolder = path.basename(folderName);

        fs.readdirSync(folderName).forEach(function (file) {

            var fullName = path.join(folderName, file);
            var stat = fs.lstatSync(fullName);

            if (stat.isDirectory()) {



            }
            else if (file.toLowerCase().indexOf('.js')) {

                


            }
        });

    };

    return {
        load: load
    };

}();

module.exports = routes;






