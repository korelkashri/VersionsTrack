const hash = require('../helpers/hash').get_hash_code;
var moment = require('moment');
const assert = require('assert');

let database = require('../helpers/db_controllers/services/db').getDB();
let requests_handler = require('../helpers/requests_handler');
const access_limitations = require('../helpers/configurations/access_limitations');

// req["params"]["username"]
// Return: true if exists, else: false
let is_user_exists = async (req, res, next) => {
    let users_db_model = database.users_model();
    try {
        let username = requests_handler.require_param(req, "route", "username");
        return (await users_db_model.find({username: username}).exec()).length !== 0;
    } catch (e) {
        throw new Error(e)
    }
};

exports.get = async (req, res, next) => {
    let users_db_model = database.users_model();
    try {
        let res;
        let username = requests_handler.optional_param(req, "route", "username");
        if (req.user && req.user.role < access_limitations.min_access_required.view_users_details && req.user.username !== username) {
            throw new Error("You have no permission to watch this user.");
        }
        if (username) { // Get specific user by id
            let query = {
                username: username
            };
            let password;
            if (!req.user) { // If not logged in already or the current user is not an admin, require password
                password = requests_handler.require_param(req, "get", "password");
                query.password = hash(password);
            }
            res = users_db_model.find(query).exec();
        } else { // Get all users
            res = users_db_model.find({}, '-password').exec();
        }
        return res;
    } catch (e) {
        throw new Error(e)
    }
};

exports.add = async (req, res, next) => {
    let users_db_model = database.users_model();
    try {
        let query;
        let username = requests_handler.require_param(req, "post", "username");
        let password = requests_handler.require_param(req, "post", "password");
        let role = requests_handler.optional_param(req, "post", "role");

        let user_exists = await is_user_exists({ params: { username: username } });
        try {
            assert(!user_exists); // If exists, throw error
        } catch (e) {
            throw new Error("User already exists");
        }

        let new_user;
        if (req.user && req.user.role >= access_limitations.min_access_required.create_new_user_with_specific_role && role) {
            new_user = new users_db_model({
                username: username,
                password: hash(password),
                role: role
            });
        } else {
            new_user = new users_db_model({
                username: username,
                password: hash(password)
            });
        }

        new_user = await new_user.save();
        return new_user;
    } catch (e) {
        throw new Error(e)
    }
};

// TODO assert username == 'admin'
exports.modify = async (req, res, next) => {
    let users_db_model = database.users_model();
    try {
        let version_id = requests_handler.require_param(req, "route", "version_id");

        return users_db_model.remove({version: version_id}).exec();
    } catch (e) {
        throw new Error(e)
    }
};

// TODO assert username == 'admin'
exports.remove = async (req, res, next) => {
    let users_db_model = database.users_model();
    try {
        let version_id = requests_handler.require_param(req, "route", "version_id");

        return users_db_model.remove({version: version_id}).exec();
    } catch (e) {
        throw new Error(e)
    }
};

exports.validate_username = is_user_exists;