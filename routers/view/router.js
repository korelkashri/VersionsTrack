var express = require('express');
var router = express.Router();
const con_validator = require('../../middlewares/validate_connection');
const access_limitations = require('../../helpers/configurations/access_limitations');

// Get routs
let system_admin_panel_routes = require('./system_admin_panel');
let projects_routes = require('./projects');
let users_routes = require('./users');
let connections_routes = require('./connections');

router.get('/', (req, res) => res.redirect('/view/projects'));

router.use('/', connections_routes);

router.use('/projects', projects_routes);

router.use('/admin-panel', con_validator.require_login, (req, res, next) => {
    req.required_level = access_limitations.system_min_access_required.view_admin_panel;
    req.action_on_reject = _ => {
        res.redirect('/404');
    };
    next();
}, con_validator.require_access_level, system_admin_panel_routes);

router.use('/users', con_validator.require_login, users_routes);

module.exports = router;