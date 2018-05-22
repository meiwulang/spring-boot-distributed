<template>
  <div class="jdy-content jdy-transfer fleft">
    <div class="jdy-content-inner-trip">
      <div class="jdy-search clearfix p10">
        <div class="inlineblock mr10 ">
          快速搜索:
          <el-input placeholder="编号、角色名称等" v-model="search.quick" class="w200">
            <el-button slot="append" icon="search" class="btnbg" @click="getTableData"></el-button>
          </el-input>
        </div>
        <el-button type="default" class="fright mt10 ">日志</el-button>
        <el-button type="default" class="fright mt10 mr10">刷新</el-button>
      </div>
      <!--jdy-search end-->
  
      <!--table begin-->
      <div class="jdy-table p10">
        <el-table :data="tableData" border class=" all">
         <el-table-column label="序号" type="index" width="60">
              </el-table-column>
         
          <el-table-column label="单位名称" width="">
            <template scope="scope">
              <span v-if="scope.row.dType==0">始发站</span>
            </template>
          </el-table-column>
          <el-table-column label="法人代表" width="">
            <template scope="scope">
              <div v-for="(value, key) in dTypes">
                <span v-if="scope.row.dType==key">{{ value }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="手机号码" width="">
            <template scope="scope">
            </template>
          </el-table-column>
          <el-table-column label="公司类型" width="">
            <template scope="scope">
            </template>
          </el-table-column>
          <el-table-column label="审核状态" width="">
            <template scope="scope">
            </template>
          </el-table-column>
          <el-table-column label="身份证" width="">
            <template scope="scope">
            </template>
          </el-table-column>
          <el-table-column label="注册时间" width="">
            <template scope="scope">
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250" fixed="right">
            <template scope="scope">
              <el-button type="default" size="mini" @click="examine">
                <!-- v-if="scope.row.operation.edit==1" -->
                审核
              </el-button>
              <el-button type="default" class="red" @click="del" size="mini">
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
  
      <jdy-alert title="开户" @closeAlert="addClose" v-if="addFlag" class=" alertCompany">
  
        <el-form :model="companyForm" :rules="companyFormRule" ref="companyForm" class="demo-form-inline" label-width="120px">
          <div class="clearfix p10 pr50">
            <el-row class="mt20">
              <el-form-item label="单位编号:" prop="dName">
                <el-input v-model="companyForm.dName" placeholder="请输入单位编号">
                </el-input>
              </el-form-item>
              <el-form-item label="单位名称:" prop="dTraffic">
                <el-input v-model="companyForm.dName" placeholder="请输入单位名称">
                </el-input>
              </el-form-item>
              <el-form-item label="品牌简称:">
                <el-input v-model="companyForm.dThree" placeholder="请输入品牌简称">
                </el-input>
              </el-form-item>
              <el-form-item label="营业执照:">
                <el-input v-model="companyForm.dThree" placeholder="请输入营业执照">
                </el-input>
              </el-form-item>
              <el-form-item label="开户备注:">
                <el-input v-model="companyForm.dThree" placeholder="请输入开户备注">
                </el-input>
              </el-form-item>
            </el-row>
            
  
          </div>
          <div class="alertfoot1 clearfix">
            <el-button class="fright mt10 mr10" @click="addClose">关闭</el-button>
            <el-button type="primary" class="fright mt10 mr10" @click="submitForm('companyForm')">保存</el-button>
          </div>
        </el-form>
      </jdy-alert>
  
    </div>
    <!--jdy-content-inner end-->
  </div>
  <!--jdy-content end-->
</template>

<script>
import jdyAlert from '@/components/Alert';
import jdyWhere from '@/components/Where';
import sData from './s.js';
export default {
  name: 'Schedule',
  data() {
    return {
      msg: 'Schedule',
      search: {
        company: "",
        address: "",
        quick: "",
        startStation: ""
      },
      tableData: sData.tableData, //列表数据 array  
      addStartStationFlag: false,
      companyForm: sData.companyForm,
      companyFormRule: sData.companyFormRule,
      currentPage: 3, //列表当前所在页,
      pageSize: 100,
      multipleSelection: [],
      multipleSelection3: [],
      dTypes: { "0": "飞机", "1": "火车", "2": "汽车", "3": "邮轮" },
      addFlag:false
    }
  },
  methods: {
    //省市县数据接口
    getCityData(level, pid) {
      if (!pid || pid.length < 1) {//默认取省
        pid = null;
        level = 1;
      }

      this.$http.post(api_prefix + 'City/selectCities', { "level": level, "pid": pid }).then(response => {
        alert('省市县数据')
      }, response => {
        console.log('出错了');
      });
    },
    go(){
      location.href="http://localhost:9090/system.html#/company/info"
    },
    examine(id) {
      location.href="http://localhost:9090/system.html#/company/examineDetail"
    },
    del() {
      var that = this;
      this.$confirm('确定删除吗', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        alert('删除成功');
      }).catch(() => {

      });


    },
    alertJournal() {

    },
    getTableData(opt) {//搜索
      this.$http.post(api_prefix + 'departure/list', { dType: 0, companyId: 1, dName: null, dStatus: 0 }).then(response => {
        var data = response.data.body;
        this.tableData = data.resultList;

        // this.tableData = data.tableData;
      }, response => {
        console.log('出错了');
      });
    },
    submitForm(formName) {
      console.log(formName)
      console.log(this.$refs)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post(api_prefix + 'departure/save',
            {
              "companyId": 0,
              "dArea": "string",
              "dCity": "string",
              "dCountry": "string",
              "dMapx": "string",
              "dMapy": "string",
              "dName": "string",
              "dProvince": "string",
              "dThree": "12",
              "dTraffic": 0,
              "dType": 0,
              "userId": 0
            }
          ).then(response => {
            alert('submit success')
          }, response => {
            console.log('出错了');
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    removeSingleTicket() {

    },
    handleCurrentJournalChange(index) { //日志  page
      var index = index - 1;
      //this.journalCurrentData = listData.journalData[index]
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      if (val) {
        alert('当前页' + val)
        var obj = { 'currentPage': val }
        this.getTableData(obj);
        this.currentPage = val;
        //console.log(`当前页: ${val}`);
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
      var alertClass = 'alertCompany';
      this.addFlag = true;
      if (this.addFlag) {
        this.$nextTick(function () {
          jdyFn.setAlertStyle(alertClass);
        });
      }
    },
    addClose() {
      this.addFlag = false;
      $('.alertbgg').remove();
    }
  },
  created() {
    this.$http.post(api_prefix + 'departure/list', { dType: 0, companyId: 1, dName: null, dStatus: 0 }).then(response => {
      var data = response.data.body;
      this.tableData = data.resultList;
    }, response => {
      console.log('出错了');
    });
  },
  components: {
    jdyAlert,
    jdyWhere
  },
  computed: {
    journalTotal() { //日志页数
      return 50
    },
    tableDataTotal() { //列表页数
      return 500
    }
  }
}
</script>

