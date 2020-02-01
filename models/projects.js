const assert = require('assert');
let database = require('../helpers/db_controllers/services/db').getDB();
const access_limitations = require('../helpers/configurations/access_limitations');
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

let filter_projects_by_access = (projects, user) => {
    let new_list = [];
    projects.forEach((project, idx) => {
        if (project.members_list && project.members_list.find(member => member.username === user.username)) {
            new_list.push(projects[idx]);
        }
    });
    return new_list;
};

let get_user_project_access = async (username, project_name) => {
    let projects_db_model = database.projects_model();
    let members = await projects_db_model.find({ name: project_name }, { "members_list": 1 }).exec();
    members = members[0].members_list;
    let user = members.find(member => member.username === username);
    return user.role;
};

exports.get = async (req, res, next) => {
    // TODO
    //  If [route_params][project_name] empty -> Return all projects that the current user have an access to.
    //  Else if the current user have an access to this project, return that project.
    //      Return also the sub projects of the selected one, that this user have an access to.
    if (!req.session.user) return [];

    let projects_db_model = database.projects_model();

    let project_name;
    let projects;

    project_name = requests_handler.optional_param(req, 'route','project_name');
    if (project_name) {
        // Get specific project
        projects = await projects_db_model.aggregate([
            { "$match": { name: project_name } },
            {
                "$graphLookup": {
                    "from": "projects",
                    "startWith": "$parent_project",
                    "connectFromField": "parent_project",
                    "connectToField": "name",
                    "as": "projects_hierarchy"
                }
            }
        ]).exec();
    } else {
        // Get all projects
        projects = await projects_db_model.aggregate([
            {
                "$graphLookup": {
                    "from": "projects",
                    "startWith": "$parent_project",
                    "connectFromField": "parent_project",
                    "connectToField": "name",
                    "as": "projects_hierarchy"
                }
            }
        ]).exec();
    }
    projects = filter_projects_by_access(projects, req.session.user);
    return projects;
};

exports.add_project = async (req, res, next) => {

};

exports.modify_project = async (req, res, next) => {

};

exports.remove_project = async (req, res, next) => {

};

exports.is_project_exists = is_project_exists;

exports.get_user_project_access = get_user_project_access;