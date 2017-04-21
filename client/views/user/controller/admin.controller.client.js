(function () {
    angular
        .module("CongressTracker")
        .controller("AdminController", AdminController);

    function AdminController($routeParams, UserService) {
        var vm = this;
        vm.adminId = $routeParams.uid;
        vm.addUser = addUser;
        vm.deleteUser = deleteUser;
        vm.editUser = editUser;
        vm.users = [];

        function init() {
            updateUserData();
        }

        init();

        function addUser(newUser) {
            UserService.createUser(user)
                .then(function (res) {
                    if (res.data) {
                        vm.users.push(res.data);
                    }
                })
                .catch(function (error) {
                    vm.error = "Unable to add the new user: " + error;
                })

        }

        function deleteUser(user) {
            UserService.deleteUser(user._id)
                .then(function (res) {
                    vm.message = "User deleted.";
                    updateUserData();
                })
                .catch(function (error) {
                    vm.error = "Unable to delete user: " + error;
                })
        }

        function editUser(user) {
            // TODO: Need to redirect to an update page?
        }

        function updateUserData() {
            UserService.findAllUsers()
                .then(function (res) {
                    if (res.data) {
                        vm.users = res.data;
                    }
                    else {
                        vm.message = "No users found";
                    }
                })
                .catch(function (error) {
                    vm.error = "Encountered an error: " + error;
                })
        }
    }
})();