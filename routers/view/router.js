var express = require('express');
var router = express.Router();

// Get routs
let versions_routes = require('./versions');
// TODO add Users view/routes

router.get('/', (req, res) => res.redirect('/view/versions'));

router.use('/versions', versions_routes);

module.exports = router;