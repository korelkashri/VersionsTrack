var express = require('express');
var router = express.Router();
const settings_controller = require("../../controllers/versions");

// GET routes

router.get("/", (req, res) => res.redirect('./all'));

router.get("/all", settings_controller.view_versions); // Display all versions

router.get("/v:version_id", settings_controller.view_version); // Display specified version

router.get("/<v:version_id", settings_controller.view_versions_by_version); // Display before specified version

router.get("/>v:version_id", settings_controller.view_versions_by_version); // Display after specified version

router.get("/<d:download_date", settings_controller.view_versions_by_date); // Display before specified date

router.get("/>d:download_date", settings_controller.view_versions_by_date); // Display after specified date

module.exports = router;