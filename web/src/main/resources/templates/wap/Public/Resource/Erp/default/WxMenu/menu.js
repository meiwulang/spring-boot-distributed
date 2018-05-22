 $(function(){
        function add_child_sortable(){
            $('.child-list').sortable({
                axis:'y',
                cursor:'move',
                opacity:0.9,
                revert:true,
                containment:'parent',
                handle:'.fa-arrows',
                distance:1,
                scroll:true,
                tolerance: 'pointer'
            })
        }
        $('.menu-body').sortable({
            axis:'y',
            cursor:'move',
            opacity:0.9,
            revert:true,
            containment:'parent',
            distance:1,
            scroll:true,
            tolerance: 'pointer',
            handle:'.p-menu .fa-arrows'
        })
        $('ul,li').disableSelection();

        $('.fa-chevron-down').live('click',function(){
                $(this).parents('.menu-li').find('.child-menu-body').slideDown();
                $(this).removeClass('fa-chevron-down').addClass('fa-chevron-up').attr('title','收起');
        })

        $('.fa-chevron-up').live('click',function(){
                $(this).parents('.menu-li').find('.child-menu-body').slideUp();
                $(this).removeClass('fa-chevron-up').addClass('fa-chevron-down').attr('title','展开');
        })

        $('.fa-bars').live('click',function(){
            if($('.p-menu').length<4){
                $('.menu-body').append(create_pmenu_html());
                check_pmenu();
                $('ul,li').disableSelection();
            }
        })

        $('.p-menu .fa-close').live('click',function(){
            if($('.p-menu').length>2){
                $(this).parents('.menu-li').remove();
                check_pmenu();
            }
        })

        $('.p-menu .fa-plus').live('click',function(){
            var flag=$(this).parents('.menu-del-flag').find('.child-list');
            if(flag.find('.child-menu-li').length<5){
                flag.append(create_child_menu());
            }
            if(flag.find('.child-menu-li').length>=5){
                flag.find('.fa-plus').hide();
                $(this).hide();
            }
            add_child_sortable();
            $('ul,li').disableSelection();
        })

        $('.child-menu-li .fa-close').live('click',function(){
            var flag=$(this).parents('.menu-del-flag');
            $(this).parents('.child-menu-body').find('.fa-plus').show();
            flag.find('.p-menu .fa-plus').show();
            $(this).parents('.child-menu-li').remove();
        })

        $('.child-menu-li .fa-plus').live('click',function(){
            var flag=$(this).parents('.child-menu-body');
            if(flag.find('.child-menu-li').length<5){
                flag.find('.child-list').append(create_child_menu());
            }
            if(flag.find('.child-menu-li').length>=5){
                flag.find('.fa-plus').hide();
                $(this).parents('.menu-del-flag').find('.p-menu .fa-plus').hide()
            }
            add_child_sortable();
            $('ul,li').disableSelection();
        })

        function check_pmenu(){
            if($('.p-menu').length>=4){
                $('.p-menu .fa-bars').hide();
            }else{
                $('.p-menu .fa-bars').show();
            }
            if($('.p-menu').length<=2){
                $('.p-menu .fa-close').hide();
            }else{
                $('.p-menu .fa-close').show();
            }
        }

        $('.menu_input_type').live('change',function(){
            if($(this).val()!='view' && $(this).val()!='click'){
                $(this).parents('.menu-dis-flag').find('.menu_input_content').attr('disabled',true);
            }else{
                $(this).parents('.menu-dis-flag').find('.menu_input_content').attr('disabled',false);
            }
            $(this).parents('.menu-dis-flag').find('.menu_input_content').val('');
            $(this).parents('.menu-dis-flag').find('.menu_input_content').removeClass('check-input');
        })

        $('.menu_input_content').live('blur',function(){
            if($(this).parents('.menu-dis-flag').find('.menu_input_type').val()=='view'){
                if(!parent.check_url($(this).val())){
                    $(this).addClass('check-input');
                }else{
                    $(this).removeClass('check-input');
                }
            }else if($(this).parents('.menu-dis-flag').find('.menu_input_type').val()=='click'){
                if($(this).val().replace(/[^\x00-\xff]/g,"aa").length>16){
                    $(this).addClass('check-input');
                }else{
                    $(this).removeClass('check-input');
                }
            }
        })

        window.get_btn=function(){
            if($('.menu_input_content').hasClass('check-input')){
                return false;
            }
            var menu=[];
            $('.menu-body .menu-li').each(function(i,v){
                var temp_menu={};
                temp_menu['name']=$(this).find('.menu_input_name').val();
                temp_menu['type']=$(this).find('.menu_input_type').val();
                if(temp_menu['type']=='view'){
                    temp_menu['url']=$(this).find('.menu_input_content').val();
                }else if(temp_menu['type']=='scancode_push'){
                    temp_menu['key']='rselfmenu_0_1';
                }else if(temp_menu['type']=='scancode_waitmsg'){
                    temp_menu['key']='rselfmenu_0_0';
                }else if(temp_menu['type']=='pic_sysphoto'){
                    temp_menu['key']='rselfmenu_1_0';
                }else if(temp_menu['type']=='pic_weixin'){
                    temp_menu['key']='rselfmenu_1_2';
                }else if(temp_menu['type']=='pic_photo_or_album'){
                    temp_menu['key']='rselfmenu_1_1';
                }else if(temp_menu['type']=='location_select'){
                    temp_menu['key']='rselfmenu_2_0';
                }else if(temp_menu['type']=='click'){
                    temp_menu['key']=$(this).find('.menu_input_content').val();
                }
                var sub_menu=[];
                $(this).find('.child-menu-li').each(function(i1,v1){
                    var temp_sub_menu={};
                    temp_sub_menu['name']=$(this).find('.menu_input_name').val();
                    temp_sub_menu['type']=$(this).find('.menu_input_type').val();
                    if(temp_sub_menu['type']=='view'){
                        temp_sub_menu['url']=$(this).find('.menu_input_content').val();
                    }else if(temp_sub_menu['type']=='scancode_push'){
                        temp_sub_menu['key']='rselfmenu_0_1';
                    }else if(temp_sub_menu['type']=='scancode_waitmsg'){
                        temp_sub_menu['key']='rselfmenu_0_0';
                    }else if(temp_sub_menu['type']=='pic_sysphoto'){
                        temp_sub_menu['key']='rselfmenu_1_0';
                    }else if(temp_sub_menu['type']=='pic_weixin'){
                        temp_sub_menu['key']='rselfmenu_1_2';
                    }else if(temp_sub_menu['type']=='pic_photo_or_album'){
                        temp_sub_menu['key']='rselfmenu_1_1';
                    }else if(temp_sub_menu['type']=='location_select'){
                        temp_sub_menu['key']='rselfmenu_2_0';
                    }else if(temp_sub_menu['type']=='click'){
                        temp_sub_menu['key']=$(this).find('.menu_input_content').val();
                    }
                    sub_menu.push(temp_sub_menu);
                })
                if(sub_menu.length>0){
                    temp_menu['sub_button']=sub_menu;
                }
                menu.push(temp_menu);
            })
            return JSON.stringify(menu);
        }

        window.set_btn=function(data){
            var menu_html='';
            if(data){
                var menu_data=JSON.parse(data);
                if(menu_data.length>0){
                    for(i=0;i<menu_data.length;i++){
                        menu_html+=create_pmenu_html(menu_data[i]);
                    }
                }else{
                    menu_html=create_pmenu_html();
                }
            }
            $('.menu-body').html(menu_html);
            check_pmenu();
            add_child_sortable();
            $('ul,li').disableSelection();
        }

        function get_type_select(type){
            var type_list={
                click:'关键字',
                view:'链接',
                scancode_push:'扫码',
                scancode_waitmsg:'扫码并提示',
                pic_sysphoto:'拍照发图',
                pic_weixin:'相册发图',
                pic_photo_or_album:'拍照或相册发图',
                location_select:'推送地理位置'
            }
            type=type?type:'click';
            var str='<select name="selse" class="menu_input_type">';
            for(index in type_list){
                if(index==type){
                    var selected_str=' selected';
                }else{
                    var selected_str='';
                }
                str+='<option value="'+index+'"'+selected_str+'>'+type_list[index]+'</option>'
            }
            str+='</select>';
            return str;
        }

        function create_child_menu(data){
            var menu_data=create_menu_data(data);
            var child_html=$('.childmenu-content').html();
            child_html=child_html.replace(/\[\[event_select_html\]\]/g,menu_data.type);
            child_html=child_html.replace(/\[\[name\]\]/g,menu_data.name);
            child_html=child_html.replace(/\[\[content\]\]/g,menu_data.content);
            return child_html;
        }

        function create_pmenu_html(data){
            var menu_data=create_menu_data(data);
            var sub_menu_html='';
            if(data && data.sub_button){
                for(var i=0;i<data.sub_button.length;i++){
                    sub_menu_html+=create_child_menu(data.sub_button[i]);
                }
            }
            var pmenu_html=$('.pmenu-content').html();
            pmenu_html=pmenu_html.replace(/\[\[event_select_html\]\]/g,menu_data.type);
            pmenu_html=pmenu_html.replace(/\[\[name\]\]/g,menu_data.name);
            pmenu_html=pmenu_html.replace(/\[\[content\]\]/g,menu_data.content);
            pmenu_html=pmenu_html.replace(/\[\[child_list_html\]\]/g,sub_menu_html);
            return pmenu_html;
        }

        function create_menu_data(data){
            var event_type=get_type_select(data?data.type:'');
            var name='';
            var content='';
            if(data){
                if(data.name){
                    name=data.name;
                }
                if(data.type=='click'){
                    content=data.key;
                }else if(data.type=='view'){
                    content=data.url;
                }
            }
            var menu_data={
                type:event_type,
                name:name,
                content:content
            };
            return menu_data;
        }

        parent.first_set_data();
    })