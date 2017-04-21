/**
 * Created by chand on 4/21/2017.
 */

(function () {
    angular
        .module("CongressTracker")
        .controller("AdminEditController", AdminEditController);

    function AdminEditController($routeParams, UserService, $location, $rootScope) {
        var vm = this;
        vm.userId = $routeParams["eduid"];
        vm.adminId = $routeParams["uid"];
        vm.updateUser = updateUser;
        vm.unregisterUser = unregisterUser;
        vm.logout = logout;

        function init() {
            UserService
                .findUserById(vm.userId)
                .then(function (user) {
                    vm.user = user.data;
                })
                .catch(function (error) {
                    vm.error = "User not found"
                });

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

        function updateUser(user) {
            UserService
                .updateUser(vm.userId, user)
                .then(function (user) {
                    if (user.data) {
                        vm.message = "User Info successfully updated"
                    }
                })
                .catch(function (error) {
                    vm.error = "Unable to update User info"
                });
        }

        function unregisterUser() {
            UserService
                .deleteUser(vm.userId)
                .then(function (user) {
                    $location.url("/admin/"+vm.adminId);
                })
                .catch(function (error) {
                    vm.error = "Failed to delete user"
                });
        }

        function logout() {
            UserService.logout()
                .then(function (response) {
                    $rootScope.currentUser = null;
                    $location.url("/");
                })
        }
    }
})();
