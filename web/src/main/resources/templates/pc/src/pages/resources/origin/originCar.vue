<template>
  <div class="jdy-content jdy-resources fleft noborder">
    <div class="jdy-content-inner-trip">
      <div class="jdy-search clearfix p10">
        <div class="inlineblock mr10 ">
          去程返程:
          <el-select v-model="search.sbReturn" clearable placeholder="请选择往返情况" class="jdy-search-edit  mr10">
            <el-option v-for="type in types" :key="type.code" :label="type.name" :value="type.code">
            </el-option>
          </el-select>
        </div>
        <div class="inlineblock mr10 ">
          快速搜索:
          <el-input placeholder="请输入始发站名称" v-model="search.sbStartPoint" class="w200">
            <el-button slot="append" icon="search" class="btnbg" @click="getTableData"></el-button>
          </el-input>
        </div>
        <el-button type="primary" class="fright mt10" @click="add">添加</el-button>
        <el-button type="default" class="fright mt10 mr10" @click="goback('origin')">返回</el-button>
      </div>
      <!--jdy-search end-->

      <div class="jdy-table p10">
        <p v-if="showFlag!=1">往返类型：去程</p>
        <el-table :data="goTableData" border class=" all mt10" v-if="showFlag!=1">
          <el-table-column label="出发时间" width="">
            <template scope="scope">
              {{formatDate(new Date(scope.row.sbTime), "hh:mm")}}
            </template>
          </el-table-column>
          <el-table-column label="时差(分钟)" width="">
            <template scope="scope">
              {{scope.row.sbTimeLength}}分钟
            </template>
          </el-table-column>
          <el-table-column label="出发地——始发站" width="">
            <template scope="scope">
              {{ $route.query.name }}&nbsp;—&nbsp;{{ scope.row.sbStartPoint }}
            </template>
          </el-table-column>
          <el-table-column label="结算价" width="">
            <template scope="scope">
              {{ parseFloat(scope.row.sbPrice).toFixed(2)}}
            </template>
          </el-table-column>
          <el-table-column label="周几有效" width="">
            <template scope="scope">
              {{ getEffctiveDay(scope.row.sbEffectWeek) || "无" }}
            </template>
          </el-table-column>
          <el-table-column label="开始时间——结束时间" width="">
            <template scope="scope">
              {{formatDate(new Date(scope.row.sbStartTime), "yyyy-MM-dd")}}
              &nbsp;—&nbsp; {{formatDate(new Date(scope.row.sbEndTime), "yyyy-MM-dd")}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250" fixed="right">
            <template scope="scope">
              <el-button type="default" size="mini" @click="edit(scope.row)">
                编辑
              </el-button>
              <el-button type="default" class="red" @click="del(scope.row.id)" size="mini">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>


        <p class="mt30" v-if="showFlag!=0">往返类型：返程</p>
        <el-table :data="returnTableData" border class=" all mt10" v-if="showFlag!=0">
          <!-- <el-table-column label="序号" type="index" width="60">
          </el-table-column> -->
          <el-table-column label="出发时间" width="">
            <template scope="scope">
              <!--{{formatDate(new Date(scope.row.sbTime), "hh:mm")}}-->
              ——
            </template>
          </el-table-column>
          <el-table-column label="时差(分钟)" width="">
            <template scope="scope">
              {{scope.row.sbTimeLength}}分钟
            </template>
          </el-table-column>
          <el-table-column label="出发地——始发站" width="">
            <template scope="scope">
              {{ scope.row.sbStartPoint }}&nbsp;— &nbsp;{{$route.query.name }}
            </template>
          </el-table-column>
          <el-table-column label="结算价" width="">
            <template scope="scope">
              {{ parseFloat(scope.row.sbPrice).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column label="周几有效" width="">
            <template scope="scope">
              {{ getEffctiveDay(scope.row.sbEffectWeek) || "无" }}
            </template>
          </el-table-column>
          <el-table-column label="开始时间——结束时间" width="">
            <template scope="scope">
              {{formatDate(new Date(scope.row.sbStartTime), "yyyy-MM-dd")}}
              &nbsp;—&nbsp;{{formatDate(new Date(scope.row.sbEndTime), "yyyy-MM-dd")}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250" fixed="right">
            <template scope="scope">
              <el-button type="default" size="mini" @click="edit(scope.row)">
                编辑
              </el-button>
              <el-button type="default" class="red" @click="del(scope.row.id)" size="mini">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>


        <!-- 分页   begin-->
        <div class="clearfix">
          <el-pagination class="fright mt20" @current-change="handleCurrentChange"
                         :current-page.sync="search.currPage" :page-size="search.pageSize"
                         layout="prev, pager, next, jumper"
                         :total="search.tableDataTotal">
          </el-pagination>
        </div>
        <!-- 分页   end-->

      </div>
      <!--jdy-table end-->

      <!--jdy-alert begin -->
      <jdy-alert title="添加/编辑班车信息" @closeAlert="departurePlaceClose" v-if="departurePlaceFlag"
                 class=" alertDeparturePlace2 alertTag alertJournal dialog-lv" style="width:750px;">

        <el-form :model="departurePlaceForm" :rules="departurePlaceRule" ref="departurePlaceForm"
                 class="demo-form-inline" label-width="120px">
          <div class="clearfix p10 mt15 alertHeight">
            <div class="alertScroll pr50">
              <el-row>
                <el-form-item label="往返情况:" prop="sbReturn">
                  <el-select v-model.number="departurePlaceForm.sbReturn" placeholder="请选择往返情况" class="all" @change="returnTypeChange">
                    <el-option v-for="type in shortTypes" :key="type.code" :label="type.name" :value='type.code'>
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="交通方式:" prop="sbTraffic">
                  <el-select v-model.number="departurePlaceForm.sbTraffic" placeholder="请选择交通方式" class="all">
                    <el-option v-for="type in dTypes" :key="type.code" :label="type.name" :value="type.code">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="出发时间:" prop="dName">
                  <el-time-picker v-model="departurePlaceForm.sbTime" :disabled="departurePlaceForm.sbReturn===1" :picker-options="{
                                format: 'HH:mm'
                              }" format="HH:mm" placeholder="请输入出发时间" clearable :editable="false" style="width: 100%;">
                  </el-time-picker>
                </el-form-item>
                <el-form-item label="时差(min):" prop="sbTimeLength">
                  <el-input-number style="width: 100%;" :min=0 :controls="false"
                                   v-model.number="departurePlaceForm.sbTimeLength"
                                   placeholder="请输入时差（单位分钟）"></el-input-number>
                </el-form-item>
                <el-form-item label="结算价:" prop="sbPrice">
                  <el-input v-model="departurePlaceForm.sbPrice" placeholder="请输入结算价"></el-input>
                </el-form-item>
                <el-form-item label="起(终)点站:" prop="sbStartPoint">
                  <!--<el-input v-model="departurePlaceForm.sbStartPoint" placeholder="请输入起（终）点站"></el-input>-->
                  <el-select  v-model="departurePlaceForm.sbStartPoint" placeholder="请输入起（终）点站" class="all" @change="startPoinChange" :filterable="true" :remote-method="searchStart" clearable remote>
                    <el-option :value="item.dName" :label="item.dName" :key="item.id" v-for="item in startList"></el-option>
                  </el-select>
                </el-form-item>
                <el-row>
                  <el-col :span="12">
                      <el-form-item label="开始时间:" prop="sbStartTime">
                        <el-date-picker
                          v-model="departurePlaceForm.sbStartTime"
                          type="date"
                          placeholder="选择开始日期"
                          class="all"
                          :picker-options="pickerOptions0" style="width: 100%;">
                        </el-date-picker>
                      </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="结束时间:" prop="sbEndTime">
                      <el-date-picker
                        v-model="departurePlaceForm.sbEndTime"
                        type="date"
                        placeholder="选择结束日期"
                        class="all"
                        :picker-options="pickerOptions0" style="width: 100%;">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item label="周几有效:" prop="sbEffectWeek">
                  <el-checkbox label="all" @change="selectAllDay" style="float:left;margin-right:10px">全选</el-checkbox>
                  <el-checkbox-group v-model="departurePlaceForm.sbEffectWeek" class="all">
                    <el-checkbox :key="value" :label="index" v-for="(value,index) in WeekDay">{{value}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-row>
              <el-form-item label="应用于返程:" prop="dName">
                <el-checkbox v-model="useInBack" :disabled="!(!departurePlaceForm.id && departurePlaceForm.sbReturn===0)"></el-checkbox>
              </el-form-item>
              <el-row>
                <el-form-item label="友情提示:" prop="dArea">
                  <div class="c5e">1.出发时间、起（始）站点 、开始、结束日期不能存在相交的现象</div>
                  <div class="mt05 c5e">2.出发时间必需是正确认得时间格式，例： 10:30</div>
                  <div class="mt05 c5e">3.时差请填写分钟，例： 30</div>
                </el-form-item>
              </el-row>
            </div>
          </div>
          <div class="alertfoot1 clearfix" style="height:100px">
            <el-button class="fright mt10 mr10" @click="departurePlaceClose">关闭</el-button>
            <el-button type="primary" class="fright mt10 mr10"  :disabled="btnFlag" @click="submitForm('departurePlaceForm')">保存</el-button>
          </div>
        </el-form>
      </jdy-alert>

      <!--jdy-alert end-->

    </div>
    <!--jdy-content-inner-trip end-->
  </div>
  <!--jdy-content end-->
</template>

<script>
  import jdyAlert from '@/components/Alert';
  import oData from './o.js';
  import ElCheckbox from "../../../../node_modules/element-ui/packages/checkbox/src/checkbox";
  import ElRow from "element-ui/packages/row/src/row";
  import ElCol from "element-ui/packages/col/src/col";
  export default {
    name: 'Schedule',
    data() {
      return {
        btnFlag:false,
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        showFlag:0,
        types: [{code: 0, name: '去程'}, {code: 1, name: '返程'}, {code: 2, name: '全部'}],
        shortTypes: [{code: 0, name: '去程'}, {code: 1, name: '返程'}],
        search: {
          sbReturn: 2,
          sbStartPoint: null,
          sbDepartureId: this.$route.query.id,
          currPage: 1,
          pageSize: 10,
          tableDataTotal: 0,
          sbStatus:0
        },
        returnTableData: [],
        goTableData: [],
        departurePlaceFlag: false,
        departurePlaceForm: {
          sbDepartureId:this.$route.query.id,
          id: null,
          sbTime: null,//出发时间
          sbTraffic: '',//交通工具
          sbReturn: '', //返程类型
          sbTimeLength: null,//时差
          sbPrice: null,//结算价
          sbShuttleStopId:null,
          sbStartPoint: null,//始发站
          sbStartTime: null, //开始时间
          sbEndTime: null, //结束时间
          sbEffectWeek: [],
          useForBack:0
        },
        useInBack:false,
        departurePlaceRule: {
          sbTraffic: [{
            required: true,
            type: 'number',
            message: '请选择交通方式',
            trigger: 'change'
          }],
          sbReturn: [{
            required: true,
            type: 'number',
            message: '请选择往返情况',
            trigger: 'change'
          }],
          sbStartPoint: [{
            required: true,
            message: '请选择起（终）点站',
            trigger: 'change'
          }],
          sbStartTime: [{
            required: true,
            type: 'date',
            message: '请选择开始时间',
            trigger: 'change'
          }],
          sbEndTime: [{
            required: true,
            type: 'date',
            message: '请选择结束时间',
            trigger: 'change'
          }],
          sbEffectWeek: [{
            required: true,
            type: 'array',
            message: '请选择周几有效',
            trigger: 'change'
          }]
        },
        startList: [],
        radio: 1,
        startName:'',
        dTypes: [{code: 0, name: '飞机'}, {code: 1, name: '火车'}, {code: 2, name: '汽车'}, {code: 3, name: '邮轮'}],
        simpleWeekDay: ["一", "二", "三", "四", "五", "六", "日"], //星期列表。
        WeekDay: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"], //星期列表。
        weekDayValue:[0,1,2,3,4,5,6]
      }
    },
    methods: {
      startPoinChange(value){
          this.startList.forEach(start => {
              if(start.dName == value){
                  this.departurePlaceForm.sbShuttleStopId = start.id
              }
          });
      },
      returnTypeChange(value){
          if(value===1){
              this.departurePlaceForm.sbTime = null
              this.useInBack = false;
          }
      },
      goback(url){
        this.$router.push({name:"origin"})
    },
    getTableData() {
      let data = {};
      if (this.search.sbReturn == 2) {  //如果是全部时，过滤掉sbReturn属性
        Object.assign(data, this.search, {sbReturn: null})
      } else {
        data = this.search
      }
      this.$http.post(api_prefix + 'shuttle_bus/list', data).then(response => {
        if (response.body.code == '0') {
          this.showFlag = this.search.sbReturn;
          this.search.tableDataTotal = response.body.body.totalNum;
          if (this.search.sbReturn === 0) { //如果查询的是去程
            this.goTableData = response.body.body.resultList;
          }
          else if (this.search.sbReturn === 1) {//如果查询的是返程
            this.returnTableData = response.body.body.resultList;
          } else {  //如果查询的是全部就分流
            this.goTableData = [];
            this.returnTableData = [];
            response.body.body.resultList.forEach(row => {
              if (row.sbReturn === 0) {
                this.goTableData.push(row)
              } else {
                this.returnTableData.push(row)
              }
            });
          }
        } else {
          this.$alert(response.body.message, '温馨提示', {type: 'warning'});
        }
      }, response => {
        this.$alert('网络错误', '温馨提示', {type: 'warning'});
      });
    },
    getEffctiveDay(value) {  //获取周几有效
      let str = "";
      value.toString().split("").forEach((value, index) => {
        if (!isNaN(value) && parseInt(value)) {
          str += this.simpleWeekDay[index]
        }
      })
      return str;
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
    add() {
      var alertClass = 'alertDeparturePlace2';
      this.departurePlaceFlag = true;

      if (this.departurePlaceFlag) {
        this.$nextTick(function () {
          jdyFn.setAlertStyle(alertClass);
          // this.search.addProduct = '';
        });
      }
    },
    edit(form) {
      this.departurePlaceForm = this.reFormmartFormDate(form);
      console.log(this.departurePlaceForm);
      this.add();
    },
    reFormmartFormDate(form){
      let array = [];
      if(form.sbEffectWeek){
        form.sbEffectWeek.split('').forEach((day,index) => {if(day == 1){array.push(index)}});
      }
      return Object.assign({},form,{sbEffectWeek:array,sbStartTime:new Date(form.sbStartTime),sbEndTime:new Date(form.sbEndTime),sbTime:new Date(form.sbTime)});
    },
    del(id) {
      this.$confirm('此操作将永久删除该班车, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post(api_prefix + 'shuttle_bus/del',{"id": id,sbDepartureId:this.$route.query.id}
        ).then(response => {
          if(response.body.code == '0'){
            this.$message.success("删除成功");
            this.getTableData();
          }else{
            this.$alert(response.body.message,'温馨提示',{type:'warning'});
          }
        }, response => {
          this.$alert('网络错误','温馨提示',{type:'warning'});
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    loadStartList(){
      this.$http.post(api_prefix + 'departure/start_site_group', {"dName":this.startName}).then((response) => {
        this.startList = response.body.body.resultList;
        console.log(this.startList);
      }, response => {
        this.$alert("网络错误", '温馨提示', {type: 'warning'});
      });
    },
    searchStart(name){
      this.startName = name;
      this.loadStartList();
    },
    handleCurrentChange(val) {
      if (val) {
        this.search.currPage = val
        this.getTableData();
      }
    },
    departurePlaceClose() {
      this.btnFlag = false;
      this.departurePlaceFlag = false;
      $('.alertbgg').remove();
      this.useInBack = false;
      this.departurePlaceForm= {
        id:null,
        sbTime: null,//出发时间
        sbTraffic: '',//交通工具
        sbReturn: '', //返程类型
        sbTimeLength: null,//时差
        sbPrice: null,//结算价
        sbStartPoint: null,//始发站
        sbStartTime: null, //开始时间
        sbEndTime: null, //结束时间
        sbEffectWeek: [],
        sbDepartureId:this.$route.query.id,
        useForBack:0
      }
    },
    submitForm(refName){
      console.log(this.useInBack);
      this.$refs[refName].validate(valid => {
        if (valid) {
          let data = this.formatSubmitDate();
          let url = null;
          if (data.id) {
            url = api_prefix + 'shuttle_bus/update';
          } else {
            url = api_prefix + 'shuttle_bus/save';
          }
          this.btnFlag = true;
          this.$http.post(url, data).then(response => {
            this.btnFlag = false;
            if (response.body.code == '0') {
              this.$message.success("保存成功");
              this.departurePlaceClose();
              this.getTableData();
            } else {
              this.$alert(response.body.message, '温馨提示', {type: 'warning'});
            }
          }, response => {
            this.btnFlag = false;
            this.$alert('网络错误', '温馨提示', {type: 'warning'});
          });
        } else {
          this.$message.error("保存失败");
        }
      });
    },
    formatSubmitDate(){
      let data = {};
      let days = '0000000';
      days = days.split('').map((day, index) => {
        if (this.departurePlaceForm.sbEffectWeek.indexOf(parseInt(index)) != -1) {
          return 1
        } else {
          return 0;
        }
      }).join('');
      Object.assign(data, this.departurePlaceForm, {
        sbEffectWeek: days,
        sbStartTime: this.formatDate(this.departurePlaceForm.sbStartTime, 'yyyy-MM-dd'),
        sbEndTime: this.formatDate(this.departurePlaceForm.sbEndTime, 'yyyy-MM-dd')
      })
      if(!data.id && this.useInBack){
        data.useForBack = 1
      }
      return data;
    },
    selectAllDay(event){
      this.departurePlaceForm.sbEffectWeek = event.target.checked ? this.weekDayValue : [];
    }
  },
  created() {
    this.getTableData();
      this.loadStartList();
    },
    components: {
      ElCol,
      ElRow,
      ElCheckbox,
      jdyAlert
    }
  }
</script>
<style scoped>
  .jdyalert{height: auto;}
  .alertScroll{height: 81%;}
  .alertHeight{height: 81%;}
</style>
