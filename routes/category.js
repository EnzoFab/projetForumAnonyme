var express = require('express');
var router = express.Router();
var pseudo = require('./filesRead');
const pool = require('./query'); // make queries

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
                res.render('error', {title:'Free2talk',errorMessage: message} );
            }else if(r.rows[0].nb ==0){
                message = "The category "+ req.params.n+ " doesn't exist";
                res.render('error', {title:'Free2talk',errorMessage: message} );
            }else {
                pool.pgQuery( // use left join
                    'SELECT T.name, T.color, T.creator, T.creationDate, T.category, Count(M.idmessage) as nbmessage FROM public.topic T Left Join public.message M on T.name = M.topic WHERE T.category =$1  Group by T.name, T.color, T.creator, T.creationDate, T.category Order by Count(M.idmessage) Desc',
                [req.params.n],function (err,resultat) {
                        if(err){
                            message = "An error has occured "+err ;
                            res.render('error', {title:'Free2talk',errorMessage: message} );

                        } else{
                            res.render('category/category',
                                {title:'Free2talk', allTopics : resultat.rows, size:resultat.rows.length});
                            // send the length of the array resultat.rows in order to organize our layout
                        }
                    })
            }
        });
});

module.exports = router;
