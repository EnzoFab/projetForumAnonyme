var express = require('express');
var router = express.Router();
const pool = require('./query'); // make queries
var image = require('./filesRead');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('home', { title: 'Free2talk', avatars :image.AVATAR_LIST  });
});


router.get('/home', function (req,res,next) {
    res.render('home', { title: 'Free2talk', avatars :image.AVATAR_LIST });
});




// if there is a cookie send true otherwise send false
router.get('/checkCookie',function (req, res, next) {
    if(req.cookies.UserCookie === undefined)
        res.send(true); // cookie isn't defefined
    else {
        pool.pgQuery('SELECT count(*) as nb From public.user WHERE token = $1',[req.cookies.UserCookie],
        function (err, result) {
            if(err)
                res.send(true);
            else{
                res.send(result.rows[0].nb == 0) // not connected ;
            }
        })
    }


});

router.get('/search/user/:n',function (req, res, next) {
    if(req.cookies.UserCookie === undefined){
        message = "Not connected";
        res.render('error', {title:'Free2talk',errorMessage: message, avatars :image.AVATAR_LIST } );
    }else{
        pool.pgQuery('SELECT count(*) as nb FROM public.user WHERE token =$1',[req.cookies.UserCookie],
        function (e,r) {
           if(e) {
               message = "An error has occured "+e;
               res.render('error', {title:'Free2talk',errorMessage: message, avatars :image.AVATAR_LIST } );
           }else if(r.rows[0].nb == 0 ){
               message = "Not connected";
               res.render('error', {title:'Free2talk',errorMessage: message, avatars :image.AVATAR_LIST } );
           }else {
               pool.pgQuery('SELECT name, avatar FROM public.user WHERE name like $1',['%'+req.params.n+'%'],
                   function (er,rs) {
                   if(er){
                       message = "An error has occured " +er;
                       res.render('error', {title:'Free2talk',errorMessage: message, avatars :image.AVATAR_LIST } );
                   }else{
                       console.log("RESULTAT "+ rs.rows);
                       res.render('user/search', {title:'Free2talk',
                           avatars :image.AVATAR_LIST, result: rs.rows } );
                   }
               });
           }
        });
    }
});


router.get('/search/topic/:n',function (req, res, next) {
    if(req.cookies.UserCookie === undefined){
        message = "Not connected";
        res.render('error', {title:'Free2talk',errorMessage: message, avatars :image.AVATAR_LIST } );
    }else{
        pool.pgQuery('SELECT count(*) as nb FROM public.user WHERE token =$1',[req.cookies.UserCookie],
            function (e,r) {
                if(e) {
                    message = "An error has occured "+e;
                    res.render('error', {title:'Free2talk',errorMessage: message, avatars :image.AVATAR_LIST } );
                }else if(r.rows[0].nb == 0 ){
                    message = "Not connected";
                    res.render('error', {title:'Free2talk',errorMessage: message, avatars :image.AVATAR_LIST } );
                }else {
                    pool.pgQuery('SELECT T.name, T.color, T.creator, T.creationDate, T.category, U.avatar, Count(M.idmessage) as nbmessage FROM public.topic T inner join public.user U on T.creator = U.name  Left Join public.message M on T.name = M.topic WHERE T.name like $1 Group by T.name, T.color, T.creator, T.creationDate, T.category, U.avatar Order by Count(M.idmessage) Desc'
                        ,['%'+req.params.n+'%'],
                        function (er,rs) {
                            if(er){
                                message = "An error has occured "+er;
                                res.render('error', {title:'Free2talk',errorMessage: message, avatars :image.AVATAR_LIST } );
                            }else{
                                console.log("RESULTAT "+ rs.rows);
                                res.render('topics/search', {title:'Free2talk',
                                     avatars :image.AVATAR_LIST, result: rs.rows } );
                            }
                        });
                }
            });
    }
});






module.exports = router;
