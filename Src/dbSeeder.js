'use strict';
var dataInitializer = require('./lib/dataSeeder'),
    config = require('./config/config.dev.json'),
    db = require('./lib/database');

db.init(config.databaseConfig);

console.log('Initializing Data');
dataInitializer.initializeUserData(function(err) {
  if (!err) {
    dataInitializer.initializeProductData();
  } else {
    console.log(err);
  }
});


