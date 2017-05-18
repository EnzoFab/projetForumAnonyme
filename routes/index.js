var express = require('express');
var router = express.Router();
var pseudo = require('./filesRead');
const pool = require('./query'); // make queries



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Free2talk', listPseudo : pseudo.PSEUDOLIST});
});


router.get('/home', function (req,res,next) {
    res.render('home', { title: 'Free2talk', listPseudo : pseudo.PSEUDOLIST});
});


router.post('/newUser', function (req, res, next) { // reception methode post
    if( req.cookies.UserCookie  === undefined){
        pseudo.PSEUDOLIST.splice(pseudo.PSEUDOLIST.indexOf(req.body.nickname), 1);
            // remove the pseudo from the list

        res.cookie('UserCookie',req.body.nickname);// cookie creation
        // then insert in the DB

        res.send('success');
    }else{
        res.send("echec");
    }
});



router.post('/checkCookie',function (req, res, next) {
   res.send(req.cookies.UserCookie === undefined);
});




module.exports = router;
