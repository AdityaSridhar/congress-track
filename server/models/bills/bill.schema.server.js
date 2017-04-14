module.exports = function () {
    var mongoose = require('mongoose');

    var BillSchema = mongoose.Schema({
        billId : String,
        upvote : {type :Number, default : 0},
        downvote : {type :Number, default : 0},
        listOfVoters : [{userId : String, vote : String}]
        }
    }, {collection: "Congress_Tracker.Bill"});

    return BillSchema;
};