var express = require('express');
var router = express.Router();
const con_validator = require('../../middlewares/validate_connection');
const users_controller = require("../../controllers/users");
const admin_controller = require("../../controllers/admin");
const access_limitations = require('../../helpers/configurations/access_limitations');

// GET routes

router.get("/", (req, res) => {
    let requests_handler = require('../../helpers/requests_handler');
    let project_name = requests_handler.require_param(req, 'route','project_name');
    let new_route = "/view/" + project_name + "/admin-panel/index";
    res.redirect(new_route);
});

router.get("/:category_name", admin_controller.view_admin_panel);

// TODO add user to project and set user role page

// TODO remove user from project option

module.exports = router;