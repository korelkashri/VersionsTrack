const responses_gen = require('../helpers/responses');
let users_model = require('../models/users');

exports.get_users = async (req, res, next) => {
    try {
        let user = await users_model.get(req, res, next); // all
        return responses_gen.generate_response(res, 200, user, "User successfully restored");
    } catch (e) {
        return responses_gen.generate_response(res, 400, null, e.message);
    }
};

exports.get_user = async (req, res, next) => {
    try {
        let user = await users_model.get(req, res, next); // by id
        return responses_gen.generate_response(res, 200, user, "User successfully restored");
    } catch (e) {
        return responses_gen.generate_response(res, 400, null, e.message);
    }
};

exports.add_user = async (req, res, next) => {
    try {
        let user = await users_model.add(req, res, next);
        return responses_gen.generate_response(res, 200, user, "User successfully restored");
    } catch (e) {
        return responses_gen.generate_response(res, 400, null, e.message);
    }
};

exports.modify_user = async (req, res, next) => {
    try {
        let user = await users_model.modify(req, res, next);
        return responses_gen.generate_response(res, 200, user, "User successfully restored");
    } catch (e) {
        return responses_gen.generate_response(res, 400, null, e.message);
    }
};

exports.remove_user = async (req, res, next) => {
    try {
        let user = await users_model.remove(req, res, next);
        return responses_gen.generate_response(res, 200, user, "User successfully restored");
    } catch (e) {
        return responses_gen.generate_response(res, 400, null, e.message);
    }
};

exports.login = async (req, res, next) => {
    try {
        let user = await users_model.get(req, res, next); // by username & password
        return responses_gen.generate_response(res, 200, user, "User successfully restored");
    } catch (e) {
        return responses_gen.generate_response(res, 400, null, e.message);
    }
};

exports.register = async (req, res, next) => {
    try {
        let user = await users_model.add(req, res, next); // Without a specified role -> In model set role to default (Guest)
        return responses_gen.generate_response(res, 200, user, "User successfully restored");
    } catch (e) {
        return responses_gen.generate_response(res, 400, null, e.message);
    }
};