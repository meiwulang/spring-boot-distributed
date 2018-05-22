<template>
    <div class="jdy-content jdy-resources fleft jl-trip jl-pic">
        <div class="jdy-content-inner-trip">
            <div class="tripbox-tab clearfix">
                <a href="javascript:;" title="" class="relative inlineblock fleft" @click="goSpotInfo($route.query.type)">景点基本信息
                    <span class="absolute inlineblock"></span>
                </a>
                <a title="" href="javascript:;" class="relative inlineblock fleft active" @click="goPic($route.query.type)">图片管理
                    <span class="absolute inlineblock"></span>
                </a>
            </div>
            <div class="jdy-content-inner-trip">
                <div class="jdy-search clearfix p10">
                    <el-button type="primary" class="fl mt5" @click="upload(0,{item:'no'})" :disabled="noUpload == 1">上传照片</el-button>
                    <el-button type="default" class="fl mt5 mr10" @click="deletePic" v-if='noUpload == 0'>批量删除</el-button>
                    <el-button type="default" class="fl mt5" @click="deletePicYes" v-if='noUpload == 1'>删除</el-button>
                    <el-button type="default" class="fl mt5 mr10" v-if='noUpload == 1' @click="cancelDelete">取消</el-button>
                </div>

                <div class="picwrap plr10">
                    <ul>
                        <li class="clearfix jl-picList" v-for="(item,index) in picData" style="position:relative;">
                            <input type="checkbox" :class="'picIndex'+index" v-show="showAllDelete">
                            <div class="picwrap-img relative">
                                <a href="javascript:;"><img :src="item.pOssName" alt="" @click="getDeleteId(item.id,index)"></a>
                            </div>
                            <div class="picwrap-bottom" style="width:135px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display:inline-block">{{item.pRealName}}
                            </div>
                            <div class="editPic" v-show="showEditPic">
                                <a href="javascript:;">
                                    <i class="el-icon-view" @click="toBigPic(picData,index)"></i>
                                </a>
                                <a href="javascript:;">
                                    <i class="el-icon-edit" @click="editPic(item)"></i>
                                </a>
                                <a href="javascript:;">
                                    <i class="el-icon-delete" @click="deletePicSingle(index,item.id)"></i>
                                </a>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <jdy-alert title="上传图片" @closeAlert="saveToAblum" v-if="alertPicFlag" class="alertTag dialog-upload-pic" style="width:850px;">
                <div class="clearfix">
                    <div class="mt10 clearfix scroll-cont">
                        <div class="jl-localPic">
                            <label for="fileUpload">
                                <div class="el-upload el-upload--picture-card">
                                    <input type="file" name="file" id="fileUpload" class="el-upload__input" multiple="multiple" accept="image/*"  v-on:change="changecover($event)">
                                    <i class="el-icon-plus"></i>
                                </div>
                            </label>
                        </div>
                        <div v-for="(item,key) in attachs" class="jl-upLoadPic">
                            <img :src="item" class="ifImg">
                            <div class="jl-upLoadPicHover" v-show="showPicHover">
                                <i class="el-icon-delete2" @click="delImage(item,key)"></i>
                            </div>
                        </div>
                    </div>
                    <div class="clearfix alertTagFooter">
                        <!--<button type="button" class="el-button fright mt10 mr10" @click="closePics">
                            <span>取消</span>
                        </button>-->
                        <button type="button" class="el-button fright mt10 mr10 el-button--primary" @click="saveToAblum">
                            <span>关闭</span>
                        </button>
                    </div>
                </div>
            </jdy-alert>

            <jdy-alert title="编辑/添加图片名称" @closeAlert="closePicName" v-if="alertPicName" class="alertPicName alertTag">
                <div class="alertPicNames clearfix">
                    <el-input v-model="picNameValue" placeholder="请输入名称" style="width:90%;" @change="getNameValue"></el-input>
                    <button type="button" class="el-button fright mt30 mr10" @click="closePicName">
                        <span>取消</span>
                    </button>
                    <button type="button" class="el-button fright mt30 mr10 el-button--primary" @click="saveName">
                        <span>保存</span>
                    </button>
                </div>
            </jdy-alert>

            <jdy-alert title="放大图片" @closeAlert="closePics2" v-if="alertPicFlag2" class="alertJournal alertPics2 alertTag">
                <div class="alertimgss clearfix">
                    <i class="el-icon-arrow-left alertimgss-icon" @click="leftPic"></i>
                    <i class="el-icon-arrow-right alertimgss-icon" @click="rightPic"></i>
                    <div class="alertimgss-center">
                        <img :src="picitem[picindex].pOssName" alt="">
                    </div>
                </div>
            </jdy-alert>
            <!-- 分页   begin-->
            <div class="clearfix">
                <el-pagination class="fright mt10 mb10" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper" :total="tableDataTotal">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import jdyAlert from '@/components/Alert';
export default {
    name: "pic",
    data() {
        return {
            ablumName: this.$route.query.aname,
            picNum: this.$route.query.picNum,
            pAlbumId: this.$route.query.albumId,
            pType: 3,
            pid: this.$route.query.spotId,
            picindex: 0,
            options: [],
            selectedOptions: [],
            dialogImageUrl: '',
            dialogVisible: false,
            alertPicFlag: false,
            alertPicFlag2: false,
            showPicHover: false,
            showEditPic: false,
            showAllDelete: false,
            noUpload: 0,
            alertPicName: false,
            picIdArry: [],
            picNameValue: '',
            picNameId: '',
            picEditItem: {},
            search: {
                type: '',
                select: '景点',
                address: ''
            },
            sortData: [{
                value: '酒店',
                label: '酒店'
            }, {
                value: '景点',
                label: '景点'
            }],
            uploadForm: {
                select: '',
                pAlbumId: ''
            },
            attachs: [],
            picData: [],
            picDataUp: [],
            SortUpValue: '',
            ablumId: '',
            picType: '',
            pPid: '',
          attachIdArr:[],
            fullscreenLoading: false,
            tableDataTotal: 0,
            pageSize: 20,
            currentPage: 1,
            urlSpotId:this.$route.query.spotId,
            urlAlbumId:this.$route.query.albumId,
            uploadImageList:[],
        }
    },
    updated() {
        $(".jl-picList").mouseenter(function () {
            $(this).find(".editPic").css("display", "inline-block")
        })
        $(".jl-picList").mouseleave(function () {
            $(this).find(".editPic").css("display", "none")
        })
        $(".jl-upLoadPic").mouseenter(function () {
            $(this).find(".jl-upLoadPicHover").css("display", "inline-block")
        })
        $(".jl-upLoadPic").mouseleave(function () {
            $(this).find(".jl-upLoadPicHover").css("display", "none")
        })
    },
    mounted() {
        jdyFn.picHover();
        // if (this.pType == 1) {
        //     this.pType = 3
        // } else {
        //     this.pType = 2
        // }
        this.$http.post(api_prefix + 'attach/list', {
            pAlbumId: this.pAlbumId,
            pSize: 20,
            currPage: this.currentPage,
        }).then(response => {
            if (response.data.code == 0) {
                let data = response.data.body;
                this.picData = data.resultList;
                this.tableDataTotal = data.totalNum;
            } else {
                this.$alert(response.data.message, '温馨提示', {
                    confirmButtonText: '确定',
                    callback: action => { }
                });
            }
        }, response => {
            console.log('出错了');
        });
    },
    methods: {
        // 页面跳转
        goSpotInfo(value){
            this.$router.push({ name: "scenicspotInfo",query:{type: value,spotId:this.urlSpotId,albumId:this.urlAlbumId}})
        },
        goPic(value){
            this.$router.push({ name: "scenicspotPic",query:{type: value,spotId:this.urlSpotId,albumId:this.urlAlbumId}})
        },
        getPicData() {
            this.$http.post(api_prefix + '/attach/list', {
                pAlbumId: this.pAlbumId,
                pSize: 20,
                currPage: this.currentPage
            }).then(response => {
                if (response.data.code == 0) {
                    let data = response.data.body;
                    this.picData = data.resultList;
                    this.tableDataTotal = data.totalNum;
                } else {
                    this.$alert(response.data.message, '温馨提示', {
                        confirmButtonText: '确定',
                        callback: action => { }
                    });
                }
            }, response => {
                console.log('出错了');
            });
        },
        deletePic() {
            this.showAllDelete = true;
            this.noUpload = 1;
        },
        cancelDelete() {
            $(".jl-picList input").each(function(){
                $(this).is(":checked") && $(this).removeAttr("checked")
            })
            this.noUpload = 0;
            this.showAllDelete = false;
        },
        deletePicYes() {
            if(this.picIdArry==null||this.picIdArry.length<1){this.$alert("请选择需要删除的文件");return}
            this.$confirm('你确定要删除该内容？', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.post(api_prefix + '/attach/batchDelete', this.picIdArry).then(response => {
                    if (response.data.code == 0) {
                        this.cancelDelete();
                        this.getPicData();
                        $(".jl-picList input").each(function(){
                            $(this).is(":checked") && $(this).removeAttr("checked")
                        })
                    } else {
                        this.$alert(response.data.message, '温馨提示', {
                            confirmButtonText: '确定',
                            callback: action => { }
                        });
                    }
                }, response => {
                    console.log('出错了');
                });
            }).catch(() => {

            });
        },
        getDeleteId(id, index) {
            if ($(".picIndex" + index).is(":checked")) {
                $(".picIndex" + index).removeAttr("checked");
                var picindex = $.inArray(id, this.picIdArry);
                if (index >= 0) {
                    this.picIdArry.splice(picindex, 1);
                }
            } else {
                $(".picIndex" + index).attr("checked", true)
                this.picIdArry.push(id);
            }
        },
        toBigPic(picData, index) {
            this.alertPicFlag2 = true;
            this.picindex = index;
            this.picitem = picData;
            this.$nextTick(function () {
                jdyFn.setAlertStyle('alertTag');
            });
        },
        leftPic() {
            if (this.picindex < 1) {
                this.picindex = 0;
                return;
            }
            this.picindex--;
        },
        rightPic() {
            if (this.picindex >= this.picData.length - 1) {
                this.picindex = this.picData.length - 1;
                return;
            }
            this.picindex++;
        },
        editPic(item) {
            this.picEditItem = item;
            this.alertPicName = true;
            this.picNameValue = item.pRealName;
        },
        getNameValue(value) {
            this.picNameValue = value;
            this.picEditItem.pRealName = this.picNameValue;
        },
        saveName() {
            this.picEditItem.puserId=1; //临时
            this.$http.post(api_prefix + 'attach/update', this.picEditItem).then(response => {
                if (response.data.code == 0) {
                    this.getPicData();
                    this.closePicName();
                    this.$message({
                        type: 'success',
                        message: '保存成功!'
                    });
                } else {
                    this.$alert(response.data.message, '温馨提示', {
                        confirmButtonText: '确定',
                        callback: action => { }
                    });
                }
            }, response => {
                console.log('出错了');
            });
        },
        deletePicSingle(index, id) {
            this.$confirm('你确定要删除该内容？', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.post(api_prefix + 'attach/delete', {
                    id: id,
                    puserId:1
                }).then(response => {
                    if (response.data.code == 0) {
                        this.getPicData()
                    } else {
                        this.$alert(response.data.message, '温馨提示', {
                            confirmButtonText: '确定',
                            callback: action => { }
                        });
                    }
                }, response => {
                    console.log('出错了');
                });
            }).catch(() => {
                // this.$message({
                //     type: 'info',
                //     message: '已取消删除'
                // });
            });
        },
        upload(index, item) {
            this.alertPicFlag = true;
            this.attachs=[];
            this.$nextTick(function () {
                jdyFn.setAlertStyle('alertPics');
            });
        },
        showbig(index, item) {
            this.alertPicFlag2 = true;
            this.$nextTick(function () {
                jdyFn.setAlertStyle('alertTag');
            });
        },
        del(index, item) {
            this.$confirm('此操作将永久删除该图片, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.picData.splice(index, 1);
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                // this.$message({
                //     type: 'info',
                //     message: '已取消删除'
                // });
            });
        },
        closePics() {
            $('.alertbgg').remove();
            this.alertPicFlag = !this.alertPicFlag;
        },
        closePics2() {
            this.alertPicFlag2 = !this.alertPicFlag2;
        },
        closePicName() {
            this.alertPicName = !this.alertPicName;
        },
        handleCurrentChange(val) {
            if (val) {
                this.currentPage = val;
                this.getPicData();
            }
        },
        clearPicAttachArr(){
          this.attachs=[];
          this.attachIdArr=[];
          this.uploadImageList = [];
        },
        dealWithPic(fileList){
          let notImage = [];
          let bigImage = [];
          let returnImage = [];
          for (let i = 0; i < fileList.length; i++) {
            const item =  fileList[i];
            var fileSize = item.size / 1024;
            var fileType = item.type.startsWith("image/");
            if (!fileType) {
              notImage.push(item);
            }
            else if (fileSize > 5120) {
              bigImage.push(item);
            }
            else{
              returnImage.push(item);
            }
          }
          this.uploadImageList = returnImage;
          if(notImage.length>0){
            this.$alert('请选择图片上传！', '温馨提示', {
              confirmButtonText: '确定',
              callback: action => { }
            });
          }
          else  if(bigImage.length>0){
            this.$alert('图片大小不能超过5M！', '温馨提示', {
              confirmButtonText: '确定',
              callback: action => { }
            });
          }
        },
        changecover($event) {
            console.log($event)
            var files = event.currentTarget.files || event.dataTransfer.files;
            var fileName = event.currentTarget.value
            this.dealWithPic(files);
            this.uploadImageList.forEach((item)=>{
              this.createImage(item);
            });
            event.currentTarget.value = '';
        },
        createImage(file) {
            let formData = new FormData();
            formData.append('fileType', 'jpg');
            formData.append('file', file);
          var pos = file.name.lastIndexOf('.');
          var selfName = file.name.substr(0,pos);
          var selfType = file.name.substr(pos+1,file.name.length-1);
            this.$http.post(api_prefix + "common/file/upload", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((res) => {
                let picUrl = res.body.body.key;
                this.$http.post(api_prefix + 'attach/save', {
                    pAlbumId: this.pAlbumId,
                    pOssName: picUrl,
                    pPicType: selfType,
                    pPid: this.pid,
                    pRealName: selfName,
                    pSize: '11',
                    pType: this.pType,
                    puserId:1,  //临时测试
                    pageSize: 1
                }).then(response => {
                    if (response.data.code == 0) {
                        this.attachs.push(picUrl);
                        this.attachIdArr.push( response.data.body.id);
                    } else {
                        this.$alert(response.data.message, '温馨提示', {
                            confirmButtonText: '确定',
                            callback: action => { }
                        });
                    }
                }, response => {
                    console.log('出错了');
                });
            });
        },
        delImage(url, index) {
            if (this.attachs.length > 0) {
                this.$http.post(api_prefix + '/attach/delete', {
                    id: this.attachIdArr[index]
                }).then(response => {
                    if (response.data.code == 0) {
                        this.attachs.splice(index, 1);
                        this.attachIdArr.splice(index, 1);
                    } else {
                        this.$alert(response.data.message, '温馨提示', {
                            confirmButtonText: '确定',
                            callback: action => { }
                        });
                    }
                }, response => {
                    console.log('出错了');
                });
            }
        },
        saveToAblum() {
          this.clearPicAttachArr();
            this.getPicData();
            this.alertPicFlag = false;
        }
    },
    components: {
        jdyAlert
    }
}
</script>

<style>

</style>
