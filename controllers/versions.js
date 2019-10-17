const responses_gen = require('../helpers/responses');
let versions_model = require('../models/versions');

// API
exports.get_versions = async (req, res, next) => {
    try {
        let versions = await versions_model.get(req, res, next);
        return responses_gen.generate_response(res, 200, versions, "Settings restored successfully");
    } catch (e) {
        return responses_gen.generate_response(res, 400, null, e.message);
    }
};

exports.get_version = async (req, res, next) => {
    try {
        let versions = await versions_model.get(req, res, next);
        return responses_gen.generate_response(res, 200, versions, "Settings restored successfully");
    } catch (e) {
        return responses_gen.generate_response(res, 400, null, e.message);
    }
};

exports.get_versions_by_version = async (req, res, next) => {
    try {
        let versions = await versions_model.get(req, res, next);
        return responses_gen.generate_response(res, 200, versions, "Settings restored successfully");
    } catch (e) {
        return responses_gen.generate_response(res, 400, null, e.message);
    }
};

exports.get_versions_by_date = async (req, res, next) => {
    try {
        let versions = await versions_model.get(req, res, next);
        return responses_gen.generate_response(res, 200, versions, "Settings restored successfully");
    } catch (e) {
        return responses_gen.generate_response(res, 400, null, e.message);
    }
};

exports.add_version = async (req, res, next) => {
    try {
        let versions = await versions_model.get(req, res, next);
        return responses_gen.generate_response(res, 200, versions, "Settings restored successfully");
    } catch (e) {
        return responses_gen.generate_response(res, 400, null, e.message);
    }
};

exports.add_property = async (req, res, next) => {
    try {
        let versions = await versions_model.get(req, res, next);
        return responses_gen.generate_response(res, 200, versions, "Settings restored successfully");
    } catch (e) {
        return responses_gen.generate_response(res, 400, null, e.message);
    }
};

exports.remove_version = async (req, res, next) => {
    try {
        let versions = await versions_model.get(req, res, next);
        return responses_gen.generate_response(res, 200, versions, "Settings restored successfully");
    } catch (e) {
        return responses_gen.generate_response(res, 400, null, e.message);
    }
};

exports.remove_property = async (req, res, next) => {
    try {
        let versions = await versions_model.get(req, res, next);
        return responses_gen.generate_response(res, 200, versions, "Settings restored successfully");
    } catch (e) {
        return responses_gen.generate_response(res, 400, null, e.message);
    }
};

exports.modify_version = async (req, res, next) => {
    try {
        let versions = await versions_model.get(req, res, next);
        return responses_gen.generate_response(res, 200, versions, "Settings restored successfully");
    } catch (e) {
        return responses_gen.generate_response(res, 400, null, e.message);
    }
};

exports.modify_property = async (req, res, next) => {
    try {
        let versions = await versions_model.get(req, res, next);
        return responses_gen.generate_response(res, 200, versions, "Settings restored successfully");
    } catch (e) {
        return responses_gen.generate_response(res, 400, null, e.message);
    }
};


// View
exports.view_versions = async (req, res, next) => {
    try {
        res.render("pages/home"/*, {access_level: req.session.user.role}*/);
    } catch (e) {
        return responses_gen.generate_response(res, 400, null, e.message);
    }
};