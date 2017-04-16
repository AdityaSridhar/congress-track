/**
 * Created by chand on 4/14/2017.
 */
(function () {
    angular
        .module("CongressTracker")
        .factory("BillService", BillService);

    function BillService($http) {


        var api = {
            "registerVot": registerVot,
            "getBillInfo" : getBillInfo
        };
        return api;

        function registerVot(voter,billId) {
            console.log(voter);
            var a = $http.put("/api/bill/"+billId, voter);
            console.log("Checking return at client service "+ a);
            return a;
        }

        function getBillInfo(billId){
            var a = $http.get("/api/bill/"+billId);
            console.log("Checking return at client service "+ JSON.stringify(a));
            return a;
        }
    }
})();