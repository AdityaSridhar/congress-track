/**
 * Created by chand on 4/14/2017.
 */

module.exports = function (app, model){

    app.get("/api/bill", findBill);
    // app.get("/api/bill/:billId", findBillByID);
    app.put("/api/bill/:billId", updateBill);
    app.get("/api/bill/:billId", findBillById)

    function findBillById(req, res){
        var billId = req.params.billId;

        model
            .findBillById(billId)
            .then(function(bill) {
                if (bill.length != 0) {
                    res.json(bill);
                } else {
                    res.sendStatus(404);
                }
            }, function (err) {
                    res.sendStatus(404);
                });
    }

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
        var user = req.body;
        console.log("Stripped "+user.id);
        var billId = req.params.billId;

        model
            .updateBill(billId, user)
            .then(function (bill) {
                if (bill) {
                    console.log("Checking return at server "+bill);
                    res.json(bill);
                }else{
                    res.sendStatus(404);
                }
            },function () {
                var use =  {userId : user.id, vote : user.vote};
                if (user.vote === 'Upvote'){
                    var bill = {
                        'billId': billId,
                        'upvote': 1,
                        'downvote': 0,
                        'listOfVoters': [use]
                    }
                }else{
                    var bill = {
                        'billId': billId,
                        'upvote': 0,
                        'downvote': 1,
                        'listOfVoters': [use]
                    }
                }
                model
                    .createBill(bill)
                    .then(function(bill){
                        if(bill) {
                            console.log("Create "+bill);
                            res.json(bill);
                        }
                    },function(){
                        console.log("Check1");
                        res.sendStatus(404);
                    });
            });
    }

};
