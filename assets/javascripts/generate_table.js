$(function () {
    let embook_table = $('table.em_list');
    let base_url = '/' + Embooks.settings.equipment_app_name;
    let issue_id = undefined;
    let res = location.href.match(/\/issues\/[0-9]*/);
    if (res) {
        issue_id = parseInt(res[0].split('/')[2], 10);
    }
    let tracker_id = Embooks.settings.tracker_id;  // 予約トラッカーID
    let cf_id_issue_id = Embooks.settings.cf_id.issue_id;
    let cf_id_enabled = Embooks.settings.cf_id.enabled;
    let cf_id_starttime = Embooks.settings.cf_id.starttime;
    let cf_id_duetime = Embooks.settings.cf_id.duetime;

    let target_url = base_url + '/issues.json?sort=issue_id&tracker_id=' + tracker_id;
    if (issue_id != undefined) {
        target_url = target_url + '&cf_' + cf_id_issue_id + '=' + issue_id;
    }

    let odd_or_even = function (i) {
        return (i === 0 || !!(i && !(i % 2))) ? 'odd' : 'even';
    }

    let get_cf = function(data, cf_id){
        let target_item = data.find(function (item) {
            return item.id == cf_id;
        });
        return target_item;
    }

    let generate_table = function (data) {
        let tag_lists = $('table.em_list th').map(function(i,x){return x.className}).get();
        let embook_table_tbody = embook_table.children('tbody');
        embook_table_tbody.empty();  // clear entries before adding
        data.forEach(function (item, index) {
            $(embook_table_tbody).append('<tr class=' + odd_or_even(index) + '></tr>');
            let embook_table_tbody_tr = $(embook_table_tbody).children('tr:last');
            let td_inner = undefined;
            tag_lists.forEach(function (tag) {
                switch (tag) {
                    case '#':
                        td_inner = '<a href="' + base_url  + '/issues/' + item.id + '">' + item.id + '</a>';
                        break;
                    case 'enabled':
                        td_inner = get_cf(item.custom_fields, cf_id_enabled).value == 1;
                        break;
                    case 'issue_id':
                        td_inner = '<a href="' +
                            base_url  + '/issues/' + get_cf(item.custom_fields, cf_id_issue_id).value + '">' +
                            get_cf(item.custom_fields, cf_id_issue_id).value + '</a>';
                        break;
                    case 'status':
                        td_inner = item.status.name;
                        break;
                    case 'priority':
                        td_inner = item.priority.name;
                        break;
                    case 'equipment_id':
                        td_inner = '<a href="' +
                            base_url  + '/projects/' + item.project.id + '/issues">' +
                            item.project.name + '</a>';
                        break;
                    case 'start_datetime':
                        td_inner = item.start_date + ' ' + get_cf(item.custom_fields, cf_id_starttime).value;
                        break;
                    case 'due_datetime':
                        td_inner = item.due_date + ' ' + get_cf(item.custom_fields, cf_id_duetime).value;
                        break;
                    default:
                        break;
                }
                $(embook_table_tbody_tr).append('<td>' + td_inner + '</td>');
            });
        });
    }

    // 参考: https://itsakura.com/jquery-getjson
    let get_data = function () {
        $.getJSON(target_url).done(function (data, textStatus, jqXHR) {
            if (data.total_count > 0) {
                $(".nodata").hide();  // index
                embook_table.show();  // index, issue
                generate_table(data.issues.sort(
                    // sort by issue id
                    function compareNumbers(a, b) {
                        return a.id - b.id;
                    }));
            } else {
                embook_table.hide();
            }
        });
    }
    $('#embooks-form').on('reset', get_data);
    get_data();
});