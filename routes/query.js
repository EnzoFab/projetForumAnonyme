/**
 * Created by ENZO on 17/05/2017.
 */






function create () {
    const pg = require('pg');
    var config = {
        user: 'Enzo', //env var: PGUSER
        database: 'postgres', //env var: PGDATABASE
        password: 'enzo', //env var: PGPASSWORD
        host: 'localhost', // Server hosting the postgres database
        port: 5432, //env var: PGPORT
        max: 10, // max number of clients in the pool
        idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
    };
    const pool = new pg.Pool(config);


    const query = pool.query(
        'CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');

}

module.exports = create;