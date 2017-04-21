/**
 * Created by chand on 4/21/2017.
 */
(function () {
    angular
        .module("CongressTracker")
        .controller("AdminCreateController", AdminCreateController);

    function AdminCreateController($location, UserService, $rootScope, $routeParams) {
        var vm = this;
        vm.register = registerUser;
        vm.dismissAlert = dismissAlert;
        vm.confirmPassword = "";
        vm.adminId = $routeParams["uid"];
        vm.dismissAlert = dismissAlert;

        function init(){
            vm.adminI = $routeParams["uid"];
            UserService
                .findUserById(vm.adminId)
                .then(function (user) {
                    vm.admin = user.data;
                })
                .catch(function (error) {
                    vm.error = "User not found"
                });
        }

        init();

        function dismissAlert() {
            vm.error = "";
        }

        function registerUser(user) {
            console.log("Hi");
            user.password = "123";
                UserService.findUserByUsername(user.username)
                    .then(function (found) {
                        if (found.data) {
                            vm.error = "There already exists a user with the provided User Name."
                        }
                        else {
                            user.role = "DEFAULT";
                            UserService
                                .createUser(user)
                                .then(function (response) {
                                    var user = response.data;
                                    vm.message = "User successfully created.";
                                    UserService
                                        .findUserById(vm.adminId)
                                        .then(function (user) {
                                            $rootScope.currentUser = user;
                                            $location.url("/admin/" + vm.adminId);
                                        })
                                        .catch(function (error) {
                                            vm.error = "User not found"
                                        });

                                    // vm.adminId = $routeParams["uid"];

                                })
                                .catch(function (error) {
                                    vm.error = "Unable to register user due to an error: " + error;
                                });
                        }
                    });
        }
    }

})();