/**
 * Created by chand on 4/14/2017.
 */

module.exports = function (app, model){

    app.get("/api/bill", findBill);
    app.get("/api/bill/:billId", findBillById);
    app.put("/api/bill/:billId", updateBill);

    function findBill(req, res) {
        var billId = req.query.billId;

        model
            .findBillById(billId)
            .then(function (bill) {
                if (bill.length != 0) {
                    res.json(bill);
                } else {
                    res.sendStatus(404);
                }
            }, function (err) {
                res.sendStatus(404);
            });
    }

    function updateBill(req, res){
        var user = req.query.user;
        var billId = req.params.billId;

        model
            .updateBill(billId, user)
            .then(function (response) {
                if(response.nModified === 1){
                    // Update was successful
                    model
                        .findBillById(billId)
                        .then(function (response) {
                            res.json(response);
                        },function () {
                            if (user.vote === 'Upvote'){
                                var bill = {
                                    'billId': billId,
                                    'upvote': 1,
                                    'downvote': 0,
                                    'listOfVoters': [user]
                                }
                            }else{
                                var bill = {
                                    'billId': billId,
                                    'upvote': 0,
                                    'downvote': 1,
                                    'listOfVoters': [user]
                                }
                            }
                            model
                                .createBill(bill)
                                .then(function(bill){
                                    if(bill) {
                                        res.json(bill);
                                    }
                                },function(){
                                    res.sendStatus(404);
                                });
                        });
                }
                else{
                    res.sendStatus(404);
                }
            },function () {
                res.sendStatus(404);
            });
    }

};
