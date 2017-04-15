module.exports = function () {

    var api = {
        createBill : createBill,
        // findBill: findBill,
        findBillById: findBillById,
        updateBill: updateBill,
        deleteBill: deleteBill,
    };

    var mongoose = require('mongoose');
    var BillSchema = require('./bill.schema.server')();
    var BillModel = mongoose.model('BillModel', BillSchema);

    return api;

    function createBill(bill) {
        return BillModel.create(bill);
    }

    function findBillById(billId) {
        console.log("Hit findBillById "+ billId)
        return BillModel.findOne({billId : billId})
            .then(function (bill) {
                return bill;
            });
    }

    function updateBill(billId, user) {
        console.log("Match user "+user.id);
        return findBillById(billId)
            .then(function (Bill) {
                loVoters = Bill.listOfVoters;
                var check = 0;
                console.log("returned bill " +Bill);

                for(var l in Bill.listOfVoters){
                    console.log("Loop "+user.id);
                    if (user.id === Bill.listOfVoters[l].userId){
                        check = 1;
                        if(user.vote !== Bill.listOfVoters[l].vote){
                            if(user.vote === 'Upvote') {
                                Bill.upvote = Bill.upvote + 1;
                                Bill.downvote = Bill.downvote - 1;
                                Bill.listOfVoters[l].vote = 'Upvote';
                            }else{
                                Bill.upvote = Bill.upvote - 1;
                                Bill.downvote = Bill.downvote + 1;
                                Bill.listOfVoters[l].vote = 'Downvote'
                            }
                        }
                    }
                }

                console.log(check);

                if (check === 0){
                    if (user.vote === 'Upvote'){
                        Bill.upvote = Bill.upvote + 1;
                        Bill.listOfVoters.push({userId : user.id, vote : user.vote});
                        console.log("While pushing: "+user.id);
                    }else{
                        Bill.downvote = Bill.downvote + 1;
                        Bill.listOfVoters.push({userId : user.id, vote : user.vote});
                    }
                }

                return BillModel.findByIdAndUpdate(Bill._id, Bill, {new: true})
                    .then(function (updatedBill) {
                        console.log("Final value "+updatedBill);
                        return updatedBill;
                    });
            });
    }

    function deleteBill(userId) {
        return BillModel.findById(userId)
            .then(function (user) {
                return user.remove();
            });
    }

};