var express = require('express');
var router = express.Router();
//const con_validator = require('../middlewares/validate_connection');

// Get routs
/*let login_routes              = require('./login');*/
let versions_routes              = require('./versions');

//router.get('/', con_validator.require_login, (req, res) => res.redirect('/dashboard'));

router.get('/', (req, res) => res.redirect('/versions/all'));

//router.use('/', login_routes);

router.use('/versions', versions_routes);

/*router.get('/dashboard', con_validator.require_login, (req, res) => {
    res.render("pages/home", {access_level: req.session.user.role})
});*/

module.exports = router;