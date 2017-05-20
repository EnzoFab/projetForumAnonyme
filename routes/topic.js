var express = require('express');
var router = express.Router();
var pseudo = require('./filesRead');
const pool = require('./query'); // make queries

/* GET users listing. */
router.get('/', function(req, res, next) {
    // display all topics
    if(res.cookie.UserCookie  === undefined)
        console.log("no cookies ")
    else
        res.send('respond with a resource');
    res.render('topics/allTopics', { title: 'Free2talk', listPseudo : pseudo.PSEUDOLIST });
});

router.get('/:n',function (req, res, next) {
    res.render('topics/topic', {title:'Free2talk',listPseudo : pseudo.PSEUDOLIST })
});




router.post('/create',function (req, res, next) {
    if(req.cookies.UserCookie === undefined)
        res.send('not connected');
    else{
      pool.pgQuery("SELECT COUNT(*) as nb FROM public.topic Where creator =$1 ",[req.cookies.UserCookie] ,function (err, resultat) {
          if(err) res.send(err);
          else if (resultat.rows[0].nb > 4){
              res.send("You have already create 5 or more topics");
          }else{
              pool.pgQuery("SELECT COUNT(*) as nb FROM public.topic Where name =$1",[req.body.topicName],
              function (error,result) {
                  if(error) res.send(error);
                  else if(result.rows[0].nb == 1){
                        res.send("Change your topic name, this one already exists");
                  }else {
                      pool.pgQuery('INSERT INTO topic VALUES($1,$2,$3,$4,$5)',
                          [req.body.topicName, req.body.color, req.cookies.UserCookie,
                              new Date(), req.body.category],
                          function (err, r3) {
                              if (err) res.send(err);
                              else res.send('success');
                          });
                  }
              });
          }
      });

    }

});



router.get('/error', function (req, res, next) {

});


module.exports = router;
