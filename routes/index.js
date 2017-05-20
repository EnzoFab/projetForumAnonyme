var express = require('express');
var router = express.Router();
var pseudo = require('./filesRead');
const pool = require('./query'); // make queries
const passwordHash = require('password-hash');
var date = require('date-and-time');
var get_ip = require('ipware')().get_ip;

/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('home', { title: 'Free2talk', listPseudo : pseudo.PSEUDOLIST });
});


router.get('/home', function (req,res,next) {
    res.render('home', { title: 'Free2talk', listPseudo : pseudo.PSEUDOLIST});
});



router.post('/signIn', function (req, res, next) { // get methode post
    if(req.body.nickname === undefined){
        res.send("An Error has occurred retry later");
    } else if( req.cookies.UserCookie  === undefined){
        pseudo.PSEUDOLIST.splice(pseudo.PSEUDOLIST.indexOf(req.body.nickname), 1);
            // remove the pseudo from the list

        var ip_info = get_ip(req)['clientIp'];
        pool.pgQuery('SELECT Count(*) as nb FROM public.user  WHERE name =$1',
            [ip_info],function (err, resultat) {
            if(err)res.send('has occurred retry later ' + err);
            else if(! resultat === undefined && resultat.rows[0].nb > 2) // check if there are less than 3 account on this account
                res.send("There are 3 or more account on this IP");
            else{
                var hachPassword = passwordHash.generate(req.body.password); // hach the password
                // then insert in the DB
                pool.pgQuery(
                    "INSERT INTO public.user VALUES($1,$2,$3,$4)",
                    [req.body.nickname, ip_info, hachPassword, new Date()],
                    function (err,result) {
                        if(err){  res.send('error running query ' +err);
                            //res.send('An Error has occurred retry later');
                        }else {
                            res.cookie('UserCookie',req.body.nickname);// cookie creation
                            res.send('success');
                        }
                    });
            }
        });







    }else{
        res.send('An Error has occurred retry later');
    }
});

router.post('/login',function (req, res, next) {

    pool.pgQuery('SELECT * FROM user WHERE name=$1', [req.body.nickname],
        function (err, result) {
            if(err) {
                res.send('error running query', err);
            }
            else if(passwordHash.verify(req.body.password, result.rows[0].password) ){
                // if the two password are equal
                res.cookie('UserCookie',req.body.nickname);// cookie creation
                res.send("succes");
            }else {
                res.send("Wrong password");
            }


    })
});


// if there is a cookie send true otherwise send false
router.get('/checkCookie',function (req, res, next) {
    console.log( (req.cookies.UserCookie === undefined) );
   res.send( (req.cookies.UserCookie === undefined ) );
});




module.exports = router;
