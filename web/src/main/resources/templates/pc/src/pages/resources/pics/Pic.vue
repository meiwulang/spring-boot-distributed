<template>
    <div class="jdy-content jdy-resources fleft jl-trip jl-pic">
        <div class="jdy-content-inner-trip">
            <div class="resources-tab">
                <div>
                    <div class="inlineblock mr10">
                        <el-select v-model="search.select" @change="getChangeSort" clearable placeholder="资源类型" class="jdy-search-edit hasbg mr10">
                            <el-option v-for="item in sortData" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                        <el-cascader placeholder="资源选择" :options="options" clearable v-model="selectedOptions" @change="handleChange" :props="props" style="width:200px;">
                        </el-cascader>
                    </div>
                    <div class="inlineblock mr10 ">
                        快速搜索：
                        <el-input placeholder="相册名称" v-model="search.adress" class="w200" @change="getSearchValue">
                        </el-input>
                    </div>
                    <el-button type="primary" @click="getChangeaName" class="el-button btnbg el-button--primary btnInTab">搜索</el-button>
                </div>
                <div>
                    <el-button type="default" class="btnInTab" @click="updatePage" v-loading.fullscreen.lock="fullscreenLoading">刷新</el-button>
                    <el-button type="primary" class="btnInTab" @click="upload(0,{item:'no'})">上传照片</el-button>
                </div>
            </div>
            <div class="picwrap plr10 mt10">
                <ul>
                    <li class="clearfix jl-picList" v-for="(item,index) in picData">
                        <router-link :to="{ name: 'picdetail',query: {id: item.id,aname:item.aName,picNum:item.albumExt.attachTotal,pid:item.aPid,type:item.aType}}">
                            <div class="picwrap-img relative">
                                <!-- <img :src="item.imgUrl" alt=""> -->
                                <img :src="item.albumExt.attachUrl" alt="" v-if="item.albumExt.attachUrl">
                                <img src="../../../assets/images/noablum.png" alt="" v-if="!item.albumExt.attachUrl">
                            </div>
                            <div class="picwrap-bottom">
                                <p class="fl" style="width:65%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display:inline-block">{{item.aName}}</p>
                                <span class="fr" style="margin-right:10px">{{item.albumExt.attachTotal}}张</span>
                            </div>
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>
        <!-- 分页   begin-->
        <div class="clearfix">
            <el-pagination class="fright picPage" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper" :total="tableDataTotal">
            </el-pagination>
        </div>
        <!-- 分页   end-->        
        <jdy-alert title="上传图片" @closeAlert="closePics" v-if="alertPicFlag" class="alertTag dialog-upload-pic" style="width:950px;">
            <div class="clearfix">
                <div class="psearch alertTagTop pl10">
                    <div class="inlineblock mr10 mb10">
                        上传到：
                        <el-select v-model="uploadForm.select" @change="getChangeSortUp" clearable placeholder="资源类型" class="jdy-search-edit hasbg">
                            <el-option v-for="item in sortData" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="inlineblock">
                        名称：
                        <el-select v-model="uploadForm.pAlbumId" filterable placeholder="请选择相册名称"  clearable :filter-method="getChangeaNameUp" @change="getPicList">
                            <el-option v-for="item in picDataUp" :key="item.id" :label="item.aName" :value="item.id" >
                                <div @click='getppid(item.aPid,item.aName)' >{{item.aName}}</div>
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="mt10 clearfix scroll-cont">
                    <div class="jl-localPic">
                        <label for="fileUpload">
                            <div class="el-upload el-upload--picture-card">
                                <input type="file" name="file" id="fileUpload" class="el-upload__input"  multiple="multiple"  accept="image/*" v-on:change="changecover($event)">
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
                    <el-button type="primary" class="fright mt10" @click="closePics">
                        <span>关闭</span>
                    </el-button>
                    <!--<button type="button" class="el-button fright mt10 mr10 el-button&#45;&#45;primary" @click="saveToAblum">
                        <span>保存</span>
                    </button>-->
                </div>
            </div>
        </jdy-alert>

        <jdy-alert title="放大图片" @closeAlert="closePics2" v-if="alertPicFlag2" class="alertJournal alertPics2">
            <div class="alertimgss clearfix">
                <i class="el-icon-arrow-left alertimgss-icon"></i>
                <i class="el-icon-arrow-right alertimgss-icon"></i>
                <div class="alertimgss-center">
                    <img src="../../../assets/images/logo.jpg" alt="">
                </div>
            </div>
        </jdy-alert>
    </div>
</template>


<script>
import jdyAlert from '@/components/Alert';
import P from './p.js';
export default {
    name: "pic",
    data() {
        return {
            options: [],
            props: {
                value: 'name',
                label: 'name',
                children: 'children'
            },//数据配置
            selectedOptions: [],
            dialogImageUrl: '',
            dialogVisible: false,
            alertPicFlag: false,
            alertPicFlag2: false,
            aname: '',
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
                select: '景点',
                pAlbumId: ''
            },
            attachs: [],
            picData: [],
            picDataUp: [],
            showPicHover: false,
            SortUpValue: '',
            ablumId: '',
            picType: 1,
            pPid: '',
            attachIdArr: [],
            fullscreenLoading: false,
            tableDataTotal: 0,
            pageSize: 20,
            currentPage: 1,
            fileName: '',
            ablumValue: '景点',
            uploadImageList:[],
        }
    },
    updated() {
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
        this.getHotel();
        console.log(this.ablumValue,'this.ablumValue3')
        this.$http.post(api_prefix + '/album/list', {
            aType: 1,
            currPage: this.currentPage,
            pageSize: 20
        }).then(response => {
            if (response.data.code == 0) {
                let data = response.data.body;
                this.picData = data.resultList;
                this.picDataUp = data.resultList;
                this.tableDataTotal = data.totalNum
                this.picType = 1;
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
        updatePage() {
            this.fullscreenLoading = true;
            setTimeout(() => {
                this.fullscreenLoading = false;
                this.$message({
                    showClose: true,
                    message: '刷新成功',
                    type: 'success'
                });
            }, 1000);
            this.$http.post(api_prefix + '/album/list', {
                aType: 1,
                currPage: 1,
                pageSize: 20
            }).then(response => {
                if (response.data.code == 0) {
                    let data = response.data.body;
                    this.picData = data.resultList;
                    this.tableDataTotal = data.totalNum
                    this.picType = 1;
                    this.search.select = '景点'
                    this.getHotel();
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
        getppid(apid, aname) {
            this.pPid = apid;
            this.aname = aname
            console.log('this.pPid', this.pPid)
        },
        getChangeSort(value) {//添加图片弹窗根据类别选择获取默认相册名称
            console.log(value)
            console.log(111111)
            if (value == '景点') {
                this.$http.post(api_prefix + '/album/list', {
                    aType: 1,
                    currPage: this.currentPage,
                    pageSize: 20
                }).then(response => {
                    if (response.data.code == 0) {
                        let data = response.data.body;
                        this.picData = data.resultList;
                        this.tableDataTotal = data.totalNum
                        this.picType = 1;
                        this.getHotel();
                        console.log(this.picData)
                        this.ablumValue = '景点';
                        console.log(this.ablumValue,'this.ablumValue')
                    } else {
                        this.$alert(response.data.message, '温馨提示', {
                            confirmButtonText: '确定',
                            callback: action => { }
                        });
                    }
                }, response => {
                    console.log('出错了');
                });
            } else {
                this.$http.post(api_prefix + '/album/list', {
                    aType: 0,
                    currPage: this.currentPage,
                    pageSize: 20
                }).then(response => {
                    if (response.data.code == 0) {
                        let data = response.data.body;
                        this.picData = data.resultList;
                        this.tableDataTotal = data.totalNum
                        this.picType = 0;
                        this.getHotel();
                        console.log(this.picData)
                        this.ablumValue = '酒店';
                        console.log(this.ablumValue,'this.ablumValue')
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
        getSearchValue(value) {//获取搜索框内的值
            this.searchValue = value
            console.log(this.searchValue)
        },
        getChangeaName() {//搜索相册名称获取相应相册名称
            console.log()
            console.log(this.picType, 'this.pType1')
            this.$http.post(api_prefix + '/album/list', {
                aType: this.picType,
                aName: this.searchValue,
                currPage: this.currentPage,
                pageSize: 20
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
        getChangeaNameUp(val) {//搜索相册名称获取相应相册名称
            console.log(val)
            console.log(this.picType, 'this.pType2')
            this.$http.post(api_prefix + '/album/list', {
                aType: this.picType,
                aName: val
            }).then(response => {
                if (response.data.code == 0) {
                    let data = response.data.body;
                    this.picDataUp = data.resultList;
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
        getPicList(value) {
            this.ablumId = value
            console.log(this.ablumId, 'this.ablumId')
        },
        handleChange(value) {
            console.log(value);
            this.searchValue = value[2]
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
            this.uploadForm.select = this.search.select;
            this.uploadForm.pAlbumId = '';
            this.$nextTick(function () {
                jdyFn.setAlertStyle('alertPics');
            });
        },
        showbig(index, item) {
            this.alertPicFlag2 = true;
            this.$nextTick(function () {
                jdyFn.setAlertStyle('alertPics2');
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
        closePics(){
          $('.alertbgg').remove();
          this.alertPicFlag = !this.alertPicFlag;
          //this.picDataUp = [];
          this.uploadForm.pAlbumId = '';
          this.getChangeaNameUp('');
          if(this.attachs.length>0){
            this.clearPicAttachArr();
            this.saveToAblum();
          }
        },
        closePics1() {
            $('.alertbgg').remove();
            this.alertPicFlag = !this.alertPicFlag;
            this.attachs = [];
            this.uploadForm.pAlbumId = '';
        },
        closePics2() {
            this.alertPicFlag2 = !this.alertPicFlag2;
        },
        handleCurrentChange(val) {
            if (val) {
                this.currentPage = val;
                console.log(this.ablumValue,'this.ablumValue2')
                this.getChangeSort(this.ablumValue);
            }
        },
        getSortUpValue(){
          if (this.uploadForm.select == '酒店') {
            this.SortUpValue = 2;
          } else {
            this.SortUpValue = 3;
          }
        },
        isSelected(){
          this.getSortUpValue();
          if(this.uploadForm.select ==='' ){
            this.$alert('请选择资源类型！', '温馨提示', {
              confirmButtonText: '确定',
              callback: action => { }
            });
            return false;
          }
          else if(this.uploadForm.pAlbumId ===''){
            this.$alert('请选择相册名称！', '温馨提示', {
              confirmButtonText: '确定',
              callback: action => { }
            });
            return false;
          }
          else{
            return true;
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
          this.isSelected();
          if(!this.isSelected()){
            return false;
          }
            console.log($event)
            var files = event.currentTarget.files || event.dataTransfer.files;
            var fileName = event.currentTarget.value;
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
            this.$http.post(api_prefix + "/common/file/upload", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((res) => {
                console.log(res)
                let picUrl = res.body.body.key;
                this.$http.post(api_prefix + '/attach/save', {
                    pAlbumId: this.ablumId,
                    pOssName: picUrl,
                    pPicType: selfType,
                    pPid: this.pPid,
                    pRealName: selfName,
                    pSize: '11',
                    pType: this.SortUpValue,
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
        getChangeSortUp(value) {
            this.uploadForm.pAlbumId = '';
            if (value == '酒店') {
                this.SortUpValue = 2;
            } else {
                this.SortUpValue = 3;
            }
            console.log(this.SortUpValue, '上传到')
        },
        saveToAblum() {
            this.$router.push({ name: 'picdetail', query: { id: this.ablumId, aname: this.aname,pid:this.pPid,type:this.SortUpValue } })
        },
        getHotel() {
            if (this.picType == 0) {
                this.$http.post(api_prefix + '/hotel/hotelList', {}).then(response => {
                    if (response.data.code == 0) {
                        let data = response.data.body;
                        for (let i in data) {
                            if (data[i].children && data[i].children.length <= 0) {
                                delete data[i].children
                            }
                        }
                        this.options = data;
                        console.log(this.options, 'options')
                    } else {
                        this.$alert(response.data.message, '温馨提示', {
                            confirmButtonText: '确定',
                            callback: action => { }
                        });
                    }
                }, response => {
                    console.log('出错了');
                });
            } else {
                this.$http.post(api_prefix + '/scenic_spot/scenicList', {}).then(response => {
                    if (response.data.code == 0) {
                        let data = response.data.body;
                        for (let i in data) {
                            if (data[i].children && data[i].children.length <= 0) {
                                delete data[i].children
                            }
                        }
                        this.options = data;
                        console.log(this.options, 'options')
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
        }
    },
    components: {
        jdyAlert
    }
}
</script>

<style scoped>
.picPage{
    margin: 10px 10px 20px 0
}
</style>
