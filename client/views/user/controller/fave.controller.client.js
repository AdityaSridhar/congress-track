(function () {
    angular
        .module("CongressTracker")
        .controller("FaveController", FaveController);

    function FaveController($routeParams, UserService, $location, $rootScope) {
        var vm = this;
        vm.userId = $routeParams["uid"];

        function init() {
            UserService
                .findUserById(vm.userId)
                .then(function (user) {
                    vm.user = user.data;
                    vm.lofp = user.data.lof;
                    vm.lofu = user.data.lofu;
                })
                .catch(function (error) {
                    vm.error = "User not found"
                });
        }

        init();
    }
})();