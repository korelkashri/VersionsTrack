const assert = require('assert');
let database = require('../helpers/db_controllers/services/db').getDB();
let requests_handler = require('../helpers/requests_handler');

/**
 *
 * @param req:
 * req["params"]["project_name"]
 * @param res
 * @param next
 *
 * @throws If req params are missing
 *
 * @returns Return: true if exists, else: false
 */
let is_project_exists = async (req, res, next) => {
    let projects_db_model = database.projects_model();
    let project_name = requests_handler.require_param(req, "route", "project_name");
    let db_res = await projects_db_model.find({name: project_name}).exec();
    return db_res.length !== 0;
};

exports.get = async (req, res, next) => {
    // TODO
    //  If [route_params][project_name] not empty -> Return al projects that the current user have an access to.
    //  Else if the current user have an access to this project, return that project.
    //  Return also the sub projects of the selected project, that this user have an access to.

    let project_name;
    let projects;

    project_name = requests_handler.optional_param(req, 'route','project_name');
    if (project_name) {
        // Get specific project
    } else {
        // Get all projects
        projects = await projects_db_model.find({}).exec();
    }
};

exports.add_project = async (req, res, next) => {

};

exports.modify_project = async (req, res, next) => {

};

exports.remove_project = async (req, res, next) => {

};

exports.is_project_exists = is_project_exists;