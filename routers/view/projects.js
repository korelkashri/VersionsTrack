var express = require('express');
var router = express.Router();
const projects_controller = require("../../controllers/projects");

// GET routes

router.get("/", versions_controller.view_versions);

module.exports = router;