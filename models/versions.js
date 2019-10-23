var moment = require('moment');
let versions_db = require('../helpers/db_controllers/services/db');
let requests_handler = require('../helpers/requests_handler');

exports.get = async (req, res, next) => {
    let versions_db_model = versions_db.getVersionsDBModel();

    // req.params.filter - if set defines lower or bigger then a parameter (version / version release date).
    // req.params.version_id - if specified check filter (optional)
    // req.params.download_date - if specified check filter (require)
    let target_version;
    let target_version_rel_date;
    let filter;

    target_version = requests_handler.optional_param(req, 'route','version_id');
    target_version_rel_date = requests_handler.optional_param(req, 'route', 'download_date');
    if (target_version) filter = requests_handler.optional_param(req, 'route', 'filter');
    else if (target_version_rel_date) filter = requests_handler.require_param(req, 'route', 'filter');

    let versions;
    try {
        if (target_version) {
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
            target_version_rel_date = moment(target_version_rel_date, [
                "YYYY.MM.DD"
            ]).startOf('day').toDate();
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
        } else {
            /*let new_version = new versions_db_model({
                version: "0",
                prev_version: "0",
                details: "lala",
                downloader: "me",
                release_date: new Date(2010,10,5),
                known_issues: "lala",
                properties: []
            });

            new_version = await new_version.save();*/
            versions = await versions_db_model.find({}).exec();
        }
    } catch (e) {
        throw new Error(e)
    }
    return versions;
};

exports.add_version = async (req, res, next) => {
    let versions_db_model = versions_db.getVersionsDBModel();
    try {
        let version_id = requests_handler.require_param(req, "route", "version_id");
        let prev_version_id = requests_handler.require_param(req, "post", "prev_version_id");
        let details = requests_handler.optional_param(req, "post", "details");
        let downloader = requests_handler.optional_param(req, "post", "downloader");
        let release_date = requests_handler.require_param(req, "post", "release_date");
        release_date = moment(release_date).format('YYYY-MM-DD'); // Format date to match the DB format
        let known_issues = requests_handler.optional_param(req, "post", "known_issues");

        let new_version = new versions_db_model({
            version: version_id,
            prev_version: prev_version_id,
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
    let versions_db_model = versions_db.getVersionsDBModel();
    try {
        let version_id = requests_handler.require_param(req, "route", "version_id");
        let property_type = requests_handler.require_param(req, "post", "type");
        let description = requests_handler.require_param(req, "post", "description");
        let tests_scope = requests_handler.require_param(req, "post", "tests_scope");
        let tests_details = requests_handler.optional_param(req, "post", "tests_details");
        let known_issues = requests_handler.optional_param(req, "post", "known_issues");

        // todo Generate new property id
        let property_id;
        let filter = {version: version_id};
        let update = {
            $push:
                {
                    properties: {
                        id: property_id,
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