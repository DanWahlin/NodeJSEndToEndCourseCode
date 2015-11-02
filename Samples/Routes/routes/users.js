var express = require('express');
var router = express.Router();

//Route with wildcard
router.get(/.*users/, function(req, res) {
       res.render('users', {
       users: [
           { userId: 1, userName: 'WildCard Route1 Doe' },
           { userId: 2, userName: 'WildCard Route2 Doe' }
       ]
   });
});

router.get('/', function(req, res, next) {
   res.render('users', {
       users: [
           { userId: 1, userName: 'John Doe' },
           { userId: 2, userName: 'Jane Doe' }
       ]
   });
});


module.exports = router;
