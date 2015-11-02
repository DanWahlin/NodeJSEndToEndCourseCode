var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', getUsers);

function getUsers(req, res, next) {
  res.send('Users!');
}

module.exports = router;
module.exports = getUsers;
