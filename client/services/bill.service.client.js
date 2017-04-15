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
        };
        return api;

        function registerVot(voter,billId) {
            console.log(voter);
            var a = $http.put("/api/bill/"+billId, voter);
            console.log("Checking return at client service "+a);
            return a;
        }
    }
})();