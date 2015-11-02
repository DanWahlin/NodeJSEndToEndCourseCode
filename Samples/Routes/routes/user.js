var express = require('express');
var router = express.Router();

//Intercept route parameter
router.param('userId', function(req, res, next, id) {

    console.log('userID callback invoked: ' + id);
    next();

});

router.get('/:userId', function(req, res, next) {

   res.render('user', { message: '', userId: req.params.userId, userName: 'John Doe' });

});

router.post('/', function(req, res, next) {

   res.render('user', { message: 'Inserted user: ' + req.body.userName + ' with user ID ' + req.body.userId });

});

//Ajax HTTP callable Methods
router.put('/ajax', function (req, res, next) {

    res.json({ message: 'Updated user: ' + req.body.userName + ' with user ID ' + req.body.userId });

});

router.delete('/ajax', function (req, res, next) {

    res.json({ message: 'Deleted user: ' + req.body.userName + ' with user ID ' + req.body.userId });

});

module.exports = router;
