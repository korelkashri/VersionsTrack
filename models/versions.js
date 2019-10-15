const mysql = require('mongo');
var qs = require('querystring');
let db = require('../helpers/db_controllers/services/db');

exports.get = async (req, res, next) => {
    let db_connection = db.getDB();
    let sql = mysql.format("SELECT * FROM global_settings");
    let settings;
    try {
        settings = await db_connection.query(sql);
    } catch (e) {
        throw new Error(e)
    }
    return settings;
};

exports.update = async (req, res, next) => {
    let db_connection = db.getDB();
    let sql = mysql.format("SELECT * FROM global_settings");
    let settings;
    try {
        settings = await db_connection.query(sql);
    } catch (e) {
        throw new Error(e)
    }
    let days_to_red_status = req.body.days || settings.days_to_red_status;
    sql = mysql.format("UPDATE global_settings SET days_to_red_status=?", [days_to_red_status]);
    try {
        settings = await db_connection.query(sql);
    } catch (e) {
        throw new Error(e)
    }
    return settings;
};