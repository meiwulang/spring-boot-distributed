/**
 * Created by zsl on 2017/3/28.
 */
(function($){
    /**
     * 图片上传控件
     * @param opt 基本参数
     * @param complete 成功
     * @param error 失败
     * @param before 上传前
     */
    $.fn.uploadFile=function(opt,complete,error,before){
        var x=$(this);
        var multiple='';
        if(opt.multiple){
            multiple='multiple="multiple"';
        }
        var default_url='';
        if(opt.default_url)default_url='<ul><li class="img-l"><a href="'+opt.default_url+'" target="_blank"><img src="'+opt.default_url+opt.process+'"></a></li><li class="clear"></li></ul>';
        x.html('<form><div class="files"><div class="upload-selecter">'+default_url+'</div><input type="file" name="upload-file" class="upload-file" '+multiple+'></div></form>');
        var upload_hover=opt.select_id?$(opt.select_id):$('.upload-selecter');
        var img_file=$('input[name=upload-file]');
        upload_hover.unbind();
        upload_hover.click(function(){
            img_file.trigger('click');
        });
        img_file.change(function(){
            var file_data=$(this)[0]['files'];
            var len=file_data.length;
            var img_tpl=upload_tpl(len);
            if(len<=0)return false;
            if(opt.upload_limit > 0){
                if(len > opt.upload_limit){
                    error({message:'最多只允许上传'+opt.upload_limit+'张图片'});
                    return false;
                }
            }
            $('.upload-selecter').html(img_tpl);
            var rst=upload_ajax(file_data,0,complete);
            if(rst['status']===false){
                if(error)error(rst);
            }
        });
        /**
         * 选择文件模版
         * @param len 选择文件数量
         * @returns {*}
         * @constructor
         */
        function upload_tpl(len){
            var tpl='';
            for(var i=0;i<len;i++){
                tpl+='<li class="img-l"></li>';
            };
            tpl='<ul>'+tpl+'<li class="clear"></li></ul>';
            return tpl;
        };
        /**
         * 上传文件的验证
         * @param file 上传文件
         * @param field 需要验证的字段
         * @returns {*}
         * @constructor
         */
        function upload_verify(file,field){
            if(!field)return true;
            //验证图片大小
            if(field.size && file.size>1000*field.size){
                return { 'status':false,'msg':'上传图片大小不可大于'+field.size+'KB!'};
            };
            //验证上传文件类型
            if(field.type){
                var type=file['name'].split('.');
                var c_suffix = type[type.length-1].toLowerCase();//获取当前上传文件的文件类型，并转换成小写
                if( in_array(c_suffix, field.type) == -1 ){
                    return { 'status':false,'msg':'上传图片类型只能是【'+field['type'].join(',')+'】!'};
                }
            }
            return true;
        };
        function in_array($value, $array){
            if (typeof $array != 'object') return false;
            for (var $i=0; $i<$array.length; $i++){
                if ( $value == $array[$i] ) return $i;
            }
            return -1;
        };
        function upload_field_data(file,field){
            if(!field) return file;
            $.each(field,function(i,v){
                file.append(i, v);
            });
            return file;
        };
        function upload_ajax(data,i,complete){
            if(data.length<=i)return false;
            var file_data=data[i];
            var verify=upload_verify(file_data,opt.verify);
            if(verify['status']===false){
                return verify;
            }
            var formdata = new FormData();
            formdata.append('file', file_data);
            formdata=upload_field_data(formdata,opt.data);
            var img_l=$('.img-l').eq(i);
            var load_msg=opt.load_msg?opt.load_msg:'0%';
            img_l.html('<span class="load-img">'+load_msg+'</span>');
            var url=opt.url?opt.url:'/b2b/upload/picture';
            var bf;
            if(before)bf=before(formdata,i);
            $.ajax({
                type: 'POST',
                url: url,
                data: formdata,
                cache: false,
                processData: false, // 不处理发送的数据，因为data值是Formdata对象，不需要对数据做处理
                contentType: false, // 不设置Content-type请求头

                success: function (ret) {
                    if(ret.code==200){
                        var img_url = ret.data.url;
                        var w_h=opt.process?opt.process:'?x-oss-process=image/resize,m_mfit,h_100,w_120';
                        img_l.html('<a href="'+img_url+'" target="_blank"><img src="'+img_url+w_h+'"></a><span class="load-img load_200">100%</span>');
                        upload_ajax(data,(i+1),complete);
                        if(complete)complete(ret,bf,(data.length<=i+1));
                    }else{
                        if(error)error(ret);
                    }
                },
                error: function (ret) {
                    if(error)error(ret);
                }
            });
            return true;
        }
    };
})(jQuery);