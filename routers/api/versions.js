var express = require('express');
var router = express.Router();
const versions_controller = require("../../controllers/versions");
const versions_middleware = require("../../middlewares/versions");

// GET routes

router.get("/", (req, res) => res.redirect('/api/versions/all'));

router.get("/all", versions_controller.get_versions); // Display all versions

router.get("/v:version_id", versions_controller.get_version); // Display specified version

router.get("/lt_v:version_id", versions_middleware.set_param_lt, versions_controller.get_versions_by_version); // Display before specified version

router.get("/gt_v:version_id", versions_middleware.set_param_gt, versions_controller.get_versions_by_version); // Display after specified version

router.get("/lt_d:download_date", versions_middleware.set_param_lt, versions_controller.get_versions_by_date); // Display before specified date

router.get("/gt_d:download_date", versions_middleware.set_param_gt, versions_controller.get_versions_by_date); // Display after specified date

// POST routes

router.post("/add/v:version_id", versions_controller.add_version); // Add new version

router.post("/add/p:version_id", versions_controller.add_property); // Add new property to version - returns the new property id

router.post("/remove/v:version_id", versions_controller.remove_version); // Remove version

router.post("/remove/p:version_id-:property_id", versions_controller.remove_property); // Remove property from version

router.post("/modify/v:version_id", versions_controller.modify_version); // Modify specified version

router.post("/modify/p:version_id-:property_id", versions_controller.modify_property); // Modify specified property

module.exports = router;