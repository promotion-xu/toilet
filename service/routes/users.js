var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:name', function(req, res, next) {
  res.send('hello, ' + req.params.name);
  next();
});

module.exports = router;
