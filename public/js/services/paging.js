angular.module("pagingM", [])
    .service("paging_s", function() {
        let _$scope;

        this.init = ($scope) => {
            _$scope = $scope;
            _$scope.versions_current_page = 1;
            _$scope.versions_pages_count = 1;
        };

        this.update_versions_paging = (versions, current_page) => {
            _$scope.versions_pages_count = Math.ceil(versions.length / _$scope.num_versions_for_page_model);
            _$scope.versions_current_page = current_page;
        };

        this.update_properties_paging = (version_data, properties, current_page) => {
            version_data.properties_pages_count = Math.ceil(properties.length / _$scope.num_properties_for_page_model);
            version_data.properties_current_page = current_page;
        };
    });