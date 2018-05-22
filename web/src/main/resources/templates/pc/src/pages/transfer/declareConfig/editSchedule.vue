<template>
  <div class="jdy-content jdy-transfer fleft">
    <div class="jdy-content-inner">
      <el-form :model="banqiForm" :rules="banqiRule" ref="banqiForm" class="demo-form-inline" label-width="100px">
        <div class="jdy-tab">
          <el-button @click="goback('schedule')" class="fright mt10 mr10">返回</el-button>
          <el-button type="primary" @click="onSubmit('banqiForm')" class="fright mt10 mr10" :disabled="btnFlag">保存</el-button>
        </div>
        <div class="tripbox clearfix  relative mt60">
          <div v-if="addType!=2" class="clearfix p10 border pb30">
            <div class="ticketmanage-title tc">
              <span>--班期信息--</span>
            </div>
            <el-row class="mt30">
              <el-col :span="8">
                <el-form-item label="班期编号:" prop="sScheduleNo">
                  <el-input v-model="banqiForm.sScheduleNo" placeholder="请输入班期编号" :disabled='true'>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="开始时间:">
                  <el-date-picker v-model="calendars" :editable="false" type="date" placeholder="开始时间" :disabled='true' :picker-options="pickerOptions0" class="all" style="width: 100%;" @change="calendarsChange">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="星期几:">
                  <el-select v-model="week" placeholder="请选择开始时间" class="all" :disabled=true>
                    <el-option v-for="(value , index) in WeekDay" :key="index" :label="value" :value="index">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="班期名称:">
                  <el-input v-model="banqiForm.sScheduleName" placeholder="请输入班期名称">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="出发时分:" prop="">
                  <!--<el-input v-model="banqiForm.sLeaveTime" placeholder="如12:35">-->
                  <!--</el-input>-->
                  <template>
                    <el-time-picker v-model="sLeaveTime" :picker-options="{
                            format: 'HH:mm'
                          }" format="HH:mm" placeholder="出发时分" clearable :editable="false" style="width: 100%;">
                    </el-time-picker>
                  </template>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="停售时间:" prop="sStopSale">
                  <el-input placeholder="请输入内容" v-model.number="banqiForm.sStopSale" type="number">
                    <el-select v-model="banqiForm.sStopType" slot="prepend" placeholder="请选择" style="width: 100px;">
                      <el-option label="分钟" :value='0'></el-option>
                      <el-option label="小时" :value='1'></el-option>
                      <el-option label="天" :value='2'></el-option>
                    </el-select>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="成团人数:">
                  <el-input-number v-model="banqiForm.sGroupNum" :min="1" style="width: 100%;" :controls="false"></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>

          </div>

        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import sData from './s.js';
import jdyCalendar from '@/components/Calendar';
import jdyAlert from '@/components/Alert';
import ElInput from "../../../../node_modules/element-ui/packages/input/src/input";
import ElInputNumber from "../../../../node_modules/element-ui/packages/input-number/src/input-number";
export default {
  components: {
    ElInputNumber,
    jdyCalendar,
    ElInput
  },
  name: "editSchedule",
  data() {
    return {
      btnFlag:false,
      addType: this.$route.query.type,
      setType: [{
        value: 0,
        label:"不对号入座"
      },{
        value: 1,
        label:"对号入座(系统随机)"
      },{
        value: 2,
        label:"对号入座(人工选择)"
      }],
      WeekDay: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"], //星期  为了符合日期getDay（）方法，从周日开始
      week: new Date().getDay(),//用于现实，不传后台
      calendars: new Date(),     //开始时间组件绑定变量，在提交表单时格式化赋值给banqiForm.calendars
      multiCalendars: '',
      sLeaveTime: new Date(),          //出发时分组件绑定变量,在提交表单时格式化赋值给banqiForm.sLeaveTime
      banqiForm: {   //提交表单数据格式
        busDTOS: [],// 车辆信息Array[批量添加车辆DTO] ,
        calendars: [new Date()],// 出发时间，yyyy-MM-dd Array[string],
        sCarNum: null,//车辆数 ,
        sCarSeats: null,//每车座位数 ,
        sGroupNum: null,// 成团人数 ,
        sLeaveTime: '',// 出发时分 ,
        sPrint: null, //是否打印0:打印 1:不打印 ,
        sProductId: 11,// 产品ID ,
        sScheduleName: '',// 班期名称 ,
        sScheduleNo: '',// 班期编号 ,
        sShamNum: '',// 虚拟已售数 ,
        sSitType: '',// 入座方式 0:不对号入座 1:对号入座(系统随机) 2:对号入座(人工选择) ,
        sStopSale: null,// 停售时间 ,
        sStopType: '',// 停售类型 0:分钟 1:小时 2:天数 ,
        tickets: [], // Array[TicketAddDTO]票信息,
        seatSold: 0,//已售数量
        fromProductListMenu:true,
      },
      TicketAddDTO: { //票信息dto
        id: '',// 主键id ,
        tMarketPrice: '',//市场价 ,
        tPeerPrice: '',// 同行价 ,
        tStock: ''// 库存
      },
      busDto: {    //表单中车辆dto
        holdList: [],   //页面显示使用，不提交后台，用于记录所有预留了的座位号，以便后续操作使用
        bSeatsLock: '',// 锁定位置，逗号分隔 ,
        bSeatsNum: 0,// 座位数 ,
        busHolds: []// Array[车辆预留信息 新增DTO] 座位预留信息
      },
      busHold: {    //车辆dto中的座位预留dto
        bAccount: '',// 预留账号 ,
        bCompanyId: '',// 预留单位ID ,
        bHoldHours: '',// 预留小时 ,
        bSeat: '' // 预留位置，逗号分隔    注意座位号是从1开始的
      },
      //            banqiForm2: sData.banqiForm2,
      banqiRule: {
        sScheduleNo: [{
          required: true,
          message: '请输入班期编号',
          trigger: 'blur'
        }, {
          min: 1,
          max: 20,
          message: '班期编号最多20个字符！'
        }],
        sCarNum: [{
          required: true,
          message: '请输入车辆数',
          trigger: 'blur',
          numeric: true,
          type: "number"
        }],
        sCarSeats: [{
          required: true,
          message: '请输入座位数',
          trigger: 'blur',
          numeric: true,
          type: "number"
        }],
        sStopSale: [{
          required: true,
          message: '请输入停售时间',
          trigger: 'blur',
          numeric: true,
          type: "number"
        }],
      },
      /*票价类目(基础)*/
      baseCategory:[],
      //            banqiRule2: sData.banqiRule2,
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      saveUrl: api_prefix + "/Schedule/updateSchedule",
      ticketListUrl: api_prefix + "/ticket/list",
      getScheduleUrl: api_prefix + "/Schedule/scheduleWithTickets/" + this.$route.query.banqi + "/" + 2,
      selectBusUrl: api_prefix + "/Bus/selectBus",
      addBusUrl: api_prefix + "/Bus/insertBus",
      removeBusUrl: api_prefix + "/Bus/deleteBus",
      updateLockSeatInfoUrl: api_prefix + "/Bus/updateLock",
      updateTemporarySeatInfoUrl: api_prefix + "/Bus/updateReserve",
      updateCarSeatNumUrl: api_prefix + "/Bus/updateSeat",
      /*票价信息*/
      ticketList: [],
      oldTickedList: [],
      ticketPage: {
        currPage: 1,
        pageSize: 30,
        total: 0
      },
      ticketLimitType: {
        0: "无限制 ",
        1: "实名票",
        2: "限制性别",
        3: "限制年龄"
      },
      simpleWeekDay: ["一", "二", "三", "四", "五", "六", "日"], //星期列表。 用于票价星期显示

      /*车座信息*/
      tableData2: [{
        licenseNumber: '', //车号
        seatNumber: '',//座位数
        company: '',//单位
        reservePrescription: ''//预留时效
      }],
      carList: [], //预设车辆的list集合，用于保存预留和锁定车座信息。提交表单时赋值给banqiForm
      currentCar: -1,   //保存当前正在操作班车的index
      currentCompany: '', //保存当前正在操作的公司id
      selectedList: [],  //保存当前操作班车的选中座位的list
      temptoraryTime: null,
      companyList: [],//单位列表
      loading: false,
      canNotModifyCarNum: false,   //用于在新增或者删除车辆时处理请求延时，避免重复操作
      currentCarSeatNum: 0     //当前车辆的车座数
    }
  },
  methods: {
    changeType(val){
      console.log(val,"-------------------");
      this.banqiForm.sSitType = parseInt(val);
    },
    modifyCarSeatNum() {
      if (this.currentCar < 0) {
        this.$alert("请选择车辆", "温馨提示", { type: "warning" });
        this.currentCarSeatNum = oldNum;
        return
      }
      let oldNum = this.carList[this.currentCar].bSeatsNum;
      let newNum = this.currentCarSeatNum;
      if (newNum <= 0) {
        this.$alert("车座数请输入大于0的数字", "温馨提示", { type: "warning" });
        this.currentCarSeatNum = oldNum;
        return;
      }
      if (oldNum < newNum) {      //车辆数增加时直接请求，请求成功则修改车座数量
        this.dealHttpReseponse(this.updateCarSeatNumUrl, {
          bSeatsNum: newNum,// 座位数 ,
          id: this.carList[this.currentCar].id //车辆id ,
        }, response => {
          this.carList[this.currentCar].bSeatsNum = this.currentCarSeatNum;
        });
      } else if (oldNum > newNum) {//车辆数减少时，由于是从后往前依次删除，所以需要先判断删除的座位有没有已经预留或者锁定，如是，则不能执行删除，车辆数恢复至旧数据
        let canNotRemoveSeats = this.carList[this.currentCar].holdList.concat(this.carList[this.currentCar].bSeatsLock.split(','));
        let canModifyFlag = true;
        canNotRemoveSeats.forEach(seat => {
          if (parseInt(seat) >= newNum) {
            canModifyFlag = false;
          }
        });
        if (canModifyFlag) {
          this.dealHttpReseponse(this.updateCarSeatNumUrl, {
            bSeatsNum: newNum,// 座位数 ,
            id: this.carList[this.currentCar].id //车辆id ,
          }, response => {
            this.carList[this.currentCar].bSeatsNum = this.currentCarSeatNum;
          });
        } else {
          this.$alert("有座位已经预留或者锁定，不能修改", "温馨提示", { type: "warning" });
          this.currentCarSeatNum = oldNum;
        }
      }
    },
    getTipContent(index) {   //获取预留座位号的公司名称
      let busHolds = this.carList[this.currentCar].busHolds
      for (let i = 0; i < busHolds.length; i++) {
        if (busHolds[i].bSeat.split(",").indexOf(index.toString()) !== -1) {
          return busHolds[i].companyName ? busHolds[i].companyName : "暂无";
        }
      }
      return "没找到预留信息";
    },
    multiCanlederChange(value) {  //出发日期多选change事件
      this.multiCalendars = value;
    },
    lockSeat() {  //锁定车位
      if (this.currentCar < 0) {
        this.$alert("请选择车辆", "温馨提示", { type: "warning" });
        return
      }
      let bSeatsLock = this.carList[this.currentCar].bSeatsLock.split(",");
      this.selectedList = this.selectedList.filter(value => {   //对选中的座位进行过滤，过滤掉预留的座位和已经锁定的座位
        return this.carList[this.currentCar].holdList.indexOf(value.toString()) == -1 && bSeatsLock.indexOf(value.toString()) == -1
      });
      if (this.selectedList.length) {
        this.dealHttpReseponse(this.updateLockSeatInfoUrl, {
          bSeatsLock: this.selectedList.join(","),//座位号，逗号分隔 ,
          id: this.carList[this.currentCar].id,//车辆id ,
          lock: true
        }, response => {
          if (bSeatsLock.length) {  //旧数据不为空 组合新旧锁定车位
            this.carList[this.currentCar].bSeatsLock = bSeatsLock.concat(this.selectedList).join(",")
          } else {  //如果旧数据为空，直接赋值
            this.carList[this.currentCar].bSeatsLock = this.selectedList.join(",")
          }
          this.selectedList = [];
        })
      } else {
        this.$alert("请选择未锁定且未预留的车座", "温馨提示", { type: "warning" });
      }
    },
    unlockSeat() {   //解锁
      if (this.currentCar < 0) {
        this.$alert("请选择车辆", "温馨提示", { type: "warning" });
        return
      }
      this.selectedList = this.selectedList.filter(date => {
        return this.carList[this.currentCar].bSeatsLock.split(",").indexOf(date.toString()) != -1 && this.carList[this.currentCar].holdList.indexOf(date.toString()) == -1
      }
      ); //过滤掉预留和未锁定的座位

      if (this.selectedList.length) {
        this.dealHttpReseponse(this.updateLockSeatInfoUrl, {
          bSeatsLock: this.selectedList.join(","),//座位号，逗号分隔 ,
          id: this.carList[this.currentCar].id,//车辆id ,
          lock: false
        }, response => {
          this.carList[this.currentCar].bSeatsLock = this.carList[this.currentCar].bSeatsLock.split(",").filter(value => { return this.selectedList.indexOf(parseInt(value)) == -1 }).join(",");  //修改当前车辆的锁定车座信息，以便页面显示做出改变
          this.selectedList = [];
        });
      } else {
        this.$alert("请选择已经锁定的车座", "温馨提示", { type: "warning" });
      }
    },
    addTemporary() {    //预留车座信息
    console.log(this.currentCompany,'this.currentCompany')
      if (this.currentCar < 0) {
        this.$alert("请选择车辆", "温馨提示", { type: "warning" });
        return
      }
      if (this.currentCompany == null) {
        this.$alert("请先选择单位", "温馨提示", { type: "warning" });
        return;
      }
      if (!this.temptoraryTime) {
        this.$alert("请输入预留时效", "温馨提示", { type: "warning" });
        return;
      }
      this.selectedList = this.selectedList.filter(value => {   //对选中的座位进行过滤，过滤掉预留的座位和已经锁定的座位
        return this.carList[this.currentCar].holdList.indexOf(value.toString()) == -1 && this.carList[this.currentCar].bSeatsLock.split(",").indexOf(value.toString()) == -1
      });
      if (!this.selectedList.length) {
        this.$alert("请选择未预留和未锁定的车座", "温馨提示", { type: "warning" });
        return;
      }
      this.dealHttpReseponse(this.updateTemporarySeatInfoUrl, {
        bAccount: '',
        bBusId: this.carList[this.currentCar].id,// 车辆id ,
        bCompanyId: this.currentCompany,//公司id ,
        bHoldHours: this.temptoraryTime,//预留时间 ,
        bSeat: this.selectedList.join(","),//预留、释放的座位，逗号分隔 ,
        reserve: true
      }, response => {
        //先添加到bushold的数组中去
        let busHold = this.getCurrentCompanyBusHold();
        if (busHold) {
          busHold.bSeat = busHold.bSeat.split(",").concat(this.selectedList).join(",");
          busHold.bHoldHours = this.temptoraryTime;
        } else {
          let busHold = {    //车辆dto中的座位预留dto
            bAccount: '',// 预留账号 ,
            companyName: this.getCompanyName(this.currentCompany),
            bCompanyId: this.currentCompany,// 预留单位ID ,
            bHoldHours: this.temptoraryTime,// 预留小时 ,
            bSeat: this.selectedList.join(",") // 预留位置，逗号分隔
          }
          this.carList[this.currentCar].busHolds.push(busHold)
        }
        //再添加到临时变量中去，记录已经选中的车座   注意：因为座位后台传过来是字符串，利用splite拆分过后是字符串，所以新加的座位号也必须是字符串
        this.carList[this.currentCar].holdList = this.carList[this.currentCar].holdList.concat(this.selectedList.join(",").split(","))
        console.log(this.carList[this.currentCar]);
        //最后清除选中效果
        this.selectedList = [];
      });
    },
    getCompanyName(id) {
      let name = '某有匹配的单位';
      this.companyList.forEach(company => {
        if (company.id.toString == id.toString) {
          name = company.cName;
        }
      })
      return name;
    },
    getCurrentCompanyBusHold() {     //获取当前单位预留座位信息
      let busHold = null;
      this.carList[this.currentCar].busHolds.forEach((value) => {
        if (value.bCompanyId == this.currentCompany) {
          busHold = value;
        }
      });
      return busHold;
    },
    releaseTemporary() {     //释放当前车辆的当前单位的预留情况
      if (this.currentCar < 0) {
        this.$alert("请选择车辆", "温馨提示", { type: "warning" });
        return
      }
      this.selectedList = this.selectedList.filter(date => {
        return this.carList[this.currentCar].bSeatsLock.split(",").indexOf(date.toString()) == -1 && this.carList[this.currentCar].holdList.indexOf(date.toString()) != -1
      }
      ); //过滤掉预留和未锁定的座位
      if (!this.selectedList.length) {
        this.$alert("请选择已经预留的座位", "温馨提示", { type: "warning" });
        return
      }
      this.dealHttpReseponse(this.updateTemporarySeatInfoUrl, {
        bBusId: this.carList[this.currentCar].id,// 车辆id ,
        bSeat: this.selectedList.join(","),//预留、释放的座位，逗号分隔 ,
        reserve: false
      }, response => {
        this.carList[this.currentCar].busHolds.forEach(date => { //遍历所有单位删除并预留的座位
          date.bSeat = date.bSeat.split(",").filter(seat => { return this.selectedList.indexOf(parseInt(seat)) == -1 }).join(",");
        })
        this.carList[this.currentCar].holdList = this.carList[this.currentCar].holdList.filter(seat => { return this.selectedList.indexOf(parseInt(seat)) == -1 })
        this.selectedList = [];
      });
    },
    carNumChange(value) {    //车辆改变时，车辆列表改变
      console.log("pre" + value);
      let len = this.carList.length;
      if (value > len) {
        for (let i = 0; i < value - len; i++) {
          this.carList.push({
            holdList: [], //预留座位列表
            bSeatsLock: "",// 锁定位置，逗号分隔 ,
            bSeatsNum: this.banqiForm.sCarSeats,// 座位数 ,
            busHolds: []// Array[车辆预留信息 新增DTO] 座位预留信息
          });
        }
      } else if (value < len) {
        for (let i = 0; i < len - value; i++) { this.carList.pop(); }
      }
      console.log("after" + this.carList.length);
    },
    seatChange(value) {   //座位数改变
      if (this.currentCar > -1) {
        this.banqiForm.sCarSeats = value;
      } else {
        this.$alert("请选择车辆", "温馨提示", { type: "warning" });
      }
    },
    addCar() {  //新增车辆
      this.canNotModifyCarNum = true;
      this.dealHttpReseponse(this.addBusUrl,
        {   //添加车辆时使用的对象     //当前只能单个车辆添加
          bScheduleId: this.$route.query.banqi,// 班期id ,
          bSeatsNum: this.banqiForm.sCarSeats, //座位数 ,
          num: 1 //车辆数 ,
        }, response => {
          this.banqiForm.sCarNum += 1;
          this.carNumChange(this.banqiForm.sCarNum);
          this.canNotModifyCarNum = false;
          this.defaultBusList();
        });
    },
    removeCar() {   //删除车辆
      this.canNotModifyCarNum = true;
      this.$confirm('你确定要删除该内容？', '友情提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.currentCar > -1) {
          if (this.carList[this.currentCar].holdList.length) {
            this.$alert("当前车辆已经预留了座位，不能删除", "温馨提示", { type: "warning" });
            this.canNotModifyCarNum = false;
            return;
          }
          if (this.carList[this.currentCar].bSeatsLock.length) {
            this.$alert("当前车辆已经锁定了座位，不能删除", "温馨提示", { type: "warning" });
            this.canNotModifyCarNum = false;
            return;
          }
          this.dealHttpReseponse(this.removeBusUrl, {
            bScheduleId: this.$route.query.banqi,// 班期id ,
            id: this.carList[this.currentCar].id//车辆id ,
          }, response => {
            this.banqiForm.sCarNum = this.banqiForm.sCarNum - 1;
            this.carList.splice(this.currentCar, 1);
            this.currentCar = -1;
            this.canNotModifyCarNum = false;
          },"post",(response)=>{
            this.canNotModifyCarNum = false;
          });
        } else {
          this.$alert("请选择车辆", "温馨提示", { type: "warning" });
          this.canNotModifyCarNum = false;
        }
      }).catch(() => {

      });
    },
    onSubmit(formName) {    //保存
      if (!this.dealBanqiFormData()) {
        return;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.btnFlag = true;
          this.$http.post(this.saveUrl, this.banqiForm).then(response => {
            if(response.data.code==0){
              this.$message.success("修改成功");
              setTimeout(() => {
                this.btnFlag = false;
                this.$router.push({ name: "declareConfigSchedule", query: { id: this.$route.query.id,c_id:this.$route.query.c_id } });
              }, 1000)
            }else{
              this.btnFlag = false;
              this.$alert(response.data.message);
            }
          });
        } else {
          this.btnFlag = false;
          this.$message.error("提交失败");
        }
      });
    },
    dealBanqiFormData() {   //将临时变量赋值为表单对象    1，开始时间和出发时间  2，判断票是否改变，3如果2成立计算新票，
      this.banqiForm.calendars = []
      this.calendars && (this.banqiForm.calendars[0] = this.formatDate(this.calendars, "yyyy-MM-dd"));   //格式化开始时间
      this.sLeaveTime && (this.banqiForm.sLeaveTime = new Date(this.sLeaveTime));     //格式化开始时分
      //        if(new Date(this.calendars.getFullYear(),this.calendars.getMonth(),this.calendars.getDate(),this.sLeaveTime.getHours(),this.sLeaveTime.getMinutes(),this.sLeaveTime.getSeconds()) < new Date()){
      //          this.$alert("出发时间不能早于现在",'温馨提示',{type:"warning"});
      //            return false;
      //        }
      let date = new Date(this.banqiForm.calendars[0]);
      let now = new Date(this.formatDate(new Date(), 'yyyy-MM-dd'));
      if (date < now) {
        this.$alert("出发时间不能早于今天", '温馨提示', { type: "warning" });
        return false;
      }
      /*
      * 获取勾选了的票价列表，并组装对象，赋值给表单对象
      * */
      var selectedTicketArray = [];
      let errorFlag = false;
      if (errorFlag) {
        return false;
      }
      /**/
      // if (selectedTicketArray.length <= 0) {
      //   this.$alert("请选择车票", '温馨提示', { type: "warning" });
      //   return false;
      // }
      if (this.banqiForm.ticketsChanged = this.isTicketInfoChanged(selectedTicketArray)) {
        this.banqiForm.tickets = selectedTicketArray;    //赋值票价信息
      };  //赋值车票有没有改动
      return true;
    },
    isTicketInfoChanged(newTicketArray) {  //判断车票有无改动    1.判断新旧票数组长度 2，把两个数组按照票id排序，3，循环判断每个票的id,市场价，同行价，库存量，是否选择 五个条件来判断两个票是否相同
      if (newTicketArray.length != this.oldTickedList.length) {
        return true;
      }
      newTicketArray.sort(this.sortBy);
      this.oldTickedList.sort(this.sortBy);
      for (let i = 0; i < newTicketArray.length; i++) {
        if (newTicketArray[i].id != this.oldTickedList[i].id || newTicketArray[i].tMarketPrice != this.oldTickedList[i].tMarketPrice
          || newTicketArray[i].tPeerPrice != this.oldTickedList[i].tPeerPrice || newTicketArray[i].tStock != this.oldTickedList[i].tStock
          || newTicketArray[i].chosen != this.oldTickedList[i].chosen) {
          return true;
        }
      }
      return false;
    },
    sortBy(obj1, obj2) {
      return obj1.id - obj2.id;
    },
    formatDate(date, fmt) {  //格式化时间
      if (date instanceof Date) {
        var o = {
          "M+": date.getMonth() + 1, //月份
          "d+": date.getDate(), //日
          "h+": date.getHours(), //小时
          "m+": date.getMinutes(), //分
          "s+": date.getSeconds(), //秒
          "q+": Math.floor((date.getMonth() + 3) / 3), //季度
          "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
          if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
      }
      throw new Error("日期格式转换发现错误的参数类型");
    },
    calendarsChange(value) {   //开始时间change事件。 修改星期几
      if (value) {
        this.week = new Date(value).getDay();
      } else {
        this.week = null;
      }
    },
    goback(url) {
      this.$confirm('数据未保存，确定返回吗？', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push({ name: "declareConfigSchedule", query: { id: this.$route.query.id,c_id:this.$route.query.c_id } });
      }).catch(() => {

      });

    },
    getLimitType(value) {   //获取限制类型
      if (value) {
        return this.ticketLimitType[value]
      }
      return "无限制"
    },
    getEffctiveDay(value) {  //获取周几有效
      let str = "";
      value.toString().split("").forEach((value, index) => {
        if (parseInt(value)) {
          str += this.simpleWeekDay[index]
        }
      })
      return str;
    },
    setSeat(index) {
      let indexOfArray = this.selectedList.indexOf(index);
      if (indexOfArray == -1) {
        this.selectedList.push(index)
      } else {
        this.selectedList.splice(indexOfArray, 1);
      }
    },
    handleCurrentChange(row) {
      this.currentCar = this.carList.indexOf(row);
      this.currentCarSeatNum = this.carList[this.currentCar].bSeatsNum;
      this.selectedList = [];
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSelectionChange3(val) {
      this.multipleSelection3 = val;
    },
    searchCompany(value) {
      this.defaultCompanyList(value);
    },
    defaultCompanyList(value) {
      this.loading = true;
      let newVar = { pageIndex: 1 };
      if (value) {
        newVar.fastSearchStr = value
      }
      this.$http.post(api_prefix + '/Company/index', newVar, { emulateJSON: true }).then(response => {
        var data = response.body;
        if (data.code == '0') {
          this.companyList = data.body.list;
          //            this.tableDataTotal =  data.body.total;
        } else {
          this.$alert(data.message);
        }
        this.loading = false;
      }, response => {
        this.loading = false;
        this.$alert("网络错误");
      });
    },
    dealHttpReseponse(url, data, fun, type,errorFun) {    //post请求
      type || (type = 'post')
      this.$http[type](url, data).then(response => {
        if (response.body.code == 0) {
          fun && fun(response);
        } else {
          this.$alert(response.body.message, '温馨提示', 'error');
          errorFun && errorFun(response);
        }
      }, response => {
        errorFun && errorFun(response);
        this.$alert("网络错误", '温馨提示', 'error');
      });
    },
    defaultBanqiForm() {
      this.dealHttpReseponse(this.getScheduleUrl, null, (response) => {
        let banqiForm = response.body.body;
//        banqiForm.sSitType = banqiForm.sSitType ? banqiForm.sSitType.toString() : null;
        banqiForm.sCalendar && (this.calendars = new Date(banqiForm.sCalendar));
        banqiForm.sLeaveTime && (this.sLeaveTime = banqiForm.sLeaveTime);
        this.ticketList = banqiForm.tickets;
        this.oldTickedList = []; //深拷贝 备份旧数据。用于提交时验证票价信息有没有改动过
        setTimeout(() => {      //延时选中回显数据
          this.ticketList.forEach(date => {
            // 票价类目转换
            date.tCategory=this.filterCategory(date.tCategory);
            if (date.chosen) {
              this.oldTickedList.push(JSON.parse(JSON.stringify(date)));
              this.$refs.multipleTable.toggleRowSelection(date);
            }
          })
        }, 200);
        Object.assign(this.banqiForm,banqiForm)
      }, "get");
    },
    // 获取票价类目
      getCategory(){
          this.$http.post(api_prefix + 'Dictionaries/dictList',{dGroupId: 111}).then(response => {
              if(response.data.code == 0){
                  let lists=response.body.body;
                  lists.forEach(data=>{
                      this.baseCategory.push({id:data.id,name:data.dName});
                  });
              }else{
                  this.$alert("获取票价类目失败");
              }
          },response=>{
              console.log("获取票价类目失败！")
          });
      },
      //票价类目转换
      filterCategory(value){
        var temp=[];
        if(value==""){
          value="---"
        }else{
          temp=this.baseCategory.filter(data=>{
              return value==data.id
          })
        }
        return temp.length!=0?temp[0].name:value
      },
    defaultBusList() {    //回显bus列表和座位预留锁定信息
      this.dealHttpReseponse(this.selectBusUrl, { bScheduleId: this.$route.query.banqi }, (response) => {
        let carList = response.body.body;
        carList.map(car => {
          car.holdList = [];
          car.bSeatsLock || (car.bSeatsLock = "")
          car.busHolds.forEach(seat => {
            if (seat.bSeat && seat.bSeat.length) {
              car.holdList = car.holdList.concat(seat.bSeat.split(","));
            }
          })
        });
        this.carList = carList;
      })
    },
  },
  mounted() {
    this.getCategory();
    this.currentCompany = '';
    this.companyList = [];
    this.defaultCompanyList();
    if (this.$route.query.banqi) {
      this.defaultBanqiForm();
      this.defaultBusList();
    }
  }

}
</script>

<style>
.myclass>.el-table__body-wrapper {
  overflow: inherit
}
</style>
