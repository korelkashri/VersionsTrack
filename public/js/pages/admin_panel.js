angular.element(document).ready(() => {
    init_materialize();
});

const app = angular.module('global_app', ['ngSanitize', 'ngAnimate', 'loaderM', 'usersM'])

    .controller('body_controller', ($scope, $http, $window, $timeout, preloader, dark_area, users) => {
        ng_init_sidenav(dark_area);
        users.init($scope, $http, preloader);

        $scope.get_all_users();
    });