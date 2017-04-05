(function(){
    angular
        .module("CongressTracker")
        .config(Config);

    function Config($routeProvider, $httpProvider) {
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/json;charset=UTF-8';

        $routeProvider
            .when("/login", {
                templateUrl: "views/user/templates/login.view.client.html",
                //controller: "LoginController",
                //controllerAs: "model"
            })
            .when("/home",{
                templateUrl : "views/homepage/template/homepage.view.client.html",
                controller : "HomePageController",
                controllerAs : "model"
            })
            .when("/register",{
                templateUrl : "views/user/templates/register.view.client.html",
                controller : "HomePageController",
                controllerAs : "model"
            })
            .when("/graphs",{
                templateUrl : "cardsDemo.html"
            })
            .otherwise({redirectTo:'/home'})
    }})();
