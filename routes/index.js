var express = require('express');
var router = express.Router();
var pseudo = require('./filesRead');
/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("homme "+  pseudo.PSEUDOLIST);
  res.render('home', { title: 'Free2talk', listPseudo : pseudo.PSEUDOLIST});
});

router.post('/newUser', function (req, res, next) { // reception methode post

    if( res.cookie.UserCookie  === undefined){
        pseudo.PSEUDOLIST.splice(pseudo.PSEUDOLIST.indexOf(req.body.nickname), 1);
            // remove the pseudo from the list
        console.log( pseudo.PSEUDOLIST);
        //res.cookie('UserCookie',req.nickname);// cookie creation
        // then insert in the DB

        res.send('success');
    }else{
        res.send("echec");
    }
});




router.get('/home', function (req,res,next) {
    console.log( "homme " +pseudo.PSEUDOLIST);
    res.render('home', { title: 'Free2talk', listPseudo : pseudo.PSEUDOLIST});
});





module.exports = router;
