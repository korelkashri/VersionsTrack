let express = require('express');
let router = express.Router();
const users_controller = require("../../controllers/users");
con_validator = require('../../middlewares/validate_connection');

router.get("/login/:username", con_validator.require_logout, users_controller.login); // Validate login

router.post("/register", con_validator.require_logout, users_controller.register); // Validate login

/*router.get("/register_test", (req, res, next) => {
    req.body.username = "admin";
    req.body.password = "admin";
    next();
}, users_controller.register);

router.get("/login_test", (req, res, next) => {
    req.params.username = "admin";
    req.body.password = "admin";
    next();
}, users_controller.login);*/

module.exports = router;