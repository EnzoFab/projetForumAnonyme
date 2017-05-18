/**
 * Created by ENZO on 17/05/2017.
 */
var Pool = require('pg-pool')

// contiendra toute nos requetes
var config = require('./confDB');

const pool = new Pool(config.PARAMETRE_CONNEXION); // connexion
// We use pool cause it will be a lot of queries
// So I use pool instead on Client cause in the seconde case we would have a lot of co - deco
// and it would have slowed down the server

// according to the tutorial https://github.com/brianc/node-postgres
module.exports.pgQuery = function (qry, values, callbackFunction) {
    console.log(' test query:', text, values);
    return pool.query(qry, values, callbackFunction);
};
