/**
 * Created by ENZO on 17/05/2017.
 */

// parametre de connexion pour pg admin
var localParam = {
    user: 'Enzo', //env var: PGUSER
    database: 'forumAnonyme', //env var: PGDATABASE
    password: 'forumAnonyme', //env var: PGPASSWORD
    host: 'localhost', // Server hosting the postgres database
    port: 5432, //env var: PGPORT
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000 // how long a client is allowed to remain idle before being closed
};

var herokuParam = {
    user: 'jjrwdomvysxgqw',
    database : 'dddjvdufa492ot',
    password: '3ba9373cf3b2bfc095f7eb00a25ba5e29b6991a050d84138c74aa4a50abb1cd5',
    host : 'ec2-54-247-166-129.eu-west-1.compute.amazonaws.com',
    port:5432,
    max : 10,
    idleTimeoutMillis: 30000

}

module.exports.PARAMETRE_CONNEXION = localParam;
module.exports.PARAMETRE_CONNEXION_HEROKU = herokuParam;