let express = require('express');
let router = express.Router();
const users_controller = require("../../controllers/users");
const con_validator = require('../../middlewares/validate_connection');
const access_limitations = require('../../helpers/configurations/access_limitations');

// GET routes

router.get("/", (req, res) => res.redirect('/api/users/all'));

router.get("/all", con_validator.require_login, (req, res, next) => {
    req.required_level = access_limitations.min_access_required.view_users_details;
    req.action_on_reject = _ => {
        res.redirect('/403');
    };
    next();
}, con_validator.require_access_level, users_controller.get_users);

router.get("/u:username", con_validator.require_login, (req, res, next) => {
    req.required_level = access_limitations.min_access_required.view_users_details;
    req.action_on_reject = _ => {
        res.redirect('/403');
    };
    next();
}, con_validator.require_access_level, users_controller.get_user);

// POST routes

module.exports = router;