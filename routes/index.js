var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  /*if(! res.cookie.UserCookie  === undefined)
    res.cookie('UserCookie',"a value");
  else
    console.log("===================================");*/
  res.render('index', { title: 'Free2talk' });
});

module.exports = router;
