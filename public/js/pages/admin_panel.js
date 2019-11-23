angular.element(document).ready(() => {
    init_materialize();
});

/* TODO
    * Add service `users`
        * Add $scope method get all users
            * The method should return `username` & `role`
            * Store the list in $scope variable `users_list`
        * Add $scope method `get_role_name` (param: role number)
    * Include `users` service in this module
    * Initialize `users` service
 */
const app = angular.module('global_app', ['ngSanitize', 'ngAnimate', 'loaderM'])

    .controller('body_controller', ($scope, $http, $window, $timeout, preloader, dark_area) => {
        ng_init_sidenav(dark_area);
    });