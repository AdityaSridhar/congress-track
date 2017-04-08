module.exports = function () {
    var UserModel = require('./user/user.model.server.js')();

    var model = {
        userModel: UserModel
    };

    return model;
};