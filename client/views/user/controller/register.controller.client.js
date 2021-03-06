/**
 * Created by sridh on 2/13/2017.
 */
(function () {
    angular
        .module("CongressTracker")
        .controller("RegisterController", RegisterController);

    function RegisterController($location, UserService, $rootScope) {
        var vm = this;
        vm.register = registerUser;
        vm.dismissAlert = dismissAlert;
        vm.confirmPassword = "";
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

        function registerUser(user) {
            if (vm.confirmPassword !== user.password) {
                vm.error = "Passwords entered do not match";
            }
            else {
                UserService.findUserByUsername(user.username)
                    .then(function (found) {
                        if (found.data) {
                            vm.error = "There already exists a user with the provided User Name."
                        }
                        else {
                            user.role = "DEFAULT";
                            UserService
                                .register(user)
                                .then(function (response) {
                                    var user = response.data;
                                    $rootScope.currentUser = user;
                                    $location.url("/user/" + user._id);
                                })
                                .catch(function (error) {
                                    vm.error = "Unable to register user due to an error: " + error;
                                });
                        }
                    });
            }
        }
    }

})();