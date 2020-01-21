require_dependency 'equipment_management/hooks'
if Rails::VERSION::MAJOR >= 5 and Rails::VERSION::MINOR >= 1
  ActiveSupport::Reloader.to_prepare do
  require_dependency 'equipment_management/issue_patch'
  end
else
  ActionDispatch::Callbacks.to_prepare do
    require_dependency 'equipment_management/issue_patch'
  end
end

Redmine::Plugin.register :equipment_management do
  name 'Equipment Management plugin'
  author 'sk-ys'
  description 'This is a plugin for Redmine'
  version '0.0.1'
  url 'https://github.com/sk-ys/redmine_equipment_management/'
  author_url ''

  requires_redmine version_or_higher: '4.0.0'

  settings default: {
    em_equipment_app_name: 'equipment',
    em_tracker_id: '',
    em_cf_id_issue_id: '',
    em_cf_id_enabled: '',
    em_cf_id_starttime: '',
    em_cf_id_duetime: '',
  }, partial: 'settings/equipment_management/general'

  menu :top_menu,
    :embooks,
    { controller: 'embooks', action: 'index' }

  menu :application_menu,
    :embooks,
    { controller: 'embooks', action: 'index' }

  project_module :equipment_management do
    permission :view_embooks, {
      embooks: [:index, :show]
    }
    permission :view_global_embooks, {
      embooks: [:index, :show]
    }
    permission :create_embooks, {
      embooks: [:index, :show, :new, :create]
    }
    permission :edit_embooks, {
      embooks: [:index, :show, :new, :create, :edit, :update]
    }
    permission :manage_embooks, {
      embooks: [:index, :show, :new, :create, :edit, :update, :delete]
    }
  end
end
