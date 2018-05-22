<template>
  <div class="jl-information">
    <div class="jdy-content jdy-transfer fleft noborder">
      <div class="jdy-content-inner-trip">
        <el-form ref="ruleForm" label-width="20px" :inline="true" class="gz-itemMragin">
          <el-row>
            <!-- <el-form-item prop="type">
              <el-select v-model="selectedOptions" v-show='companyType==2' :filterable="true" :remote-method="searchCompany" remote clearable @change="handleChange" placeholder="请选择单位名称">
                <el-option :key="value.id" v-for="value in selectList" :label="value.cName" :value="value.id">
                </el-option>
              </el-select>
              <el-select v-model="userVal" @change="userAll" placeholder="请选择部门" class="gz-smallWidth" :filterable="true" :remote-method="searchDepartment" clearable remote>
                <el-option v-for="item in userOptions" :key="item.id" :label="item.dName" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="权限角色：" label-width="84px">
              <el-select v-model="companyOptions" filterable clearable placeholder="请选择权限角色" remote :remote-method="getChangeRole" @change="changeRole">
                <el-option v-for="item in companyOptionsList" :key="item.id" :label="item.urRoleName" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="快速搜索：" prop="quickSearch" label-width="84px">
              <el-input v-model="searchVal" ref="serachIpt" placeholder="真实名字、手机号" class="gz-largeWidth">
              </el-input>
            </el-form-item>
            <el-button type="primary" @click="firstSearch" class="el-button btnbg el-button--primary">搜索</el-button>
            <!-- <el-button @click="addInfoRouter" type="primary" class="btnbg fr addBtn">添加</el-button> -->
            <el-button type="default" class="btnbg fr" @click="alertJournal">日志</el-button>
            <el-button @click="refreshBtn" type="default" class="btnbg fr" v-loading.fullscreen.lock="fullscreenLoading">刷新</el-button>
            <!-- <el-button @click="addSetting" type="default" class="fr">设为管理员</el-button> -->
          </el-row>
        </el-form>
      </div>
      <div class="jdy-table">
        <el-table :data="tableData" border highlight-current-row @row-click="rowclickHandler" style="width: 100%">
          <el-table-column type="index" label="序号" width="70">
          </el-table-column>
          <el-table-column prop="uWxOpenId" label="openid" width="300">
          </el-table-column>
          <el-table-column prop="uAccount" label="用户名" width="300">
          </el-table-column>
          <el-table-column prop="uRealName" label="真实姓名">
          </el-table-column>
          <el-table-column prop="uTel" label="手机号码">
          </el-table-column>
          <!-- <el-table-column prop="uStatus" label="状态">
            <template scope="scope">
              <el-switch on-color="#71dc1c" v-model="scope.row.uStatus" @change='isStatus' @click.native="getuStatus(scope.row.userId,scope.row.uAccount)" :on-value="0" :off-value="2" on-text="正常" off-text="锁定" :width='75'>
              </el-switch>
              <el-switch v-model="scope.row.uStatus" @change='isStatus' @click.native='getId(scope.row.id)' on-color="#71dc1c" on-text="正常" off-text="锁定" :width='70'>
                      </el-switch>
            </template>
          </el-table-column> -->
          <!-- <el-table-column prop="urRoleName" label="权限角色">
          </el-table-column>
          <el-table-column label="权限等级">
            <template scope="scope">
              <span>{{scope.row.uDataLimit | gradeFilter}}</span>
            </template>
          </el-table-column> -->
          <el-table-column prop="dName" label="部门">
          </el-table-column>
          <!-- <el-table-column prop="uPost" label="岗位职务">
          </el-table-column> -->
          <el-table-column label="单位名称" width="110">
            <template scope="scope">
              <span>分销公司</span>
            </template>
          </el-table-column>
          <el-table-column label="角色类型" width="110">
            <template scope="scope">
              <span v-if="scope.row.uDtype == 1">负责人</span>
              <span v-if="scope.row.uDtype == 0">普通代理人</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template scope="scope">
              <el-button @click="editInfo(tableData,scope.row.id)" type="default" size="mini">编辑</el-button>
              <el-button @click="deleteRow(scope.row.userId,scope.row.uAccount)" type="default" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

    </div>
    <!-- 分页   begin-->
    <div class="clearfix">
      <el-pagination class="fright mt20" @current-change="handleCurrentChange" :page-count="PageCount" :current-page.sync="currentPage" :total="tableDataTotal" :page-size="pageSizeAll">
      </el-pagination>
    </div>
    <!-- 分页end-->
    <!--jdy-content end-->

    <!--系统日志查看 弹窗  begin-->
    <jdy-alert title="系统日志查看" v-if="alertJournalFlag" @closeAlert="alertJournal" class="alertJournal">
      <jdy-log :alertJournalFlag="alertJournalFlag" :journalCurrentData="journalCurrentData" :journalTotal="journalTotal" :pid="pid" :module="module" @listenToChildEvent="alertJournal"></jdy-log>
    </jdy-alert>
    <!--系统日志查看 弹窗  begin-->
  </div>
</template>

<script>
import jdyAlert from '@/components/Alert';
import jdyLog from '@/components/Log';
export default {
  components: {
    jdyAlert,
    jdyLog
  },
  name: 'information',
  data() {
    return {
      companyType: null,
      uStatus: false,
      selectList: [],//部门名称，单位编号
      props: {
        value: 'id',
        label: 'cName',
        children: 'children'
      },//部门数据配置
      selectedOptions: null,//双向绑定部门数据
      companyList: [],//权限角色-公司类型数据
      companyProps: {

      },//数据权限角色-公司类型配置
      companyOptions: '',//双向绑定权限角色-公司类型数据
      userOptions: [],//全部部门select数据
      userVal: "",//双向数据全部部门
      tableData: [],//table数据,
      currentId: '',//table当前索引
      currentPage: 1,//当前页数
      pageSizeAll: 20,//显示分页个数，
      tableDataTotal: 1,//分页总数目，
      PageCount: 1,//总页数,
      departurePlaceFlag: false,//弹窗默认隐藏
      searchVal: '',//双向绑定查询value
      userAlldata: {
        // uCompanyId: '',//单位id
        // uDepartmentId: '',//部门id
        // uAccount: '',//用户名
        // uRealName: '',//真实姓名
        // uPym: '',//拼音码
        // uTel: '',//手机号
        // uRoleId: '',
        // uDataLimit: '',//数据级别0:用户级 1:部门级2:单位级3:系统级
        searchStr:'',
        currPage: 1,//当前页
        pageSize: '20'//页面要显示的数据
      },
      fullscreenLoading: false,
      settingId: '',
      companyOptionsList: [],
      alertJournalFlag: false,
      //日志相关参数
      pid: null,
      module: "user",
      journalTotal: 0,
      journalCurrentData: [], //日志数据
      isStatusValue: 0,
      isStatusId: '',
      isStatusAccunt: ''
      /* "pageNum": 1,//d当前页
       "pageSize": 10,//一页显示的数据
       "total": 28,//总计路数
       "pages": 3,//总页数*/
    }
  },
  mounted() {
    this.defaultUserList()
    this.defaultSelectList()
    this.defaultAllSectors()
    this.defaultRolePermissions()
    let logindata = JSON.parse(sessionStorage.loginData)
    this.companyType = logindata.cType
  },
  computed: {
  },
  filters: {
    //权限等级处理过滤数据
    gradeFilter(value) {
      let gradeName = ''
      switch (value) {
        case 0:
          gradeName = "用户级"
          return gradeName
          break;
        case 1:
          gradeName = "部门级"
          return gradeName
          break;
        case 2:
          gradeName = "单位级"
          return gradeName
          break;
        case 3:
          gradeName = "系统级"
          return gradeName
          break;
      }
      return gradeName
    }
  },
  methods: {
    //初始化获取用户列表
    defaultUserList() {
      this.$http.post(api_prefix + '/user/distList', this.userAlldata).then(response => {
        if (response.data.code == 0) {
          this.tableData = response.body.body.list
          this.tableDataTotal = response.body.body.total
        } else {
          this.$alert(response.data.message, '友情提示', {
            confirmButtonText: '确定',
            callback: action => { }
          });
        }
      }, response => {
        console.log('出错了');
      });
    },
    //初始化单位选择
    defaultSelectList(name) {
      let url = api_prefix + '/Company/index';
        let data = { pageIndex: 1 };
        if (name) {
          data['fastSearchStr'] = $.trim(name)
        }
        this.$http.post(url, data, { emulateJSON: true }).then(response => {
          let listData = response.body.body.list
          this.selectList = listData
        })
    },
    searchCompany(name) {
      console.log(name);
      this.defaultSelectList(name)
    },
     searchDepartment(name) {
      console.log(name);
      this.defaultAllSectors(name)
    },
    //初始化全部部门
    defaultAllSectors(name) {
      let logindata = JSON.parse(sessionStorage.loginData)
      if (this.userAlldata.uCompanyId) {
        var companyId = this.userAlldata.uCompanyId
      } else {
        var companyId = logindata.uCompanyId
      }
      var pageIndex = 1;
      if(name){
        var fastSearchStr = name;
      }else{
        var fastSearchStr = '';
      }
      let url = api_prefix + '/department/selectAllDepartmentByCompanyId?pageIndex=' + 1 + '&companyId=' + companyId + '&fastSearchStr=' + fastSearchStr
      this.$http.post(url).then(response => {
        if (response.status === 200) {
          this.userOptions = response.body.body.list
        }
      }).then(response => {

      })
    },
    //初始化权限角色数据
    defaultRolePermissions() {
      let logindata = JSON.parse(sessionStorage.loginData)
      this.$http.post(api_prefix + '/user_role/list', {
        urCompanyId: (this.userAlldata.uCompanyId || logindata.uCompanyId)
      }).then(response => {
        if (response.data.code == 0) {
          this.companyOptionsList = response.body.body
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
    //单位选择后查询数据
    handleChange(value) {
      console.log(value)
      this.userAlldata.uCompanyId = value
      this.uCompanyIdDefaultNum += 1
      this.defaultRolePermissions();
      this.defaultAllSectors();
      console.log(this.userAlldata.uCompanyId, 'this.userAlldata.uCompanyId')
    },
    //选择部门后查询
    userAll(value) {
      this.userAlldata.uDepartmentId = value
      console.log(value, 'uDepartmentId')
    },
    //选择权限角色
    changeRole(value) {
      this.userAlldata.uRoleId = value
      console.log(value, 'uRoleId')
    },
    //快速搜索
    firstSearch() {
      this.userAlldata.searchStr = this.searchVal;
      this.defaultUserList()
    },
    //查询完后开始赋值value
    // searchValueFun(){
    //   let thatVal = this.tableData[0]
    //   if(thatVal){
    //     this.searchVal=`${thatVal.uAccount} ${thatVal.uPym} ${thatVal.uRealName} ${thatVal.uTel}`
    //   }
    // },
    //获取选择table列表的id
    // settingIndex(val) {
    //   console.log(val,'val')
    //   this.settingId = val.id
    // },
    //设置管理员
    addSetting() {
      console.log(this.settingId, 'this.settingId')
      if (this.settingId == '') {
        this.$message({
          type: 'warning',
          message: '未选择用户!'
        });
        return
      }
      let url = api_prefix + `/user/admin/${this.settingId}`
      this.$confirm('你确定要进行设为管理员吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get(url).then(response => {
          console.log(response)
          this.$message({
            type: 'success',
            message: '设置成功!'
          });
        }).then(response => {

        })

      }).catch(() => {
      });
    },
    //刷新页面
    refreshBtn() {
      this.fullscreenLoading = true;
      setTimeout(() => {
        this.fullscreenLoading = false;
        this.$message({
          showClose: true,
          message: '刷新成功',
          type: 'success'
        });
        this.searchVal = '';
        this.selectedOptions = null;
        this.userVal = '';
        this.companyOptions = '';
        this.userAlldata = {};
        this.defaultUserList()
      }, 1000);

    },
    //状态改变时触发
    isStatus(value) {
      this.isStatusValue = value;
      console.log(this.isStatusValue, 'this.isStatusValue')
      console.log(this.isStatusId, 'this.isStatusId')
      console.log(this.isStatusAccunt, 'this.isStatusAccunt')
      let url = api_prefix + '/user/status/' + this.isStatusId + '/' + this.isStatusValue + '/' + this.isStatusAccunt
      this.$http.post(url).then(response => {
        console.log(response)
      }).then(response => {

      })
    },
    getuStatus(id, accunt) {
      this.isStatusId = id;
      this.isStatusAccunt = accunt
    },
    //删除行
    deleteRow(index, accunt) {
      //点击删除
      this.currentId = index;
      this.$confirm('你确定要删除该内容？', '友情提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post(api_prefix + `/user/status/${this.currentId}/1/${accunt}`).then(response => {
          this.fullscreenLoading = true;
          this.defaultUserList();
          setTimeout(() => {
            this.fullscreenLoading = false;
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            });
          }, 1000);
        }, response => {
          console.log('出错了');
        });
      }).catch(() => {

      });
    },
    //编辑部门信息
    editInfo(data, index) {
      this.$router.push({ path: '/agentUserInfo', query: { formDataIndex: index, isAdd: false } })
    },
    //currentPage 改变时会触发
    handleCurrentChange(currentPage) {
      this.userAlldata.currPage = currentPage,
        this.defaultUserList()
    },
    //添加用户
    addInfoRouter() {
      this.$router.push({ path: '/agentUserInfo', query: { isAdd: true } })
    },
    getChangeRole(val) {//获取住宿情况
      console.log(val);
      let logindata = JSON.parse(sessionStorage.loginData)
      this.$http.post(api_prefix + '/user_role/list', {
        urRoleName: val,
        urRoleNo: val,
        urCompanyId: logindata.uCompanyId
      }).then(response => {
        if (response.data.code == 0) {
          this.companyOptionsList = response.data.body;
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
    //----------日志相关逻辑 start-----
    //关闭,打开日志弹窗
    alertJournal(alertJournalFlag) {
      if (!this.pid) { this.$alert("请选择用户"); return }
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
      this.pid = row.userId;
      this.settingId = row.userId;
      if (!this.companyId) { this.companyId = row.companyId }
      this.getLogData(1)
    },
    //----------日志相关逻辑 end-----
  }
}
</script>
<style scoped>
.gz-itemMragin {
  margin-top: 10px;
}

.gz-Bg {
  background: rgba(0, 0, 0, .6);
  position: fixed;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  z-index: 99
}

.alertAddProduct {
  left: 0px;
  right: 0px;
  margin: auto;
}

.gz-smallWidth {
  width: 122px;
}

.gz-largeWidth {
  min-width: 330px
}

.jdy-content {
  min-height: initial;
  padding: 10px;
  box-sizing: border-box;
}

.el-pagination {
  padding-bottom: 20px;
}
</style>

