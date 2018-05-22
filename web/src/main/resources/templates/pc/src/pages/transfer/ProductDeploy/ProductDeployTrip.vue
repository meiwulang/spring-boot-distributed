<template>
  <div class="jdy-content jdy-transfer fleft noborder jl-trip" v-if="flag">
    <div class="jdy-content-inner-trip">
      <el-row class="jdy-content-inner-trip border pt10 pl10 pr10">
        <inner-header :activename="headerData.name" :savebtn="headerData.btnFlag" :showTripTab="headerData.showBtnInTabFlag" @savedata="onSubmit('ruleForm')"></inner-header>
      </el-row>
      <!--jdy-content-trip end-->
      <div class="h20 mainbg"></div>
      <div class="tripbox clearfix border relative">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="">
          <div class="tripbox-top">
            <el-col :span="12" class="mt10" style="margin-left:-30px;">
              <el-form-item label="行程天数:">
                <el-input-number v-model="ruleForm.pDays" class="all" @change="setDays" :min="1" :disabled="true"></el-input-number>
                <!-- <el-input v-model="form.days"></el-input> -->
              </el-form-item>
            </el-col>
          </div>
          <div class="tripbox-left absolute">
            <el-steps direction="vertical" :active="1" :space="785">
              <template v-for="(item,index) in ruleForm.pDays">
                <el-step style="height: 785px">{{item}}</el-step>
              </template>
            </el-steps>
          </div>
          <!--tripbox-left end-->
          <template v-for="(tripsItem,index) in ruleForm.trips">
            <div class="tripbox-right mt30" @click="getIndex(index)">
              <div class="hiddens">{{index}}</div>
              <el-row>
                <el-col :span="18">
                  <el-form-item label="出发地/目的地：" prop="address" class="onfocusInput">
                    <input type="text" v-model="tripsItem.tFromTo" placeholder="出发地/目的地" :disabled="true" :id="'focusInput'+index" class="el-input__inner">
                  </el-form-item>
                </el-col>
                <el-col :span="5" class="mt7 pl15">
                  <span class="icon2 icon2-i inlineblock icon2-cruise active" title="邮轮" @click="setVehicle(index,1)"></span>
                  <span class="icon2 icon2-i inlineblock icon2-aircraft active" title="飞机" @click="setVehicle(index,2)"></span>
                  <span class="icon2 icon2-i inlineblock icon2-train active" title="火车" @click="setVehicle(index,3)"></span>
                  <span class="icon2 icon2-i inlineblock icon2-bus active" title="巴士" @click="setVehicle(index,4)"></span>
                  <span class="icon2 icon2-i inlineblock icon2-car active" title="汽车" @click="setVehicle(index,5)"></span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item label="用餐情况：" prop="haveMeals">
                    <el-checkbox-group v-model="tripsItem.haveMeals" @change="getChangeEating(index)">
                      <template scope="scope">
                        <el-checkbox label="早餐" :disabled="true"></el-checkbox>
                        <el-checkbox label="午餐" :disabled="true"></el-checkbox>
                        <el-checkbox label="晚餐" :disabled="true"></el-checkbox>
                      </template>
                    </el-checkbox-group>
                  </el-form-item>
                </el-col>
                <el-col :span="16">
                  <el-input v-model="tripsItem.tMealsRemark" placeholder="备注" @change="getEatRemark" :maxlength = 30 :disabled="true"></el-input>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="16">
                  <el-form-item label="住宿情况：" prop="accommodation">
                    <div>
                      <el-select v-model="tripsItem.phHotelIds" multiple filterable :disabled="true" no-data-text="请输入进行搜索" placeholder="请输入酒店名称，拼音码" :filter-method="getChangeLive" @change="pushHotelIds" style="width: 100%">
                        <el-option v-for="item in tripsItem.hotel" :key="item.id" :label="item.hName" :value="item.id" @click="changeHotel(item.id)">
                        </el-option>
                      </el-select>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="6" prop="tHotelRemark">
                  <el-input v-model="tripsItem.tHotelRemark" placeholder="备注" @change="getRoomRemark" style="margin-left:10px;" :maxlength = 30 :disabled="true"></el-input>
                </el-col>
                <el-col :span="2">
                  <el-button class="btnbg fr" @click="UniteBtn(tripsItem.phHotelIds,tripsItem.hotel,tripsItem.tHotelRemark)" style="margin-left:10px;" :disabled="true">同步住宿信息</el-button>
                </el-col>
              </el-row>
              <el-row>
                <el-form-item label="游玩景点：">
                  <el-select v-model="tripsItem.phScenicIds" multiple filterable :disabled="true" no-data-text="请输入进行搜索" placeholder="请输入景点名称，拼音码" :filter-method="getChangeView" style="width: 100%" @change="pushScenicIds">
                    <el-option v-for="item in tripsItem.scenicspot" :key="item.id" :label="item.sName" :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="简易行程：">
                  <el-input v-model="tripsItem.tSimpleTrip" maxlength = 500 type="textarea" placeholder="简易行程" @change="getEasyTrip" :disabled="true"></el-input>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="详细行程：">
                  <jdy-editor :content="tripsItem.tDetailTrip" attr="tDetailTrip" :index="index" @input="editorUpdate"></jdy-editor>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label=" ">
                  <a href="javascript:;">
                    <p class="absolute bendip blue jl-picBox">图片库</p>
                  </a>
                  <div class="jl-localPic" v-show="tripsItem.attachs.length < 4">
                    <label :for="'fileUpload'+index">
                      <div class="el-upload el-upload--picture-card" style="color:#20a0ff">
                        <input type="file" name="file" :id="'fileUpload'+index" class="el-upload__input">
                        本地上传
                      </div>
                    </label>
                  </div>
                  <div v-for="(item,key) in tripsItem.attachs" class="jl-upLoadPic">
                    <img :src="item" class="ifImg">
                    <div class="jl-upLoadPicHover" v-show="showPicHover">
                      <i class="el-icon-delete2" @click="delImage(key,index)"></i>
                    </div>
                  </div>
                </el-form-item>
              </el-row>
            </div>
            <!--tripbox-right end-->
          </template>
        </el-form>
      </div>
      <!--tripbox end-->
      <!--改变标签样式 begin-->
      <jdy-alert title="添加图片" @closeAlert="alertTag" v-if="alertTagFlag" class="alertTag" style="width:850px">
        <el-form :model="addTagStyle" :rules="rules" ref="addTagStyle" label-width="90px">
          <el-row class="alertTagTop">
            <el-col :span="6">
              <el-form-item label="资源分类：">
                <el-select @change="getChangeSort" clearable placeholder="请选择类型" class="jdy-search-edit hasbg mr10" v-model="addTagStyle.sort">
                  <el-option v-for="item in sortData" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="名称：">
                <el-select v-model="addTagStyle.pAlbumId" clearable filterable placeholder="请选择相册名称" :filter-method="getChangeaName" @change="getPicList">
                  <el-option v-for="item in picData" :key="item.id" :label="item.aName" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-input v-model="addTagStyle.picName" placeholder="请输入图片名称" @change="getPicName" style="margin-left:20px"></el-input>
            </el-col>
            <el-col :span="5">
              <el-button type="primary" class="btnbg fr addBtn" style="margin-right:10px;width:100px" @click="getSearchPicList()">
                查询
              </el-button>
            </el-col>
          </el-row>
          <el-row class="alertTagMain">
            <div v-for="(item,index) in photoListData" @click="getChangePicList(item.id,item.pOssName,index)" class="photoList">
              <input type="checkbox" :class="'picIndex'+index">
              <div class="imglist">
                <img :src="item.pOssName">
              </div>
            </div>
          </el-row>
          <el-row class="alertTagFooter">
            <el-button type="primary" class="btnbg fl addBtn" style="margin-left:10px;width:100px" @click="saveToTrip()">
              保存到行程
            </el-button>
            <!-- 分页   begin-->
            <div class="clearfix">
              <el-pagination class="fright" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSizeAll" layout="prev, pager, next, jumper" :total="tableDataTotal">
              </el-pagination>
            </div>
            <!-- 分页   end-->
          </el-row>
        </el-form>
      </jdy-alert>
      <!--改变标签样式 end-->
    </div>
    <!--jdy-content-inner end-->
  </div>
  <!--jdy-content end-->
</template>

<script>
import jdyCalendar from "@/components/Calendar";
import jdyEditor from "@/components/Quilleditor";
import jdyAlert from "@/components/Alert";
// 通用tab页
import innerHeader from './header';
export default {
  name: "trip",

  components: {
    jdyCalendar,
    jdyEditor,
    jdyAlert,
    innerHeader
  },
  data() {
    return {
      headerData:{
        name:"ProductDeployTrip",
        btnFlag:false,
        showBtnInTabFlag:this.$route.query.tripFlag,
      },
      btnFlag:false,
      focusStatus:false,
      tripObj: {
        tFromTo: '',
        tMeals: "",
        tMealsRemark: null,
        phHotelIds: [],
        haveMeals: [],
        tHotelRemark: null,
        tSimpleTrip: null,
        "tDetailTrip ": null,
        dialogImageUrl: null,
        dialogVisible: false,
        vehicle: null,
        phScenicIds: [],
        attachs: []
      },
      msg: "trip",
      easyTripValue: "",
      action: "common/file/upload",
      picArry: [],
      picNameArry: [],
      // showPlus: [true],
      uploadImages: [],
      showPicHover: false,
      isSearch: false,
      ruleForm: {
        tProductId: this.$route.query.id,
        tType: 0,
        puserId: 1,
        pDays: 1,
        trips: [
          {
            haveMeals: [],
            tFromTo: "",
            tMeals: "",
            tMealsRemark: "",
            phHotelIds: [],
            tHotelRemark: "",
            tSimpleTrip: "",
            tDetailTrip: "",
            dialogImageUrl: "",
            dialogVisible: true,
            vehicle: "",
            phScenicIds: [],
            attachs: [],
            hotel: []
          }
        ]
      },
      scienspotFlag: false,
      rules: {},
      accommodationOption: [],
      dialogImageUrl: "",
      dialogVisible: false,
      viewData: [],
      picData: [],
      photoListData: [],
      picListData: [],
      alertTagFlag: false,
      alertIndex: 0,
      currentPage: 1,
      tableDataTotal: 0,
      pageSizeAll: 20,
      addTagStyle: {
        sort: "景点",
        pAlbumId: "",
        picName: "",
        picList: []
      },
      sortData: [
        {
          value: "酒店",
          label: "酒店"
        },
        {
          value: "景点",
          label: "景点"
        }
      ],
      forceUpdateViewArray: [1],
      isUpdate: false,
      flag: false,
      isAdd: "",
      getPic: "",
      newId: "",
      oldId: "",
      pAlbumIdPage: ""
    };
  },
  mounted() {
    this.newId = this.$route.query.id;
    console.log(this.newId, "this.newId");
    this.oldId = this.$route.query.copyId;
    console.log(this.oldId, "this.oldId");
    this.$nextTick(() => {
      // console.log(this.showPlus[index],'showPlus[index]')
      this.$http
        .post(api_prefix + "/album/list", {
          aType: 1
        })
        .then(
          response => {
            if (response.data.code == 0) {
              let data = response.data.body;
              this.picData = data.resultList;
              this.pType = 1;
              console.log(this.picData);
            } else {
              this.$alert(response.data.message, "温馨提示", {
                confirmButtonText: "确定",
                callback: action => {}
              });
            }
          },
          response => {
            console.log("出错了");
          }
        );
      if (this.$route.query.copyId) {
        this.$http
          .post(api_prefix + "/trip/list", {
            tProductId: this.oldId,
            tType: 0
          })
          .then(
            response => {
              if (response.data.code == 0) {
                if (response.data.body.trips.length > 0) {
                  this.isAdd = true;
                  console.log("fuzhi");
                  console.log(
                    this.ruleForm.trips.length,
                    "this.ruleForm.trips.length"
                  );
                  console.log(this.ruleForm.trips, "this.ruleForm.trips");
                  this.ruleForm = response.data.body;
                  this.ruleForm.pDays = this.ruleForm.trips.length;
                  this.ruleForm.tType = 0;
                  this.ruleForm.tProductId = this.$route.query.id;
                  this.ruleForm.puserId = 1;
                  if (this.ruleForm.trips.length > 0) {
                    this.rebuildFormData(this.ruleForm.trips);
                  }
                } else {
                  this.isAdd = true;
                  console.log("fuzhi");
                  this.ruleForm.pDays = 1;
                }
              } else {
                this.$alert(response.data.message, "温馨提示", {
                  confirmButtonText: "确定",
                  callback: action => {}
                });
              }
              this.flag = true;
            },
            response => {
              console.log("出错了");
            }
          );
      } else {
        this.$http
          .post(api_prefix + "/trip/list", {
            tProductId: this.newId,
            tType: 0
          })
          .then(
            response => {
              if (response.data.code == 0) {
                if (response.data.body.trips.length > 0) {
                  this.isAdd = false;
                  console.log("bianji");
                  console.log(
                    this.ruleForm.trips.length,
                    "this.ruleForm.trips.length"
                  );
                  console.log(this.ruleForm.trips, "this.ruleForm.trips");
                  this.ruleForm = response.data.body;
                  this.ruleForm.pDays = this.ruleForm.trips.length;
                  this.ruleForm.tType = 0;
                  this.ruleForm.tProductId = this.$route.query.id;
                  this.ruleForm.puserId = 1;
                  if (this.ruleForm.trips.length > 0) {
                    this.rebuildFormData(this.ruleForm.trips);
                  }
                } else {
                  this.isAdd = true;
                  console.log("xinzeng");
                  this.ruleForm.pDays = 1;
                }
              } else {
                this.$alert(response.data.message, "温馨提示", {
                  confirmButtonText: "确定",
                  callback: action => {}
                });
              }
              this.flag = true;
            },
            response => {
              console.log("出错了");
            }
          );
      }
    });
  },
  computed: {
    imgUploadPath() {
      return api_prefix + this.action;
    }
  },
  updated() {
    $(".jl-upLoadPic").mouseenter(function() {
      $(this)
        .find(".jl-upLoadPicHover")
        .css("display", "inline-block");
    });
    $(".jl-upLoadPic").mouseleave(function() {
      $(this)
        .find(".jl-upLoadPicHover")
        .css("display", "none");
    });
  },
  methods: {
    getIndex(index) {
      this.alertIndex = index;
      console.log(this.alertIndex);
    },
    //处理景点
    rebuildScienspot(item) {
      item["phScenicIds"] = [];
      for (let son in item.scenicspot) {
        let option = {
          id: item.scenicspot[son].id,
          sName: item.scenicspot[son].sName
        };
        item.phScenicIds.push(item.scenicspot[son].id);
      }
    },
    //处理酒店
    rebuildHotel(item) {
      item["phHotelIds"] = [];
      for (let son in item.hotel) {
        let option = {
          id: item.hotel[son].id,
          hName: item.hotel[son].hName
        };
        item.phHotelIds.push(item.hotel[son].id);
      }
    },
    //处理tmeals
    rebuildMeals(item) {
      let tMeals = item.tMeals;
      if (tMeals == "111") {
        item.haveMeals = ["早餐", "午餐", "晚餐"];
        return;
      }
      if (tMeals == "110") {
        item.haveMeals = ["早餐", "午餐"];
        return;
      }
      if (tMeals == "011") {
        item.haveMeals = ["晚餐", "午餐"];
        return;
      }
      if (tMeals == "101") {
        item.haveMeals = ["早餐", "晚餐"];
        return;
      }

      if (tMeals == "001") {
        item.haveMeals = ["晚餐"];
        return;
      }
      if (tMeals == "100") {
        item.haveMeals = ["早餐"];
        return;
      }
      if (tMeals == "010") {
        item.haveMeals = ["午餐"];
        return;
      }
      if (tMeals == "000" || tMeals == "") {
        item.haveMeals = [];
        return;
      }
      // let  that=this
      // item.haveMeals.forEach(function(value,index,array){
      //   that.$set(array ,index,value)
      // 　　});
    },
    //重构返回数据
    rebuildFormData(trips) {
      for (let item in trips) {
        this.rebuildMeals(trips[item]);
        // this.rebuildHotel(trips[item])
        // this.rebuildScienspot(trips[item])
      }
      console.log("trips", trips);
      console.log("this", this);
    },
    setVehicle(index, num) {
      //设置交通工具
      var id = 'focusInput'+index;
      $(`#${id}`).focus()
      console.log(this.ruleForm.trips[this.alertIndex].tFromTo, "bbbbb");
      let tFromTo = this.ruleForm.trips[this.alertIndex].tFromTo;
      switch (num) {
        case 1:
          tFromTo = tFromTo + "[邮轮]";
          this.ruleForm.trips[this.alertIndex].tFromTo = tFromTo;
          break;
        case 2:
          tFromTo = tFromTo + "[飞机]";
          this.ruleForm.trips[this.alertIndex].tFromTo = tFromTo;
          break;
        case 3:
          tFromTo = tFromTo + "[火车]";
          this.ruleForm.trips[this.alertIndex].tFromTo = tFromTo;
          break;
        case 4:
          tFromTo = tFromTo + "[巴士]";
          this.ruleForm.trips[this.alertIndex].tFromTo = tFromTo;
          break;
        case 5:
          tFromTo = tFromTo + "[汽车]";
          this.ruleForm.trips[this.alertIndex].tFromTo = tFromTo;
          break;
      }
      console.log(this.ruleForm.trips[this.alertIndex].tFromTo, "hhhhhhh");
    },
    //获取酒店列表
    queryHotelList(companyId) {
      this.$http
        .post(api_prefix + "hotel/list", {
          companyId: 123,
          currPage: 1,
          hName: null,
          pageSize: 15,
          startNum: 0
        })
        .then(
          rsp => {},
          rsp => {
            console.log("出错了");
          }
        );
    },
    getChangeEating(index) {
      //获取用餐情况
      let eatValue = this.ruleForm.trips[index].haveMeals;
      console.log(this.ruleForm.trips[index].haveMeals, "1");
      let eatStr = eatValue.toString();
      if (eatValue.length == 3) {
        this.ruleForm.trips[index].tMeals = "111";
      }
      if (eatValue.length == 2) {
        if (eatStr.indexOf("早餐") > -1 && eatStr.indexOf("午餐") > -1) {
          this.ruleForm.trips[index].tMeals = "110";
        }
        if (eatStr.indexOf("早餐") > -1 && eatStr.indexOf("晚餐") > -1) {
          this.ruleForm.trips[index].tMeals = "101";
        }
        if (eatStr.indexOf("午餐") > -1 && eatStr.indexOf("晚餐") > -1) {
          this.ruleForm.trips[index].tMeals = "011";
        }
      }
      if (eatValue.length == 1) {
        if (eatStr.indexOf("早餐") > -1) {
          this.ruleForm.trips[index].tMeals = "100";
        }
        if (eatStr.indexOf("晚餐") > -1) {
          this.ruleForm.trips[index].tMeals = "001";
        }
        if (eatStr.indexOf("午餐") > -1) {
          this.ruleForm.trips[index].tMeals = "010";
        }
      }
      if(eatValue.length == 0){
        this.ruleForm.trips[index].tMeals = "000";
      }
      console.log(this.ruleForm.trips[index].tMeals, "2");
      // console.log(eatValue)
    },
    getEatRemark(value) {
      //获取用餐情况备注
      this.eatRemark = value;
      console.log(this.eatRemark, "this.eatRemark");
    },
    pushHotelIds(value) {
      //获取pushHotelIds
      console.log(value);
    },
    getRoomRemark(value) {
      //获取住宿情况备注
      this.roomRemark = value;
      console.log(this.roomRemark, "this.roomRemark");
    },
    getEasyTrip(value) {
      //获取简易行程
      if(value.length>=500){
        return  this.$message.info("简易行程不能超过500字！");
      }else{
        this.easyTripValue = value;
      }
    },
    getChangeAddress(value) {
      //获取出发地/目的地
      this.addressValue = value;
      console.log(this.addressValue, "this.addressValue");
    },
    pushScenicIds(value) {
      //获取pushScenicIds
      console.log(value, "景点ID");
    },
    getChangeView(val) {
      //获取景点
      this.$http
        .post(api_prefix + "/scenic_spot/list", {
          sName: val,
          sPym: val
        })
        .then(
          response => {
            if (response.data.code == 0) {
              let data = response.data.body;
              if (data.list) {
                console.log(this.ruleForm.trips[this.alertIndex], "11111");
                this.ruleForm.trips[this.alertIndex].scenicspot = data.list;
                var _item = this.ruleForm.trips[this.alertIndex];
                this.$set(this.ruleForm.trips, this.alertIndex, _item);
              }
            } else {
              this.$alert(response.data.message, "温馨提示", {
                confirmButtonText: "确定",
                callback: action => {}
              });
            }
          },
          response => {
            console.log("出错了");
          }
        );
    },
    getChangeLive(val) {
      //获取住宿情况
      console.log(val);
      this.$http
        .post(api_prefix + "/hotel/list", {
          hName: val,
          hPym: val
        })
        .then(
          response => {
            if (response.data.code == 0) {
              let data = response.data.body;
              if (data.list) {
                console.log(this.ruleForm.trips[this.alertIndex], "11111");
                this.ruleForm.trips[this.alertIndex].hotel = data.list;
                var _item = this.ruleForm.trips[this.alertIndex];
                this.$set(this.ruleForm.trips, this.alertIndex, _item);
              }
              console.log(
                this.ruleForm.trips[this.alertIndex].hotel,
                "2123421"
              );
            } else {
              this.$alert(response.data.message, "温馨提示", {
                confirmButtonText: "确定",
                callback: action => {}
              });
            }
          },
          response => {
            console.log("出错了");
          }
        );
    },
    UniteBtn(val, vals, mark) {
      console.log(val, "zzzzs");
      console.log(vals, "cccccc");
      console.log(this.ruleForm.trips, "sssss");
      for (let item in this.ruleForm.trips) {
        console.log(this.ruleForm.trips[item], "ooo");
        this.ruleForm.trips[item].phHotelIds = val;
        this.ruleForm.trips[item].hotel = vals;
        this.ruleForm.trips[item].tHotelRemark = mark;
        console.log("rrrrr", this.ruleForm.trips[item].phHotelIds);
        console.log("bbbbbbb", this.ruleForm.trips[item].hotel);

        // this.ruleForm.trips[item].phHotelIds = val
      }
    },
    alertTag(index) {
      //关闭,打开添加/编辑标签弹窗
      this.getPic = "";
      this.photoListData = [];
      this.alertIndex = index;
      console.log(this.alertIndex, "alertIndex`1");
      this.alertTagFlag = !this.alertTagFlag;
      if (this.alertTageFlag) {
        this.$nextTick(function() {
          jdyFn.setAlertStyle("alertTag");
        });
      }
      if (this.alertTagFlag == false) {
        this.addTagStyle.picName = "";
        this.addTagStyle.pAlbumId = "";
        this.tableDataTotal = 0;
      }
      this.getPic = this.ruleForm.trips[this.alertIndex].phScenicIds[0];
      if (this.getPic == undefined) {
        this.getPic = "";
      }
      console.log(this.getPic, "this.alertIndex", this.alertIndex);
      if (this.getPic) {
        this.getPicList(this.getPic);
      }
    },
    getChangeSort(value) {
      //添加图片弹窗根据类别选择获取默认相册名称
      console.log(value);
      if (value == "景点") {
        this.$http
          .post(api_prefix + "/album/list", {
            aType: 1
          })
          .then(
            response => {
              if (response.data.code == 0) {
                let data = response.data.body;
                this.picData = data.resultList;
                this.pType = 1;
                console.log(this.picData);
              } else {
                this.$alert(response.data.message, "温馨提示", {
                  confirmButtonText: "确定",
                  callback: action => {}
                });
              }
            },
            response => {
              console.log("出错了");
            }
          );
      } else {
        this.$http
          .post(api_prefix + "/album/list", {
            aType: 0
          })
          .then(
            response => {
              if (response.data.code == 0) {
                let data = response.data.body;
                this.picData = data.resultList;
                this.pType = 0;
                console.log(this.picData);
              } else {
                this.$alert(response.data.message, "温馨提示", {
                  confirmButtonText: "确定",
                  callback: action => {}
                });
              }
            },
            response => {
              console.log("出错了");
            }
          );
      }
    },
    getChangeaName(val) {
      //搜索相册名称获取相应相册名称
      console.log(val);
      this.$http
        .post(api_prefix + "/album/list", {
          aType: this.pType,
          aName: val
        })
        .then(
          response => {
            if (response.data.code == 0) {
              let data = response.data.body;
              this.picData = data.resultList;
              console.log(this.picData);
            } else {
              this.$alert(response.data.message, "温馨提示", {
                confirmButtonText: "确定",
                callback: action => {}
              });
            }
          },
          response => {
            console.log("出错了");
          }
        );
    },
    getPicList(value) {
      //选中相册名称进行数据请求获取相册列表内容
      console.log(value, "相册ID");
      this.pAlbumIdPage = value;
      this.$http
        .post(api_prefix + "/attach/list", {
          pAlbumId: value,
          pageSize: 15,
          currPage: this.currentPage
        })
        .then(
          response => {
            if (response.data.code == 0) {
              let data = response.data.body;
              this.photoListData = data.resultList;
              this.tableDataTotal = data.totalNum;
              console.log(this.photoListData, "photoListData1");
            } else {
              this.$alert(response.data.message, "温馨提示", {
                confirmButtonText: "确定",
                callback: action => {}
              });
            }
          },
          response => {
            console.log("出错了");
          }
        );
    },
    getPicName(value) {
      //获取图片名称
      console.log(value);
      this.picName = value;
    },
    getSearchPicList() {
      //点击查询
      this.isSearch = true;
      this.$http
        .post(api_prefix + "/attach/list", {
          pRealName: this.picName,
          pageSize: 15,
          currPage: this.currentPage
        })
        .then(
          response => {
            currPage: this.currentPage;
            if (response.data.code == 0) {
              let data = response.data.body;
              this.photoListData = data.resultList;
              this.tableDataTotal = data.totalNum;
              console.log(this.photoListData, "photoListData2");
            } else {
              this.$alert(response.data.message, "温馨提示", {
                confirmButtonText: "确定",
                callback: action => {}
              });
            }
          },
          response => {
            console.log("出错了");
          }
        );
    },
    getChangePicList(id, pOssName, index) {
      console.log("选中了", id, pOssName);
      if ($(".picIndex" + index).is(":checked")) {
        $(".picIndex" + index).removeAttr("checked");
        var picindex = $.inArray(pOssName, this.picNameArry);
        if (index >= 0) {
          this.picNameArry.splice(picindex, 1);
          console.log(this.picNameArry);
        }
      } else {
        $(".picIndex" + index).attr("checked", true);
        this.picNameArry.push(pOssName);
        console.log(this.picNameArry);
      }
    },
    saveToTrip() {
      console.log(this.alertIndex, "(this.alertIndex2");
      console.log(this.picNameArry.length, "picNameArry.length");
      console.log(
        this.ruleForm.trips[this.alertIndex].attachs.length,
        "attachs.length"
      );
      console.log(
        this.ruleForm.trips[this.alertIndex].attachs.length +
          this.picNameArry.length,
        "yiqi.length"
      );
      if (
        this.picNameArry.length +
          this.ruleForm.trips[this.alertIndex].attachs.length >
        4
      ) {
        this.$message.error("最多只能上传四张图片!");
      }
      if (
        this.picNameArry.length +
          this.ruleForm.trips[this.alertIndex].attachs.length ==
        4
      ) {
        // this.showPlus[this.alertIndex] = false;
        Array.prototype.push.apply(
          this.ruleForm.trips[this.alertIndex].attachs,
          this.picNameArry
        );
        console.log(this.ruleForm.trips[this.alertIndex].attachs, "图库1");
        this.picNameArry = [];
        console.log(
          this.ruleForm.trips[this.alertIndex].attachs.length,
          "attachs.length"
        );
        this.alertTagFlag = false;
      }
      if (
        this.picNameArry.length +
          this.ruleForm.trips[this.alertIndex].attachs.length <
        4
      ) {
        Array.prototype.push.apply(
          this.ruleForm.trips[this.alertIndex].attachs,
          this.picNameArry
        );
        console.log(this.ruleForm.trips[this.alertIndex].attachs, "图库1");
        this.picNameArry = [];
        console.log(
          this.ruleForm.trips[this.alertIndex].attachs.length,
          "attachs.length"
        );
        this.alertTagFlag = false;
      }
    },
    setDays(value) {
      var pDays = this.ruleForm.pDays;
      let str = JSON.stringify(this.tripObj);
      if (this.ruleForm.trips.length > value) {
        console.log(this.ruleForm.trips.length, "this.ruleForm.trips.length");
        for (let i = this.ruleForm.trips.length; i > value; i--) {
          this.ruleForm.trips.pop();
        }
      } else {
        for (let a = this.ruleForm.trips.length; a < value; a++) {
          this.ruleForm.trips.push(JSON.parse(str));
        }
      }
      console.log(this.ruleForm.trips);
      console.log(pDays);
    },
    editorUpdate(value, attr, index) {
      console.log(index, "sadsad");
      console.log(value, "value");
      this.ruleForm.trips[index].tDetailTrip = value;
      console.log(this.ruleForm.trips);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.picNameArry.push(file);
      this.dialogVisible = true;
    },
    getTripList() {
      this.$http
        .post(api_prefix + "/trip/list", {
          tProductId: this.newId,
          tType: 0
        })
        .then(
          response => {
            if (response.data.code == 0) {
              if (response.data.body.trips.length > 0) {
                this.isAdd = false;
                console.log("bianji");
                console.log(
                  this.ruleForm.trips.length,
                  "this.ruleForm.trips.length"
                );
                console.log(this.ruleForm.trips, "this.ruleForm.trips");
                this.ruleForm = response.data.body;
                this.ruleForm.pDays = this.ruleForm.trips.length;
                this.ruleForm.tType = 0;
                this.ruleForm.tProductId = this.$route.query.id;
                this.ruleForm.puserId = 1;
                if (this.ruleForm.trips.length > 0) {
                  this.rebuildFormData(this.ruleForm.trips);
                }
              } else {
                this.isAdd = true;
                console.log("xinzeng");
                this.ruleForm.pDays = 1;
              }
            } else {
              this.$alert(response.data.message, "温馨提示", {
                confirmButtonText: "确定",
                callback: action => {}
              });
            }
            this.flag = true;
          },
          response => {
            console.log("出错了");
          }
        );
    },
    onSubmitGo() {
      if (this.isAdd == true) {
        console.log("下一步 保存");
        this.btnFlag = true;
        this.$http.post(api_prefix + "trip/save", this.ruleForm).then(
          response => {
            if (response.data.code == 0) {
              this.$message({
                type: "success",
                message: "保存成功!"
              });
              setTimeout(() => {
                this.btnFlag = false;
                this.$router.push({
                  name: "Ticketprice",
                  query: { id: this.$route.query.id }
                });
              }, 500);
            } else {
              this.btnFlag = false;
              this.$alert(response.data.message, "温馨提示", {
                confirmButtonText: "确定",
                callback: action => {}
              });
            }
          },
          response => {
            console.log("出错了");
          }
        );
      } else if (this.isAdd == false) {
        console.log("下一步 更新");
        this.btnFlag = true;
        this.$http.post(api_prefix + "trip/update", this.ruleForm).then(
          response => {
            if (response.data.code == 0) {
              this.$message({
                type: "success",
                message: "保存成功!"
              });
              setTimeout(() => {
                this.btnFlag = false;
                this.$router.push({
                  name: "Ticketprice",
                  query: { id: this.$route.query.id }
                });
              }, 500);
            } else {
              this.btnFlag = false;
              this.$alert(response.data.message, "温馨提示", {
                confirmButtonText: "确定",
                callback: action => {}
              });
            }
          },
          response => {
            console.log("出错了");
          }
        );
      }
    },
    goback(url) {
      if (url == "List") {
        console.log("gotoList");
        this.$confirm("数据未保存，是否关闭？", "温馨提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$router.push({ name: url });
          })
          .catch(() => {});
      } else {
        this.$confirm("数据未保存，是否关闭？", "温馨提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$router.push({
              name: url,
              query: { id: this.$route.query.id }
            });
          })
          .catch(() => {});
      }
    },
    onSubmit() {
      if (this.isAdd == false) {
        console.log("更新");
        this.btnFlag = true;
        this.$http.post(api_prefix + "trip/update", this.ruleForm).then(
          response => {
            if (response.data.code == 0) {
              this.btnFlag = false;
              this.$message({
                type: "success",
                message: "保存成功!"
              });
              this.getTripList();
            } else {
              this.btnFlag = false;
              this.$alert(response.data.message, "温馨提示", {
                confirmButtonText: "确定",
                callback: action => {}
              });
            }
          },
          response => {
            console.log("出错了");
          }
        );
      } else {
        console.log("保存");
        this.btnFlag = true;
        this.$http.post(api_prefix + "trip/save", this.ruleForm).then(
          response => {
            if (response.data.code == 0) {
              this.btnFlag = false;
              this.$message({
                type: "success",
                message: "保存成功!"
              });
              this.getTripList();
            } else {
              this.btnFlag = false;
              this.$alert(response.data.message, "温馨提示", {
                confirmButtonText: "确定",
                callback: action => {}
              });
            }
          },
          response => {
            console.log("出错了");
          }
        );
      }
    },
    getTheIndex(index) {
      this.alertIndex = index;
      console.log(this.alertIndex, "ceshi");
    },
    changecover($event) {
      var files = event.currentTarget.files || event.dataTransfer.files;
      if (!files.length) return;
      console.log(files.length, "files.length");
      console.log($event, "$event");
      if (
        files.length + this.ruleForm.trips[this.alertIndex].attachs.length >
        4
      ) {
        console.log(
          files.length + this.ruleForm.trips[this.alertIndex].attachs.length,
          "files.length + this.picNameArry.length"
        );
        return;
      } else if (
        files.length + this.ruleForm.trips[this.alertIndex].attachs.length ==
        4
      ) {
        console.log(
          files.length + this.ruleForm.trips[this.alertIndex].attachs.length,
          "files.length + this.picNameArry.length"
        );
        // this.showPlus[this.alertIndex] = false;
      } else {
        // this.showPlus[this.alertIndex] = true;
      }
      var fileSize = files[0].size / 1024;
      var fileType = files[0].type.startsWith("image/");
      console.log(fileSize, "fileSize");
      for (let i = 0; i < files.length; i++) {
        if (!fileType) {
          this.$alert("请选择图片上传！", "温馨提示", {
            confirmButtonText: "确定",
            callback: action => {}
          });
        } else if (fileSize > 5120) {
          this.$alert("图片大小不能超过5M！", "温馨提示", {
            confirmButtonText: "确定",
            callback: action => {}
          });
        } else {
          this.createImage(files[i]);
        }
      }
      event.currentTarget.value = "";
    },
    createImage(file) {
      let formData = new FormData();
      formData.append("fileType", "jpg");
      formData.append("file", file);
      this.$http
        .post(api_prefix + "/common/file/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        })
        .then(res => {
          console.log(res);
          let picUrl = res.body.body.key;
          this.ruleForm.trips[this.alertIndex].attachs.push(picUrl);
          console.log(
            this.ruleForm.trips[this.alertIndex].attachs,
            "图库2",
            "this.alertIndex",
            this.alertIndex
          );
          console.log(this.alertIndex, "zuizhong");
        });
    },
    delImage(index, alertindex) {
      console.log(index, "dele index");
      console.log(alertindex, "alertindex index");
      console.log("deleta index", this.alertIndex);
      this.alertIndex = alertindex;
      if (this.ruleForm.trips[this.alertIndex].attachs.length > 0) {
        this.ruleForm.trips[this.alertIndex].attachs.splice(index, 1);
      }
      if (this.ruleForm.trips[this.alertIndex].attachs.length < 4) {
        // this.showPlus[this.alertIndex] = true;
      }
      if (this.ruleForm.trips[this.alertIndex].attachs.length == 4) {
        // this.showPlus[this.alertIndex] = false;
      }
      if (this.ruleForm.trips[this.alertIndex].attachs.length > 0) {
        // this.showPlus[this.alertIndex] = true;
      }
      console.log(this.ruleForm.trips[this.alertIndex].attachs, "图库3");
    },
    handleCurrentChange(val) {
      if (val) {
        var obj = { currentPage: val };
        if (this.isSearch) {
          console.log(1);
          this.getSearchPicList();
        } else {
          console.log(2);
          this.getPicList(this.pAlbumIdPage);
        }
        this.currentPage = val;
      }
    }
  }
};
</script>

