const assert = require("assert");
const mysql = require('mysql');
const util = require('util');

let _db;

let initDB = (callback) => {
    if (_db) {
        console.warn("Trying to init DB again!");
        return;
    }

    _db = mysql.createPool({
        connectionLimit: 10,
        host: "remotemysql.com",
        user: "SOWDwU4DKo",
        password: "GCdniRGRuz",
        database: "SOWDwU4DKo"
    });

    _db.getConnection((err, connection) => {
        if (err) {
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                console.error('Database connection was closed.')
            }
            if (err.code === 'ER_CON_COUNT_ERROR') {
                console.error('Database has too many connections.')
            }
            if (err.code === 'ECONNREFUSED') {
                console.error('Database connection was refused.')
            }
        } else {
            console.log("DB Connected!");
        }
        if (connection) connection.release();
        callback();
    });

    _db.query = util.promisify(_db.query);

    /*_db.connect(function(err) {
        if (err) throw err;
        _db.query = util.promisify(_db.query);
        console.log("DB Connected!");
        callback();
    });*/
};

let getDB = () => {
    assert.ok(_db, "Db has not been initialized. Please called init first.");
    return _db;
};

module.exports = {
    getDB,
    initDB
};