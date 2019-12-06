var moment = require('moment');
const assert = require('assert');

let database = require('../helpers/db_controllers/services/db').getDB();
let requests_handler = require('../helpers/requests_handler');

// req["params"]["version_id"]
// Return: true if exists, else: false
let is_version_exists = async (req, res, next) => {
    let versions_db_model = database.versions_model();
    try {
        let version_id = requests_handler.require_param(req, "route", "version_id");
        return (await versions_db_model.find({version: version_id}).exec()).length !== 0;
    } catch (e) {
        throw new Error(e)
    }
};

exports.get = async (req, res, next) => {
    let versions_db_model = database.versions_model();

    // req.params.filter - if set defines lower or bigger then a parameter (version / version release date).
    // req.params.version_id - if specified check filter (optional)
    // req.params.download_date - if specified check filter (require)
    let target_version;
    let target_description;
    let target_version_rel_date;
    let filter;

    target_version = requests_handler.optional_param(req, 'route','version_id');
    target_description = requests_handler.optional_param(req, 'route','description');
    target_version_rel_date = requests_handler.optional_param(req, 'route', 'download_date');
    if (target_version) filter = requests_handler.optional_param(req, 'route', 'filter');
    else if (target_version_rel_date) filter = requests_handler.require_param(req, 'route', 'filter');

    let versions;
    try {
        if (target_version) {
            // Search versions by id

            switch (filter) {
                case "<":
                    versions = await versions_db_model.find( { version: { "$lte": target_version } } ).exec();
                    break;

                case ">":
                    versions = await versions_db_model.find( { version: { "$gte": target_version } } ).exec();
                    break;

                default:
                    versions = await versions_db_model.find( { version: target_version } ).exec();
                    break;
            }
        } else if (target_version_rel_date) {
            // Search versions by date

            target_version_rel_date = new Date(target_version_rel_date);
            /*
            * Examples for wrong formats:
            *   dd-mm-yyyy  (15-10-2016)
            *   yyyy-m-dd   (2010-6-15)
            *   yyyy-mm-d   (2010-10-5)
            *
            * Accepted formats:
            *   yyyy-mm-dd  (2010-10-06)
            *               (2010-03-19)
            *               (2016-12-31)
            */
            switch (filter) {
                case "<":
                    versions = await versions_db_model.find( { "release_date": { "$lte": target_version_rel_date } } ).exec();
                    break;

                case ">":
                    versions = await versions_db_model.find( { "release_date": { "$gte": target_version_rel_date } } ).exec();
                    break;

                default:
                    throw new Error("Unspecified sign for date filter.");
            }
        } else if (target_description) {
            // Search versions by description

            versions =
                await versions_db_model.find(
                    {$text: {$search: target_description, $language: "en"}},
                    {score: {$meta: "textScore"}}
                ).sort({ score: { $meta: "textScore" } }).exec();
        } else {
            // Get all versions

            async function demo_erase_and_create_a_demo_db() {
                versions_db_model.deleteMany({}, null).exec();
                let new_version = new versions_db_model({
                    version: "0.0.0",
                    prev_version: "0.0.0",
                    details: "lala",
                    downloader: "me",
                    release_date: new Date("2010-10-26"),
                    known_issues: "lala",
                    properties: []
                });
                new_version = await new_version.save();
                new_version = new versions_db_model({
                    version: "0.0.1",
                    prev_version: "0.0.0",
                    details: "lala",
                    downloader: "me",
                    release_date: new Date("2010-11-10"),
                    known_issues: "lala",
                    properties: []
                });
                new_version = await new_version.save();
                new_version = new versions_db_model({
                    version: "0.0.2",
                    prev_version: "0.0.1",
                    details: "lala",
                    downloader: "me",
                    release_date: new Date("2010-12-13"),
                    known_issues: "lala",
                    properties: []
                });
                new_version = await new_version.save();
            }
            //await demo_erase_and_create_a_demo_db();
            versions = await versions_db_model.find({}).exec();
        }
    } catch (e) {
        throw new Error(e)
    }
    return versions;
};

exports.add_version = async (req, res, next) => {
    let versions_db_model = database.versions_model();
    try {
        let version_id = requests_handler.require_param(req, "route", "version_id");
        let version_exists = await is_version_exists({ params: { version_id: version_id } });
        try {
            assert(!version_exists) // if exists, throw error
        } catch (e) {
            throw new Error("Version already exists");
        }

        let prev_version_id = requests_handler.require_param(req, "post", "prev_version_id");
        let is_beta = requests_handler.optional_param(req, "post", "is_beta");
        let details = requests_handler.optional_param(req, "post", "details");
        let downloader = requests_handler.optional_param(req, "post", "downloader");
        let release_date = requests_handler.require_param(req, "post", "release_date");
        release_date = moment(release_date).format('YYYY-MM-DD'); // Format date to match the DB format
        let known_issues = requests_handler.optional_param(req, "post", "known_issues");

        let new_version = new versions_db_model({
            version: version_id,
            prev_version: prev_version_id,
            is_beta: is_beta,
            details: details,
            downloader: downloader,
            release_date: release_date,
            known_issues: known_issues,
            properties: []
        });

        new_version = await new_version.save();
        return new_version;
    } catch (e) {
        throw new Error(e)
    }
};

exports.add_property = async (req, res, next) => {
    let versions_db_model = database.versions_model();
    try {
        let version_id = requests_handler.require_param(req, "route", "version_id");
        let property_type = requests_handler.require_param(req, "post", "type");
        let description = requests_handler.require_param(req, "post", "description");
        let tests_scope = requests_handler.require_param(req, "post", "tests_scope");
        let tests_details = requests_handler.optional_param(req, "post", "tests_details");
        let known_issues = requests_handler.optional_param(req, "post", "known_issues");

        let filter = {version: version_id};
        let update = {
            $push:
                {
                    properties: {
                        // _id is automatically generated by mongodb
                        type: property_type,
                        description: description,
                        tests_scope: tests_scope,
                        tests_details: tests_details,
                        known_issues: known_issues
                    }
                }
        };

        let new_version = await versions_db_model.findOneAndUpdate(filter, update, {
            new: true // Return the new object after the update is applied
        });

        if (!new_version) {
            throw new Error("Target version didn't found.");
        }

        return new_version;
    } catch (e) {
        throw new Error(e)
    }
};

exports.modify_version = async (req, res, next) => {
    let versions_db_model = database.versions_model();
    try {
        let version_id = requests_handler.require_param(req, "route", "version_id");
        let new_version_id = requests_handler.optional_param(req, "post", "version_id");
        let new_prev_version = requests_handler.optional_param(req, "post", "prev_version");
        let is_beta = requests_handler.optional_param(req, "post", "is_beta");
        let details = requests_handler.optional_param(req, "post", "details");
        let downloader = requests_handler.optional_param(req, "post", "downloader");
        let release_date = requests_handler.require_param(req, "post", "release_date");
        release_date = new Date(release_date);
        let known_issues = requests_handler.optional_param(req, "post", "known_issues");

        let filter = {version: version_id};
        let update = {
            $set:
                {
                    'version': new_version_id,
                    'prev_version': new_prev_version,
                    'is_beta': is_beta,
                    'details': details,
                    'downloader': downloader,
                    'release_date': release_date,
                    'known_issues': known_issues
                }
        };

        let new_version = await versions_db_model.updateOne(filter, update, {
            new: true // Return the new object after the update is applied
        }).exec();

        if (!new_version) {
            throw new Error("Target version didn't found.");
        }

        return new_version;
    } catch (e) {
        throw new Error(e)
    }
};

exports.modify_property = async (req, res, next) => {
    let versions_db_model = database.versions_model();
    try {
        let version_id = requests_handler.require_param(req, "route", "version_id");
        let property_id = requests_handler.require_param(req, "route", "property_id");
        let property_type = requests_handler.require_param(req, "post", "type");
        let description = requests_handler.require_param(req, "post", "description");
        let tests_scope = requests_handler.require_param(req, "post", "tests_scope");
        let tests_details = requests_handler.optional_param(req, "post", "tests_details");
        let known_issues = requests_handler.optional_param(req, "post", "known_issues");

        let filter = {version: version_id, 'properties._id': property_id};
        let update = {
            $set:
                {
                    'properties.$.type': property_type,
                    'properties.$.description': description,
                    'properties.$.tests_scope': tests_scope,
                    'properties.$.tests_details': tests_details,
                    'properties.$.known_issues': known_issues
                }
        };

        let new_version = await versions_db_model.updateOne(filter, update, {
            new: true // Return the new object after the update is applied
        }).exec();

        if (!new_version) {
            throw new Error("Target version didn't found.");
        }

        return new_version;
    } catch (e) {
        throw new Error(e)
    }
};

exports.remove_version = async (req, res, next) => {
    let versions_db_model = database.versions_model();
    try {
        let version_id = requests_handler.require_param(req, "route", "version_id");

        return versions_db_model.remove({version: version_id}).exec();
    } catch (e) {
        throw new Error(e)
    }
};

exports.remove_property = async (req, res, next) => {
    let versions_db_model = database.versions_model();
    try {
        let version_id = requests_handler.require_param(req, "route", "version_id");
        let property_id = requests_handler.require_param(req, "route", "property_id");

        let filter = {version: version_id};
        let update = {
            $pull:
                {
                    properties: {
                        _id: property_id
                    }
                }
        };

        let new_version = await versions_db_model.updateOne(filter, update, {
            new: true // Return the new object after the update is applied
        }).exec();

        if (!new_version) {
            throw new Error("Target version didn't found.");
        }

        return new_version;
    } catch (e) {
        throw new Error(e)
    }
};

exports.is_version_exists = is_version_exists;