/**
 * Created by ENZO on 21/05/2017.
 */
var express = require('express');
var router = express.Router();
var pseudo = require('./filesRead');
const pool = require('./query'); // make queries
const passwordHash = require('password-hash');
var date = require('date-and-time');
var get_ip = require('ipware')().get_ip;


router.get('/',function (req, res,next) { // get all user sorted by the number of message the have sent
    pool.pgQuery('SELECT U.name FROM public.user U Left Join public.message M on U.name = M.sender Group by U.name Order by Count(M.idmessage) Desc',
    '', function (err,rslt) {
            if(err){
                message = "Error this error " + err;
                res.render('error', {title:'Free2talk',errorMessage: message} );
            }else{
                res.render("user/allUsers",{title:'Free2talk',allUser: rslt.rows})
            }
        })
});


router.get('/mySpace',function (req, res, next) {
    if(req.cookies.UserCookie === undefined){
        res.redirect('/user');
    }else{
        res.render("user/me",{title:'Free2talk', me:req.cookies.UserCookie});
    }
});






router.post('/signIn', function (req, res, next) { // get methode post
    // try to register a new user
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

    pool.pgQuery('SELECT * FROM public.user WHERE name=$1', [req.body.nickname],
        function (err, result) {
            if(err) {
                res.send('error running query' + err);
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



//all unused nicknames
router.get('/nickNames',function (req, res,next) {
    var query = 'SELECT nickname FROM public.nicknames N WHERE NOT exists( SELECT * FROM public.user U where U.name= N.nickname)ORDER BY nickname';
    pool.pgQuery(query,function (err,result) {
        if(err)res.send("error" +err);
        else {
            res.send(JSON.stringify(result.rows));
        }
    })
});

router.get('/registredUser',function (req,res,next) {
    pool.pgQuery('SELECT name FROM public.user',function (err, result) {
        if(err)res.send(err);
        else res.send(JSON.stringify(result.rows));
    });
});


router.get('/:n',function (req,res,next) {
    pool.pgQuery("SELECT Count(*) as nb FROM public.user WHERE name=$1",[req.params.n],
        function (err, rslt ) {
            if(err){
                message = "An error has occured "+err ;
                res.render('error', {title:'Free2talk',errorMessage: message} );
            }else if(rslt.rows[0].nb == 0){
                message = "The user " + req.params.n + " doesn't exist" ;
                res.render('error', {title:'Free2talk',errorMessage: message} );
            }else{
                pool.pgQuery("SELECT * FROM public.user WHERE name=$1", [req.params.n],
                    function (e,r) {
                        if(e){
                            message = "An error has occured "+e ;
                            res.render('error', {title:'Free2talk',errorMessage: message} );
                        }else {
                            res.render('user/user',{title:'Free2talk',userData:r.rows[0]});
                        }

                    });
            }
        });
});






module.exports = router;