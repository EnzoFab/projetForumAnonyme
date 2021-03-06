var express = require('express');
var router = express.Router();
var pseudo = require('../conf/filesRead');
const pool = require('../conf/query'); // make queries
var image = require('../conf/filesRead');

router.get('/allCategories', function (req, res , next) {
    pool.pgQuery('SELECT * FROM public.category','', function (err, resultat) {
        if(err) {
            return console.error('error running query', err);
        }
        console.log(JSON.stringify(resultat.rows))
        res.send(JSON.stringify(resultat.rows));

    });
});

router.get('/:n',function (req, res, next) {
    pool.pgQuery('SELECT COUNT(*) as nb FROM Category WHERE nameCat=$1',
        [req.params.n],function (e,r) {
            if(e){
               message = "An error has occured "+e;
                res.render('error', {title:'Free2talk',errorMessage: message,  avatars :image.AVATAR_LIST } );
            }else if(r.rows[0].nb ==0){
                message = "The category "+ req.params.n+ " doesn't exist";
                res.render('error', {title:'Free2talk',errorMessage: message,  avatars :image.AVATAR_LIST } );
            }else {
                pool.pgQuery( // use left join
                    'SELECT T.name, T.color, T.creator, T.creationDate, T.category, U.avatar, Count(M.idmessage) as nbmessage FROM public.topic T inner join public.user U on T.creator = U.name  Left Join public.message M on T.name = M.topic WHERE T.category =$1 Group by T.name, T.color, T.creator, T.creationDate, T.category, U.avatar Order by Count(M.idmessage) Desc',
                [req.params.n],function (err,resultat) {
                        if(err){
                            message = err ;
                            res.render('error', {title:'Free2talk',errorMessage: message,  avatars :image.AVATAR_LIST } );

                        } else{
                            res.render('category/category',
                                {title:'Free2talk', allTopics : resultat.rows, size:resultat.rows.length, nameCat: req.params.n,
                                    avatars :image.AVATAR_LIST });
                            // send the length of the array resultat.rows in order to organize our layout
                        }
                    });
            }
        });
});

module.exports = router;
