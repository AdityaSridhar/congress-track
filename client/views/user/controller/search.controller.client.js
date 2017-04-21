/**
 * Created by chand on 4/17/2017.
 */
(function () {
    angular
        .module("CongressTracker")
        .controller("SearchController", SearchController);

    function SearchController(GeoLocationService, CongressAPIService, $sce, $routeParams, BillService) {
        var vm = this;
        vm.repSearchText = null;
        vm.billSearchText = null;
        vm.userId = $routeParams["uid"];
        vm.searchRep = searchRep;
        vm.searchBill = searchBill;
        vm.registerVote = registerVote;
        vm.bil = {};

        function registerVote(vote, billId){
            var voter = {'id' : vm.userId,
                'vote' : vote};
            BillService
                .registerVot(voter, billId)
                .then(function(bill){
                    vm.bil[billId] = {'upvote' : bill.data.upvote, 'downvote' : bill.data.downvote};
                },function(){});
        }

        function searchRep() {
            vm.error = "";
            vm.hasRepSearchResults = false;
            vm.hasBillSearchResults = false;
            if (vm.repSearchText) {
                GeoLocationService.getLocation(vm.repSearchText)
                    .then(function (location) {
                            if (location.data) {
                                var loc = location.data.results[0].geometry.location;
                                CongressAPIService.findCongressionalDistrict(loc.lat, loc.lng)
                                    .then(function (district) {
                                            if (district.data) {
                                                var state = district.data.results[0].state;
                                                var districtNumber = district.data.results[0].district;
                                                CongressAPIService.findRepresentative(state, districtNumber)
                                                    .then(function (res) {
                                                        if (res.data) {
                                                            vm.hasRepSearchResults = true;
                                                            var representative = res.data.results[0];
                                                            vm.rep = {
                                                                name: "Rep. " + representative.first_name + " " + representative.last_name,
                                                                bioguide: representative.bioguide_id,
                                                                state: representative.state,
                                                                district: representative.district
                                                            };
                                                            vm.repPhoto = "https://theunitedstates.io/images/congress/original/" + vm.rep.bioguide + ".jpg";
                                                            $sce.trustAsResourceUrl(vm.repPhoto);
                                                        }
                                                    })
                                            }
                                        },
                                        function (error) {
                                            vm.error = error;
                                        })
                            }
                        },
                        function (error) {
                            vm.error = error;
                        })
                    .catch(function (error) {
                        vm.error = error;
                    });

            }
            else{
                vm.error = "Please enter an address";
            }
        }

        function searchBill() {
            vm.error = "";
            vm.hasRepSearchResults = false;
            vm.hasBillSearchResults = false;
            if(vm.billSearchText){
                CongressAPIService.findBills(vm.billSearchText)
                    .then(function (bills) {
                        if(bills.data){
                            vm.hasBillSearchResults = true;
                            vm.bills = bills.data.results;
                        }
                    })
            }
            else{
                vm.error = "Please enter relevant information in the bill search"
            }
        }
    }
})();