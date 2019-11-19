var express = require('express');
var router = express.Router();
const con_validator = require('../../middlewares/validate_connection');
const users_controller = require("../../controllers/users"); // todo Add Controller/Model for users Login/Register

// GET routes

router.get('/login', con_validator.require_logout, function(req, res) {
    res.render('pages/login');
});

// router.post('/login', con_validator.require_logout, users_controller.login);

router.get('/disconnect', function(req, res) {
    req.session.reset();
    res.redirect('/');
});

router.get("/register", con_validator.require_logout, function(req, res) {
    res.render('pages/register'); // TODO create register page
});

// router.post("/register", con_validator.require_logout, users_controller.register);

module.exports = router;