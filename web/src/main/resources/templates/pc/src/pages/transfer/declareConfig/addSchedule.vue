<template>
  <div class="jdy-content jdy-transfer fleft">
    <div class="jdy-content-inner">
      <el-form :model="banqiForm" :rules="banqiRule" ref="banqiForm" class="demo-form-inline" label-width="100px">
        <div class="jdy-tab">
          <el-button class="fright mt10" @click="goback('schedule')">返回</el-button>
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
                  <el-input v-model="banqiForm.sScheduleNo" placeholder="请输入班期编号">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="开始时间:">
                  <el-date-picker v-model="calendars" :editable="false" type="date" placeholder="开始时间" :picker-options="pickerOptions0" class="all" style="width: 100%;" @change="calendarsChange">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="星期几:">
                  <el-select v-model="week" placeholder="请选择开始时间" class="all" :disabled="true">
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
                  <el-input v-model.number="banqiForm.sGroupNum" type="number" style="width: 100%;" ></el-input>
                </el-form-item>
              </el-col>
            </el-row>

          </div>
          <div v-if="addType==2" class="clearfix p10 border pb30">
            <div class="ticketmanage-title tc">
              <span>--班期信息--</span>
            </div>
            <el-row>
              <el-col :span="18">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="班期编号:" prop="sScheduleNo">
                      <el-input v-model="banqiForm.sScheduleNo" placeholder="请输入班期编号">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="班期名称:">
                      <el-input v-model="banqiForm.sScheduleName" placeholder="请输入班期名称">
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="虚拟已售数:" prop="">
                      <el-input-number v-model.number="banqiForm.sShamNum" placeholder="虚拟已售数" :min="0" :max="100" style="width: 100%;" :controls="false"></el-input-number>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="对号入座:" prop="">
                      <el-select v-model="banqiForm.sSitType" placeholder="请选择" class="all">
                        <el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in setType">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <template>
                      <el-form-item label="出发时分">
                        <el-time-picker v-model="sLeaveTime" :picker-options="{
                                  format: 'HH:mm'
                                }" format="HH:mm" placeholder="出发时分" clearable :editable="false" style="width: 100%;">
                        </el-time-picker>
                      </el-form-item>
                    </template>
                  </el-col>
                  <el-col :span="12">
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
                  <el-form-item label="成团人数:">
                    <el-input-number v-model="banqiForm.sGroupNum" :min="1" :max="100" style="width: 100%;" :controls="false"></el-input-number>
                  </el-form-item>
                </el-row>
              </el-col>
              <el-col :span="6">
                <jdy-calendar id="jdytCalendar" v-model="multiCalendars" @change="multiCanlederChange"></jdy-calendar>
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
import ElFormItem from "../../../../node_modules/element-ui/packages/form/src/form-item";
import ElCol from "element-ui/packages/col/src/col";
export default {
  components: {
    ElCol,
    ElFormItem,
    ElInputNumber,
    jdyCalendar,
    ElInput
  },
  name: "",
  data() {
    return {
      btnFlag:false,
      loginCompanyId:'',
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
      multiCalendars: new Date().format("yyyy-MM-dd"),
      sLeaveTime: new Date(),          //出发时分组件绑定变量,在提交表单时格式化赋值给banqiForm.sLeaveTime
      banqiForm: {   //提交表单数据格式
        busDTOS: [],// 车辆信息Array[批量添加车辆DTO] ,
        calendars: [new Date()],// 出发时间，yyyy-MM-dd Array[string],
        sCarNum: null,//车辆数 ,
        sCarSeats: null,//每车座位数 ,
        sGroupNum: 0,// 成团人数 ,
        sLeaveTime: '',// 出发时分 ,
        sPrint: null, //是否打印0:打印 1:不打印 ,
        sProductId: this.$route.query.id,// 产品ID ,
        sScheduleName: '',// 班期名称 ,
        sScheduleNo: '',// 班期编号 ,
        sShamNum: '',// 虚拟已售数 ,
        sSitType: 0,// 入座方式 0:不对号入座 1:对号入座(系统随机) 2:对号入座(人工选择) ,
        sStopSale: 30,// 停售时间 ,
        sStopType: 0,// 停售类型 0:分钟 1:小时 2:天数 ,
        tickets: [], // Array[TicketAddDTO]票信息,
        seatSold: 0 //已售数量
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
      //            banqiRule2: sData.banqiRule2,
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      saveUrl: api_prefix + "/Schedule/batchInsert",
      ticketListUrl: api_prefix + "/ticket/list",

      /*票价类目(基础)*/
      baseCategory:[],
      /*票价信息*/
      ticketList: [],
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
      currentCompany: null, //保存当前正在操作的公司id
      selectedList: [],  //保存当前操作班车的选中座位的list
      temptoraryTime: null,
      companyList: [],//单位列表
      loading: false
    }
  },
  mounted(){
    this.getProductDetail()
    this.getCategory();
  },
  methods: {
    getTipContent(index) {   //获取预留座位号的公司名称
      let busHolds = this.carList[this.currentCar].busHolds
      for (let i = 0; i < busHolds.length; i++) {
        if (busHolds[i].bSeat.split(",").indexOf(index.toString()) !== -1) {
          return busHolds[i].companyName ? busHolds[i].companyName : "暂无";
        }
      }
      return "没找到预留信息";
    },
    // 获取产品详情
    getProductDetail(){
        let httpdata={
          id: this.$route.query.id,
          lineType: 0
        }
        this.$http.post(api_prefix+'product/detail',httpdata).then(response => {
          if(response.data.code==0){
            this.banqiForm.sScheduleNo=this.typefilter(response.data.body.body.product.pType)+
            this.formatDate(new Date(), 'yyyy-MM-dd').replace(/-/g,"")+
            Math.floor(Math.random()*900+99)
          }else{
            this.$alert(response.data.message);
          }
        }, response => {
          console.log('获取产品详情出错了');
        });
    }, 
    typefilter(value){
      if(value){
        switch(value){
          case 10:
            return "GD";
            break;
          case 11:
            return "GC";
            break;
          case 20:
            return "CC";
            break;
          case 21:
            return "CD";
            break;
          case 30:
            return "YL";
            break;
          case 50:
            return "ZY";
            break;
          case 51:
            return "HD";
            break;
          case 52:
            return "DZ";
            break;
          case 54:
            return "HJ";
            break;
          case 55:
            return "QZ";
            break;
          case 56:
            return "JP";
            break;
          case 57:
            return "JD";
            break; 
          case 58:
            return "DX";
            break;
          case 59:
            return "QT";
            break;
          case 60:
            return "HW";
            break;
          case 61:
            return "YX";
            break;
          case 62:
            return "ZJ";
            break;
          case 63:
            return "LP";
            break; 
          case 64:
            return "LJ";
            break;
          case 65:
            return "LD";
            break;
          case 66:
            return "QZ";
            break; 
          case 67:
            return "DP";
            break; 
          case 68:
            return "ZT";
            break;                                                              
        }
      }else{
        // 未获取产品类型
        return "XXXX"
      }
    },  
    multiCanlederChange(value) {  //出发日期多选change事件
      this.multiCalendars = value;
      console.log(value);
    },
    lockSeat() {  //锁定车位
      if (this.currentCar < 0) {
        this.$alert("请选择车辆", "温馨提示", { type: "warning" });
        return
      }
      if (this.selectedList.length) {
        let bSeatsLock = this.carList[this.currentCar].bSeatsLock;
        console.log(this.carList[this.currentCar].holdList);
        this.selectedList = this.selectedList.filter(value => {
          return this.carList[this.currentCar].holdList.indexOf(value.toString()) == -1
        });
        if (bSeatsLock) {  //旧数据不为空 组合新旧锁定车位并去重
          let temp = {};
          bSeatsLock.split(",").concat(this.selectedList).forEach((value) => {
            temp[value] = "";
          });
          this.carList[this.currentCar].bSeatsLock = Object.keys(temp).map(value => {
            return value;
          }).join(",")
          temp = null;
        } else {  //如果旧数据为空，直接赋值
          this.carList[this.currentCar].bSeatsLock = this.selectedList.join(",")
        }
      } else {
        this.$alert("请选择车座", "温馨提示", { type: "warning" });
      }
      this.selectedList = [];
    },
    unlockSeat() {   //解锁
      if (this.currentCar < 0) {
        this.$alert("请选择车辆", "温馨提示", { type: "warning" });
        return
      }
      this.selectedList = this.selectedList.filter(date => {//过滤掉预留和未锁定的座位
        return this.carList[this.currentCar].bSeatsLock.split(",").indexOf(date.toString()) != -1 && this.carList[this.currentCar].holdList.indexOf(date.toString()) == -1
      }
      );
      if (this.selectedList.length) {
        this.carList[this.currentCar].bSeatsLock = this.carList[this.currentCar].bSeatsLock.split(",").filter(value => {
          return this.selectedList.indexOf(parseInt(value)) == -1
        }).join(",");
        this.selectedList = [];
      } else {
        this.$alert("请选择已经锁定的车座", "温馨提示", { type: "warning" });
      }
    },
    addTemporary() {    //预留车座信息
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
        this.$alert("请选择未预留或者锁定的车座", "温馨提示", { type: "warning" });
        return;
      }
      //先添加到bushold的数组中去，用于提交后台
      let busHold = this.getCurrentCompanyBusHold();
      if (busHold) {
        busHold.bSeat = this.selectedList.join(",");
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
      //再添加到临时变量中去，记录已经选中的车座
      let temp = {};
      this.carList[this.currentCar].holdList.concat(this.selectedList).forEach((value) => {
        temp[value] = "";
      });
      this.carList[this.currentCar].holdList = Object.keys(temp).map(value => {
        return value;
      })
      temp = null;
      //最后清除选中效果
      this.selectedList = [];
      console.log(this.carList[this.currentCar].holdList);
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
      this.carList[this.currentCar].busHolds.forEach(date => {    //遍历所有预留了的公司，在遍历每个公司预留的座位，删除选中的座位
        date.bSeat = date.bSeat.split(",").filter(seat => { return this.selectedList.indexOf(parseInt(seat)) == -1 }).join(",");
      });
      //处理一下预留显示使用的数组
      this.carList[this.currentCar].holdList = this.carList[this.currentCar].holdList.filter(seat => { return this.selectedList.indexOf(parseInt(seat)) == -1 })
      this.selectedList = [];
    },
    carNumChange(value) {    //车辆改变时，车辆列表改变
      let len = this.carList.length;
      if (value > len) {
        for (let i = 0; i < value - len; i++) {
          this.carList.push({
            holdList: [], //预留座位列表
            bSeatsLock: "",// 锁定位置，逗号分隔 ,
            bSeatsNum: this.banqiForm.sCarSeats || 0,// 座位数 ,
            busHolds: []// Array[车辆预留信息 新增DTO] 座位预留信息
          });
        }
      } else if (value < len) {
        for (let i = 0; i < len - value; i++) {
          this.carList.pop();
        }
      }
    },
    seatChange(value) {   //座位数改变
      if (this.currentCar > -1) {
        this.banqiForm.sCarSeats = value;
      } else {
        this.$alert("请选择车辆", "温馨提示", { type: "warning" });
      }
    },
    addCar() {  //新增车辆
      this.banqiForm.sCarNum += 1;
      this.carNumChange(this.banqiForm.sCarNum);
    },
    removeCar() {   //删除车辆
      if (this.banqiForm.sCarNum > 0) {
        if (this.currentCar > -1) {
          let num = this.currentCar;
          this.currentCar = -1;
          this.carList.splice(num, 1);
          this.banqiForm.sCarNum -= 1;
        } else {
            this.$alert("请选择车辆","温馨提示",{type:"warning"});
//          this.banqiForm.sCarNum -= 1;
//          this.carNumChange(this.banqiForm.sCarNum);
        }
      }
    },
    onSubmit(formName) {    //保存
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.dealBanqiFormData()) {
            return;
          }
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
          this.$message.error("提交失败");
        }
      });
    },
    dealBanqiFormData() {   //将临时变量赋值为表单对象
      if (this.addType == 2) { //批量添加
        this.multiCalendars && (this.banqiForm.calendars = this.multiCalendars.split(',').map(e => {return $.trim(e);}));
      } else {   //单个添加
        this.calendars && (this.banqiForm.calendars[0] = this.formatDate(this.calendars, "yyyy-MM-dd"));   //格式化开始时间
      }
      this.sLeaveTime && (this.banqiForm.sLeaveTime = this.sLeaveTime);     //格式化开始时分
      //        if (new Date(this.calendars.getFullYear(), this.calendars.getMonth(), this.calendars.getDate(), this.sLeaveTime.getHours(), this.sLeaveTime.getMinutes(), this.sLeaveTime.getSeconds()) < new Date()) {
      //          this.$alert("出发时间不能早于现在", '温馨提示', {type: "warning"});
      //          return false;
      //        }
      for (let i = 0; i < this.banqiForm.calendars.length; i++) {
        let date = new Date(this.banqiForm.calendars[i]);
        let now = new Date(this.formatDate(new Date(), 'yyyy-MM-dd'));
        console.log(date, now);
        if (date < now) {
          this.$alert("出发时间不能早于今天", '温馨提示', { type: "warning" });
          return false;
        }
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
      this.banqiForm.tickets = selectedTicketArray;    //赋值票价信息
      this.banqiForm.busDTOS = this.carList;   //赋值车辆以及座位信息
      return true;
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
        this.$router.push({ name: "declareConfigSchedule" ,query:{id:this.$route.query.id,c_id:this.$route.query.c_id}});
      }).catch(() => {

      });

    },
    defaultTicketList() {     //默认加载票价信息
      if (this.banqiForm.sProductId) {
        let logindata = JSON.parse(sessionStorage.loginData);
        this.loginCompanyId = logindata.uCompanyId;
        let date = Object.assign(this.ticketPage, { tProductId: this.banqiForm.sProductId, tStatus: 0 ,tCompanyId:this.loginCompanyId});
        this.dealHttpReseponse(this.ticketListUrl, date, (response) => {
          let data = response.data.body;
          setTimeout(() => {      //延时选中回显数据
          this.ticketList.forEach(date => {
            // 票价类目转换
            date.tCategory=this.filterCategory(date.tCategory);
          })
        }, 200);
          this.ticketList =  data.list;
          this.ticketPage.currPage = response.body.body.pageNum;
          this.ticketPage.total = response.body.body.total;
        });
      }
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
    currentPageChange(value) {  //票价列表翻页
      if (value != this.ticketPage.currPage) {
        this.ticketPage.currPage = value;
        this.defaultTicketList();
      }
    },
    pageSizeChange(value) {

    },
    setSeat(index) {
      let indexOfArray = this.selectedList.indexOf(index);
      if (indexOfArray == -1) {
        this.selectedList.push(index)
      } else {
        this.selectedList.splice(indexOfArray, 1);
      }
    },
    addSingleTicket() {//添加单票

    },
    removeSingleTicket() {
    },
    handleCurrentChange(row) {
      this.selectedList = [];
      this.currentCar = this.carList.indexOf(row);
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
    dealHttpReseponse(url, data, fun, type) {    //post请求
      type || (type = 'post')
      this.$http[type](url, data).then(response => {
        if (response.body.code == 0) {
          fun(response);
        } else {
          this.$alert(response.body.message, '温馨提示', 'error');
        }
      }, response => {
        this.$alert("网络错误", '温馨提示', 'error');
      });
    },
    defaultBanqiForm() {
      if (this.$route.query.banqi) {
        let data = this.$route.query.banqi;
        let banqiForm = JSON.parse(data);
//        banqiForm.sSitType = banqiForm.sSitType.toString();
        banqiForm.sCalendar && (this.calendars = new Date(banqiForm.sCalendar));
        banqiForm.sLeaveTime && (this.sLeaveTime = banqiForm.sLeaveTime);
        console.log(banqiForm);
        this.banqiForm = banqiForm
      }
    }
  },
  created() {
    this.currentCompany = '';
    this.companyList = [];
    this.defaultTicketList();
    this.defaultCompanyList();
  }

}
</script>

<style>
/*.el-table el-table--fit el-table--border el-table--enable-row-hover{*/


/*height: 500px;*/


/*}*/


/*.el-table{*/


/*overflow: unset;*/


/*}*/


/*.el-table__body-wrapper{*/


/*height:500px;*/


/*}*/

.myclass>.el-table__body-wrapper {
  overflow: inherit
}
</style>
