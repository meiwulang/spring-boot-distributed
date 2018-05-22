<template>
  <div class="quilleditor" >
      <quill-editor v-model="dcontent" ref="myTextEditor"
                :options="editorOption"
                @blur="onEditorBlur($event)"
                @change="onEditorChange($event)"
                @focus="onEditorFocus($event)"
                @ready="onEditorReady($event)"
                :disabled="readonly"
                :class="{ backColor: readonly }"
                >
      </quill-editor>
  </div>
</template>
<script>
import Vue from 'vue';
import { quillEditor } from 'vue-quill-editor'
import Quill from 'quill'
import { ImageImport } from '../assets/js/ImageImport.js'
import { ImageResize } from '../assets/js/ImageResize.js'
Quill.register('modules/imageImport', ImageImport)
Quill.register('modules/imageResize', ImageResize)

export default {
    name:'quilleditor',
    props:{
        content:String,
        attr:String,
        index:Number,
        readonly:{
            type: Boolean,
            default: false
        }
    },
    data() {
      return {
          dcontent: this.content,
          editorOption:{
            modules: {
              toolbar: [
                [{ 'size': ['small', false, 'large'] }],
                ['bold', 'italic'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'color': [] }, { 'background': [] }], 
              ],
              history: {
                delay: 1000,
                maxStack: 50,
                userOnly: false
              },
              imageImport: true,
              imageResize: {
                displaySize: true
              }
            }
          },
          uploadUrl : api_prefix+"/common/file/upload",
          config : {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          },
      }
    },
    computed: {
    imgUploadPath() {
      this.uploadUrl= api_prefix + this.action;
    }
  },
    methods:{
      onEditorBlur({ editor, html, text }) {
        //this.$emit('input',html,this.attr)
      },
      onEditorFocus({ editor, html, text }) {
         //this.$emit('input',html,this.attr)
      },
      onEditorReady({ editor, html, text }) {
      /*   debugger;
        this.$emit('input',html,this.attr,this.index) */
      },
      onEditorChange({ editor, html, text }) {
          console.log(this.$refs.myTextEditor.quill.getSelection());
          console.log(this.index);
          this.$emit('input',html,this.attr,this.index)
      },
      uploadFile(files){  //上传文件
          if(files.length > 0){
            let formData = new FormData();
            formData.append('fileType', 'jpg');
            formData.append('file', files[0]);
            this.$http.post(this.uploadUrl, formData, this.config).then(function (res) {
              let quill = this.$refs.myTextEditor.quill;
              quill.focus()
              quill.insertEmbed(quill.getSelection().index, 'image', res.body.body.key);
            });
          }
      },
      addMyImageModule(){ //添加imgUpload按钮
        let imgHtml = '<span class="ql-formats"><button type="button" class="ql-image"><svg viewBox="0 0 18 18"> <rect class="ql-stroke" height="10" width="12" x="3" y="4"></rect> <circle class="ql-fill" cx="6" cy="7" r="1"></circle> <polyline class="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"></polyline> </svg></button></span>';
        let inputHtml = '<input type="file" accept="image/png, image/gif, image/jpeg, image/bmp, image/x-icon" class="ql-image"/>';
        imgHtml = $(imgHtml);
        inputHtml = $(inputHtml);
        imgHtml.on('click',e => {
          inputHtml.click()
        });
        $(this.$refs["myTextEditor"].$el).find('.ql-toolbar.ql-snow').eq(0).append(imgHtml).append(inputHtml);
        var self = this;
        inputHtml.on('change',function(e){
          self.uploadFile(e.target.files);
          inputHtml.val('');
        });
      }
    },
    mounted(){
      this.addMyImageModule();
    },
    components:{
      quillEditor
    },
  watch:{
    content:{
      handler:function(val,oldVal){ //解决回显问题。
        if(val && val != oldVal && val != this.dcontent){
            let quill = this.$refs.myTextEditor.quill;
//          quill.root.innerHTML = val;
            this.dcontent = val;
          quill.focus();
        }
      }
    }
  }
}
</script>
<style>
.backColor{
  background:#eef1f6
}
</style>
