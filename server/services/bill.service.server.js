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
                if (bill.lenght != 0) {
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
                            res.sendStatus(404);
                        })
                }
                else{
                    res.sendStatus(404);
                }
            },function () {
                res.sendStatus(404);
            });
    }

}
