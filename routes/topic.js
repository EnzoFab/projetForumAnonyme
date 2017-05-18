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

router.post('/create',function (req, res, next) {
    if(req.cookies.UserCookie === undefined)
        res.send('not connected');
    else{
        pool.pgQuery('INSERT INTO Topic VALUES($1,$2,$3,$4)',
            [req.body.topicName, req.body.color, req.cookies.UserCookie,  Date.now()],
            function (err) {
                if (err) throw err;
                else res.send('success');
            });
    }

});

router.get('/:n', function (req, res, next) {
    // first check if the topic exists
    // if yes display the topic otherwise display an error
    var topicName = req.params.n;
    console.log("================expliquez moi cette merde" +pseudo.PSEUDOLIST+"===============");
    res.render('topics/topic',
        { title: 'Free2talk', listPseudo : pseudo.PSEUDOLIST }
        );
});


router.get('/error', function (req, res, next) {

});


module.exports = router;
