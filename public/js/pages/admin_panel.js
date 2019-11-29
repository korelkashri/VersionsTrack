angular.element(document).ready(() => {
    init_materialize();
});

const app = angular.module('global_app', ['ngSanitize', 'ngAnimate', 'loaderM', 'usersM'])

    .controller('body_controller', ($scope, $http, $window, $timeout, $location, preloader, dark_area, users) => {
        ng_init_sidenav(dark_area);
        users.init($scope, $http, preloader);

        $scope.get_user_details = (username) => {
            users.get_user_details(username, (data) => {
                $('#user_role').val(data.role);
                $('select').formSelect();
            })
        };

        $scope.create_user = () => {
            let route = "/api/users/create";
            let params = $.param({
                username: $("#username").val(),
                password: $("#password").val(),
                role: $("#user_role").val()
            });
            $http({
                method: "POST",
                url: route,
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then((response) => {
                response = response.data;
                window.location.assign(".");
                alertify.success(response.message);
            }, (response) => {
                response = response.data;
                alertify.error(response.message);
            });
        };

        $scope.modify_user = (username) => {
            let route = "/api/users/modify/" + username;
            let params = $.param({
                username: $("#username").val(),
                password: $("#password").val(),
                role: $("#user_role").val()
            });
            $http({
                method: "POST",
                url: route,
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then((response) => {
                response = response.data;
                window.location.assign(".");
                alertify.success(response.message);
            }, (response) => {
                response = response.data;
                alertify.error(response.message);
            });
        };
    });