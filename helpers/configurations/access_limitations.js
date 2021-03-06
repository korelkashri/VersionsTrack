exports.system_min_access_required = {
    view_projects: 1,
    view_profile: 1,
    modify_current_user: 1,
    view_admin_panel: 2,
    view_users_details: 2,
    create_new_user_with_specific_role: 2,
    modify_all_users: 2,
    delete_different_users: 2,
    delete_all_users: 2, // Delete all users in one shot -- Recreate admin user (admin@admin)
    create_project: 2,
    delete_project: 2,
    modify_project: 2
};

exports.project_min_access_required = {
    view_project: 1, // Guest
    create_new_version: 3,
    create_new_property: 3,
    modify_version: 3,
    modify_property: 3,
    delete_version: 3,
    delete_property: 3,
    view_admin_panel: 4,
};