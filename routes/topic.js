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
        pool.pgQuery('INSERT INTO topic VALUES($1,$2,$3,$4)',
            [req.body.topicName, req.body.color, req.cookies.UserCookie,  new Date()],
            function (err) {
                if (err) res.send('fail');
                else res.send('success');
            });
    }

});



router.get('/error', function (req, res, next) {

});


module.exports = router;
