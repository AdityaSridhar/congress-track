(function () {
    angular
        .module("CongressTracker")
        .factory("GeoLocationService", GeoLocationService);

    function GeoLocationService($http) {

        var api = {
            "getLocation": getLocation
        };

        var urlBase = "https://maps.googleapis.com/maps/api/geocode/json?address=";

        return api;

        function getLocation(address) {
            var url = urlBase + address;
            return $http.get(url);
        }
    }
})();