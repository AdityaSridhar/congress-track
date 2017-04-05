(function () {
    angular
        .module("CongressTracker")
        .controller("HomePageController", HomePageController);

    function HomePageController() {
        var vm = this;

        function init() {
            vm.myInterval = 3000;
            vm.active = 0;
            vm.noWrapSlides = false;
            vm.slides = [
                {
                    image: 'http://lorempixel.com/400/200/'
                },
                {
                    image: 'http://lorempixel.com/400/200/food'
                },
                {
                    image: 'http://lorempixel.com/400/200/sports'
                },
                {
                    image: 'http://lorempixel.com/400/200/people'
                },
                {
                    image: 'http://lorempixel.com/400/200/people'
                },
                {
                    image: 'http://lorempixel.com/400/200/people'
                },
                {
                    image: 'http://lorempixel.com/400/200/people'
                }
            ];
        }

        init();
    }
})();