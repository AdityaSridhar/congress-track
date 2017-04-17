(function () {
    angular
        .module("CongressTracker")
        .controller("PoliticianController", PoliticianController);

    function PoliticianController($routeParams, UserService, BillService, $rootScope, CongressAPIService, $sce) {
        var vm = this;
        vm.bio = $routeParams["bio"];
        vm.userId = $routeParams["uid"];
        vm.registerVote = registerVote;
        vm.bil = {};

        vm.changeClass= changeClass;

        function changeClass(name, bioguide){

            var bod = {'name' : name, 'id' : vm.userId, 'bioguide' : bioguide};
            if(vm.liked){
                UserService
                    .removeFromFave(bod)
                    .then(function(data) {
                        vm.liked = false;
                    },function(){});
            }else{
                UserService
                    .addToFave(bod)
                    .then(function(data){
                        vm.liked = true;
                    },function(){})
            }

        }

        function registerVote(vote, billId){
            var voter = {'id' : vm.userId,
                'vote' : vote};
            BillService
                .registerVot(voter, billId)
                .then(function(bill){
                    vm.bil[billId] = {'upvote' : bill.data.upvote, 'downvote' : bill.data.downvote};
                },function(){});
        }

        function init() {
            CongressAPIService
                .findPolBio(vm.bio)
                .then(function (res) {
                    if (res.data) {
                        var representative = res.data.results[0];
                        vm.rep = {
                            name: "Rep. " + representative.first_name + " " + representative.last_name,
                            party: representative.party,
                            office: representative.office,
                            term: representative.term_start + " - " + representative.term_end,
                            twitter: "https://twitter.com/" + representative.twitter_id,
                            facebook: "https://facebook.com/" + representative.facebook_id,
                            website: representative.website,
                            bioguide: representative.bioguide_id,
                            phone: representative.phone
                        };
                        vm.polName = representative.first_name + " " + representative.last_name;

                        vm.repPhoto = "https://theunitedstates.io/images/congress/original/" + vm.rep.bioguide + ".jpg";
                        $sce.trustAsResourceUrl(vm.repPhoto);

                        UserService
                            .findUserById(vm.userId)
                            .then(function (user) {
                                vm.user = user.data;
                                vm.lof = user.data.lof;
                                var lof = user.data.lof;
                                var check = 0;
                                for(var v in user.data.lof){
                                    if(user.data.lof[v].name === vm.rep.name){
                                        check = 1;
                                    }
                                }

                                if (check == 0){
                                    vm.liked = false;
                                }else{
                                    vm.liked = true;
                                }
                            })
                            .catch(function (error) {
                                vm.error = "User not found"
                            });

                        CongressAPIService.findSponsoredBills(vm.rep.bioguide)
                            .then(function (bills) {
                                vm.sponsored_bills = bills.data.results;
                                // for(var s in vm.sponsored_bills){
                                //     BillService
                                //         .getBillInfo(vm.sponsored_bills[s].bill_id)
                                //         .then(function(bill){
                                //             console.log("Bill "+JSON.stringify(bill));
                                //             vm.bil[bill.data.billId] = {'upvote' : bill.data.upvote, 'downvote' : bill.data.downvote};
                                //         })
                                //         .catch (function(error){
                                //             vm.bil[vm.sponsored_bills[s].bill_id] = {'upvote' : 0, 'downvote' : 0};
                                //         });
                                // }
                            });

                        CongressAPIService.findCommittees(vm.rep.bioguide)
                            .then(function (committees) {
                                vm.committees = committees.data.results;
                            });
                    }
                });

            UserService
                .findUserById(vm.userId)
                .then(function (user) {
                    vm.user = user.data;
                    vm.lof = user.data.lof;
                })
                .catch(function (error) {
                    vm.error = "User not found"
                });
        }

        init();
    }
})();