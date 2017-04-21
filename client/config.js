
(function () {
    angular
        .module("CongressTracker")
        .config(Config);

    var checkLoggedin = function ($q, $timeout, $http, $location, $rootScope) {
        var deferred = $q.defer();
        $http.get('/api/loggedin').success(function (user) {
            $rootScope.errorMessage = null;
            if (user !== '0') {
                $rootScope.currentUser = user;
                deferred.resolve();
            }
            else {
                deferred.reject();
                $location.url('/');
            }
        });
        return deferred.promise;
    };

    var isAdmin = function ($q, $timeout, $http, $location, $rootScope) {
        var deferred = $q.defer();
        $http.get('/api/isAdmin').success(function (user) {
            $rootScope.errorMessage = null;
            if (user !== '0') {
                $rootScope.currentUser = user;
                deferred.resolve();
            }
            else {
                deferred.reject();
                $location.url('/');
            }
        });
        return deferred.promise;
    };

    function Config($routeProvider, $httpProvider) {
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/json;charset=UTF-8';

        $routeProvider
            .when("/login", {
                templateUrl: "views/user/templates/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when("/", {
                templateUrl: "views/homepage/template/homepage.view.client.html",
                controller: "HomePageController",
                controllerAs: "model"
            })
            .when("/admin/:uid", {
                templateUrl: "views/user/templates/admin.view.client.html",
                controller: "AdminController",
                controllerAs: "model",
                resolve: {loggedin: isAdmin }
            })
            .when("/guest/pol/:bio", {
                templateUrl: "views/guest/template/guest.politician.view.html",
                controller: "GuestPoliticianController",
                controllerAs: "model"
            })
            .when("/guest/search/", {
                templateUrl: "views/guest/template/guest.search.view.client.html",
                controller: "GuestSearchController",
                controllerAs: "model"
            })
            .when("/home", {
                templateUrl: "views/homepage/template/homepage.view.client.html",
                controller: "HomePageController",
                controllerAs: "model"
            })
            .when("/user/:uid", {
                templateUrl: "views/user/templates/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: {loggedin: checkLoggedin}
            })
            .when("/user/:uid/search", {
                templateUrl: "views/user/templates/search.view.client.html",
                controller: "SearchController",
                controllerAs: "model"
            })
            .when("/user/:uid/fuser/:fuid", {
                templateUrl: "views/user/templates/user.view.client.html",
                controller: "UserController",
                controllerAs: "model"
            })
            .when("/user/:uid/fave", {
                templateUrl: "views/user/templates/fave.view.client.html",
                controller: "FaveController",
                controllerAs: "model"
            })
            .when("/user/:uid/pol/:bio", {
                templateUrl: "views/user/templates/politician.view.client.html",
                controller: "PoliticianController",
                controllerAs: "model"
            })
            .when("/user/:uid/district", {
                templateUrl: "views/user/templates/district.view.client.html",
                controller: "DistrictController",
                controllerAs: "model"
            })
            .when("/register", {
                templateUrl: "views/user/templates/register.view.client.html",
                controller: "RegisterController",
                controllerAs: "model"
            })
            .otherwise({redirectTo: '/home'})
    }
})();
