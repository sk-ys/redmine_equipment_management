module EquipmentManagement
  class Hooks < Redmine::Hook::ViewListener
    def view_issues_show_description_bottom(context={ })
      context[:controller].send( :render_to_string,
        {
          partial: '/hooks/equipment_management/view_issues_show_description_bottom',
          locals: context
        })
    end
  end
end