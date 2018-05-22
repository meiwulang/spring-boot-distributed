/**
 * Created by Administrator on 2015/12/10.
 * 分为panel的div   和   html的div
 */
var ROW,TAB,FormP;
var MapVal={};
Ext.onReady(function(){
    var once_edit=true;
    var dream=$('#dream_box');
    var dream_basic=$('#dream_basic');
    var dream_attach=$('#dream_attach');
    var dream_map=$('#dream_map');
    var dream_link=$('#dream_link');
    var data_h=$('.data_c');

    var basic_items=[
        {id:"org_id", name:"org_id", fieldLabel:"ID", xtype:'hidden',allowBlank:true},
        {id:"org_pid", name:"org_pid", fieldLabel:"所属单位ID",xtype:'hidden',allowBlank:true},
        {id:"org_pname", name:"org_pname", fieldLabel:"所属单位",xtype:'combobox'},
        {id:"org_bh", name:"org_bh", fieldLabel:"编号", /*vtype:'alphanum',*/ maxLength:"10"},
        {id:"org_name", name:"org_name", fieldLabel:"单位名称",  maxLength:"50"},
        {id:"org_sname", name:"org_sname", fieldLabel:"单位简称", maxLength:"50"},
        {id:"org_addr", name:"org_addr", fieldLabel:"单位地址", maxLength:"50"},
        {id:"org_type", name:"org_type", fieldLabel:"单位类型",  maxLength:"11"},
        {id:"org_fare_type", name:"org_fare_type", fieldLabel:"票价类型",  maxLength:"11"},
        /*{id:"org_procedure", name:"org_procedure", fieldLabel:"手续费",  maxLength:"11"},*/
        {id:"org_service_tel", name:"org_service_tel", fieldLabel:"服务电话"},
        {id:"org_fax", name:"org_fax", fieldLabel:"传真"},
        {id:"org_province", name:"org_province", fieldLabel:"省份",xtype:'combobox', maxLength:"15"},
        {id:"org_city", name:"org_city", fieldLabel:"城市",xtype:'combobox', maxLength:"100"},
        {id:"org_county", name:"org_county", fieldLabel:"区/县",xtype:'combobox', maxLength:"100"}
    ];
    var legal_items=[
        {id:"org_legal", name:"org_legal", fieldLabel:"法人姓名",maxLength:"100"},
        {id:"org_mob", name:"org_mob", fieldLabel:"手机号码", vtype:'Mobile', maxLength:"11"},
        {id:"org_tel", name:"org_tel", fieldLabel:"联系电话",  maxLength:"11"},
        {id:"org_intro", name:"org_intro", fieldLabel:"单位简介",  maxLength:"200",xtype:'textarea'}
    ];

    var link_items= [
        {id:"lk_name", name:"lk_name", fieldLabel:"姓名", maxLength:"100"},
        {id:"lk_phone", name:"lk_phone", fieldLabel:"手机",vtype:"Mobile", maxLength:"100"},
        {id:"lk_tel", name:"lk_tel", fieldLabel:"电话", maxLength:"100"},
        {id:"lk_fax", name:"lk_fax", fieldLabel:"传真", maxLength:"100"},
        {id:"lk_qq", name:"lk_qq", fieldLabel:"Q Q", maxLength:"100"},
        {id:"lk_job", name:"lk_job", fieldLabel:"职位", maxLength:"100"},
        {id:"lk_email", name:"lk_email", fieldLabel:"邮箱",vtype:"email", maxLength:"100"},
        {id:"lk_info", name:"lk_info", fieldLabel:"简介", maxLength:"200",xtype:'textarea',width:408,allowBlank:true}
    ];

    window.init_var=function(v){  //初始化全局变量
        TAB='基本信息';
        ROW=v;
        switchTab(TAB,ROW);
    }

    /*切换效果*/
    window.switchTab=function(name,row,type){
        var html='';
        dream.html(html);
        if(name=='基本信息'){
            html=basicTpl(basic_items,legal_items,row.basic);
        }
        if(name=='附件信息'){
            html=attachTpl(row,type);
        }
        if(name=='地理信息'){
            html=mapTpl(row.basic,type);
        }
        if(name=='联系人信息'){
            var dd;
            if(row.link_man!=null){
                dd=row.link_man[0];
            }
            html=linkTpl(link_items,dd)
        }
        dream.html(html);
        dream.show(function(){
            if(name=='地理信息'){
                if(document.getElementById('mapIfr1') || document.getElementById('mapIfr')){
                    var point={lng:row.basic.org_mapx,lat:row.basic.org_mapy};
                    if(type){
                        document.getElementById('mapIfr1').onload = function(){
                            window.mapIfr1.addMarker(point,type);
                        }
                    }else{
                        document.getElementById('mapIfr').onload = function(){
                            window.mapIfr.addMarker(point);
                        }
                    }
                }
            }
        });
    };

    window.getMapVal=function(){
        MapVal.str = $('#map_search1').val();
        return MapVal;
    }
    window.get_point=function(x,y){
        $('#org_mapx').val(x);
        $('#org_mapy').val(y);
        MapVal.X = x;
        MapVal.Y = y;
    }
    window.get_address=function(v,t){
        if(t){
            $('#map_search1').val(v);
        }else{
            $('#map_search').val(v);
        }

    }

     /*组织html*/
    function basicTpl(b,l,v){  // 基本信息模板
        var b_str='',b_str_li='',n_str='',n_str_li='',l_str='',l_str_li='',html_str='',hide='';
        b_str_li=str_li(b,v);
        b_str='<div class="message"><div class="m-nav">基本信息</div><ul>'+b_str_li+'</ul></div>';
        l_str_li=str_li(l,v);
        l_str='<div class="message"><div class="m-nav">法人信息</div><ul>'+l_str_li+'</ul></div>';
        return b_str+l_str;
    }

    function str_li(b,v){
        var str_li='',hide='';
        for(var i=0;i< b.length;i++){ //基本信息
            hide='';
            var re='',ab='',ml='';
            if(b[i].xtype=='hidden') hide='hide';
            if(b[i].name=='org_intro' || b[i].id=='org_release') {re='relative';ab='absolute';ml='ml80'}
            if(b[i].xtype=='checkboxgroup'){
                var items=b[i].items,items_span='',checked='';
                var rel=[];
                if(v.org_release) rel=v.org_release.split(',');
                for(var j=0;j<items.length;j++){
                    checked='';
                    if($.inArray(items[j].id.substr(12,1),rel)!=-1) checked='checked=true';
                    items_span+='<span><input type="checkbox" disabled="true" class="data-val" '+checked+'  data-id="'+items[j].id+'"/>'+items[j].boxLabel+'</span>';
                }
                str_li+='<li class="company '+hide+re+'"><span class="text-reight w80 '+ab+'">'+
                    b[i].fieldLabel+'：</span><span class="'+ml+'"  style="text-align: center" ">'+
                    items_span+
                    '</span></li>'
            }else {
                str_li+='<li class="company '+hide+re+'"><span class="text-reight w80 '+ab+'">'+b[i].fieldLabel+'：</span><span class="data-val '+ml+'" data-name="'+b[i].name+'">'+v[b[i].name]+'</span></li>'
            }
        }
        return str_li;
    }

    function linkTpl(lk,v){  //  联系人的模板
        //todo  現在只做了一個聯繫人信息
        var str_li='',lh='',long_li='';
        for(var i=0; i< lk.length;i++){
            var v_l='';
            if(typeof v!='undefined') v_l=v[lk[i].name];
            if(lk[i].name=='lk_email' || lk[i].name=='lk_info'){
                long_li='class="long_li"';
            }
            if(!lk[i].name)lk[i].name='';
            str_li+='<li '+long_li+'><span>'+lk[i].fieldLabel+'：</span><span class="data-val" data-name="'+lk[i].name+'">'+v_l+'</span></li>';
        }
        lh+='<div class="message"><div class="m-nav">联系人信息</div><ul class="link_man">'+
            str_li+
            '</ul></div></div>';
        return lh;
    }

    function mapTpl(v,t){  //  只要传入值就可以了
        var arr=[{name:'搜索'},{name:'经度',field:'org_mapx'},{name:'纬度',field:'org_mapy'}]
        var map='',map_top='',map_map='',input_id='',search_id='id="map_search"',id_search='',name='地址';
        var ifra_id='id="mapIfr" name="mapIfr"';
        var mask='<div style="width: 100%;height: 600px;position: absolute;background-color: white;top: 0;opacity: 0"></div>';
        var i_str = '';
        var input_str = '<span><input type="text" '+search_id+' style="width: 300px;border:none"/></span>';
        for(var i=0;i<arr.length;i++){
            if(t === true){
                input_id='id="'+arr[i].field+'"';
                search_id='id="map_search1"';
                ifra_id='id="mapIfr1" name="mapIfr1"';
                id_search='id="ml5"';
                mask='';
                name = '搜索';
                i_str = '<i class="fa fa-search" ></i></span></li>';
                input_str = '<span><input type="text" '+search_id+' style="width: 300px"/></span>';
            }
            if(arr[i].name=='搜索'){
                map_top+='<li class="mr20 mb5"> ' +
                    '<span>'+name+':</span>' +
                    input_str+
                    '<span '+id_search+' style="cursor: pointer;margin-left: 5px">'+i_str;
            }else{
                map_top+='<li class="mr10"> ' +
                    '<span>'+arr[i].name+':</span>' +
                    '<span><input type="text"  disabled="disabled" '+input_id+' data-name="'+arr[i].field+'" style="width: 130px" value="'+v[arr[i].field]+'"/></span>' +
                    '</li>'
            }
        }
        map_map+='<iframe '+ifra_id+' src="'+$__app__+'/Company/map" width="90%" height="450px" frameborder="0" scrolling="auto"></iframe>';
        map+='<div class="message relative"><div class="m-nav">地理信息</div>'+
            '<div class="map_top"><ul>'+map_top+'</ul></div>' +
            '<div class="map_map">'+map_map+'</div>'+
            '</div>' +
            mask+'</div>';
        return map;
    }

    function attachTpl(v,t){
        var img='',logo='',img2='',img3='',ID_li='',disabled='style = "border:none" disabled = "disabled"';
        var plus_logo='',plus2='',plus3='';
        var logo_url='',ID_id='',tax_id='',charter_id='';
        var xx_img = [];
        var id_img = [];
        var char_img = '';
        var tax_img = '';
        var vt=v.attach;
        if(vt !=null){
            for(var i=0;i< vt.length;i++){
                if(vt[i].at_model=='LOGO'){
                    logo_url= $app_root+vt[i].at_url;
                }
                /*if( ( vt[i].at_model ).substr(0,4) == '形象图片'){
                    xx_img[( vt[i].at_model ).substr(-1,1)]=$app_root+vt[i].at_url;
                }*/
                if( ( vt[i].at_model ).substr(0,3) == '身份证'){
                    id_img[( vt[i].at_model ).substr(-1,1)]=$app_root+vt[i].at_url;
                }
                if(vt[i].at_model == '营业执照'){
                    char_img = $app_root+vt[i].at_url;
                }
                if(vt[i].at_model == '税务登记证'){
                    tax_img = $app_root+vt[i].at_url;
                }
            }
        }

        if(typeof t !='undefined'){
            plus_logo='<div class="absolute plus"><i class="fa fa-plus fa-5x" style="margin-top: 90px"></i></div>';
            plus2='<div class="absolute plus"><i class="fa fa-plus fa-5x" style="margin-top: 47px"></i></div>';
            plus3='<div class="absolute plus"><i class="fa fa-plus fa-5x" style="margin-top: 90px"></i></div>';
            disabled='';
            ID_id='id="ID_id"'
            tax_id='id="tax_id"'
            charter_id='id="charter_id"'
        }
        logo+='<div class="relative overFlow"  style="width: 100%;">'+plus_logo+'<img data-src="'+logo_url+'" src="'+logo_url+'" width="100%"  alt="" class = "img-cls" data-type="LOGO"/></div>'
        /*for(var i=0;i<4;i++){
            var img_t='';
            if(typeof xx_img[i]!='undefined'){
                img_t=xx_img[i];
            }
            img2+='<div class="image"><div style="padding: 5px">' +
                '<div class="relative" style="width: 100%;height: 150px">'+plus2+'<img data-src="'+img_t+'" src="'+img_t+'" width="100%" height="150px" alt="" class = "img-cls" data-type="形象图片-'+i+'"/></div>' +
                '</div></div>'
        }
        img2+='<div class="clear"></div>';*/
        for(var i=0;i<2;i++){
            var img_d='';
            if(typeof id_img[i]!='undefined'){
                img_d=id_img[i];
            }
            ID_li+='<div class="image"><div style="padding: 5px">' +
                '<div class="relative overFlow" style="width: 100%;height: 150px">'+plus2+'<img data-src="'+img_d+'" src="'+img_d+'" width="100%"  alt="" class = "img-cls" data-type="身份证-'+i+'"/></div>' +
                '</div></div>';
        }
        img3+='<div class="pro_li">' +
            '<div class="company">身份证： <input class="w200" '+disabled+' type="text" '+ID_id+' name="org_card" value = "'+ v.basic.org_card+'"/></div>' +
            ID_li+
            '<div class="clear"></div></div>'
        img3+='<div class="pro_li"><div class="company mb5">税务登记证： <input class="w200" '+disabled+' type="text" '+tax_id+' name="org_tax" value = "'+ v.basic.org_tax+'"/></div>' +
            '<div class="relative overFlow" style="width: 100%;">'+plus3+'<img data-src="'+tax_img+'" src="'+tax_img+'" width="100%"   alt="" class = "img-cls" data-type="税务登记证"/></div></div>'
        img3+='<div class="pro_li"><div class="company mb5">营业执照： <input class="w200" '+disabled+' type="text" '+charter_id+' name="org_charter" value = "'+ v.basic.org_charter+'"/></div>' +
            '<div class="relative overFlow" style="width: 100%;">'+plus3+'<img data-src="'+char_img+'" src="'+char_img+'" width="100%"   alt="" class = "img-cls" data-type="营业执照"/></div></div>'
        //return com_att(logo,'LOGO')+com_att(img2,'形象图片')+com_att(img3,'单位证件');
        return com_att(logo,'LOGO')+com_att(img3,'单位证件');
    }



    function com_att(str,name){
        return '<div class="message"><div class="m-nav">'+name+'</div><div class="logo-img">'+str+'</div></div>'
    }
     /*组织html*/

    /*Panel*/
    var form=Ext.create('Ext.form.Panel', {
        bodyPadding: 5,
        id:'form',
        border:false,
        width: 450,
        bodyStyle:"background:none;",
        defaults:{
            xtype:'fieldset',
            autoHeight:true,
            defaultType:'textfield',
            defaults:{
                allowBlank:false,
                width:380,
                labelAlign:'right',
                labelWidth:60
            }
        },
        items: [
            {title:'基本信息',items:basic_items},
            /*{title:'基本属性',items:nature_items},*/
            {title:'法人信息',items:legal_items}
        ]
    });

    var upload_form=$('#upload_form');
    var this_img;

    $(document).on('focus','#ID_id',function(){
        $(this).removeClass('allow_bank');
    });
    $(document).on('blur','#ID_id',function(){
        if(!$(this).val()){
            $(this).addClass('allow_bank');
        }
    });

    $(document).on('focus','#tax_id',function(){
        $(this).removeClass('allow_bank');
    });
    $(document).on('blur','#tax_id',function(){
        if(!$(this).val()){
            $(this).addClass('allow_bank');
        }
    });

    $(document).on('focus','#charter_id',function(){
        $(this).removeClass('allow_bank');
    });
    $(document).on('blur','#charter_id',function(){
        if(!$(this).val()){
            $(this).addClass('allow_bank');
        }
    });

    $(document).on('click','.absolute.plus',function(){
        upload_form.find('input').get(0).click();
        this_img=$(this);
    });
    $(document).on('change','#input_file',function(){
        upload_form.submit();
        upload_form.find('input').val('');
    });
    $(document).on('submit','#upload_form',function(){
        setTimeout(function(){
            var str=$('#iframe_u')[0].contentDocument.body.innerHTML;
            var dd=$.parseJSON( str );
            if(dd.success){
                this_img.parent().find('img').attr("src",$app_root+dd.data[0].savepath+dd.data[0].savename);
                this_img.parent().find('img').attr("data-src",dd.data[0].savepath+dd.data[0].savename);
                this_img.parent().find('img').addClass('add_img');
            }else{
                alert(dd.info);
            }
        },300)
    });

    $(document).on('click','#ml5',function(){
        var skey = $('#map_search1').val();
        window.mapIfr1.search(skey);
        MapVal.str = skey;
    })
    $(document).on('keydown','#map_search1',function(v){
        if(v.keyCode == '13'){
            var skey = $('#map_search1').val();
            window.mapIfr1.search(skey);
            MapVal.str = skey;
        }
    })

});