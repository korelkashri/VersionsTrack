const db = require('../helpers/db_controllers/services/db');

let test_session_connection = (req, res, next) => {
    if (req.session && req.session.user) {
        if (req.session.user.id === undefined) {
            delete req.session.user;
            delete req.user;
            delete res.locals.user;
            next();
        }
        const db_connection = db.getDB();
        let sql = mysql.format("SELECT * FROM users WHERE id=?", [req.session.user.id]);
        db_connection.query(sql, (err,rows) => {
            if(err) throw err;
            let user = rows[0];
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
            // finishing processing the middleware and run the route
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
    if (req.required_level > req.user.role) {
        req.action_on_reject ? req.action_on_reject() : res.status(401).end();
    } else {
        next();
    }
};

let require_logout = (req, res, next) => {
    if (!req.user) {
        next();
    } else {
        res.redirect('/dashboard');
    }
};

module.exports = {
    test_session_connection,
    require_login,
    require_access_level,
    require_logout
};