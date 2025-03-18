const { Pool } = require("pg");
require("colors");


const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: true,
        ca: process.env.DB_CA,
    },
};

const pool = new Pool(config);

pool.connect(function (err) {
    if (err) throw err;
    pool.query("SELECT VERSION()", [], function (err, result) {
        if (err) throw err;
        console.log(result.rows[0].version.yellow);
    });
    pool.query("SHOW max_connections", [], function (err, result) {
        if (err) throw err;
        console.log(
            `Max Connections: ${result.rows[0].max_connections} `.yellow,
        );
    });
});