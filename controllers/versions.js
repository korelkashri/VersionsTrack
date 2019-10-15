const responses_gen = require('../helpers/responses');
let versions_model = require('../models/versions');

exports.get_versions = async (req, res, next) => {
    try {
        let versions = await versions_model.get(req, res, next);
        return responses_gen.generate_response(res, 200, versions, "Settings restored successfully");
    } catch (e) {
        return responses_gen.generate_response(res, 400, null, e.message);
    }
};

exports.view_versions = async (req, res, next) => {
    try {
        res.render("pages/home"/*, {access_level: req.session.user.role}*/);
    } catch (e) {
        return responses_gen.generate_response(res, 400, null, e.message);
    }
};

exports.update_settings = async (req, res, next) => {
    try {
        let settings = await settings_model.update(req, res, next);
        return responses_gen.generate_response(res, 200, settings, "Settings update succeeded");
    } catch (e) {
        return responses_gen.generate_response(res, 400, null, e.message);
    }
};