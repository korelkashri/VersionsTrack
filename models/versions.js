const mongoose = require('mongoose');
var qs = require('querystring');
let versions_db = require('../helpers/db_controllers/services/db');
let requests_handler = require('../helpers/requests_handler');

exports.get = async (req, res, next) => {
    let db_connection = versions_db.getDB();

    // req.params.filter - if set defines lower or bigger then a parameter (version / version release date).
    // req.params.version_id - if specified check filter (optional)
    // req.params.download_date - if specified check filter (require)
    let target_version;
    let target_version_rel_date;
    let filter;

    target_version = requests_handler.optional_param(req, 'route','version_id');
    target_version_rel_date = requests_handler.optional_param(req, 'route', 'download_date');
    if (target_version) filter = requests_handler.optional_param(req, 'route', 'filter');
    else if (target_version_rel_date) filter = requests_handler.require_param(req, 'route', 'filter');

    let versions;
    try {
        if (target_version) {
            switch (filter) {
                case "<":
                    break;

                case ">":
                    break;

                default:
                    versions = await db_connection.find({version:target_version}).exec();
                    break;
            }
        } else if (target_version_rel_date) {

        } else {
            versions = await db_connection.get().exec();
        }
    } catch (e) {
        throw new Error(e)
    }
    return versions;
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