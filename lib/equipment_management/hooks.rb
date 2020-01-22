module EquipmentManagement
  class Hooks < Redmine::Hook::ViewListener
    def view_layouts_base_html_head(context={})
      html = "<script type=\"text/javascript\">\n//<![CDATA[\n"
      html << "Embooks = { settings: #{create_embooks_settings_array().to_json} };"
      html << "\n//]]>\n</script>"
      return html
    end

    def create_embooks_settings_array()
      settings = {
        hostname: Setting.host_name.to_s,
        equipment_app_name: Setting.plugin_equipment_management["em_equipment_app_name"],
        tracker_id: Setting.plugin_equipment_management["em_tracker_id"].to_i,
        cf_id: {
          issue_id: Setting.plugin_equipment_management["em_cf_id_issue_id"].to_i,
          enabled: Setting.plugin_equipment_management["em_cf_id_enabled"].to_i,
          starttime: Setting.plugin_equipment_management["em_cf_id_starttime"].to_i,
          duetime: Setting.plugin_equipment_management["em_cf_id_duetime"].to_i
        }
      }
      return settings
    end

    def view_issues_show_description_bottom(context={ })
      context[:controller].send( :render_to_string,
        {
          partial: '/hooks/equipment_management/view_issues_show_description_bottom',
          locals: context
        })
    end
  end
end