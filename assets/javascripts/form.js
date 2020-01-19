/*
add issue test
*/
$(function() {

    let app_path = '/equipment';
    let target_field_id = '#em_equipment_id'; // フィールドのID
    let apikey = '';
    let issue_id = parseInt(location.href.match(/\/issues\/[0-9]*/)[0].split('/')[2], 10)

    let tracker_id = 4;  // 予約トラッカーID
    let cfid_issue_id = 1;
    let cfid_enabled = 2;
    let cfid_start_time = 5;
    let cfid_due_time = 6;

    $('#embooks-form input[type=submit]').on('click', function() {

        let subject = $('title').text();  // 予約チケット名 = 登録元チケットのタイトル

        let project_id = parseInt($('#em_equipment_id').val());

        let enabled_val = $('#em_enabled').prop("checked") == 1 ? 1 : 0;

        let start_date = $('#em_start_date').val();
        let start_time = $('#em_start_time').val();

        let due_date = $('#em_due_date').val();
        let due_time = $('#em_due_time').val();

        // create issue json data
        let issue = {
            'issue': {
                'project_id': project_id,
                'tracker_id': tracker_id,
                'start_date': start_date,
                'due_date': due_date,
                'subject': subject,
                'custom_fields': [
                    {
                        'id': cfid_enabled,
                        'value': enabled_val
                    },
                    {
                        'id': cfid_issue_id,
                        'value': issue_id
                    },
                    {
                        'id': cfid_start_time,
                        'value': start_time
                    },
                    {
                        'id': cfid_due_time,
                        'value': due_time
                    }
                ]
            }
        }

        if (!confirm('Add issue?')) {
            return;
        }

        // チケット作成処理(非同期)を実行し、最後にテーブル再描画
        let defer = $.Deferred();
        let promise = defer.promise();

        promise = promise.then(getApiKey());
        promise = promise.then(createIssue(issue));

        promise
        .done(function() {
            // 成功したらフォームをリセット
            $('#embooks-form')[0].reset(); // リセットフォーム
            $('#embooks-form').toggle();  // フォームを隠す
        })
        .fail(function() {
            alert('失敗しました');
        });
        defer.resolve();
    });

    function getApiKey() {
        let target_path = app_path + '/my/api_key'
        return function() {
            return $.get(target_path).done(function(data){
                apikey = $('#content > div.box > pre', $(data)).first().text();
            });
        };
    }

    function createIssue(issue) {
        return function() {
            $.support.cors = true;
            return $.ajax({
                type: 'POST',
                url: app_path + '/issues.json',
                headers: {
                    'X-Redmine-API-Key': apikey
                },
                // 作成時はレスポンスのコンテンツが無く、jsonだとエラーとなるのでtextにしておく
                dataType: 'text',
                contentType: 'application/json',
                data: JSON.stringify(issue)
            });
        };
    }

    // time picker
    // https://xdsoft.net/jqplugins/datetimepicker/
    $(function () {
        let ids = ['em_start_time', 'em_due_time'];
        ids.forEach(function(id){
            $('#' + id).datetimepicker({
                datepicker:false,
                step:5,
                format:'H:i',
                mask:true
            });
        });
    });

    // project name selector
    var update_value = function () {
        $(target_field_id).val($('#project_id_selector').val());
        $(target_field_id).change();
    }
    var generate_selector = function (data) {
        var flg_exist_id = false;
        var current_id = $(target_field_id).val();
        $(target_field_id).css('display', 'none');
        // add select element
        $(target_field_id).after('<select name="project[id]" id="project_id_selector"></select>');
        // add onchange event
        $('#project_id_selector').on('change', update_value);
        $('#project_id_selector').prop('disabled', $(target_field_id).prop('disabled'));
        // add options
        $('#project_id_selector').append('<option value="0">未選択</option>');
        data.forEach(function (item) {
            $('#project_id_selector').append('<option value="' + item.id + '">' + item.name + '</option>');
            if (item.id == current_id) {
                flg_exist_id = true;
            }
        });
        if (!flg_exist_id) {
            current_id = 0;
            $(target_field_id).val(current_id);
        }
        // select initial value
        $('#project_id_selector').val(current_id);
    }

    // get projects
    // 参考: https://itsakura.com/jquery-getjson
    var target_url = app_path + '/projects.json';
    $.getJSON(target_url).done(function (data, textStatus, jqXHR) {
        generate_selector(data.projects);
    });
})