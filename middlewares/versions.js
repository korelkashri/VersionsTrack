let set_param_lt = (req, res, next) => {
    req.params.filter = "<";
    next();
};

let set_param_gt = (req, res, next) => {
    req.params.filter = ">";
    next();
};

module.exports = {
    set_param_lt,
    set_param_gt
};