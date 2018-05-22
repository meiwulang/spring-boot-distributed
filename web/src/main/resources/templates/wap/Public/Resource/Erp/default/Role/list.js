Ext.onReady(function(){
    var checkbox_id=$('input[type=checkbox]');
    checkbox_fn();
    function checkbox_fn(){
        var c_id=$('input[type=checkbox]');
        for(var i=0;i<c_id.length;i++){
            var show_this=c_id.eq(i);
            if(show_this.attr('checked')){
                show_this.parent().addClass('checked_show');
            }else{
                show_this.parent().removeClass('checked_show');
            }
        }
    };
    checkbox_id.click(function(){
        var data_type=$(this).attr('data-type'),all_id;
        var mods_id=$(this).parents('.mods-id');
        var mods_cls=$(this).parents('.mods-cls');
        var mods_next=$(this).parents('.mods-next');
        var mods_box=$(this).parents('.mods-role');
        if(data_type=='module'){
            all_id=mods_id.find('input[type=checkbox]');
        }else if(data_type=='list_yes'){
            all_id=mods_cls.find('input[type=checkbox]');
        }else if(data_type=='list_next'){
            all_id=mods_next.find('input[type=checkbox]');
        }else if(data_type=='role'){
            all_id=mods_box.find('input[type=checkbox]');
        }else{
            all_id=$(this);
        }
        if(!$(this).attr('checked')){
            $(this).attr('checked',true);
            all_id.attr('checked',true);
            all_id.prop('checked',true);
            attr_module(data_type,$(this));
        }else{
            $(this).removeAttr('checked');
            all_id.removeAttr('checked');
        }
        checkbox_fn();
    });

    function attr_module(attr_type,it){
        var mods_id=it.parents('.mods-id').find('.role-mod').find('input[type=checkbox]');
        var mods_cls=it.parents('.mods-cls').find('.md-title').find('input[type=checkbox]');
        var mods_role=it.parents('.mods-role').find('.mrl-title').find('input[type=checkbox]');
        if(attr_type=='role')return false;
        if(attr_type=='module'){
            mods_role.attr('checked',true);
        }else if(attr_type=='list_yes'){
            mods_id.attr('checked',true);
            mods_role.attr('checked',true);
        }else{
            mods_id.attr('checked',true);
            mods_cls.attr('checked',true);
            mods_role.attr('checked',true);
        }
    }

    $('.hide_id').click(function(){
        var data_type=$(this).attr('data-type'),all_id;
        if($(this).find('.fa').length<=0)return false;
        var mods_id=$(this).parents('.mods-id');
        var mods_cls=$(this).parents('.mods-cls');
        var mods_box=$(this).parents('.mods-role');
        if(data_type=='module'){
            all_id=mods_id.find('.show-id');
        }else if(data_type=='list_yes'){
            all_id=mods_cls.find('.md-list');
        }else if(data_type=='role'){
            all_id=mods_box.find('.mrl-info');
        }
        if($(this).find('.fa-angle-down').length>0){
            all_id.hide();
            $(this).html('<i class="fa fa-angle-right"></i> <i class="fa fa-folder-o"></i>');
        }else{
            all_id.show();
            $(this).html('<i class="fa fa-angle-down"></i> <i class="fa fa-folder-open-o"></i>');
        }
    });

    $('#role-tools .tools-id').click(function(){
        var data_val=$(this).attr('data-val');
        var ck_id=$('input[type=checkbox]');
        var show_id=$('.show-id');
        switch (data_val){
            case '全选':
                ck_id.attr('checked',true);
                ck_id.prop('checked',true);
                checkbox_fn();
                break;
            case '全消':
                ck_id.removeAttr('checked');
                checkbox_fn();
                break;
            case '收起':
                show_id.hide();
                $(this).attr('data-val','展开');
                $(this).html('展开');
                $('.hide_module').html('<i class="fa fa-angle-right"></i> <i class="fa fa-folder-o"></i>');
                break;
            case '展开':
                show_id.show();
                $(this).attr('data-val','收起');
                $(this).html('收起');
                $('.hide_module').html('<i class="fa fa-angle-down"></i> <i class="fa fa-folder-open-o"></i>');
                break;
            case '保存':
                role_save();
                break;
        };
    });
    function role_save(){
        var r_data={};
        var r_id=$('input[name=r_id]').val();
        if(!r_id){
            Ext.Msg.alert('友情提示','请选择需要编辑的角色!');
            return false;
        };
        r_data['r_id']=r_id;
        var c_id=$('input[checked=checked]');
        var role=[];
        for(var i=0;i<c_id.length;i++){
            var md_id=c_id.eq(i);
            role[i]=md_id.val();
        };
        r_data['r_role']=Ext.encode(role);
        $.ajax({
            type:"POST",
            url:$__app__ + "/Role/saveItems",
            data:r_data,
            success:function (r) {
                var rst = r;
                if (rst.status==1){
                    Ext.Msg.alert('友情提示', ' 权限配置成功！');
                }else{
                    Ext.Msg.alert('友情提示', rst.info);
                }
            }
        });
    };
});