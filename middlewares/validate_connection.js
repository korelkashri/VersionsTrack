const hash = require('../helpers/hash').get_hash_code;
let database = require('../helpers/db_controllers/services/db').getDB();

let test_session_connection = (req, res, next) => {
    if (req.session && req.session.user) {
        if (req.session.user.id === undefined) {
            delete req.session.user;
            delete req.user;
            delete res.locals.user;
            next();
        }
        const users_db_model = database.users_model();
        users_db_model.find({id: req.session.user.id}, (err, data) => {
            if (err) throw err;
            if (data.length) {
                let user = data[0];
                if (hash(user.password) === req.session.user.password) {
                    req.user = user;
                    user.password = req.session.user.password;
                    //delete req.user.password; // delete the password from the session
                    req.session.user = user;  //refresh the session value
                    res.locals.user = user;
                } else {
                    delete req.session.user;
                    delete req.user;
                    delete res.locals.user;
                }
            }
            next();
        });
    } else {
        next();
    }
};

let require_login = (req, res, next) => {
    if (!req.user) {
        res.redirect('/login');
    } else {
        next();
    }
};

let require_access_level = (req, res, next) => {
    let role = req.user && req.user.role || 1; // 1 -> guest
    if (req.required_level > role) {
        req.action_on_reject ? req.action_on_reject() : res.status(401).end();
    } else {
        next();
    }
};

let require_logout = (req, res, next) => {
    if (!req.user) {
        next();
    } else {
        res.redirect('/');
    }
};

module.exports = {
    test_session_connection,
    require_login,
    require_access_level,
    require_logout
};