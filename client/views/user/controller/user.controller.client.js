(function () {
    angular
        .module("CongressTracker")
        .controller("UserController", UserController);

    function UserController($routeParams, UserService, $location, $rootScope) {
        var vm = this;
        vm.userId = $routeParams["uid"];
        vm.fuserId = $routeParams["fuid"]
        vm.changeClass = changeClass;

        function init() {
            UserService
                .findUserById(vm.fuserId)
                .then(function (user) {
                    vm.fname = user.data.username;
                    console.log(JSON.stringify(user));
                    vm.fuser = user.data;
                    vm.lofp = user.data.lof;
                    vm.lofu = user.data.lofu;
                    UserService
                        .findUserById(vm.userId)
                        .then(function (user) {
                            vm.user = user.data;
                            var check = 0;
                            for(var v in user.data.lofu){
                                if(user.data.lofu[v].name === vm.fname){
                                    check = 1;
                                }
                            }

                            if (check == 0){
                                vm.liked = false;
                            }else{
                                vm.liked = true;
                            }
                        })
                        .catch(function (error) {
                            vm.error = "User not found"
                        });
                })
                .catch(function (error) {
                    vm.error = "User not found"
                });
        }

        function changeClass(name, id){

            var bod = {'name' : name, 'id' : vm.userId, 'fuserId' : id};
            if(vm.liked){
                UserService
                    .removeFromFaveF(bod)
                    .then(function(data) {
                        vm.liked = false;
                        console.log("after removing from fave" +JSON.stringify(data));
                    },function(){});
            }else{
                UserService
                    .addToFaveF(bod)
                    .then(function(data){
                        vm.liked = true;
                    },function(){})
            }

        }

        init();
    }
})();