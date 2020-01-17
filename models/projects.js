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

};

exports.get = async (req, res, next) => {

};

exports.add_project = async (req, res, next) => {

};

exports.modify_project = async (req, res, next) => {

};

exports.remove_project = async (req, res, next) => {

};

exports.is_project_exists = is_project_exists;