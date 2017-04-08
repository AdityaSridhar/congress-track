module.exports = function () {

    var api = {
        createUser: createUser,
        findUserById: findUserById,
        findUserByUsername: findUserByUsername,
        findUserByCredentials: findUserByCredentials,
        updateUser: updateUser,
        deleteUser: deleteUser,
        findUserByFacebookId: findUserByFacebookId
    };

    var mongoose = require('mongoose');
    var UserSchema = require('./user.schema.server')();
    var UserModel = mongoose.model('UserModel', UserSchema);

    return api;

    function createUser(user) {
        return UserModel.create(user);
    }

    function findUserById(userId) {
        return UserModel.findById(userId)
            .exec()
            .then(function (user) {
                return user;
            });
    }

    function findUserByUsername(username) {
        return UserModel.findOne({username: username})
            .exec()
            .then(function (user) {
                return user;
            })
    }

    function findUserByCredentials(username, password) {
        return UserModel.findOne({username: username, password: password})
            .exec()
            .then(function (user) {
                return user;
            })
    }

    function updateUser(userId, user) {
        return UserModel.findByIdAndUpdate(userId, user, {new: true})
            .exec()
            .then(function (updatedUser) {
                return updatedUser;
            });
    }

    function deleteUser(userId) {
        return UserModel.findById(userId)
            .exec()
            .then(function (user) {
                return user.remove();
            });
    }

    function findUserByFacebookId(facebookId) {
        return UserModel.findOne({'facebook.id': facebookId})
            .exec()
            .then(function (user) {
                return user;
            });
    }
};