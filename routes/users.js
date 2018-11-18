var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/login', function(req, res, next) {
   res.redirect('/users/login');
});
router.get('/login', function(req, res, next) {
  res.render('pages/dashboard');
});
module.exports = router;
