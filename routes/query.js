/**
 * Created by ENZO on 17/05/2017.
 */
var Pool = require('pg-pool')

// contiendra toute nos requetes
var config = require('./confDB');

const pool = new Pool(config.PARAMETRE_CONNEXION); // connexion

function querySelect() {

}

function queryInsert() {

}

function insertNewTopic(nom, couleur, createur, date) {
    const query = pool.query();
}

function create () {





    const query = pool.query(
        "Insert INTO UTILISATEUR VALUES('Enzo','code')");
    console.log("connection " +query);

}

module.exports.querys = {insert:queryInsert, select: querySelect};