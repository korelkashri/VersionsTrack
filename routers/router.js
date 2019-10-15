var express = require('express');
var router = express.Router();

// Get routs
let api_routes      = require('./api/router');
let view_routes     = require('./view/router');

router.get('/', (req, res) => res.redirect('/view'));

router.use('/api', api_routes);
router.use('/view', view_routes);

module.exports = router;