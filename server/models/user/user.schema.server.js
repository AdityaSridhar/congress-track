/**
 * Created by Aditya Sridhar on 3/18/2017.
 */

module.exports = function () {
    var mongoose = require('mongoose');

    var UserSchema = mongoose.Schema({
        username: String,
        password: String,
        firstName: String,
        lastName: String,
        email: String,
        phone: String,
        address: String,
        lof : [{name : String, bioguide : String}],
        lofu : [{name : String, fuserId : String}],
        role: {type: String, enum: ['DEFAULT', 'ADMIN'], default: "DEFAULT"},
        dateCreated: {type: Date, default: Date.now},
        facebook: {
            id: String,
            token: String
        }
    }, {collection: "Congress_Tracker.User"});

    return UserSchema;
};