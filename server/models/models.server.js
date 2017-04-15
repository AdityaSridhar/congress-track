module.exports = function () {
    var UserModel = require('./user/user.model.server.js')();
    var BillModel = require('./bills/bill.model.server')();

    var model = {
        userModel: UserModel,
        billModel: BillModel
    };

    return model;
};