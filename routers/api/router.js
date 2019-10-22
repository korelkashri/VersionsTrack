var express = require('express');
var router = express.Router();

// Get routs
let versions = require('./versions');

router.get('/', (req, res) => res.redirect('/api/versions'));

router.use('/versions', versions);

module.exports = router;