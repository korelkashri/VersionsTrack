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
            current_page = current_page > _$scope.versions_pages_count ? _$scope.versions_pages_count : current_page;
            _$scope.versions_current_page = current_page;
        };

        this.update_properties_paging = (version_data, properties, current_page) => {
            version_data.properties_pages_count = Math.ceil(properties.length / _$scope.num_properties_for_page_model);
            version_data.properties_current_page = current_page;
        };
    })

    .filter("versions_filter", ["paging_s", function(paging_s) {
        return function (versions_list, current_page, num_versions_for_page_model) {
            let filtered = [];
            if (versions_list === undefined) return filtered;
            filtered = versions_list;
            num_versions_for_page_model = Number(num_versions_for_page_model);
            current_page = current_page < 1 ? 1 : current_page;
            var begin = ((current_page - 1) * num_versions_for_page_model),
                end = begin + num_versions_for_page_model;
            if (begin > filtered.length) {
                current_page = 1;
                begin = 0;
            }
            paging_s.update_versions_paging(filtered, current_page);
            return filtered.slice(begin, Math.min(end, filtered.length));
        };
    }])

    .filter("properties_filter", ["paging_s", function(paging_s) {
        return function (properties, version_data, current_page, num_properties_for_page_model) {
            let filtered = [];
            if (properties === undefined) return filtered;
            filtered = properties; // Deep clone
            num_properties_for_page_model = Number(num_properties_for_page_model);
            current_page = current_page < 1 ? 1 : current_page;
            var begin = ((current_page - 1) * num_properties_for_page_model),
                end = begin + num_properties_for_page_model;
            if (begin > filtered.length) {
                current_page = 1;
                begin = 0;
            }
            paging_s.update_properties_paging(version_data, filtered, current_page);
            return filtered.slice(begin, Math.min(end, filtered.length));
        };
    }]);