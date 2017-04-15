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
            return $http.put("/api/bill/"+billId, voter);
        }
    }
})();