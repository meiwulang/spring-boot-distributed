/**
 * @fileOverview HTML5 Multi Files Upload Widgets
 * @depends
 * @author xiechengxiong
 * @date 2014-03-04
 * @version 1.0
 * @interface
 * @update
 */
(function(win, doc) {
  var MultiFile = function(obj, opts) {
    this.obj = obj;
    this.opts = opts;
    this.container = this.createContainer();
    this.placeholder = X.query('.placeholder', this.container)[0];
    this.listWrap = X.query('.filelist', this.container)[0];
    this.status = X.query('.status', this.container)[0];
    this.file = X.query('input', this.container);
    this.progress = X.query('.status .progress', this.container)[0];
    this.info = X.query('.status .info', this.container)[0];
    this.files = [];
    this.index = 0;
    this.bindEvent();
  };
  MultiFile.prototype = {
    bindEvent: function() {
      var _this = this;

      this.file.each(function() {
        var file = this;
        X.on(this, 'change', function() {
         //alert(file.files[0].type)
          _this.selectFile(file.files);
        });
      });
      X.on(this.container, 'click', function(e) {
        var target = e.target || win.event.srcElement;
        var role = X.attr(target, 'data-role');
        var index = X.index(target.parentNode.parentNode || doc.body);
        switch (role) {
          case 'upload': _this.uploadFile(this.obj,'click'); break;
          case 'delete': _this.deleteFile(index); break;
          case 'rotateLeft': _this.rotate(index, -1); break;
          case 'rotateRight': _this.rotate(index, 1); break;
          default :break;
        }
      });
      X.on(doc, 'dragleave', function(e) {e.preventDefault();});
      X.on(doc, 'drop', function(e) {e.preventDefault();});
      X.on(doc, 'dragenter', function(e) {e.preventDefault();});
      X.on(doc, 'dragover', function(e) {e.preventDefault();});
      X.on(this.container, 'drop', function(e) {
        e.preventDefault();
        _this.selectFile(e.dataTransfer.files);
      });
    },
    changeArray: function(list) {
      var arr = [];
      for(var i = 0, len = list.length; i < len; i++) {
        arr.push(list[i]);
      }
      return arr;
    },
    changeInfo: function() {
      var fileSize = 0;
      for(var i = 0; i < this.files.length; i++) {
        fileSize += this.files[i].size;
      }
      if (fileSize > 1024 * 1024) {
        fileSize = (Math.round(fileSize * 100 / (1024 * 1024)) / 100).toString() + 'MB';
      } else {
        fileSize = (Math.round(fileSize * 100 / 1024) / 100).toString() + 'KB';
      }
      this.info.innerHTML = '选中'+this.files.length+'文件，共'+fileSize+'。';
    },
    changePanel: function(f1, f2) {
      this.placeholder.style.display = f1;
      this.listWrap.style.display = f2;
      if(this.opts.load==true){
          this.status.style.display = f2;
      }
    },
    checkType: function(type) {
      var types = this.opts.fileType.split(';');
      var obj = {};
      for(var i = 0, len = types.length; i < len; i++) {
        var key = types[i].split('.')[1];
        if(typeof key !== 'undefined') {
          obj[key] = true;
        }
      }
      return obj[type.split('/')[1]];
    },
    createContainer: function() {
      var multiple='multiple="multiple"';
        var multiple_add='<div class="add"><label>继续添加</label><input type="file" '+multiple+' /></div>';
      if(this.opts.multiple==true){
          multiple='';
          multiple_add='';
      }
      var placeholder = '<div class="placeholder"><div class="wrap"><div class="add"><label>点击选择文件</label><input type="file" '+multiple+' /></div><p class="tips">支持文件拖拽, 最多可上传'+this.opts.maxCount+'张文件</p></div></div>';
      var fileList = '<div class="filelist"></div>';

      var status = '<div class="status"><div class="progress"><span class="text">0%</span><span class="percentage"></span></div><div class="info"></div><div class="btns">'+multiple_add+'<div class="upload" id="upload-id" data-role="upload">开始上传</div></div></div>';
      var container = doc.createElement('div');
      container.className = 'x-multifile-wrap';
      container.innerHTML = placeholder+fileList+status;
      container.style.cssText = 'width:'+this.opts.width+'px;height:'+this.opts.height+'px;';
      this.obj.appendChild(container);
      return container;
    },
    createFile: function(name, url,type) {
      var file_img='',img_cls='';
      /*if(type.indexOf('mp3')>=0){
          file_img='<i class="fa fa-music"></i>';
      }else if(type.indexOf('msword')>=0){
          file_img='<i class="fa fa-file-word-o"></i>';
      }else if(type.indexOf('excel')>=0){
          file_img='<i class="fa fa-file-excel-o"></i>';
      }else if(type.indexOf('plain')>=0){
          file_img='<i class="fa fa-file-text-o"></i>';
      }else if(type.indexOf('mp4')>=0 || type.indexOf('wmv')>=0){
          file_img='<i class="fa fa-film"></i>';
      }else{
        if(this.opts.load==true){
          file_img='<i class="fa fa-picture-o"></i>';
        }else{
          img_cls='<img src="'+url+'" />';
        }
      }*/
      var img = '';
      if(this.opts.load==true){
        img='<div href="'+$__app__+url+'" style="height:'+(this.opts.picHeight-33)+'px;padding:5px;padding-top:28px;word-wrap:break-word;word-break:normal;">'+name+'</div>';
      }else{
        img='<p class="img" style="height:'+this.opts.picHeight+'px"><img src="'+url+'" /></p>';
      }
      //var img = '<p class="img" style="height:'+this.opts.picHeight+'px">'+file_img+img_cls+'</p>';
      var title = '<p class="title">'+name+'</p>';
      var progress = '<p class="progress"><span></span></p>';
      var tool = '<div class="tool"><a data-role="delete">&#xf013f;</a><a data-role="rotateRight">&#xf013b;</a><a data-role="rotateLeft">&#xf013a;</a></div>';
      var result = '<span class="result"></span>';
      var li = doc.createElement('li');
      li.innerHTML = img+progress+tool+result;
      li.style.cssText = 'width:'+this.opts.picWidth+'px;height'+this.opts.picHeight+'px;';
      this.listWrap.appendChild(li);
      this.fillList = X.query('.filelist li', this.container);
      if(this.opts.load!=true){
          this.uploadFile(this.obj);
      }
    },
    deleteFile: function(index) {
      this.fillList[index].remove();
      this.files.splice(index, 1);
      if(this.files.length === 0) {
        this.changePanel('block', 'none');
      }
      this.changeInfo();
      if(this.opts.load!=true){
          this.opts.DeleteIdFn(this.obj);
      }
    },
    rotate: function(index, direction) {
      var img = X.query('.img', this.fillList[index])[0];
      var angle = X.data(img, 'angle') || 0;
      angle += direction*90;
      img.style.transform = 'rotate('+angle+'deg)';
      img.style.webkitTransform = 'rotate('+angle+'deg)';
      X.data(img, 'angle', angle);
    },
    selectFile: function(fs) {
      fs = this.changeArray(fs);
      var cLen = fs.length;
      var tLen = this.files.length;
      var max = this.opts.maxCount;
      if(tLen+cLen > max) {
        fs.splice(max-tLen-cLen, tLen+cLen-max);
      }
      for(var i = 0; i < fs.length; i++) {
        var file = fs[i];
        if(this.checkType(file.type)) {
          if(file.size > 10000000*100) {
            file.packet = [];
            file.breakpoint = 0;
            file.tag = Math.floor(Math.random() * 10E10) + '_' + new Date().getTime();
            for(var j = 0, len = file.size/10000000*10000; j < len; j++) {
              var blob = file.slice(j*10000000*10000, (j+1)*1000000000*10000);
              blob.type = file.type;
              blob.name = file.name;
              file.packet.push(blob);
            }
          }
          this.files.push(file);
          (function(file, _this) {
            var reader = new FileReader();
            reader.onload = function( evt ){
              _this.createFile(file.name, evt.target.result,file.type);
            };
            reader.readAsDataURL(file);
          })(file, this);
        }
      }
      if(this.files.length > 0) {
        this.changePanel('none', 'block');
        this.changeInfo();
      }
    },
    uploadComplete: function(e) {
      var file = this.files[this.index];
      if(typeof file!='object')return ;
      if(file.packet && file.breakpoint < file.packet.length - 1) {
        file.breakpoint++;
        this.uploadFile(this.obj);
      } else {
        var result = X.query('.result', this.fillList[this.index])[0];
        result.style.display = 'inline-block';
        result.innerHTML = '&#xf00b2;';
        if(this.index === this.files.length - 1) {
          this.opts.allCompleteCallback && this.opts.allCompleteCallback(e);
          this.progress.style.display = 'none';
          this.info.innerHTML = '共'+this.files.length+'张文件，已上传'+(this.index+1)+'张';
        } else {
          this.index++;
          this.uploadFile(this.obj);
          this.info.innerHTML = '正在上传'+(this.index+1)+'/'+this.files.length+'张文件';
        }
        var percentComplete =  Math.floor((this.index/this.files.length)*100)+'%';
        this.progress.innerHTML = '<span class="text">'+percentComplete+'</span><span class="percentage" style="width:'+percentComplete+'"></span>';
        this.opts.uploadCompleteCallback && this.opts.uploadCompleteCallback(e);
      }
    },
    uploadFailed: function(e) {
      this.opts.uploadErrorCallback && this.opts.uploadErrorCallback(e);
    },
    uploadFile: function(e,type) {
      if(type=='click'){
        var upload_id=document.getElementById('upload-id');
        if(upload_id.getAttribute('status')=='yes')return false;
        upload_id.setAttribute('status','yes');
        upload_id.innerHTML='正在上传...';
        upload_id.style.background='#cccccc';
      }
      var xhr = new XMLHttpRequest();
      var _this = this;
      xhr.upload.addEventListener('progress', function(e) {_this.uploadProgress(e);}, false);
      xhr.addEventListener('load', function(e) {_this.uploadComplete(e);}, false);
      xhr.addEventListener('error', function(e) {_this.uploadFailed(e);}, false);
      if(_this.opts.load!=true){
          xhr.onreadystatechange=function(){
              if(xhr.readyState==4){
                  _this.opts.requestText(xhr,_this,e);//alert(xhr.responseText)
              }
          };
      }
      xhr.open('post', this.opts.uploadUrl, true);
      var fd = new FormData();
      var file = this.files[this.index];
      var fieldName = this.opts.fieldName;
      if(file.packet) {
        fd.append('breakpoint', file.breakpoint);
        fd.append('len', file.packet.length);
        fd.append('fileName', file.name);
        fd.append('tag', file.tag);
        fd.append(fieldName, file.packet[file.breakpoint]);
      } else {
        fd.append(fieldName, file);
      }
      for(var name in this.opts.extraData) {
        fd.append(name, this.opts.extraData[name]);
      }
      xhr.send(fd);
      this.progress.style.display = 'inline-block';
},
    uploadProgress: function(e) {
      if(e.lengthComputable) {
        var progressList = X.query('.filelist .progress span', this.container);
        var percentage = Math.round(e.loaded * 100 / e.total);
        var file = this.files[this.index];
        if(file.packet) {
          percentage = Math.round((file.breakpoint * e.total + e.loaded) * 100 / (file.packet.length*e.total));
        }
        progressList[this.index].style.width = percentage +'%';
      }
    }
  };
  var list = [];
  X.multiFile = function (options) {
    options = X.extend(X.multiFile.defualts, options);
    var element = X.query(options['selector']);
    element = X.isArray(element) ? element : [element];
    for (var i = 0, len = element.length; i < len; i++) {
      list.push(new MultiFile(element[i], options));
    }
  };
  X.multiFile.defualts = {
    selector: '.multifile',//容器选择器
    width: 120,//容器宽度
    height: 100,//容器高度
    picWidth: 120,//预览图宽度
    picHeight: 100,//预览图高度
    maxCount: 100,//最大上传限制
    multiple:true,//是否需要多文件上传
    load:false,
    uploadUrl: $__app__+'/Upload/ajax_upload',//上传地址
    fieldName: 'file',//提交时的表单名称
    fileType: '*.gif;*.png;*.jpg;*.jpeg;*.bmp;',
    extraData: {album: 'album'},//上传时额外的数据
    selectFileCallback: null,// 选择文件的回调
    deleteFileCallback:null,// 删除某个文件的回调
    exceedFileCallback: null,// 文件超出限制的最大体积时的回调
    startUploadCallback: null,// 开始上传某个文件时的回调
    uploadCompleteCallback: null,// 某个文件上传完成的回调
    uploadErrorCallback: null,// 某个文件上传失败的回调
    allCompleteCallback: null,// 全部上传完成时的回调
    requestText:null,//上传成功后出发函数
    DeleteIdFn:null//删除后触发函数
  };
})(window, document);
