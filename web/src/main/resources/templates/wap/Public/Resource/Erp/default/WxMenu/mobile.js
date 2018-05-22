$(function(){

        $('body').on('click','.li-box',function(){
            if($(this).parent('.footer-li').find('.hidden-list').is(":hidden")){
                $('.hidden-list').hide();
                $(this).parent('.footer-li').find('.hidden-list').show();
            }else{
                $('.hidden-list').hide();
            }
        });

        window.create_btn=function(data,app_name){
            $('.title').html(app_name);
            var btn_str='';
            if(data){
                btn_str+='<ul>';
                for(i=0;i<data.length;i++){
                    btn_str+='<li class="footer-li mobile_btn'+data.length+'"> <a href="#" class="li-box">';
                    if(data[i]['sub_button'].length>0){
                        btn_str+='<i class="fa fa-gratipay"></i>';
                    }
                    btn_str+='<span class="li-title">'+data[i]['name']+'</span></a>';
                    if(data[i]['sub_button'].length>0){
                        btn_str+='<div class="hidden-list"><ul>';
                        for(j=0;j<data[i]['sub_button'].length;j++){
                            btn_str+='<li class="hidden-li">'+data[i]['sub_button'][j]['name']+'</li>';
                        }
                        btn_str+='</ul><i class="arrow arrow-out"></i></div>';
                    }
                    btn_str+='</li>';
                }
                btn_str+='<div class="clear"></div></ul>';
            }
            $('.footer').html(btn_str);
        }

        parent.get_data();
    })