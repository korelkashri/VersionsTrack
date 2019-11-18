var moment = require('moment');
const assert = require('assert');

let database = require('../helpers/db_controllers/services/db').getDB();
let requests_handler = require('../helpers/requests_handler');

exports.get = async (req, res, next) => {
    let users_db_model = database.users_model();
    try {
        let version_id = requests_handler.require_param(req, "route", "version_id");

        return versions_db_model.remove({version: version_id}).exec();
    } catch (e) {
        throw new Error(e)
    }
};

exports.add = async (req, res, next) => {
    let users_db_model = database.users_model();
    try {
        let username = requests_handler.require_param(req, "route", "username");
        let password = requests_handler.require_param(req, "post", "password");
        let role = requests_handler.optional_param(req, "post", "password");

        return versions_db_model.insert({version: version_id}).exec();
    } catch (e) {
        throw new Error(e)
    }
};

exports.modify = async (req, res, next) => {
    let users_db_model = database.users_model();
    try {
        let version_id = requests_handler.require_param(req, "route", "version_id");

        return versions_db_model.remove({version: version_id}).exec();
    } catch (e) {
        throw new Error(e)
    }
};

exports.remove = async (req, res, next) => {
    let users_db_model = database.users_model();
    try {
        let version_id = requests_handler.require_param(req, "route", "version_id");

        return versions_db_model.remove({version: version_id}).exec();
    } catch (e) {
        throw new Error(e)
    }
};