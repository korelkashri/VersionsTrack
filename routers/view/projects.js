var express = require('express');
var router = express.Router();
const con_validator = require('../../middlewares/validate_connection');
const access_limitations = require('../../helpers/configurations/access_limitations');
const projects_controller = require("../../controllers/projects");

// Extended routes
let versions_routes = require('./versions');
let admin_panel_routes = require('./project_admin_panel');

router.use('/p:project_name/admin-panel', con_validator.require_login, (req, res, next) => { // Project Admin Require
    req.project_action_required_level = access_limitations.project_min_access_required.view_admin_panel;
    req.action_on_reject = _ => {
        res.redirect('/404');
    };
    next();
}, con_validator.require_project_access_level, admin_panel_routes);

router.use('/p:project_name/versions', con_validator.require_login, (req, res, next) => { // Project Admin Require
    req.project_action_required_level = access_limitations.project_min_access_required.view_project;
    req.action_on_reject = _ => {
        res.redirect('/404');
    };
    next();
}, con_validator.require_project_access_level, versions_routes);


// GET routes
router.get('/', projects_controller.view_projects);

router.get('/:project_name', con_validator.require_login, (req, res, next) => { // Project Admin Require
    req.project_action_required_level = access_limitations.project_min_access_required.view_project;
    req.action_on_reject = _ => {
        res.redirect('/404');
    };
    next();
}, con_validator.require_project_access_level, projects_controller.view_project);

module.exports = router;