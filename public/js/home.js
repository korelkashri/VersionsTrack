//todo Add alertify to this project

const app = angular.module('global_app', [])

    .controller('body_controller', ($scope, $http, search_s) => {
        $(document).ready(function(){
            $('select').formSelect();
            let params = $.param({});
            $http({
                method: "GET",
                url: "/api/versions/all",
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then((response) => {
                response = response.data;
                $scope.versions_list = response.data; // todo check this line
                console.log(response)
                //alertify.success(response.message);
            }, (response) => {
                response = response.data;
                console.log("Error occurred: " + response.message)
                //alertify.error(response.message);
            });
        });
        search_s.init($scope, $http);
        /*global_reports_s.init($scope, $http, $timeout, $compile, reports_optional_status, preloader, soldiers_reports_s, buildings_reports_s);
        users_s.init($scope, $http, $timeout);
        guidance_bases_s.init($scope, $http, $timeout, $compile);
        paging.init($scope);

        let plus_button = {
            actions: {
                click: () => {
                    $scope.buildings.clear_report_modal();
                    $scope.soldiers.clear_report_modal();
                }
            },
            classes: [
                "modal-trigger"
            ],
            attributes: {
                "data-target": "choose_plus_modal"
            }
        };
        angular_init_users_pages($scope, dark_area, plus_button);*/
    })

    .service("paging", function() {
        let scope_ref;

        this.init = ($scope) => {
            scope_ref = $scope;
            scope_ref.reports_current_page = 1;
            scope_ref.reports_pages_count = 1;
        };

        this.update_reports_paging = (reports, current_page) => {
            scope_ref.reports_pages_count = Math.ceil(reports.length / scope_ref.num_reports_for_page_model);
            scope_ref.reports_current_page = current_page;
        };
    })

    .service("search_s", function() {
        this.init = ($scope, $http, $timeout) => {
            $scope.search = () => {
                let params = $.param({
                    version: $scope.version_id_filter_model,

                });
                $http({
                    method: "POST",
                    url: "/users/self/update",
                    data: params,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then((response) => {
                    response = response.data;
                    alertify.success(response.message);
                }, (response) => {
                    response = response.data;
                    alertify.error(response.message);
                });
            };

            $http({method: "GET", url: "/guidance_bases"}).then((response) => {
                $scope.guidance_bases_list = response.data.data;
                /*$timeout(() => {
                    $('[name="optional_guidance_bases"]').formSelect();
                }, 500);*/
            });
        };
    })

    .service("users_s", function() {
        this.init = ($scope, $http, $timeout) => {
            $scope.update_user = () => {
                let params = $.param({
                    guidance_base: $scope.new_user_base_model,
                    password: $scope.new_user_password_model,
                    role: $scope.new_user_role_model
                });
                $http({
                    method: "POST",
                    url: "/users/" + $scope.new_user_id_model + "/update",
                    data: params,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then((response) => {
                    response = response.data;
                    alertify.success(response.message);
                }, (response) => {
                    response = response.data;
                    alertify.error(response.message);
                }).finally(() => {
                    $("#user_modal").modal('close');
                });
            };

            $scope.create_user = () => {
                let params = $.param({
                    id: $scope.new_user_id_model,
                    guidance_base: $scope.new_user_base_model,
                    password: $scope.new_user_password_model,
                    role: $scope.new_user_role_model
                });
                $http({
                    method: "POST",
                    url: "/users/new",
                    data: params,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then((response) => {
                    response = response.data;
                    alertify.success(response.message);
                }, (response) => {
                    response = response.data;
                    alertify.error(response.message);
                }).finally(() => {
                    $("#user_modal").modal('close');
                });
            };

            function get_user_data() {
                let params = $.param({});
                $http({
                    method: "GET",
                    url: "/users/data/self",
                    data: params,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then((response) => {
                    response = response.data;
                    $scope.optional_guidance_base_model = String(response.data.default_guidance_base);
                    $scope.num_reports_for_page_model = response.data.reports_per_page;
                    $timeout(() => {
                        $('[name="optional_guidance_bases"]').formSelect();
                    }, 500);
                });
            }

            get_user_data();
        };
    })

    .service("preloader", function() {
        this.start = () => {
            $(".circular-preloader").addClass("active");
            //$(".preloader_status").addClass("progress");
        };

        this.stop = () => {
            $(".circular-preloader").removeClass("active");
            //$(".preloader_status").removeClass("progress");
        };
    })

    .service("dark_area", function() {
        this.is_dismiss_on = true;
        this.show = () => {
            $(".dismiss_area").addClass("on");
        };

        this.hide = () => {
            $(".dismiss_area").removeClass("on");
        };

        $(".dismiss_area").click(function() {
            if (is_dismiss_on) {
                $(".sidenav").sidenav("close");
                $(".dismiss_area").removeClass("on");
            }
        });

        this.turn_on_dismiss = () => {
            is_dismiss_on = true;
        };

        this.turn_off_dismiss = () => {
            is_dismiss_on = false;
        };
    })

    .factory('skipReload', [
        '$route',
        '$rootScope',
        function ($route, $rootScope) {
            return function () {
                var lastRoute = $route.current;
                var un = $rootScope.$on('$locationChangeSuccess', function () {
                    $route.current = lastRoute;
                    un();
                });
            };
        }
    ])

    .factory("reports_optional_status", function() {
        //        0        1          2         3
        return ["בטיפול", "מתעכב", "ממתין לאישור", "אושר"];
    })

    .filter("reports_filter", ['reports_optional_status', 'paging', function(reports_optional_status, paging) {
        let optional_status = reports_optional_status;

        function filter_requirements(report, reports_filter_select_model, reports_guidance_bases_filter_select_model) {
            let filter_by_status = reports_filter_select_model;
            let filter_by_guidance_bases = reports_guidance_bases_filter_select_model;
            let return_value = true;
            if (filter_by_status) return_value = optional_status[Number(filter_by_status)] === report.status || (report.status === optional_status[1] && optional_status[Number(filter_by_status)] === optional_status[2]); // Filter by status
            if (filter_by_guidance_bases) return_value = return_value && (Number(filter_by_guidance_bases) === -1 || Number(filter_by_guidance_bases) === Number(report.guidance_base)); // Filter by guidance base
            return return_value;
        }

        return function (reports, reports_filter_select_model, reports_guidance_bases_filter_select_model, current_page, num_reports_for_page_model) {
            let filtered = [];
            if (reports === undefined) return filtered;
            num_reports_for_page_model = Number(num_reports_for_page_model);
            var begin = ((current_page - 1) * num_reports_for_page_model),
                end = begin + num_reports_for_page_model;
            for (let i = 0; i < reports.length; i++) {
                if (filter_requirements(reports[i], reports_filter_select_model, reports_guidance_bases_filter_select_model)) {
                    filtered.push(reports[i]);
                }
            }
            if (begin > filtered.length) {
                current_page = 1;
                begin = 0;
            }
            paging.update_reports_paging(filtered, current_page);
            return filtered.slice(begin, Math.min(end, filtered.length));
        };
    }])

    .run(function($animate) {
        $animate.enabled(true);
    });