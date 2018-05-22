<template>
  <div class="jdy-content jdy-transfer fleft">
    <div class="jdy-content-inner-trip">
      <div class="jdy-search clearfix p10 jl-information">
        <div class="inlineblock mr10 ">
          公司类型:
          <el-select v-model="search.company" clearable placeholder="请选择公司类型" class="jdy-search-edit  mr10">
            <el-option key="2" label="管理公司" :value="2">
            </el-option>
            <el-option key="0" label="供应商" :value="0">
            </el-option>
            <el-option key="3" label="分销中心" :value="3">
            </el-option>
          </el-select>
        </div>
        <div class="inlineblock mr10 ">
          公司所在地:
          <div class="inlineblock relative">
            <div class="el-input">
              <input autocomplete="off" v-model="search.address" placeholder="请选择单位所在地" type="text" rows="2" validateevent="true" @click="getCity" class="el-input__inner">
            </div>
            <!-- <el-input class="" v-model="search.address" placeholder="点击查询公司所在地" @click="getCity" ></el-input> -->
            <i class="el-input__icon el-icon-caret-top f13" style="transform: rotateZ(180deg);" @click="getCity"></i>
            <div class="selectcitybox absolute" v-if="cityboxFlag">
              <div class="selectcitybox-i">
                <ul>
                  <li class="clearfix">
                    <div class="provicebox fleft">
                      直辖市
                    </div>
                    <div class="citybox fleft">
                      <span @click="selectCity(1,'北京')" :class="{active:selectEd==1}">北京</span>
                      <span @click="selectCity(2,'上海')" :class="{active:selectEd==2}">上海</span>
                      <span @click="selectCity(3,'天津')" :class="{active:selectEd==3}">天津</span>
                      <span @click="selectCity(4,'重庆')" :class="{active:selectEd==4}">重庆</span>
                    </div>
                  </li>
                  <li class="clearfix" v-for="(citys,key) in proviceArr">
                    <div class="provicebox fleft">
                      {{key}}
                    </div>
                    <div class="citybox fleft">
                      <span v-for="city in citys" @click="selectCity(city.id,city.name)" :class="{active:selectEd==city.id}">{{city.name}}</span>
                    </div>
                  </li>

                </ul>
              </div>
            </div>
            <!-- <jdy-where v-model="search.address" ></jdy-where> -->
          </div>
        </div>
        <div class="inlineblock mr10 ">
          快速搜索:
          <el-input placeholder="单位名称，编号" v-model="search.quick" class="w250">
          </el-input>
        </div>
        <el-button type="primary" @click="getTableData" class="el-button btnbg el-button--primary">搜索</el-button>
        <el-button type="primary" class="fright mt10" @click="go">添加</el-button>
        <el-button type="default" class="fright mt10 mr10" @click="alertJournal">日志</el-button>
        <el-button type="default" class="fright mt10 " v-loading.fullscreen.lock="fullscreenLoading" @click="refresh">刷新</el-button>
      </div>
      <!--jdy-search end-->

      <!--table begin-->
      <div class="jdy-table p10">
        <el-table :data="tableData" border class=" all" @row-click="rowclickHandler" highlight-current-row>
          <!-- <el-table-column label="序号" type="index" width="60">
                </el-table-column> -->
          <el-table-column label="编号" width="">
            <template scope="scope">
              {{scope.row.cNo }}
            </template>
          </el-table-column>
          <el-table-column label="单位名称" width="">
            <template scope="scope">
              <!--<span v-if="scope.row.dType==0">始发站</span>-->
              {{scope.row.cName}}
            </template>
          </el-table-column>
          <el-table-column label="单位类型" width="">
            <template scope="scope">
              <div v-for="(value, key) in cTypes">
                <span v-if="scope.row.cType==key">{{ value }}</span>
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column label="是否开户" width="">
            <template scope="scope">
              <div class="radiusbox radiusbox-red inlineblock" v-if="scope.row.cOpenAccount==2 || scope.row.cOpenAccount==3">收</div>
              <div class="radiusbox radiusbox-blue inlineblock" v-if="scope.row.cOpenAccount==1 || scope.row.cOpenAccount==3">付</div>
              <div class="inlineblock" v-else>未开户</div>
            </template>
          </el-table-column> -->
          <el-table-column label="设置结算" width="">
            <template scope="scope">
              <span v-if="scope.row.hasSetting">已设置</span>
              <span v-else>未设置</span>
            </template>
          </el-table-column>
          <el-table-column label="收款账户余额" width="">
            <template scope="scope">
              {{"--"}}
            </template>
          </el-table-column>
          <el-table-column label="付款账户余额" width="">
            <template scope="scope">
              {{"--"}}
            </template>
          </el-table-column>
          <el-table-column label="法人代表" width="">
            <template scope="scope">
              {{scope.row.cChargeName}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250" fixed="right">
            <template scope="scope">
              <el-button type="default" size="mini" @click="edit(scope.row.id)">
                <!-- v-if="scope.row.operation.edit==1" -->
                编辑
              </el-button>
              <el-button type="default" class="red" @click="del(scope.row.id)" size="mini">
                <!-- v-if="scope.row.operation.del==1" -->
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页   begin-->
        <div class="clearfix">
          <el-pagination class="fright mt20" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper" :total="tableDataTotal">
          </el-pagination>
        </div>
        <!-- 分页   end-->

      </div>
      <!--jdy-table end-->

      <!--<jdy-alert title="开户" @closeAlert="addClose" v-if="addFlag" class=" alertCompany">-->

      <!--<el-form :model="companyForm" :rules="companyFormRule" ref="companyForm" class="demo-form-inline" label-width="120px">-->
      <!--<div class="clearfix p10 pr50">-->
      <!--<el-row class="mt20">-->
      <!--<el-form-item label="单位编号:" prop="dName">-->
      <!--<el-input v-model="companyForm.cNo" placeholder="请输入单位编号" readonly="readonly">-->
      <!--</el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="单位名称:" prop="dTraffic">-->
      <!--<el-input v-model="companyForm.cName" placeholder="请输入单位名称" readonly="readonly">-->
      <!--</el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="品牌简称:">-->
      <!--<el-input v-model="companyForm.dThree" placeholder="暂无品牌简称" readonly="readonly" >-->

      <!--</el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="营业执照:">-->
      <!--<el-input v-model="companyForm.cLicenseCode" placeholder="请输入营业执照">-->
      <!--</el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="开户备注:">-->
      <!--<el-input v-model="companyForm.dThree" placeholder="暂无开户备注" readonly="readonly">-->
      <!--</el-input>-->
      <!--</el-form-item>-->
      <!--</el-row>-->

      <!--</div>-->
      <!--<div class="alertfoot1 clearfix">-->
      <!--<el-button class="fright mt10 mr10" @click="addClose">关闭</el-button>-->
      <!--<el-button type="primary" class="fright mt10 mr10" @click="submitForm('companyForm')">保存</el-button>-->
      <!--</div>-->
      <!--</el-form>-->
      <!--</jdy-alert>-->

    </div>
    <!--jdy-content-inner end-->
    <jdy-alert title="系统日志查看" v-if="alertJournalFlag" @closeAlert="alertJournal" class="alertJournal">
      <jdy-log :alertJournalFlag="alertJournalFlag" :journalCurrentData="journalCurrentData" :journalTotal="journalTotal" :pid="pid" :module="module" @listenToChildEvent="alertJournal"></jdy-log>
    </jdy-alert>
  </div>
  <!--jdy-content end-->
</template>

<script>
import jdyAlert from '@/components/Alert';
import jdyWhere from '@/components/Where';
import jdyLog from '@/components/Log';
import sData from './s.js';
export default {
  name: 'Schedule',
  data() {
    return {
      Municipalities: ['北京', '上海', '天津', '重庆'],
      proviceArr: [],
      msg: 'Schedule',
      selectEd: '',
      search: {
        company: "",
        address: "",
        quick: "",
        startStation: ""
      },
      tableData: [], //列表数据 array
      addStartStationFlag: false,
      companyForm: sData.companyForm,
      companyFormRule: sData.companyFormRule,
      currentPage: 1, //列表当前所在页,
      pageSize: 20,
      tableDataTotal: 0,
      multipleSelection: [],
      multipleSelection3: [],
      dTypes: { "0": "飞机", "1": "火车", "2": "汽车", "3": "邮轮" },
      addFlag: false,
      cityboxFlag: false,
      cTypes: { "0": "供应商","2": "管理公司" ,"3": "分销中心"},
      addFlag: false,
      fullscreenLoading: false,
      alertJournalFlag: false, //系统日志查看 弹窗值
      journalStyle: { //系统日志弹窗位置
        top: '164px',
        left: '300px'
      },
      pid: null,
      module: "Company",
      journalTotal: 0,
      journalCurrentData: [] //日志数据
    }
  },
  methods: {
    selectCity(id, city) {
      this.selectEd = id; //class设置active
      this.search.address = city; //选中城市
      this.cityboxFlag = false; //隐藏弹窗
    },
    getCity() {//隐藏显示弹窗
      this.cityboxFlag = !this.cityboxFlag;
    },
    go() {
      this.$router.push({ name: 'companyInfo' })
      //      location.href="http://localhost:9090/system.html#/company/info"
    },
    edit(id) {
      this.$router.push({ name: 'companyInfo', query: { id: id } })
      //      location.href="http://localhost:9090/system.html#/company/info?id="+id
    },
    del(id) {
      var that = this;
      this.$confirm('确定删除吗', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post(api_prefix + '/Company/del', { "id": id }, { emulateJSON: true }).then(response => {
          var data = response.body;
          if (data.code == "0") {
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            });
            this.getTableData();
          } else {
            this.$message({
              showClose: true,
              message: '删除失败',
              type: 'error'
            });
          }
        }, response => {
          this.$alert("请求失败~");
        });
      }).catch(() => {

      });


    },
    //关闭,打开日志弹窗
    alertJournal(alertJournalFlag) {
      if (!this.pid) { this.$alert("请选择公司", "温馨提示", { type: "warning" }); return }
      this.alertJournalFlag = !this.alertJournalFlag
      if (this.alertJournalFlag) {
        this.$nextTick(function() {
          jdyFn.setAlertStyle('alertJournal');
        });
      }
    },
    //获取日志数据
    getLogData(index) {
      this.$http.post(api_prefix + '/logs/selectLogs?pageIndex=' + index + '&module=' + this.module + '&pid=' + this.pid
      ).then(response => {
        let _self = this;
        this.journalTotal = response.data.body.total;
        this.journalCurrentData = []
        response.data.body.list.forEach(function(value) {
          _self.journalCurrentData.push(value);
        });
        // this.journalCurrentData=response.data.body.list
      }, response => {
        console.log('获取日志出错了');
      });
    },
    //table行点击事件
    rowclickHandler(row, event, column) {
      console.log(row);
      this.pid = row.id;
      if (!this.companyId) { this.companyId = row.companyId }
      this.getLogData(1)
    },
    getTableData() {//搜索
      this.$http.post(api_prefix + '/Company/index', { type: this.search.company, pageIndex: this.currentPage, fastSearchStr: $.trim(this.search.quick), city: this.search.address }, { emulateJSON: true }).then(response => {
        var data = response.body;
        if (data.code == '0') {
          this.tableData = data.body.list;
          this.tableDataTotal = data.body.total;
        } else {
          this.$alert(data.message);
        }
      }, response => {
        var data = response.body;
        this.$alert(data.message);
      });
    },
    submitForm(id) {
      this.$http.post(api_prefix + '/Company/openAccount',
        {
          "companyId": id,
        }
        , { emulateJSON: true }).then(response => {
          var data = response.body;
          this.getTableData();
        }, response => {
          var data = response.body;
          this.$alert(data.message);
        });

    },
    handleCurrentJournalChange(index) { //日志  page
      var index = index - 1;
      //this.journalCurrentData = listData.journalData[index]
    },
    handleSizeChange(val) {
      //      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {

      if (val) {
        var obj = { 'currentPage': val }
        this.currentPage = val;
        this.getTableData(obj);
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
    ,
    handleSelectionChange3(val) {
      this.multipleSelection3 = val;
    },
    add(value) {
      this.$confirm('你确定要开户吗？', '友情提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        this.submitForm(value.id);
      })
      //        this.companyForm = value;
      //      var alertClass = 'alertCompany';
      //      this.addFlag = true;
      //      if (this.addFlag) {
      //        this.$nextTick(function () {
      //          jdyFn.setAlertStyle(alertClass);
      //        });
      //      }
    },
    addClose() {
      this.addFlag = false;
      $('.alertbgg').remove();
    },
    getDefaultProvinceStr() {
      this.$http.post(api_prefix + '/City/selectCityPutList', {}).then(response => {
        let body = response.body.body;
        for (var p in body) {
          if (this.Municipalities.indexOf(p) != -1) {
            delete body[p];
          }
        }
        console.log(body);
        this.proviceArr = body;
      });
    },
    refresh() {
      this.fullscreenLoading = true;
      setTimeout(() => {
        this.fullscreenLoading = false;
        this.$message({
          showClose: true,
          message: '刷新成功',
          type: 'success'
        });
        this.search = {
          company: "",
          address: "",
          quick: "",
          startStation: ""
        },
          this.getTableData();
      }, 1000);
    }
  },
  created() {
    this.getDefaultProvinceStr();
    this.getTableData();
  },
  components: {
    jdyAlert,
    jdyWhere,
    jdyLog
  }

}
</script>

