var express = require('express');
var router = express.Router();
const projects_controller = require("../../controllers/projects");
const con_validator = require('../../middlewares/validate_connection');
const access_limitations = require('../../helpers/configurations/access_limitations');

// GET routes

router.get("/", (req, res) => res.redirect('/api/projects/all'));

router.get("/all", projects_controller.get_projects); // Display all projects [That the current user have an access to]

router.get("/p:project_name", projects_controller.get_project); // Display specified project

// POST routes

router.post("/create/:project_name", (req, res, next) => {
    req.required_level = access_limitations.system_min_access_required.create_project;
    req.action_on_reject = _ => {
        res.redirect('/403');
    };
    next();
}, con_validator.require_access_level, projects_controller.add_project); // Create new project

router.post("/delete/:project_name", (req, res, next) => {
    req.required_level = access_limitations.system_min_access_required.delete_project;
    req.action_on_reject = _ => {
        res.redirect('/403');
    };
    next();
}, con_validator.require_access_level, projects_controller.remove_project); // Delete project

router.post("/modify/:project_name", (req, res, next) => {
    req.required_level = access_limitations.system_min_access_required.modify_project;
    req.action_on_reject = _ => {
        res.redirect('/403');
    };
    next();
}, con_validator.require_access_level, projects_controller.modify_project); // Modify specified project

module.exports = router;