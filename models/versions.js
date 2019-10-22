var qs = require('querystring');
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
                    versions = await versions_db_model.find( { version: { $lte: target_version } } ).exec();
                    break;

                case ">":
                    versions = await versions_db_model.find( { version: { $gte: target_version } } ).exec();
                    break;

                default:
                    versions = await versions_db_model.find({version:target_version}).exec();
                    break;
            }
        } else if (target_version_rel_date) {
            switch (filter) {
                case "<":
                    versions = await versions_db_model.find( { date: { $lte: target_version_rel_date } } ).exec();
                    break;

                case ">":
                    versions = await versions_db_model.find( { date: { $gte: target_version_rel_date } } ).exec();
                    break;

                default:
                    throw new Error("Unspecified sign for date filter.")
            }
        } else {
            versions = await versions_db_model.get().exec();
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