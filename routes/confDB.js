/**
 * Created by ENZO on 17/05/2017.
 */

// parametre de connexion pour pg admin
var param = {
    user: 'Enzo', //env var: PGUSER
    database: 'forumAnonyme', //env var: PGDATABASE
    password: 'forumAnonyme', //env var: PGPASSWORD
    host: 'localhost', // Server hosting the postgres database
    port: 5432, //env var: PGPORT
    max: 10, // max number of clients in the pool
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
}

module.exports.PARAMETRE_CONNEXION = param;