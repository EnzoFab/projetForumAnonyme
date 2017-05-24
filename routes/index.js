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




module.exports = router;
