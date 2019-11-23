var express = require('express');
var router = express.Router();
const con_validator = require('../../middlewares/validate_connection');
const users_controller = require("../../controllers/users");
const access_limitations = require('../../helpers/configurations/access_limitations');

// GET routes

router.get('/login', con_validator.require_logout, users_controller.view_login_page);

// router.post('/login', con_validator.require_logout, users_controller.login);

router.get('/disconnect', function(req, res) {
    req.session.reset();
    res.redirect('/');
});

router.get("/register", con_validator.require_logout, function(req, res) {
    res.render('pages/register'); // TODO create register page
});

router.get("/profile", con_validator.require_login, (req, res, next) => {
    req.required_level = access_limitations.min_access_required.view_profile;
    req.action_on_reject = _ => {
        res.redirect('/');
    };
    next();
}, con_validator.require_access_level, users_controller.view_profile);

router.get("/admin-panel", (req, res) => res.redirect('/view/admin-panel/index'));

router.get("/admin-panel/:category_name", con_validator.require_login, (req, res, next) => { // Required Admin
    req.required_level = access_limitations.min_access_required.view_admin_panel;
    req.action_on_reject = _ => {
        res.redirect('/404');
    };
    next();
}, con_validator.require_access_level, users_controller.view_admin_panel);

// router.post("/register", con_validator.require_logout, users_controller.register);

module.exports = router;