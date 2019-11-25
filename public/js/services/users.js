angular.module("usersM", [])

    .service("users", function() {
        let _$scope, _$http, _preloader;
        let role_names = ["Banned", "Guest", "User", "Manger", "Admin"];

        this.init = ($scope, $http, preloader) => {
            _$scope = $scope;
            _$http = $http;
            _preloader = preloader;

            _$scope.get_all_users = () => {
                _preloader.start();
                _$http({
                    method: "GET",
                    url: "/api/users/all",
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then((response) => {
                    response = response.data;
                    let users_list = response.data;
                    users_list.sort((elem1, elem2) => {
                        if (elem1.role > elem2.role) return -1;
                        if (elem1.role < elem2.role) return 1;
                        return 0;
                    });
                    _$scope.users_list = users_list;
                }, (response) => {
                    response = response.data;
                    alertify.error(response.message);
                }).finally(() => {
                    _preloader.stop();
                });
            };

            _$scope.get_role_name = (role_number) => {
                return role_names[role_number];
            }
        };
    });