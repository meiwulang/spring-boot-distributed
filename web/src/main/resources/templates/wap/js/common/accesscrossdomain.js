 $(function () {
    $('ol a').click(function () {
        url = $(this).data('url');
        desc = $(this).data('desc');
        type = $(this).data('type');
        if ('POST' == type) {
            data = JSON.stringify($(this).data('data'));
            showData = JSON.stringify($(this).data('data'), null, 2);
        } else {
            data = showData = $(this).data('data');
        }
        $.ajax({
            url: url,
            type: type,
            contentType: "application/json; charset=utf-8",
            xhrFields: {
                withCredentials: true
            },
            crossDomain: true,
            data: data,
            success: function (result) {
                $('#url').html(url);
                $('#desc').html(desc);
                $('#params').html(showData);
                $('#result').html(JSON.stringify(result, null, 2));
            },
            error: function (result) {
                $.MsgBox({type:"alert",title: '错误',msg: "出错啦",speed:200});
                // alert('出错啦');
                $('#url').html(url);
                $('#desc').html(desc);
                $('#params').html(data);
                $('#result').html(JSON.stringify(result, null, 2));
            }
        })
    });
});