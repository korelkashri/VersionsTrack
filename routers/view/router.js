var express = require('express');
var router = express.Router();

// Get routs
let versions_routes = require('./versions');
let users_routes = require('./users');

router.get('/', (req, res) => res.redirect('/view/versions'));

router.use('/', users_routes);

router.use('/versions', versions_routes);

module.exports = router;