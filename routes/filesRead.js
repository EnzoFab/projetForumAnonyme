/**
 * Created by ENZO on 17/05/2017.
 */
var fs = require('fs');


fs.readFile('public/ressources/liste_pseudo.txt', 'utf8', function (err,data) {
    if (err) {
        return console.log(err);
    }
    //console.log(data);
    pseudos = data.split(" ");
    module.exports.PSEUDOLIST = pseudos;
});


