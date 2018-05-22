<template>
    <div class="jdy-content jdy-resources fleft jl-trip jl-pic">
        <div class="jdy-content-inner-trip" style="height:60px;line-height:60px;padding-left:20px">
            <p class="picDetailTitle">{{ablumName}}
                <span>（{{tableDataTotal}}张）</span>
            </p>
            <el-button slot="append" class="btnbg fr mt15" @click="goBack" style="margin-right:10px;width:80px">
                返回
            </el-button>
        </div>
        <div style="background-color:#EDF4F8;height:10px;"></div>
        <div class="jdy-content-inner-trip">
            <div class="jdy-search clearfix p10">
                <el-button type="primary" class="fl mt5" @click="upload(0,{item:'no'})" :disabled="noUpload == 1">上传照片</el-button>
                <el-button type="default" class="fl mt5 mr10" @click="deletePic" v-if='noUpload == 0'>批量删除</el-button>
                <el-button type="default" class="fl mt5" @click="deletePicYes" v-if='noUpload == 1'>删除</el-button>
                <el-button type="default" class="fl mt5 mr10" v-if='noUpload == 1' @click="cancelDelete">取消</el-button>
            </div>

            <div class="picwrap plr10 clearfix">
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
                    <span @click="cancelEdit">取消</span>
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
            <el-pagination class="fright mt10 mr10 mb10" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper" :total="tableDataTotal">
            </el-pagination>
        </div>
        <!-- 分页   end-->
    </div>
</template>


<script>
import jdyAlert from '@/components/Alert';
import P from './p.js';
export default {
    name: "pic",
    data() {
        return {
            ablumName: this.$route.query.aname,
            picNum: this.$route.query.picNum,
            pAlbumId: this.$route.query.id,
            pType: this.$route.query.type,
            pid: this.$route.query.pid,
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
            pPid: this.$route.query.id,
            attachIdArr: [],
            fullscreenLoading: false,
            tableDataTotal: 0,
            pageSize: 20,
            currentPage: 1,
            uploadImageList:[],
        }
    },
    updated() {
        $(".jl-picList").mouseenter(function () {
            console.log('1')
            $(this).find(".editPic").css("display", "inline-block")
        })
        $(".jl-picList").mouseleave(function () {
            console.log('1')
            $(this).find(".editPic").css("display", "none")
        })
        $(".jl-upLoadPic").mouseenter(function () {
            console.log('1')
            $(this).find(".jl-upLoadPicHover").css("display", "inline-block")
        })
        $(".jl-upLoadPic").mouseleave(function () {
            console.log('1')
            $(this).find(".jl-upLoadPicHover").css("display", "none")
        })
    },
    mounted() {
        jdyFn.picHover();
        if (this.pType == 1) {
            this.pType = 3
        } else {
            this.pType = 2
        }
        this.$http.post(api_prefix + '/attach/list', {
            pAlbumId: this.pAlbumId,
            pSize: 20,
            currPage: this.currentPage
        }).then(response => {
            if (response.data.code == 0) {
                let data = response.data.body;
                this.picData = data.resultList;
                this.tableDataTotal = data.totalNum
                console.log(this.picData)
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
        //返回上一页
        goBack() {
            this.$router.go(-1)
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
                    this.tableDataTotal = data.totalNum
                    console.log(this.picData)
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
            $(".jl-picList input").each(function () {
                $(this).is(":checked") && $(this).removeAttr("checked")
            })
            this.noUpload = 0;
            this.showAllDelete = false;
        },
        deletePicYes() {
            this.$confirm('你确定要删除该内容？', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.post(api_prefix + '/attach/batchDelete', this.picIdArry).then(response => {
                    if (response.data.code == 0) {
                        this.cancelDelete();
                        this.getPicData();
                        $(".jl-picList input").each(function () {
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
            console.log('选中了', id, index);
            if ($(".picIndex" + index).is(":checked")) {
                $(".picIndex" + index).removeAttr("checked");
                var picindex = $.inArray(id, this.picIdArry);
                if (index >= 0) {
                    this.picIdArry.splice(picindex, 1);
                    console.log(this.picIdArry, '111111111111111111111');
                }
            } else {
                $(".picIndex" + index).attr("checked", true)
                this.picIdArry.push(id);
                console.log(this.picIdArry, '2222222222222222222');
            }
        },
        toBigPic(picData, index) {
            console.log(picData, 'picData')
            console.log(index, 'index')
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
            console.log(item, '123456')
            console.log(this.picEditItem, '123456')
            this.alertPicName = true;
            this.picNameValue = item.pRealName;
        },
        getNameValue(value) {
            this.picNameValue = value;
            this.picEditItem.pRealName = this.picNameValue;
        },
        saveName() {
            this.$http.post(api_prefix + '/attach/update', this.picEditItem).then(response => {
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
            console.log('id', id)
            this.$confirm('你确定要删除该内容？', '温馨提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$http.post(api_prefix + '/attach/delete', {
                    id: id
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

            });
        },
        handleChange(value) {
            console.log(value);
        },
        goback() {
            location.href = "http://localhost:9090/resources.html#/hotel";
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        delGroup() {
            alert(1)
        },
        getTableData() {

        },
        reset() {
            alert('刷新')
        },
        upload(index, item) {
            this.alertPicFlag = true;
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
            })
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
        handlePictureCardPreview() {

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
            var selfType = file.name.substr(pos+1);
            this.$http.post(api_prefix + "/common/file/upload", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((res) => {
                console.log(res)
                let picUrl = res.body.body.key;
                this.$http.post(api_prefix + '/attach/save', {
                    pAlbumId: this.pAlbumId,
                    pOssName: picUrl,
                    pPicType: selfType,
                    pPid: this.pid,
                    pRealName: selfName,
                    pSize: '11',
                    pType: this.pType,
                    pageSize: 1
                }).then(response => {
                    if (response.data.code == 0) {
                        this.attachs.push(picUrl);
                        this.attachIdArr.push(response.data.body.id);
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
            console.log(url, 'url')
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
            console.log(this.attachs, '图库3')
        },
        saveToAblum() {
            this.clearPicAttachArr();
            this.getPicData();
            this.alertPicFlag = false;
        },
        cancelEdit() {
            this.getPicData()
        }
    },
    components: {
        jdyAlert
    }
}
</script>

<style scoped>

</style>
