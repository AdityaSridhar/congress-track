/**
 * Created by chand on 4/17/2017.
 */
(function () {
    angular
        .module("CongressTracker")
        .controller("SearchController", SearchController);

    function SearchController(GeoLocationService, CongressAPIService, $sce, $routeParams, BillService, UserService) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        vm.searchRep = searchRep;
        vm.searchBill = searchBill;
        vm.registerVote = registerVote;
        vm.searchUser = searchUser;
        vm.bil = {};
        vm.repSearchText = null;
        vm.billSearchText = null;
        vm.userSearchText = null;

        function registerVote(vote, billId) {
            var voter = {
                'id': vm.userId,
                'vote': vote
            };
            BillService
                .registerVot(voter, billId)
                .then(function (bill) {
                    vm.bil[billId] = {'upvote': bill.data.upvote, 'downvote': bill.data.downvote};
                }, function () {
                });
        }

        function searchRep() {
            setVarsToDefault();
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
                                                        if (res.data && res.data.results && res.data.results.length > 0) {
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
                                                        else{
                                                            vm.message = "Please verify if the address entered is valid."
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
            else {
                vm.error = "Please enter an address";
            }
        }

        function searchBill() {
            setVarsToDefault();
            if (vm.billSearchText) {
                CongressAPIService.findBills(vm.billSearchText)
                    .then(function (bills) {
                        if (bills.data && bills.data.results && bills.data.results.length > 0) {
                            vm.hasBillSearchResults = true;
                            vm.bills = bills.data.results;
                        }
                        else {
                            vm.message = "No bill found pertaining to the search text";
                        }
                    })
            }
            else {
                vm.error = "Please enter relevant information in the bill search"
            }
        }

        function searchUser() {
            setVarsToDefault();
            if (vm.userSearchText) {
                UserService.findUserMatches(vm.userSearchText)
                    .then(function (res) {
                        if (res.data && res.data.length > 0) {
                            vm.hasUserSearchResults = true;
                            vm.users = res.data;
                        }
                        else {
                            vm.message = "No such user exists.";
                        }
                    })
                    .catch(function (error) {
                        vm.error = "Oops. Something went wrong: " + error;
                    })
            }
        }

        function setVarsToDefault() {
            vm.error = "";
            vm.message = "";
            vm.hasRepSearchResults = false;
            vm.hasBillSearchResults = false;
            vm.hasUserSearchResults = false;
        }
    }
})();