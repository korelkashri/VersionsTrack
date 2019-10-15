var express = require('express');
var router = express.Router();

// Get routs
let versions_routes = require('./versions');

router.get('/', (req, res) => res.redirect('./versions'));

router.use('/versions', versions_routes);

module.exports = router;