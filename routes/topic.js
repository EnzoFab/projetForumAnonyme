var express = require('express');
var router = express.Router();
var pseudo = require('./filesRead');

/* GET users listing. */
router.get('/', function(req, res, next) {
    // display all topics
    if(res.cookie.UserCookie  === undefined)
        console.log("no cookies ")
    else
        res.send('respond with a resource');
    res.render('topics/allTopics', { title: 'Free2talk', listPseudo : pseudo.PSEUDOLIST });
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
