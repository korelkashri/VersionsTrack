exports.require_param = (req, param_type, param_name) => {
    switch (param_type) {
        case "post": param_type = "body"; break;
        case "get": param_type = "query"; break;
        case "route": param_type = "params"; break;
    }
    const value = req[param_type][param_name];
    if (value === undefined) throw new Error("Missing " + param_name + " param.");
    return value;
};

exports.optional_param = (req, param_type, param_name) => {
    switch (param_type) {
        case "post": param_type = "body"; break;
        case "get": param_type = "query"; break;
        case "route": param_type = "params"; break;
    }
    return req[param_type][param_name];
};