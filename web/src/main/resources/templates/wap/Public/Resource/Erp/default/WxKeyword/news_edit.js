/**
 * Created by chaos on 2016/2/18.
 */
$(function(){
    $('.news-box').on('focus','.field-content input',function(){
        $(this).parent('.field-content').addClass('field-content-focus');
    })
    $('.news-box').on('blur','.field-content input',function(){
        $(this).parent('.field-content').removeClass('field-content-focus');
        var data_bind=$(this).attr('data-bind');
        if(data_bind!=''){
            $(this).parents('.news-article').find('.'+data_bind).html($(this).val());
        }
    })
    $('.news-box').on('focus','.field-content textarea',function(){
        $(this).parent('.field-content').addClass('field-content-focus');
    })
    $('.news-box').on('blur','.field-content textarea',function(){
        $(this).parent('.field-content').removeClass('field-content-focus');
    })
    $('.news-box').on('click','.fa-edit',function(){
        $('.news-box .news-article-edit').hide();
        $('.news-box .news-article-edited').show();
        var parent_obj=$(this).parents('.news-article');
        parent_obj.find('.news-article-edit').show();
        parent_obj.find('.news-article-edited').hide();
    })
    $('.news-box').on('click','.news-save-btn',function(){
        var parent_obj=$(this).parents('.news-article');
        parent_obj.find('.news-article-edit').hide();
        parent_obj.find('.news-article-edited').show();
    })
    $('.news-box').sortable({
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
    $('news-article').disableSelection();
    $('.add-new-article').click(function(){
        if($('.news-box .news-article').length>=9){
            return false;
        }
        $('.news-box .news-article-edit').hide();
        $('.news-box .news-article-edited').show();
        $('.news-box').append(create_html({}));
        if($('.news-box .news-article').length>=9){
            $(this).hide();
        }
    })
    $('.news-box').on('click','.news-del-btn',function(){
        $('.add-new-article').show();
        $(this).parents('.news-article').remove();
    })
    $('.news-box').on('click','.remove-image',function(){
        $(this).parent().find('.news-article-cover').html('');
        $(this).parents('.news-article').find('.news-list-right').html('');
    })
    $('.news-box').on('change','.news_cover_choose',function(){
        window.image_obj=$(this);
        $(this).parent('form').submit();
        $(this).val('');
    })
    $(document).on('submit','form',function(){
        setTimeout(function(){
            var str=$('#pic_frame')[0].contentDocument.body.innerHTML;
            var result=$.parseJSON(str);
            if(result.success){
                var img_url=result.data[0].savepath+result.data[0].savename;
                image_obj.parents('.news-article').find('.news-article-cover').html('<img src="'+$app_root+img_url+'" data-src="'+img_url+'">');
                image_obj.parents('.news-article').find('.news-list-right').html('<img src="'+$app_root+img_url+'" data-src="'+img_url+'">');
            }else{
                parent.msgAlert(result.info);
            }
        },300)
    });

    window.get_news_data=function(){
        var data=[];
        $('.news-box .news-article').each(function(i,v){
            var news_cover=$(this).find('.news-article-cover img').attr('data-src');
            if(!news_cover){
                news_cover='';
            }
            var temp_data={
                news_title:$(this).find('.news-title-input').val(),
                news_cover:news_cover,
                news_desc:$(this).find('.news-desc-input').val(),
                news_url:$(this).find('.news-url-input').val(),
            };
            data.push(JSON.stringify(temp_data));

        });
        return data;
    }
    window.set_html=function(data){
        var html='';
        for(var i=0;i<data.length;i++){
            html+=create_html(data[i]);
        }
        $('.news-box').html(html);
        if($('.news-box .news-article').length>=9){
            $('.add-new-article').hide();
        }else{
            $('.add-new-article').show();
        }
    }
    function create_html(data){
        var html=$('.templete').html();
        var edit_flag=true;
        if(!data.news_title){
            data.news_title='';
        }else{
            edit_flag=false;
        }
        if(data.news_cover){
            edit_flag=false;
            var news_cover='<img src="'+$app_root+data.news_cover+'" data-src="'+data.news_cover+'">';
        }else{
            var news_cover='';
        }
        if(!data.news_desc){
            data.news_desc='';
        }else{
            edit_flag=false;
        }
        if(!data.news_url){
            data.news_url='';
        }else{
            edit_flag=false;
        }
        if(edit_flag){
            news_edit_flag='';
            news_edited_flag='style="display: none"';
        }else{
            news_edit_flag='style="display: none"';
            news_edited_flag='';
        }
        html=html.replace(/\[\[news_title\]\]/g,data.news_title);
        html=html.replace(/\[\[news_cover\]\]/g,news_cover);
        html=html.replace(/\[\[news_desc\]\]/g,data.news_desc);
        html=html.replace(/\[\[news_url\]\]/g,data.news_url);
        html=html.replace(/\[\[news_edit_flag\]\]/g,news_edit_flag);
        html=html.replace(/\[\[news_edited_flag\]\]/g,news_edited_flag);
        return html;
    }
    set_html(parent.get_news());
})
