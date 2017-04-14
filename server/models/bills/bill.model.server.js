module.exports = function () {

    var api = {
        createBill : createBill,
        findBill: findBill,
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
        return BillModel.findone({billId : billId})
            .exec()
            .then(function (bill) {
                return bill;
            });
    }

    function updateBill(billId, user) {
        return findBillById(billId)
            .exec()
            .then(function (Bill) {
                loVoters = Bill.listOfVoters;
                var check = 0;

                for(var l in loVoters){
                    if user.id === loVoters[l].userId{
                        check = 1;
                        if(user.vote !== loVoters[l].vote){
                            if(user.vote === 'upvote') {
                                Bill.upvote = Bill.upvote + 1;
                                Bill.downvote = Bill.downvote - 1;
                            }else{
                                Bill.upvote = Bill.upvote - 1;
                                Bill.downvote = Bill.downvote + 1;
                            }
                        }
                    }
                }

                if (check === 0){
                    if (user.vote === 'upvote'){
                        Bill.upvote = Bill.upvote + 1;
                        Bill.listOfVoters.push(user);
                    }
                }

                return BillModel.findByIdAndUpdate(Bill._id, Bill, {new: true})
                    .exec()
                    .then(function (updatedBill) {
                        return updatedBill;
                    });
            });
    }

    function deleteBill(userId) {
        return BillModel.findById(userId)
            .exec()
            .then(function (user) {
                return user.remove();
            });
    }

};