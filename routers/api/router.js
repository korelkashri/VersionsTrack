var express = require('express');
var router = express.Router();
const con_validator = require('../../middlewares/validate_connection');

let versions = require('./versions');
let projects = require('./projects');
let users = require('./users');
let connections = require('./connections');

// router.get('/', (req, res) => res.redirect('/api/versions'));

router.use('/', connections);

router.use('/projects/', projects);

router.use('/projects/p:project_name/versions', con_validator.require_login, versions);

router.use('/users', con_validator.require_login, users);

module.exports = router;