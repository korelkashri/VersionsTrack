angular.element(document).ready(() => {
    $('select').formSelect();
    document.getElementById("new_version_version_release_date").valueAsDate = new Date();
});

const app = angular.module('global_app', [])

    .controller('body_controller', ($scope, $http, $timeout, search_s, versions_s, properties_s) => {
        search_s.init($scope, $http);
        versions_s.init($scope, $http);
        properties_s.init($scope, $http);
        $(document).ready(() => {
            $scope.search();
            $('.modal').modal();
            $("#new_version_modal").modal({
                onOpenStart: () => {
                    search_s.update_last_version()
                }
            });
            $("#new_version_version_release_date").on("change", function() {
                this.setAttribute(
                    "data-date",
                    moment(this.value, "YYYY/MM/DD").format(this.getAttribute("data-date-format"))
                )
            }).trigger("change");
        })
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
        let _$scope, _$http;

        this.init = ($scope, $http) => {
            _$http = $http;
            _$scope = $scope;

            _$scope.search = () => {
                let route;
                if (_$scope.version_id_filter_model) {
                    switch (_$scope.versions_filter_select_model) {
                        case "equal":
                            route = "/api/versions/v";
                            break;

                        case "after":
                            route = "/api/versions/gt_v";
                            break;

                        case "before":
                            route = "/api/versions/lt_v";
                            break;
                    }
                    route += _$scope.version_id_filter_model;
                } else {
                    route = "/api/versions/all";
                }

                _$http({
                    method: "GET",
                    url: route,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then((response) => {
                    response = response.data;
                    _$scope.versions_list = response.data;
                    _$scope.versions_list.forEach((version) => {
                        let date_info = version.release_date.split('T');
                        version.release_date = date_info[0];
                        version.view_state = true;
                        version.properties.forEach((property) => {
                            property.view_state = true;
                        });
                    });
                    alertify.success(response.message);
                }, (response) => {
                    response = response.data;
                    alertify.error(response.message);
                });
            };

            _$http({method: "GET", url: "/guidance_bases"}).then((response) => {
                _$scope.guidance_bases_list = response.data.data;
                /*$timeout(() => {
                    $('[name="optional_guidance_bases"]').formSelect();
                }, 500);*/
            });
        };

        this.update_last_version = () => {
            _$http({
                method: "GET",
                url: "/api/versions/all",
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then((response) => {
                response = response.data;
                let versions_list = response.data;
                versions_list.sort((elem1, elem2) => {
                    if (elem1.version > elem2.version) return -1;
                    if (elem1.version < elem2.version) return 1;
                    return 0;
                });
                _$scope.last_version = versions_list[0];
            }, (response) => {
                response = response.data;
                alertify.error(response.message);
            });
        }
    })

    .directive('versionsUpdateD', function() { // After loading the versions run this directive
        return function($scope) {
            if ($scope.$last){
                $('select').formSelect();
            }
        };
    })

    .service("versions_s", function () {
        this.init = ($scope, $http) => {
            $scope.new_version = () => {
                let new_version_id = $scope.new_version_version_id;
                let prev_version_id = $scope.new_version_prev_version_id || $scope.last_version.version;

                let route = "/api/versions/add/v" + new_version_id;
                let params = $.param({
                    prev_version_id: prev_version_id,
                    details: $scope.new_version_version_details,
                    downloader: $scope.new_version_version_downloader,
                    release_date: new Date($scope.new_version_version_release_date),
                    known_issues: $scope.new_version_version_known_issues
                });
                console.log(params);

                if ($scope.new_version_version_downloader === "Invalid input") {
                    alertify.error("Invalid new version release date.");
                    return false;
                }

                $http({
                    method: "POST",
                    url: route,
                    data: params,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then((response) => {
                    response = response.data;
                    alertify.success(response.message);
                    $scope.clear_new_version_data();
                    $scope.search();
                }, (response) => {
                    response = response.data;
                    alertify.error(response.message);
                });
            };

            $scope.clear_new_version_data = () => {
                $scope.new_version_version_id =
                $scope.new_version_prev_version_id =
                $scope.new_version_version_details =
                $scope.new_version_version_downloader =
                $scope.new_version_version_known_issues = "";
                $("input")
                    .filter(function() {
                        return this.id.match(/new_version*/) && !this.placeholder;
                    }).each(function() {
                        $(this).labels().removeClass("active");
                    }
                );
                document.getElementById("new_version_version_release_date").valueAsDate = new Date();
            };

            $scope.remove_version = (version_id) => {

            };

            $scope.modify_version_view_state = (version_data, state) => {

            };

            $scope.modify_version = (version_id) => {

            };
        }
    })

    .service("properties_s", function () {
        this.init = ($scope, $http) => {
            $scope.new_property = (version_id) => {
                let description = $("[id='new_version_property_description_" + version_id + "'").val();
                let params = $.param({
                    type: $("[id='new_version_property_type_" + version_id + "'").val(),
                    description: description,
                    tests_scope: $("[id='new_version_property_tests_scope_" + version_id + "'").val(),
                    tests_details: $("[id='new_version_property_tests_details_" + version_id + "'").val(),
                    known_issues: $("[id='new_version_property_known_issues_" + version_id + "'").val()
                });

                if (!description) {
                    alertify.error("Please enter description: " + version_id);
                    return false;
                }

                $http({
                    method: "POST",
                    url: "/api/versions/add/p" + version_id,
                    data: params,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then((response) => {
                    response = response.data;
                    alertify.success(response.message);
                    $scope.search();
                }, (response) => {
                    response = response.data;
                    alertify.error(response.message);
                });
            };

            $scope.modify_property = (version_id, property_id) => {
                let type_field          = $("[id='modify_property_type_" + property_id + "']"),
                    description_field   = $("[id='modify_property_description_" + property_id + "']"),
                    tests_scope_field   = $("[id='modify_property_tests_scope_" + property_id + "']"),
                    tests_details_field = $("[id='modify_property_tests_details_" + property_id + "']"),
                    known_issues_field  = $("[id='modify_property_known_issues_" + property_id + "']");

                let params = $.param({
                    type: type_field.val(),
                    description: description_field.val(),
                    tests_scope: tests_scope_field.val(),
                    tests_details: tests_details_field.val(),
                    known_issues: known_issues_field.val()
                });

                if (!description_field.val()) {
                    alertify.error("Please enter description: " + version_id);
                    return false;
                }

                $http({
                    method: "POST",
                    url: "/api/versions/modify/p" + version_id + "-" + property_id,
                    data: params,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then((response) => {
                    response = response.data;
                    alertify.success(response.message);
                    $scope.search();
                }, (response) => {
                    response = response.data;
                    alertify.error(response.message);
                });
            };

            $scope.modify_property_view_state = (property_data, state) => {
                let property_id = property_data._id;
                let type_field          = $("[id='modify_property_type_" + property_id + "']"),
                    description_field   = $("[id='modify_property_description_" + property_id + "']"),
                    tests_scope_field   = $("[id='modify_property_tests_scope_" + property_id + "']"),
                    tests_details_field = $("[id='modify_property_tests_details_" + property_id + "']"),
                    known_issues_field  = $("[id='modify_property_known_issues_" + property_id + "']");

                type_field.val(property_data.type);
                description_field.val(property_data.description);
                tests_scope_field.val(property_data.tests_scope);
                tests_details_field.val(property_data.tests_details);
                known_issues_field.val(property_data.known_issues);

                type_field.formSelect();
                tests_scope_field.formSelect();
                description_field.labels().addClass("active"); // Read About: Materialize input labels active class - https://materializecss.com/text-inputs.html
                tests_details_field.labels().addClass("active");
                known_issues_field.labels().addClass("active");

                property_data.view_state = state;
            };

            $scope.remove_property = (version_id, property_id) => {
                $http({
                    method: "POST",
                    url: "/api/versions/remove/p" + version_id + "-" + property_id,
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).then((response) => {
                    response = response.data;
                    alertify.success(response.message);
                    $scope.search();
                }, (response) => {
                    response = response.data;
                    alertify.error(response.message);
                });
            };
        }
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

    .run(function($animate) {
        $animate.enabled(true);
    });