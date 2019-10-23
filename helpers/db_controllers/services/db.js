const assert = require("assert");
const mongoose = require("mongoose");
let _db;

let init_schema = () => {
    let schema = mongoose.Schema({
        version: {
            type: String,
            required: true
        },
        prev_version: {
            type: String,
            required: true
        },
        details: String,
        downloader: String,
        release_date: {
            type: Date,
            default: Date.now
        },
        known_issues: String,
        properties: [
            {
                id: {
                    type: Number,
                    required: true
                },
                type: {
                    type: String,
                    enum: ['Feature', 'Fix Bug', 'Change', 'Deprecated'],
                    default: 'Feature',
                    required: true
                },
                description: {
                    type: String,
                    required: true
                },
                tests_scope: {
                    type: String,
                    enum: ['None', 'Partial', 'Large', 'Full'],
                    default: 'Partial',
                    required: true
                },
                tests_details: String,
                known_issues: String
            }
        ]
    });
    _db = mongoose.model('versions', schema);
};

let initDB = (callback) => {
    /*if (mongoose.connection) {
        console.warn("Trying to init DB again!");
        return;
    }*/

    /*_db = mysql.createPool({
        connectionLimit: 10,
        host: "remotemysql.com",
        user: "SOWDwU4DKo",
        password: "GCdniRGRuz",
        database: "SOWDwU4DKo"
    });*/
    mongoose.connect('mongodb://localhost/resthub', { useNewUrlParser: true});

    /*if(!mongoose.connection)
        console.error("Error connecting db");
    else*/
    console.log("Db connected successfully");

    init_schema();

    callback();
    /*_db.getConnection((err, connection) => {
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

    _db.query = util.promisify(_db.query);*/
};

let getVersionsDBModel = () => {
    assert.ok(_db, "Db has not been initialized. Please called init first.");
    return _db;
};

module.exports = {
    getVersionsDBModel,
    initDB
};