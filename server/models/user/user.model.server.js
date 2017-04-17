module.exports = function () {

    var api = {
        createUser: createUser,
        findUserById: findUserById,
        findUserByUsername: findUserByUsername,
        findUserByCredentials: findUserByCredentials,
        updateUser: updateUser,
        deleteUser: deleteUser,
        findUserByFacebookId: findUserByFacebookId,
        addToFav : addToFav,
        removeFromFav : removeFromFav,
        addToFavF : addToFavF,
        removeFromFavF : removeFromFavF,
    };

    var mongoose = require('mongoose');
    var UserSchema = require('./user.schema.server')();
    var UserModel = mongoose.model('UserModel', UserSchema);

    return api;

    function addToFav(name, id, bio){
        return UserModel.findById(id)
            .then(function (user){
                console.log("Model "+user.lof);
                var nam = {'name' : name, 'bioguide' : bio};
                user.lof.push(nam);
                return updateUser(user._id, user)
                    .then(function(user){
                        console.log("after update "+user);
                        return user;
                    });
            });
    }

    function addToFavF(name, id, fid){
        return UserModel.findById(id)
            .then(function (user){
                var nam = {'name' : name, 'fuserId' : fid};
                user.lofu.push(nam);
                return updateUser(user._id, user)
                    .then(function(user){
                        console.log("after update "+user);
                        return user;
                    });
            });
    }

    function removeFromFav(name, id){
        console.log(name);
        return UserModel.findById(id)
            .then(function (user){
                console.log("Remove function " + user);

                var lof = user.lof;
                var tem = {};
                console.log("lof "+lof);

                for(var v in user.lof){
                    if(user.lof[v].name === name){
                        user.lof.splice(v, 1);
                    }
                }

                //user.lof = tem;

                console.log(user);
                return updateUser(user._id, user)
                    .then(function(user){
                        console.log("Mega user" +user);
                        return user;
                    });
            });
    }
    function removeFromFavF(name, id){
        console.log(name);
        return UserModel.findById(id)
            .then(function (user){
                console.log("Remove function " + user);

                var lofu = user.lofu;
                var tem = {};
                console.log("lof "+lofu);

                for(var v in user.lofu){
                    if(user.lofu[v].name === name){
                        user.lofu.splice(v, 1);
                    }
                }

                //user.lof = tem;

                console.log(user);
                return updateUser(user._id, user)
                    .then(function(user){
                        console.log("Mega user" +user);
                        return user;
                    });
            });
    }

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