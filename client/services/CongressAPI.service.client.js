(function () {
    angular
        .module("CongressTracker")
        .factory("CongressAPIService", CongressAPIService);

    function CongressAPIService($http, $sce) {

        var api = {
            "findRepresentative": findRepresentative,
            "findCongressionalDistrict": findCongressionalDistrict,
            "findSponsoredBills": findSponsoredBills,
            "findCommittees": findCommittees
        };

        var urlBase = "https://congress.api.sunlightfoundation.com";

        return api;

        function findRepresentative(state, district) {
            var url = urlBase + "/legislators?in_office=true&chamber=house&state=" + state + "&district=" + district + "&callback=JSON_CALLBACK";
            $sce.trustAsResourceUrl(url);
            return $http.jsonp(url);
        }

        function findCongressionalDistrict(latitude, longitude) {
            var url = urlBase + "/districts/locate?latitude=" + latitude + "&longitude=" + longitude;
            return $http.get(url);
        }

        function findSponsoredBills(sponsor_id) {
            var url = urlBase + "/bills?sponsor_id=" + sponsor_id + "&callback=JSON_CALLBACK";
            $sce.trustAsResourceUrl(url);
            return $http.jsonp(url);
        }

        function findCommittees(member_id) {
            var url = urlBase + "/committees?member_ids=" + member_id + "&callback=JSON_CALLBACK";
            $sce.trustAsResourceUrl(url);
            return $http.jsonp(url);
        }
    }
})();