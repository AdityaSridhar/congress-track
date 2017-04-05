(function () {
    angular
        .module("CongressTracker", [])
        .controller("HomePageController", HomePageController);

    function HomePageController() {
        var vm = this;


        function init() {
            vm.myInterval = 3000;
            vm.slides = [
                {
                    image: 'http://lorempixel.com/400/200/',
                    num: 1
                },
                {
                    image: 'http://lorempixel.com/400/200/food', num: 2
                },
                {
                    image: 'http://lorempixel.com/400/200/sports', num: 3
                },
                {
                    image: 'http://lorempixel.com/400/200/people', num: 4
                }
            ];
        }

        init();
    }
})();