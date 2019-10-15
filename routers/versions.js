var express = require('express');
var router = express.Router();
const settings_controller = require("../controllers/versions");

// GET routes

router.get("/", (req, res) => res.redirect('/versions/all'));

router.get("/all", settings_controller.view_settings); // Display all versions

router.get("/v:version_id", settings_controller.view_settings); // Display specified version

router.get("/<v:version_id", settings_controller.view_settings); // Display before specified version

router.get("/>v:version_id", settings_controller.view_settings); // Display after specified version

router.get("/<d:download_date", settings_controller.view_settings); // Display before specified date

router.get("/>d:download_date", settings_controller.view_settings); // Display after specified date

// POST routes

router.post("/add/v:version_id", settings_controller.view_settings); // Add new version

router.post("/add/p:version_id-:property_id", settings_controller.view_settings); // Add new property to version

router.post("/remove/v:version_id", settings_controller.view_settings); // Remove version

router.post("/remove/p:version_id-:property_id", settings_controller.view_settings); // Remove property from version

router.post("/modify/v:version_id", settings_controller.view_settings); // Modify specified version

router.post("/modify/p:version_id-:property_id", settings_controller.view_settings); // Modify specified property

module.exports = router;