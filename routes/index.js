var express = require('express');
var router = express.Router();
var pseudo = require('./filesRead');
const pool = require('./query'); // make queries
var date = require('date-and-time');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('home', { title: 'Free2talk', listPseudo : pseudo.PSEUDOLIST });
});


router.get('/home', function (req,res,next) {
    res.render('home', { title: 'Free2talk', listPseudo : pseudo.PSEUDOLIST});
});




// if there is a cookie send true otherwise send false
router.get('/checkCookie',function (req, res, next) {
    console.log( (req.cookies.UserCookie === undefined) );
   res.send( (req.cookies.UserCookie === undefined ) );
});




module.exports = router;
