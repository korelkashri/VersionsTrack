const responses_gen = require('../helpers/responses');
let projects_model = require('../models/projects');
const access_limitations = require('../helpers/configurations/access_limitations');
let requests_handler = require('../helpers/requests_handler');

// API

exports.get_projects = async (req, res, next) => {
    try {
        let projects = await projects_model.get(req, res, next);
        return responses_gen.generate_response(res, 200, projects, "projects successfully restored");
    } catch (e) {
        return responses_gen.generate_response(res, 400, null, e.message);
    }
};

exports.get_project = async (req, res, next) => {
    try {
        let projects = await projects_model.get(req, res, next);
        return responses_gen.generate_response(res, 200, projects, "projects successfully restored");
    } catch (e) {
        return responses_gen.generate_response(res, 400, null, e.message);
    }
};

exports.add_project = async (req, res, next) => {
    try {
        await projects_model.add_project(req, res, next);
        return responses_gen.generate_response(res, 200, {}, "project successfully added");
    } catch (e) {
        return responses_gen.generate_response(res, 400, null, e.message);
    }
};

exports.remove_project = async (req, res, next) => {
    try {
        await projects_model.remove_project(req, res, next);
        return responses_gen.generate_response(res, 200, null, "project successfully removed");
    } catch (e) {
        return responses_gen.generate_response(res, 400, null, e.message);
    }
};


exports.modify_project = async (req, res, next) => {
    try {
        let projects = await projects_model.modify_project(req, res, next);
        return responses_gen.generate_response(res, 200, projects, "project successfully modified");
    } catch (e) {
        return responses_gen.generate_response(res, 400, null, e.message);
    }
};

// View
exports.view_projects = async (req, res, next) => {
    try {
        res.render("pages/projects", {
            access_level: req.session.user ? req.session.user.role : 1,
            is_logged_in: !!req.session.user,
            username: req.session.user && req.session.user.username,
            min_access_required: access_limitations
        });
    } catch (e) {
        return responses_gen.generate_response(res, 400, null, e.message);
    }
};

exports.view_project = async (req, res, next) => {
    try {
        let project_name = requests_handler.require_param(req, 'route','project_name');
        res.render("pages/projects", {
            access_level: req.session.user ? req.session.user.role : 1,
            is_logged_in: !!req.session.user,
            username: req.session.user && req.session.user.username,
            min_access_required: access_limitations,
            selected_project: project_name
        });
    } catch (e) {
        return responses_gen.generate_response(res, 400, null, e.message);
    }
};