/**
 * Created by ENZO on 21/05/2017.
 */
var express = require('express');
var router = express.Router();
var pseudo = require('./filesRead');
const pool = require('./query'); // make queries
const passwordHash = require('password-hash');
var date = require('date-and-time');
var image = require('./filesRead');
var randtoken = require('rand-token').generator({
    chars: 'a-z'
});; // create a random token in lowerCase



router.get('/',function (req, res,next) { // get all user sorted by the number of message the have sent
    if(req.cookies.UserCookie === undefined){
        message = "Not connected";
        res.render('error', {title:'Free2talk',errorMessage: message, avatars :image.AVATAR_LIST } );
    }else{
        pool.pgQuery('SELECT count(*) as nb FROM public.user WHERE token =$1',[req.cookies.UserCookie],
            function (e,r) {
                if(e){
                    message = "An error has occured";
                    res.render('error', {title:'Free2talk',errorMessage: message, avatars :image.AVATAR_LIST } );
                }else if(r.rows[0].nb == 0){
                    message = "Not connected";
                    res.render('error', {title:'Free2talk',errorMessage: message, avatars :image.AVATAR_LIST } );
                }else{
                    pool.pgQuery('SELECT U.name, U.avatar FROM public.user U Left Join public.message M on U.name = M.sender Group by U.name Order by Count(M.idmessage) Desc',
                        '', function (err,rslt) {
                            if(err){
                                message = "Error this error " + err;
                                res.render('error', {title:'Free2talk',errorMessage: message, avatars :image.AVATAR_LIST } );
                            }else{
                                res.render("user/allUsers",{title:'Free2talk',allUser: rslt.rows,avatars :image.AVATAR_LIST })
                            }
                        });
                }
            })
    }
});


router.get('/mySpace',function (req, res, next) {
    if(req.cookies.UserCookie === undefined){
        message = "Not connected" ;
        res.render('error', {title:'Free2talk',errorMessage: message, avatars :image.AVATAR_LIST } );
    }else{
        pool.pgQuery('SELECT name, avatar, count(*) as nb FROM public.user WHERE token = $1 GROUP BY name, avatar',
            [req.cookies.UserCookie],function (e,r) {
                if(e){
                    message = "Error this error " + e;
                    res.render('error', {title:'Free2talk',errorMessage: message, avatars :image.AVATAR_LIST } );
                }else if(r.rows[0].nb ==0){
                    message = "Not connected" ;
                    res.render('error', {title:'Free2talk',errorMessage: message, avatars :image.AVATAR_LIST } );
                }else {
                    res.render("user/me",{title:'Free2talk', nickname: r.rows[0].name,avatar:r.rows[0].avatar,
                        avatars :image.AVATAR_LIST });
                }
            });

    }
});


router.post('/updatePassword',function (req, res, next) {
    if(req.cookies.UserCookie === undefined){
        res.send('not connected');
    }else {
        pool.pgQuery('SELECT name, password, count(*) as nb FROM public.user WHERE token =$1 Group by name, password ',
        [req.cookies.UserCookie], function (err, rslt) {
               if(err){
                   res.send('An error has occured');
               }else if(rslt.rows[0].nb == 0 ){
                   res.send('not connected');
               } else {
                   var name = rslt.rows[0].name;
                   var password = rslt.rows[0].password;

                   if( ! passwordHash.verify(req.body.old,password)){
                        res.send('Wrong password');
                   }else {
                       newPass = passwordHash.generate(req.body.new); // generate a new password
                       pool.pgQuery('UPDATE public.user SET password = $2 WHERE name =$1 ',[name, newPass],
                       function (e, r) {
                           if(e)
                               res.send('An error has occured');
                           else
                               res.send('success');
                       });
                   }
               }
            });
    }
});

router.post('/updateAvatar', function (req, res, next) {
    if(req.cookies.UserCookie === undefined){
        res.send('not connected');
    }else{
        pool.pgQuery('SELECT name, count(*) as nb FROM public.user WHERE token =$1 Group by name ',
            [req.cookies.UserCookie], function (e,r) {
                if(e){
                    res.send('An error has occured');
                }else if(r.rows[0].nb == 0 ){
                    res.send('not connected');
                }else{
                    name = r.rows[0].name
                    pool.pgQuery('UPDATE public.user set avatar = $2 WHERE name =$1 ',
                    [name, req.body.avatar],function (er,re) {
                        if(er)
                            res.send('An error has occured');
                        else{
                            res.send('success');
                        }
                    })
                }
            });
    }
});



router.post('/signIn', function (req, res, next) { // get methode post
    // try to register a new user
    if(req.body.nickname === undefined){
        res.send("An Error has occurred retry later");
    } else if( req.cookies.UserCookie  === undefined){ // user is not connected yet

        var ip = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;


        pool.pgQuery('SELECT Count(*) as nb FROM public.user  WHERE name =$1',
            [ip],function (err, resultat) {
                if(err)res.send('has occurred retry later ' + err);
                else if( resultat.rows[0].nb > 2) // check if there are less than 3 account on this account
                    res.send("There are 3 or more account on this IP");
                else{
                    var hachPassword = passwordHash.generate( req.body.password ); // hach the password
                    token = randtoken.generate(25); // create 25 letter-token
                    // then insert in the DB
                    pool.pgQuery(
                        "INSERT INTO public.user VALUES($1,$2,$3,$4,$5,$6)",
                        [req.body.nickname, ip, hachPassword, new Date(),req.body.avatar , token],
                        function (err,result) {
                            if(err){  res.send('error running query ' +err);
                                //res.send('An Error has occurred retry later');
                            }else {
                                res.cookie('UserCookie',token);// cookie creation
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
                token = randtoken.generate(25); // create 25 letter-token
                pool.pgQuery('UPDATE public.user set token =$2 WHERE name =$1',[req.body.nickname, token],
                    function (err,reslt) { // update the actual token
                    if(err)
                        res.send('An error has occured '+ err);
                    else {
                        res.cookie('UserCookie',token);// cookie creation
                        res.send("succes");
                    }
                });

            }else {
                res.send("Wrong password");
            }


        })
});

router.post('/sendMessage',function (req,res,next) {
    if(req.cookies.UserCookie === undefined){
        res.send('not connected');
    }else {
        pool.pgQuery('SELECT name, avatar, COUNT(*) as nb FROM public.user WHERE token = $1 GROUP BY name, avatar',[req.cookies.UserCookie],
        function (e,r) {
            if(e)
                res.send(e);
            else if(r.rows[0].nb == 0){
                res.send('not connected');
            }else{
                name = r.rows[0].name;
                avatar = r.rows[0].avatar;
                // insert the new message and send back name and avatar
                pool.pgQuery('INSERT INTO public.message(textmessage, datesending, topic, sender, file)VALUES ($1, $2, $3, $4, $5)',
                [req.body.text, new Date(),req.body.topic, name,null],function (err, reslt) {
                    if(err)
                        res.send('error');
                    else {
                        res.send({name: name, avatar:avatar, text:req.body.text });
                    }
                });
            }
        });
    }
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
   if(req.cookies.UserCookie === undefined){
       message = "Not connected";
       res.render('error', {title:'Free2talk',errorMessage: message, avatars :image.AVATAR_LIST } );
   }else{
       pool.pgQuery('SELECT count(*) as nb FROM public.user WHERE token =$1',[req.cookies.UserCookie],
       function (e,r) {
           if(e){
               message = "An error has occured";
               res.render('error', {title:'Free2talk',errorMessage: message, avatars :image.AVATAR_LIST } );
           }else if(r.rows[0].nb == 0){
               message = "Not connected";
               res.render('error', {title:'Free2talk',errorMessage: message, avatars :image.AVATAR_LIST } );
           }else{
               pool.pgQuery("SELECT Count(*) as nb FROM public.user WHERE name=$1",[req.params.n],
                   function (err, rslt ) {
                       if(err){
                           message = "An error has occured "+err ;
                           res.render('error', {title:'Free2talk',errorMessage: message, avatars :image.AVATAR_LIST } );
                       }else if(rslt.rows[0].nb == 0){
                           message = "The user " + req.params.n + " doesn't exist" ;
                           res.render('error', {title:'Free2talk',errorMessage: message, avatars :image.AVATAR_LIST } );
                       }else{
                           pool.pgQuery("SELECT * FROM public.user WHERE name=$1", [req.params.n],
                               function (e,r) {
                                   if(e){
                                       message = "An error has occured "+e ;
                                       res.render('error', {title:'Free2talk',errorMessage: message, avatars :image.AVATAR_LIST } );
                                   }else {
                                       res.render('user/user',{title:'Free2talk',userData:r.rows[0], avatars :image.AVATAR_LIST });
                                   }

                               });
                       }
                   });
           }
       })
   }
});






module.exports = router;