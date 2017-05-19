var express = require('express');
var router = express.Router();
var pseudo = require('./filesRead');
const pool = require('./query'); // make queries

router.get('/allCategories', function (req, res , next) {
    pool.pgQuery('SELECT * FROM Category','', function (err, resultat) {
        if(err) {
            return console.error('error running query', err);
        }
        console.log(JSON.stringify(resultat.rows))
        res.send(JSON.stringify(resultat.rows));

    });
});

module.exports = router;
