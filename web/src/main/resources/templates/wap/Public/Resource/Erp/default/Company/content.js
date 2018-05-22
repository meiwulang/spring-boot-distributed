$(function(){
    function url_id(i){
        var _this=i.parentNode;
        var children_id=_this.children;
        var card_url;
        for(var j=0;j<children_id.length;j++){
            var cls=children_id[j].className;
            if(cls.indexOf('from_post')>=0) card_url=children_id[j];
        }
        return { url:card_url}
    }
    function find_id(i,name){
        var children_id=i.children;
        var card_url;
        for(var j=0;j<children_id.length;j++){
            var cls=children_id[j].className;
            if(cls.indexOf(name)>=0) card_url=children_id[j];
        }
        return card_url;
    }
    X.multiFile({
        selector:'.img-file',
        extraData:{ at_class:'Logo'},
        width:80,height:30,
        picWidth:80,picHeight:30,
        maxCount:1,
        requestText:function(e,t,i){
            var row=e.responseText;
            var data = row;
            if (typeof msg != 'object')
                data = eval("(" + row + ")");
            if(data.code==200){
                var img_url=data.data.url;
                var card=url_id(i);
                card.url.value=img_url;
                var img_name=find_id(i,'img-cls');
                img_name.innerHTML='<a href="'+img_url+'" target="_blank"><img src="'+img_url+'?x-oss-process=image/resize,m_mfit,w_290,h_190" width="100%"></a>';
            }else{
                alert(data.message);
                t.deleteFile(0);
            }
        },DeleteIdFn:function(t){
            var card=url_id(i);
            card.url.value='';
        }
    });
    window.Company_File=function(){
        var from_post=$('.from_post');
        var post_data={};
        for(var fi=0;fi<from_post.length;fi++){
            var from_id=from_post.eq(fi);
            if(!from_id.val())continue;
            post_data[from_id.attr('name')]=from_id.val();
        }
        return post_data;
    };
});