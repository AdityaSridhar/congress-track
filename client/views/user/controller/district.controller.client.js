(function () {
    angular
        .module("CongressTracker")
        .controller("DistrictController", DistrictController);

    function DistrictController($location, $routeParams, UserService, GeoLocationService, CongressAPIService, $sce) {
        var vm = this;
        vm.userId = $routeParams.uid;

        function init() {
            UserService.findUserById(vm.userId)
                .then(function (user) {
                    if (user.data) {
                        GeoLocationService.getLocation(user.data.address)
                            .then(function (location) {
                                if(location.data){
                                    var loc = location.data.results[0].geometry.location;
                                    CongressAPIService.findCongressionalDistrict(loc.lat, loc.lng)
                                        .then(function (district) {
                                            if(district.data){
                                                var state = district.data.results[0].state;
                                                var districtNumber = district.data.results[0].district;
                                                CongressAPIService.findRepresentative(state, districtNumber)
                                                    .then(function (res) {
                                                        if(res.data){
                                                            var representative = res.data.results[0];
                                                            vm.rep = {
                                                                name: "Rep. " + representative.first_name + " "+  representative.last_name,
                                                                party: representative.party,
                                                                office: representative.office,
                                                                term: representative.term_start + " - " + representative.term_end,
                                                                twitter: "https://twitter.com/" + representative.twitter_id,
                                                                facebook: "https://facebook.com/" + representative.facebook_id,
                                                                website: representative.website,
                                                                bioguide: representative.bioguide_id,
                                                                phone: representative.phone
                                                            };
                                                            vm.repPhoto = "https://theunitedstates.io/images/congress/original/" + vm.rep.bioguide + ".jpg";
                                                            $sce.trustAsResourceUrl(vm.repPhoto);
                                                            
                                                            CongressAPIService.findSponsoredBills(vm.rep.bioguide)
                                                                .then(function (bills) {
                                                                    vm.sponsored_bills = bills.data.results;
                                                                })
                                                        }
                                                    })
                                            }
                                        })
                                }
                            })

                    }
                })
        }

        init();
    }
})();