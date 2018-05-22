/**
 * Created by Administrator on 15-12-25.
 */
var param={};
$(function () {
    $('.img-li').toggle(function () {
        $(this).addClass('img-check');
    }, function () {
        $(this).removeClass('img-check');
    })

    $('.del-btn').click(function () {
        var del_arr = [];
        if ($('.img-check').length <= 0) {
            Ext.Msg.alert('提示', '请先选至少一张图片！');
            return;
        }
        if ($('.img-check').hasClass('img-cover')) {
            Ext.Msg.alert('提示', '包含封面图片不能删除！');
            return;
        }
        Ext.MessageBox.confirm('友情提示', '确定删除吗？', function (id) {
            if (id == 'yes') {
                $('.img-check').each(function (i, v) {
                    del_arr.push($(this).attr('data-index'));
                })
                $.ajax({
                    url: $__app__ + '/Pic/del',
                    type: 'post',
                    data: {'at_id': del_arr},
                    success: function (data) {
                        if (data.status == '1') {
                            Ext.Msg.alert('提示', '删除成功！');
                            //$('.img-check').remove();
                            $('.img-check').parents('.li-list').remove();
                        } else {
                            Ext.Msg.alert('提示', data.info);
                        }
                    }
                })
            }
        })


    })

    //失去焦点修改备注
    function on_blur(){
        var at_name=$(".at_name");
      //  at_remark.unbind();
        at_name.on('blur', function () {
            var at_name = $(this).val();
            var at_id = $(this).parents('.li-list').find('.img-li').attr('data-index');
            var this_obj = $(this);

            $.ajax({
                url: $__app__ + '/Pic/change_remark',
                type: 'post',
                data: {'at_id': at_id, 'at_name': at_name},
                success: function (data) {
                    if (data.status == '1') {
                        Ext.Msg.alert('提示', '修改成功！');
                        this_obj.attr("disabled", true);
                    } else {
                        Ext.Msg.alert('提示', data.info);
                    }
                }
            })
        })
    }



    $('.fa-pencil-square-o').live('click', function () {
        $(this).siblings('input').removeAttr('disabled');
    })

    $('.save-btn').click(function () {
        if ($('.img-check').length != 1) {
            Ext.Msg.alert('提示', '只能选择一张图片！');
            return;
        }
        if ($('.img-check').hasClass('img-cover')) {
            Ext.Msg.alert('提示', '该图片已经是封面了！');
            return;
        }
        Ext.MessageBox.confirm('友情提示', '确定设为封面吗？', function (id) {
            if (id == 'yes') {
                var save_url = $('.img-check').find('img').attr('data-url');
                $.ajax({
                    url: $__app__ + '/Pic/save_cover',
                    type: 'post',
                    data: {'save_model': param.table_model, 'save_url': save_url, 'save_id': param.table_id},
                    success: function (data) {
                        Ext.Msg.alert('提示', data.info, function () {
                            if (data.status == 1) {
                                parent.main_reload();
                            }
                        });
                        $('.img-cover').removeClass('img-cover');
                        $('.img-check').addClass('img-cover');
                    }
                })
            }
        })
    });
    var upload_limit=0;
    var style=0;
     function winload(style){
         $('.load_cover').css('display',style);
         f8=true;

     }

    $('.upload-file-box').uploadFile({
        url:$__app__ + '/Pic/upload_pic',
        upload_limit:upload_limit,//图片上传一次性的限制
        verify:{ size:5000,type:['jpg','JPG','gif','PNG','png','GIF']},
        multiple:true,
        select_id:'.upload-btn',
        process:'?x-oss-process=image/resize,m_fill,h_110,w_110',
        load_msg:'上传中...',
        data:param
    },function(r,o,ot){
        var data= r.data;
        var at_id = data.at_id;
        var at_url = data.at_url + '?x-oss-process=image/resize,m_mfit,h_110,w_110';
        if(ot==true){
            winload('none');
        }
        var html = '<div class="li-list"><div class="img-li" data-index=' + at_id + '>' +
            '<i class="fa fa-camera"></i>' +
            '<a href="' + data.at_url + '" target="_blank"><img src=' + at_url + ' data-url="' + data.at_url + '"></a>' +
            '<i class="fa fa-check-square-o"></i></div>' +
            '<div class="remark-div"><input value="'+data.at_name+'" class="at_name" name="at_name" disabled><i class="fa fa-pencil-square-o"></i></div></div>';
        $('.img-ul').append(html);
        var img_li=$('.img-li');
        img_li.removeClass('img-check');
        $.each(img_li, function (i, v) {
            $('.img-li').eq(i).toggle(function () {
                $('.img-li').eq(i).addClass('img-check')
            }, function () {
                $('.img-li').eq(i).removeClass('img-check')
            })
        });
        on_blur();
    },function(r){
        Ext.Msg.alert('友情提示', r.message);
    },function(data,i){
        if(i==0){
            winload('block');
        }
    }
    );

});