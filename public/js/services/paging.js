angular.module("pagingM", [])
    .service("paging_s", function() {
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
    });