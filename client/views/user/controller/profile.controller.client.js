(function () {
    angular
        .module("CongressTracker")
        .controller("ProfileController", ProfileController);

    function ProfileController($routeParams, UserService, $location, $rootScope) {
        var vm = this;
        vm.userId = $routeParams["uid"];
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
                    $location.url("/login");
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