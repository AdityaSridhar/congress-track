(function () {
    angular
        .module("CongressTracker")
        .controller("LoginController", LoginController);

    function LoginController($location, UserService, $rootScope) {
        var vm = this;
        vm.login = login;
        vm.dismissAlert = dismissAlert;

        function login(user) {
            UserService
                .login(user)
                .then(function (response) {
                    var user = response.data;
                    $rootScope.currentUser = user;
                    $location.url("/user/" + user._id);
                })
                .catch(function (error) {
                    vm.error = "Unable to login";
                })
        }

        function dismissAlert() {
            vm.error = "";
        }
    }
})();