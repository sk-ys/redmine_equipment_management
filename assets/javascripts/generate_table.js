$(function () {
    let embook_table = $('table.em_list');
    let base_url = '/' + $('#em_equipment_app_name').val();
    let issue_id = undefined;
    let res = location.href.match(/\/issues\/[0-9]*/);
    if (res) {
        issue_id = parseInt(res[0].split('/')[2], 10)
    }
    let tracker_id = 4;
    let cf_id_issue_id = 1;
    let cf_id_enabled = 2;
    let cf_id_starttime = 5;
    let cf_id_duetime = 6;

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
        let hide_issue_id = $('table.em_list th').length == 7;  // todo:
        let embook_table_tbody = embook_table.children('tbody');
        embook_table_tbody.empty();  // clear entries before adding
        data.forEach(function (item, index) {
            $(embook_table_tbody).append('<tr class=' + odd_or_even(index) + '></tr>');
            let embook_table_tbody_tr = $(embook_table_tbody).children('tr:last');
            $(embook_table_tbody_tr).append('<td><a href="' + base_url  + '/issues/' + item.id + '">' + item.id + '</a></td>');
            $(embook_table_tbody_tr).append('<td>' + (get_cf(item.custom_fields, cf_id_enabled).value == 1) + '</td>');
            if (!hide_issue_id) {
                $(embook_table_tbody_tr).append(
                    '<td><a href="' + base_url  + '/issues/' + get_cf(item.custom_fields, cf_id_issue_id).value + '">' +
                    get_cf(item.custom_fields, cf_id_issue_id).name + '</a></td>');
            }
            $(embook_table_tbody_tr).append('<td>' + item.status.name + '</td>');
            $(embook_table_tbody_tr).append('<td>' + item.priority.name + '</td>');
            $(embook_table_tbody_tr).append('<td><a href="' + base_url  + '/projects/' + item.project.id + '/issues">' + item.project.value + '</a></td>');
            $(embook_table_tbody_tr).append('<td>' + item.start_date + ' ' + get_cf(item.custom_fields, cf_id_starttime).value + '</td>');
            $(embook_table_tbody_tr).append('<td>' + item.due_date + ' ' + get_cf(item.custom_fields, cf_id_duetime).value + '</td>');
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