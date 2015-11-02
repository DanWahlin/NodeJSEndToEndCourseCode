'use strict';
var mongoose = require('mongoose');

var database = function () {
    var conn = null,

        init = function (config) {
            console.log('Trying to connect to ' + config.host + '/' +
              config.database);

            var options = {
                user: config.username,
                pass: config.password,
                server: {},
                replset: {}
            };

            options.server.socketOptions = options.replset.socketOptions =
              { keepAlive: 1 };

            //Add Connection Code Here


        },

        close = function () {


        }

    return {
        init: init,
        close: close
    };

}();

module.exports = database;
