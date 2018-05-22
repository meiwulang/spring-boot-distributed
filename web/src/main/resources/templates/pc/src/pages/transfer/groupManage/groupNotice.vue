<template>
  <div class="jl-sale">
    <div class="jdy-content fleft lv-creditBill">
      <div class="jdy-content-inner">
        <div>
          <el-button class="fright mt10" type="primary" @click="changeHref">导出word</el-button>
          <el-button class="fright mt10 mr10" @click="printFn" v-show="showPrint">打印</el-button>
          <el-button class="fright mt10 mr10" @click="save" :disabled="this.btnFlag" v-show="showSave">保存</el-button>
          <el-button class="fright mt10" @click="editPrint" v-show="showBianji">编辑</el-button>
          <el-button class="fright mt10">
            <router-link :to="{name:'groupManage'}">
              <span style="color:#000000">返回</span>
            </router-link>
            </el-button>
        </div>
        <div id="ptintHtml">
          <div class="page-header">
            <div>
              <h1>出团通知书</h1>
              <h3>团号：{{fromData.groupNo}}</h3>
            </div>
            <div>
              <image src="" />
            </div>
          </div>
          <div class="table-wrap">
              <el-row>
                <el-form ref="form" label-width="140px" :model="fromData" v-if="this.showEdit == true">
                    <el-col :span="24">
                        <el-form-item label="线路名称：">
                            <el-input v-model="fromData.productName" :disabled="true"></el-input>  
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="组团社名称：">
                            <el-input v-model="fromData.companyName"></el-input>  
                        </el-form-item>
                        <el-form-item label="游客人数：" prop="uAccount">
                            {{fromData.adultTouristsNum}}大{{fromData.childTouristsNum}}小
                            <!-- <el-input v-model="fromData.childTouristsNum"></el-input> -->
                        </el-form-item>
                        <el-form-item label="接团旗号：" prop="uAccount">
                            <el-input v-model="fromData.banner"></el-input>
                        </el-form-item>
                        <el-form-item label="组团社紧急联系人：" prop="uAccount">
                            <el-input v-model="fromData.emergencyContact"></el-input>
                        </el-form-item>
                        <el-form-item label="集合时间：" prop="uAccount">
                            <el-date-picker
                            v-model="fromData.musterTime"
                            type="datetime"
                            placeholder="选择日期时间"
                            @change="changeMusterTime">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="组团社联系人：">
                            <el-input v-model="fromData.userName"></el-input>  
                        </el-form-item>
                        <el-form-item label="组团社手机：" prop="uAccount">
                            <el-input v-model="fromData.userPhone"></el-input>
                        </el-form-item>
                        <el-form-item label="地接导游及电话：" prop="uAccount">
                            <el-input v-model="fromData.touristGuide"></el-input>
                        </el-form-item>
                        <el-form-item label="联系方式：" prop="uAccount">
                            <el-input v-model="fromData.emergencyCall"></el-input>
                        </el-form-item>
                        <el-form-item label="集合地点：" prop="uAccount">
                            <el-input v-model="fromData.musterPlace"></el-input>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <table class="table-custom" cellspacing="0" cellpadding="0" v-if="this.showEdit == false">
              <tr>
                <th>线路名称</th>
                <td colspan="3">{{fromData.productName}}<p style="font-size:20px;color:red;float:right;border:2px solid red;padding:2px" v-if="fromData.departureStatus == 4">已取消</p></td>
              </tr>
              <tr>
                <th>组团社名称</th>
                <td>{{fromData.companyName}}</td>
                <th>组团联系人</th>
                <td>{{fromData.userName}}</td>
              </tr>
              <tr>
                <th>游客人数</th>
                <td>{{fromData.adultTouristsNum}}大{{fromData.childTouristsNum}}小</td>
                <th>组团社手机</th>
                <td>{{fromData.userPhone}}</td>
              </tr>
              <tr>
                <th>接团旗号</th>
                <td>{{fromData.banner}}</td>
                <th>地接导游及电话</th>
                <td>{{fromData.touristGuide}}</td>
              </tr>
              <tr>
                <th>组团社紧急联系人</th>
                <td>{{fromData.emergencyContact}}</td>
                <th>联系方式</th>
                <td>{{fromData.emergencyCall}}</td>
              </tr>
              <tr>
                <th>集合时间</th>
                <td>{{fromData.musterTime}}</td>
                <th>集合地点</th>
                <td>{{fromData.musterPlace}}</td>
              </tr>
              <tr v-if="fromData.departureStatus == 4">
                <th>取消时间</th>
                <td>{{fromData.cancelTime | dateFormatTwo}}</td>
                <th>取消人员</th>
                <td>{{fromData.cancelUserName}}</td>
              </tr>
              <tr v-if="fromData.departureStatus == 4">
                <th>取消原因</th>
                <td colspan="3">{{fromData.cancelComment}}</td>
              </tr>
            </table>
          </div>
          <div class="page-header">
            <h3 style="display:inline-block">航班信息</h3> 
            <!-- <div class="mt10"></div>c -->
            <el-button class="fright mt10" @click="addFlight" v-if="showAddFlight == true">添加交通信息</el-button>
          </div> 
            <el-table ref="multipleTable" :data="planeData" border tooltip-effect="dark" style="width: 100%;margin-bottom:15px" v-show="this.showEdit == true">
                <el-table-column label="交通类目" min-width="70" >
                    <template scope="scope">
                        <el-select v-model="planeData[scope.$index].lineType">
                            <el-option :key="0" label="出团" :value="0">
                            </el-option>
                            <el-option :key="2" label="回团" :value="2">
                            </el-option>
                            <el-option :key="1" label="中转" :value="1">
                            </el-option>                            
                        </el-select>
                    </template>
                </el-table-column> 
                <el-table-column label="交通方式" min-width="80" >
                    <template scope="scope">
                        <el-select v-model="planeData[scope.$index].flightType">
                            <el-option :key="1" label="飞机" :value="1">
                            </el-option>
                            <el-option :key="2" label="火车" :value="2">
                            </el-option>
                            <el-option :key="3" label="邮轮" :value="3">
                            </el-option>   
                            <el-option :key="4" label="汽车" :value="4">
                            </el-option>                          
                        </el-select>
                    </template>
                </el-table-column> 
                <el-table-column label="第几天" min-width="50" >
                    <template scope="scope">
                        <el-input v-model="planeData[scope.$index].sortDay"></el-input>
                    </template>
                </el-table-column>                         
                <el-table-column label="交通信息" min-width="100" >
                    <template scope="scope">
                        <el-input v-model="planeData[scope.$index].flightNum"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="出发地" min-width="60" >
                    <template scope="scope">
                        <el-input v-model="planeData[scope.$index].departurePlace"></el-input>
                    </template>
                </el-table-column>                    
                <el-table-column label="目的地"  min-width="60">
                    <template scope="scope">
                        <el-input class="inputGeneral"  v-model="planeData[scope.$index].destination"></el-input>
                    </template>
                </el-table-column>    
                <el-table-column label="出发时间" min-width="175" >
                    <template scope="scope">
                        <!-- <el-input v-model="scope.row.flightTime"></el-input> -->
                        <el-date-picker
                        v-model="planeData[scope.$index].flightTime"
                        type="datetime"
                        placeholder="选择日期时间">
                        </el-date-picker>
                    </template>
                </el-table-column>                    
                <el-table-column label="抵达时间"  min-width="175">
                    <template scope="scope">
                        <el-date-picker
                        v-model="planeData[scope.$index].arrivalTime"
                        type="datetime"
                        placeholder="选择日期时间"
                        @change="changeDate">
                        </el-date-picker>
                    </template>
                </el-table-column>   
                <el-table-column prop="aStatus" label="操作" width="50">
                  <template scope="scope">
                      <el-button type="default" class="red" size="mini" @click="goCancel([scope.$index])" v-if="scope.row.lineType == 2">
                          删除
                      </el-button>
                  </template>
                </el-table-column>                                     
            </el-table>
            <el-table ref="multipleTable" :data="planeData" border tooltip-effect="dark" style="width: 100%;margin-bottom:15px;" v-show="this.showEdit == false">
                <el-table-column label="交通类目" min-width="80" >
                    <template scope="scope">
                        <span class="jl-noticeTitle">{{scope.row.lineType | lineTypeFilter}}</span>
                    </template>
                </el-table-column> 
                <el-table-column label="交通方式" min-width="80" >
                    <template scope="scope">
                        <span class="jl-noticeTitle">{{scope.row.flightType | flightTypeFilter}}</span>
                    </template>
                </el-table-column> 
                <el-table-column label="第几天" min-width="80" >
                    <template scope="scope">
                        <span class="jl-noticeTitle">{{scope.row.sortDay}}</span>
                    </template>
                </el-table-column>                         
                <el-table-column label="交通信息" min-width="150" >
                    <template scope="scope">
                        <span class="jl-noticeTitle">{{scope.row.flightNum}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="出发地" min-width="80" >
                    <template scope="scope">
                        <span class="jl-noticeTitle">{{scope.row.departurePlace}}</span>
                    </template>
                </el-table-column>                    
                <el-table-column label="目的地"  min-width="80">
                    <template scope="scope">
                        <span class="jl-noticeTitle">{{scope.row.destination}}</span>
                    </template>
                </el-table-column>    
                <el-table-column label="出发时间" min-width="130" >
                    <template scope="scope">
                        <span class="jl-noticeTitle">{{scope.row.flightTime}}</span>
                    </template>
                </el-table-column>                    
                <el-table-column label="抵达时间"  min-width="130">
                    <template scope="scope">
                        <span class="jl-noticeTitle">{{scope.row.arrivalTime}}</span>
                    </template>
                </el-table-column>                                       
            </el-table>   
          <div class="page-header">
            <h3>线路行程</h3> 
            <!-- <div class="mt10"></div>c -->
          </div>    
          <div class="table-wrap table2">
            <table class="table-custom" cellspacing="0" cellpadding="0" v-if="tableData.trips">
              <template v-for="tripItem in tableData.trips">
                <tr>
                  <th class="blue-font">
                    <strong>{{tripItem.tripsDay}} {{tripItem.tFromTo}}</strong>
                  </th>
                </tr>
                <tr>
                  <td><p v-html="tripItem.tDetailTrip"></p></td>
                </tr>
                <tr>
                  <td class="div2">
                    <div class="borderR">
                      <strong>用餐：</strong> {{tripItem.mealsInfo}}  <strong class="ml20">[用餐备注]</strong>{{tripItem.tMealsRemark}}</div>
                    <div>
                      <strong>住宿：</strong> {{tripItem.hotelNames}} <strong class="ml20">[住宿备注]</strong>{{tripItem.tHotelRemark}}</div>
                  </td>
                </tr>
              </template>
              <tr>
                <th>线路特色</th>
              </tr>
              <tr>
                <td>
                    <p v-html="tableData.pSpecial" class="jl-pCostInclude"></p>
                    <p v-if="!tableData.pSpecial" class="jl-pCostInclude">无</p>
                </td>
              </tr>
              <tr>
                <th>预订须知</th>
              </tr>
              <tr>
                <td>
                  <p v-html="tableData.pNotes" class="jl-pCostInclude"></p>
                  <p v-if="!tableData.pNotes" class="jl-pCostInclude">无</p>
                </td>
              </tr>
              <tr>
                <th>费用说明</th>
              </tr>
              <tr>
                <td>
                  <p>
                    <strong>【费用包含】</strong>
                  </p>
                  <p v-html="tableData.pCostInclude" class="jl-pCostInclude"></p>
                  <p v-if="!tableData.pCostInclude" class="jl-pCostInclude">无</p>
                  <p>
                    <strong>【费用不含】</strong>
                  </p>
                  <p v-html="tableData.pCostExclude" class="jl-pCostExclude"></p>
                  <p v-if="!tableData.pCostExclude" class="jl-pCostInclude">无</p>

                </td>
              </tr>
              <tr>
                <th>温馨提醒</th>
              </tr>
              <tr>
                <td>
                  <p>1.游客报名时，请务必提供准确姓名及身份证号码，以免产生不必要的经济损失。机票因享受团队折扣，一经确认出票，不予签改。火车票确认后就会立即出票，如取消行程或更换他人，会产生损失费，请自行承担。</p>
                  <p>2.70周岁以上老年人预订出游，须出示健康证明并有年轻的家属或朋友陪同出游。</p>
                  <p>3.出行期间，请随身携带本人有效身份证原件（出行前请务必检查自己证件的有效期），未满16周岁者请携带户口本原件。超过16周岁的游客若没有办理身份证，请在户籍所在地派出所开具相关身份证明，以免影响登机。</p>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>

    </div>
    <!--jdy-content end-->
  </div>
</template>

<script>
import jdyAlert from "@/components/Alert";
import jdyLog from "@/components/Log";
import orderApi from "./../api/index";
export default {
  components: {
    jdyAlert,
    jdyLog
  },
  name: "information",
  data() {
    return {
      showBianji:true,
      showPrint:true,
      showSave:false,
      btnFlag:false,
      alertIndex:'',
      showEdit: false,
      planeData:[],
      fromData: {},
      tableData: {
        sCalendar: "",
        trips: [
          {
            tripsDay: ""
          }
        ]
      },
      downLoadHref: "",
      showAddFlight: false,
    };
  },
  filters:{
      lineTypeFilter: function(value){
          if(value == 0){
              return value = '出团';
          }
          if(value == 2){
              return value = '回团';
          }
          if(value == 1){
              return value = '中转';
          }
      },
      flightTypeFilter: function(value){
          if(value == 1){
              return value = '飞机';
          }
          if(value == 2){
              return value = '火车';
          }
          if(value == 3){
              return value = '邮轮';
          }
          if(value == 4){
              return value = '汽车';
          }
      }
  },
  mounted() {
    this.getTableData();
    const that = this;
    this.$nextTick(function() {
      window.addEventListener("keydown", function(evt) {
        if (!evt.ctrlKey || (evt.key !== "p" && evt.keyCode !== 80)) {
          return;
        }
        evt.preventDefault();
        that.printFn();
      });
    });
  },
  methods: {
    changeDate(value){
      console.log(value,'value')
      console.log(this.planeData[0].arrivalTime,'arrivalTime')
    },
    changeHref() {
      var id = this.$route.query.sId;
      this.downLoadHref = api_prefix + "/Schedule/exportGroupNotice/" + id;
      console.log(this.downLoadHref, "downLoadHref");
      location.href = this.downLoadHref;
    },
    //打印
    printFn() {
      this.showAddFlight = false;
      setTimeout(()=>{
          const printpage = document.getElementById("ptintHtml");
          jdyFn.printHtml(printpage);
          setTimeout(()=>{
              this.showAddFlight = true;
          },1000)
      },500)
    },
    goForWord() {
      this.$http
        .get(api_prefix + "Order/exportGroupNotice/" + this.$route.query.id)
        .then(
          response => {
            if (response.data.code == 0) {
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
    //获取列表数据
    getTableData() {
      const vm = this;
      const id = this.$route.query.sId;
      this.$http
        .get(api_prefix + `/Schedule/getScheduleMessage/${id}`)
        .then(
          response => {
            if (response.data.code == 0) {
              let data = response.data.body;
              vm.tableData = data;
              vm.fromData = data.scheduleSetting;
              vm.planeData = data.scheduleFlightList;
              if(this.fromData.departureStatus == 4 || this.fromData.departureStatus == 2){
                this.showBianji = false;
              }
              console.log("vm.tableData.sCalendar", vm.tableData.sCalendar);
              var day = vm.tableData.pDays;
              console.log(day, "day");
              var odate = vm.tableData.sCalendar;
              for (let i = 0; i < day; i++) {
                if (i == 0) {
                  let date = new Date(odate);
                  let oYear = date.getFullYear();
                  let oMonth = date.getMonth() + 1;
                  let oDay = date.getDate();
                  let oHour = date.getHours();
                  let oMin = date.getMinutes();
                  let oSen = date.getSeconds();
                  var oTime =
                    oYear +
                    "年" +
                    getzf(oMonth) +
                    "月" +
                    getzf(oDay) +
                    "日" +
                    getzf(oHour) +
                    ":" +
                    getzf(oMin) +
                    ":" +
                    getzf(oSen); //最后拼接时间
                  //补0操作
                  function getzf(num) {
                    if (parseInt(num) < 10) {
                      num = "0" + num;
                    }
                    return num;
                  }
                  oTime = oTime.substring(5, 11);
                  console.log(oTime, "oTime1");
                  this.tableData.trips[i].tripsDay = oTime;
                  console.log(this.tableData.trips[i].tripsDay, "this.tableData.trips[i].tripsDay");
                } else {
                  let ndate = odate + 24 * 60 * 60 * 1000;
                  let date = new Date(ndate);
                  let oYear = date.getFullYear();
                  let oMonth = date.getMonth() + 1;
                  let oDay = date.getDate();
                  let oHour = date.getHours();
                  let oMin = date.getMinutes();
                  let oSen = date.getSeconds();
                  var oTime =
                    oYear +
                    "年" +
                    getzf(oMonth) +
                    "月" +
                    getzf(oDay) +
                    "日" +
                    getzf(oHour) +
                    ":" +
                    getzf(oMin) +
                    ":" +
                    getzf(oSen); //最后拼接时间
                  //补0操作
                  function getzf(num) {
                    if (parseInt(num) < 10) {
                      num = "0" + num;
                    }
                    return num;
                  }
                  var oTime = oTime.substring(5, 11);
                  console.log(oTime, "oTime2");
                  odate = ndate;
                  console.log(odate, "odate");
                  this.tableData.trips[i].tripsDay = oTime;
                  console.log(this.tableData.trips[i].tripsDay, "this.tableData.trips[i].tripsDay2");
                }
              }
            } else {
              vm.$alert(response.data.message);
            }
          },
          response => {
            console.log("出错了");
          }
        );
    },
    addFlight(){//添加航班信息
      let paramList={
        "lineType":'',
        "flightType":'',
        "sortDay":null,
        "flightNum":null,
        "departurePlace":null,
        "destination":null,
        "flightTime":null,
        "arrivalTime":null      
      }
      this.planeData.push(paramList)
    },
    editPrint(){
        this.showPrint = false;
        this.showSave = true;
        this.showEdit = true;
        this.showAddFlight = true;
        this.showBianji = false;
    },
    goCancel(index){
      console.log(index,'index')
      this.planeData.splice(index, 1)
    },
    changeMusterTime(val){
      console.log(val,'vasl')
      console.log(this.fromData.musterTime,'this.fromData.musterTime')
      if(val){
        let datetime = new Date(val);
        let year = datetime.getFullYear();
        let month = datetime.getMonth();
        let date = datetime.getDate();
        let hour = datetime.getHours();
        let minute = datetime.getMinutes();
        let second = datetime.getSeconds();

        let result = year + 
            '-' + 
            ((month + 1) >= 10 ? (month + 1) : '0' + (month + 1)) + 
            '-' + 
            ((date + 1) < 10 ? '0' + date : date) + 
            ' ' + 
            ((hour + 1) < 10 ? '0' + hour : hour) +
            ':' + 
            ((minute + 1) < 10 ? '0' + minute : minute) + 
            ':' + 
            ((second + 1) < 10 ? '0' + second : second);
         this.fromData.musterTime = result;
      }
    },  
    save(){
        var flagOne = true;
        var flagTwo = true;
        for( var i = 0;i < this.planeData.length;i++){
            if(!flagOne || this.planeData[i].lineType == 0){
                flagOne = false; 
                // return;
            }
            if(!flagTwo || this.planeData[i].lineType == 2){
                    flagTwo = false;
                    // return;
            }
        }
        if(flagTwo == true && flagOne == true){
            this.$message.error("请添加出团和回团信息");
            return;
        }
        else if(flagOne == true){
            this.$message.error("请添加出团信息");
            return;
        }
        else if(flagTwo == true){
            this.$message.error("请添加回团信息");
            return;
        }
        else{
            for(let u = 0;u < this.planeData.length;u++){
              if(this.planeData[u].flightTime == undefined){
                this.$message.error("请添加出团日期");
                return;
              }else{
                let val = this.planeData[u].flightTime;
                let datetime = new Date(val);
                let year = datetime.getFullYear();
                let month = datetime.getMonth();
                let date = datetime.getDate();
                let hour = datetime.getHours();
                let minute = datetime.getMinutes();
                let second = datetime.getSeconds();

                let result = year + 
                    '-' + 
                    ((month + 1) >= 10 ? (month + 1) : '0' + (month + 1)) + 
                    '-' + 
                    ((date + 1) < 10 ? '0' + date : date) + 
                    ' ' + 
                    ((hour + 1) <= 10 ? '0' + hour : hour) +
                    ':' + 
                    ((minute + 1) <= 10 ? '0' + minute : minute) + 
                    ':' + 
                    ((second + 1) <= 10 ? '0' + second : second);
                    console.log("flightTime",result)
                this.planeData[u].flightTime = result;
              }
            }
            for(let u = 0;u < this.planeData.length;u++){
              if(this.planeData[u].arrivalTime == undefined){
                this.$message.error("请添加回团日期");
                return;
              }else{
                let val = this.planeData[u].arrivalTime;
                let datetime = new Date(val);
                let year = datetime.getFullYear();
                let month = datetime.getMonth();
                let date = datetime.getDate();
                let hour = datetime.getHours();
                let minute = datetime.getMinutes();
                let second = datetime.getSeconds();

                let result = year + 
                    '-' + 
                    ((month + 1) >= 10 ? (month + 1) : '0' + (month + 1)) + 
                    '-' + 
                    ((date + 1) < 10 ? '0' + date : date) + 
                    ' ' + 
                    ((hour + 1) <= 10 ? '0' + hour : hour) +
                    ':' + 
                    ((minute + 1) <= 10 ? '0' + minute : minute) + 
                    ':' + 
                    ((second + 1) <= 10 ? '0' + second : second);
                    console.log("arrivalTime3",result)
                this.planeData[u].arrivalTime = result;
              }
            }
            if(this.fromData.musterTime == undefined){
              this.$message.error("请添加集合时间");
                return;
            }else{
                let val = this.fromData.musterTime;
                let datetime = new Date(val);
                let year = datetime.getFullYear();
                let month = datetime.getMonth();
                let date = datetime.getDate();
                let hour = datetime.getHours();
                let minute = datetime.getMinutes();
                let second = datetime.getSeconds();

                let result = year + 
                    '-' + 
                    ((month + 1) >= 10 ? (month + 1) : '0' + (month + 1)) + 
                    '-' + 
                    ((date + 1) < 10 ? '0' + date : date) + 
                    ' ' + 
                    ((hour + 1) <= 10 ? '0' + hour : hour) +
                    ':' + 
                    ((minute + 1) <= 10 ? '0' + minute : minute) + 
                    ':' + 
                    ((second + 1) <= 10 ? '0' + second : second);
                this.fromData.musterTime = result;              
            }
            console.log(this.tableData,'tableData')
            this.btnFlag = true;
            this.$http
            .post(api_prefix + '/Schedule/saveScheduleSetting/',this.tableData)
            .then(
            response => {
              if (response.data.code == 0) {
                this.btnFlag = false;
                this.showAddFlight = false;
                //是否填写必填信息判断
                this.showEdit = false;
                this.showSave = false;
                this.showPrint = true;
                this.showBianji = true;
                this.$message.success("保存成功");
              }else{
                this.btnFlag = false;
                this.$alert(response.data.message, "温馨提示", {
                confirmButtonText: "确定",
                callback: action => {}
              });
              }
            },
            response => {
                this.btnFlag = false;
                console.log("出错了");
            }
            );
        }
    },
  }
};
</script>

<style scoped>
#ptintHtml {
  padding-top: 30px;
}

.page-header {
  overflow: hidden;
  margin-bottom: 10px;
}

.page-header div {
  float: left;
}

.page-header div:first-child {
  width: 70%;
}

.page-header h1 {
  font: 28px Microsoft YaHei, verdana, SimHei, sans-serif, "黑体";
  padding-bottom: 5px;
}

.page-header h3 {
  font: 18px Microsoft YaHei, verdana, SimHei, sans-serif, "黑体";
  padding-bottom: 5px;
}

.page-header p {
  padding-bottom: 5px;
  line-height: 20px;
}

.page-header image {
  width: 125px;
  height: 125px;
  vertical-align: top;
}

.table-wrap {
  padding-bottom: 10px;
}

.table-wrap .blue-font {
  color: #3f96f7;
}

.table-wrap th {
  font-weight: bold;
}

.table2 th {
  text-align: left;
}

.table-wrap .alignR {
  text-align: right;
}

.table-wrap .borderR {
  border-right: 1px solid #d7dfe3;
}

.table-wrap .borderStyle {
  border-top: 1px solid #d7dfe3;
  border-bottom: 1px dashed #d7dfe3;
}

.table-custom td {
  vertical-align: middle;
}

.table-custom td.div2 {
  overflow: hidden;
  padding: 0;
}

.table-custom td.div2 div {
  box-sizing: border-box;
  width: 50%;
  float: left;
  padding: 8px 20px;
}

@media print {
  #app {
    display: none;
    opacity: 0;
  }
  .page-header {
    overflow: hidden;
    margin-bottom: 0;
  }
  .page-header div {
    float: left;
  }
  .page-header div:first-child {
    width: 70%;
  }
  .page-header h1 {
    font: 28px Microsoft YaHei, verdana, SimHei, sans-serif, "黑体";
    padding-bottom: 5px;
  }
  .page-header h3 {
    font: 18px Microsoft YaHei, verdana, SimHei, sans-serif, "黑体";
    padding-bottom: 5px;
  }
  .page-header p {
    padding-bottom: 5px;
    line-height: 20px;
  }
  .page-header image {
    width: 125px;
    height: 125px;
    vertical-align: top;
  }
  .table-wrap {
    padding-bottom: 10px;
  }
  .table-wrap .blue-font {
    color: #3f96f7;
  }
  .table-wrap th {
    font-weight: bold;
  }
  .table2 th {
    text-align: center;
  }
  .table-wrap .alignR {
    text-align: right;
  }
  .table-wrap .borderR {
    border-right: 1px solid #d7dfe3;
  }
  .table-wrap .borderStyle {
    border-top: 1px solid #d7dfe3;
    border-bottom: 1px dashed #d7dfe3;
  }
  .table-custom td {
    vertical-align: middle;
  }
  .table-custom td.div2 {
    overflow: hidden;
    padding: 0;
  }
  .table-custom td.div2 div {
    box-sizing: border-box;
    width: 50%;
    float: left;
    padding: 3px 5px;
  }
  table th,
  table td {
    padding: 3px 5px;
    font-size: 13px;
  }
  p {
    font-size: 13px;
  }
}
</style>
