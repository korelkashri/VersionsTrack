const responses_gen = require('../helpers/responses');
let versions_model = require('../models/versions');
const access_limitations = require('../helpers/configurations/access_limitations');
let projects_model = require('../models/projects');
let requests_handler = require('../helpers/requests_handler');

// API

let add_is_prev_version_exists_data = async (versions) => {
    for (let version of versions) {
        version._doc.is_prev_version_exists = await versions_model.is_version_exists({ params: { version_id: version.prev_version } });
    }
};

exports.get_versions = async (req, res, next) => {
    try {
        let versions = await versions_model.get(req, res, next);
        await add_is_prev_version_exists_data(versions);
        return responses_gen.generate_response(res, 200, versions, "Versions successfully restored");
    } catch (e) {
        return responses_gen.generate_response(res, 400, null, e.message);
    }
};

exports.get_version = async (req, res, next) => {
    try {
        let versions = await versions_model.get(req, res, next);
        await add_is_prev_version_exists_data(versions);
        return responses_gen.generate_response(res, 200, versions, "Versions successfully restored");
    } catch (e) {
        return responses_gen.generate_response(res, 400, null, e.message);
    }
};

exports.get_versions_by_version = async (req, res, next) => {
    try {
        let versions = await versions_model.get(req, res, next);
        await add_is_prev_version_exists_data(versions);
        return responses_gen.generate_response(res, 200, versions, "Versions successfully restored");
    } catch (e) {
        return responses_gen.generate_response(res, 400, null, e.message);
    }
};

exports.get_versions_by_date = async (req, res, next) => {
    try {
        let versions = await versions_model.get(req, res, next);
        await add_is_prev_version_exists_data(versions);
        return responses_gen.generate_response(res, 200, versions, "Versions successfully restored");
    } catch (e) {
        return responses_gen.generate_response(res, 400, null, e.message);
    }
};

exports.get_versions_by_description = async (req, res, next) => {
    try {
        let versions = await versions_model.get(req, res, next);
        await add_is_prev_version_exists_data(versions);
        return responses_gen.generate_response(res, 200, versions, "Versions successfully restored");
    } catch (e) {
        return responses_gen.generate_response(res, 400, null, e.message);
    }
};

exports.add_version = async (req, res, next) => {
    try {
        await versions_model.add_version(req, res, next);
        return responses_gen.generate_response(res, 200, {}, "Version successfully added");
    } catch (e) {
        return responses_gen.generate_response(res, 400, null, e.message);
    }
};

exports.add_property = async (req, res, next) => {
    try {
        let versions = await versions_model.add_property(req, res, next);
        return responses_gen.generate_response(res, 200, versions, "Property successfully added");
    } catch (e) {
        return responses_gen.generate_response(res, 400, null, e.message);
    }
};

exports.remove_version = async (req, res, next) => {
    try {
        await versions_model.remove_version(req, res, next);
        return responses_gen.generate_response(res, 200, null, "Version successfully removed");
    } catch (e) {
        return responses_gen.generate_response(res, 400, null, e.message);
    }
};

exports.remove_property = async (req, res, next) => {
    try {
        await versions_model.remove_property(req, res, next);
        return responses_gen.generate_response(res, 200, null, "Property successfully removed");
    } catch (e) {
        return responses_gen.generate_response(res, 400, null, e.message);
    }
};

exports.modify_version = async (req, res, next) => {
    try {
        let versions = await versions_model.modify_version(req, res, next);
        return responses_gen.generate_response(res, 200, versions, "Version successfully modified");
    } catch (e) {
        return responses_gen.generate_response(res, 400, null, e.message);
    }
};

exports.modify_property = async (req, res, next) => {
    try {
        let versions = await versions_model.modify_property(req, res, next);
        return responses_gen.generate_response(res, 200, versions, "Property successfully modified");
    } catch (e) {
        return responses_gen.generate_response(res, 400, null, e.message);
    }
};


// View
exports.view_versions = async (req, res, next) => {
    try {
        // Assumptions at this point:
        // - The project exists.
        // - The user found as member in this project.

        let project_name = requests_handler.require_param(req, 'route','project_name');
        let user_project_role = await projects_model.get_user_project_access(req.session.user.username, project_name);
        res.render("pages/versions", {
            // is_logged_in: !!req.session.user,
            // access_level: req.session.user ? user_project_role : 1,
            // username: req.session.user && req.session.user.username,

            is_logged_in: true, // See assumptions
            access_level: user_project_role,  // See assumptions
            username: req.session.user.username, // See assumptions
            min_access_required: access_limitations,
            selected_project: project_name
        });
    } catch (e) {
        return responses_gen.generate_response(res, 400, null, e.message);
    }
};