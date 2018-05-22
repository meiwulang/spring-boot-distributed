<template>
  <div class="jl-information">
    <div class="jdy-content jdy-transfer fleft noborder jl-ad">
      <div class="jdy-content-inner-trip">
        <el-form ref="ruleForm" label-width="20px" :inline="true" class="gz-itemMragin">
          <el-row>
            <el-form-item label="广告位置：" label-width="84px">
              <el-select v-model="aPlace" class="gz-Block" clearable>
                <el-option v-for="item in OptionsList" :key="item.id" :label="item.dName" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="快速搜索：" prop="quickSearch" label-width="84px">
              <el-input v-model="adverContent" placeholder="广告名称、广告内容、其他内容、投放城市" @change="getSearchValue" style="width:300px">
              </el-input>
            </el-form-item>
            <el-button type="primary" @click="firstSearch" class="el-button btnbg el-button--primary">搜索</el-button>
            <el-button @click="addInfoRouter" type="primary" class="btnbg fr addBtn">添加</el-button>
            <el-button @click="refreshBtn" v-loading.fullscreen.lock="fullscreenLoading" type="default" class="btnbg fr">刷新</el-button>
          </el-row>
        </el-form>
      </div>
      <div class="jdy-table">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column type='index' label="序号" width="65">
          </el-table-column>
          <el-table-column prop="aPlace" label="广告位置">
          </el-table-column>
          <el-table-column prop="aTitle" label="广告名称">
            <template scope="scope">
              <span class="jl-noticeTitle">{{scope.row.aTitle}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="aSort" label="排序" width="70">
          </el-table-column>
          <el-table-column prop="areaList" label="投放城市">
            <template scope="scope">
              <span class="jl-noticeTitle">{{scope.row.areaList|filterAreaList}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="aStartTime" label="开始日期">
            <template scope="scope">
              <span>{{scope.row.aStartTime|filterStartTime}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="aEndTime" label="结束日期">
            <template scope="scope">
              <span>{{scope.row.aEndTime|filterStartTime}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="aStatus" label="是否有效">
            <template scope="scope">
              <span v-if="scope.row.aShow==0">显示</span>
              <span v-else>隐藏</span>
              <!-- <el-switch
                      on-color="#71dc1c"
                      v-model="scope.row.aStatus"
                      :on-value='0'
                      :off-value='1'
                      @change="SwitchChange(scope.row)"
                      on-text="显示"
                      off-text="隐藏"
                      :width='75'> -->
              </el-switch>
            </template>
          </el-table-column>

          <el-table-column prop="aOther" label="其他内容">
            <template scope="scope">
              <span class="jl-noticeTitle">{{scope.row.aOther}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="aComment" label="广告说明" width="400">
            <template scope="scope">
              <span class="jl-noticeTitle">{{scope.row.aComment}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template scope="scope">
              <el-button type="default" size="mini">
                <router-link :to="{ name: 'advertisingInfo',query: {id: scope.row.id}}">编辑</router-link>
              </el-button>
              <el-button @click="deleteRow(scope.row.id, tableData)" type="default" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页   begin-->
      <div class="clearfix">
        <el-pagination class="fright mt20" @size-change="sizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSizeAll" layout="prev, pager, next, jumper" :total="tableDataTotal">
        </el-pagination>
      </div>
      <!-- 分页end-->
    </div>
    <!--jdy-content end-->

    <!--查看公告 弹窗 begin-->
    <!--<jdy-alert title="查看公告" @closeAlert="alertNotice" v-if="alertNoticeFlag" class="alertNotice">
            <h1>{{alertTitle}}</h1>
            <p>{{alertContent}}</p>
          </jdy-alert>-->
    <!--查看公告 弹窗 end-->

    <!--系统日志查看 弹窗  begin-->
    <!--<jdy-alert title="系统日志查看" @closeAlert="alertJournal" v-if="alertJournalFlag" class="alertJournal">

          </jdy-alert>-->
    <!--系统日志查看 弹窗  end-->
  </div>
</template>

<script>
import jdyAlert from '@/components/Alert';
export default {
  components: {
    jdyAlert
  },
  name: 'information',
  data() {
    return {
      aPlace: '',
      taCity: '111',
      uStatus: 0,
      value1: true,
      adverContent: '',//绑定搜索框
      fullscreenLoading: false,//默认关闭的loadding框
      selectList: [],//部门单位select
      props: {
        value: 'id',
        label: 'cName',
        children: 'children'
      },//部门数据配置
      selectedOptions: [],
      advertings: {
        aComment: '',// 广告说明 ,
        aOther: '', //其他内容 ,
        aPlace: '',//广告位置 ,
        aStatus: '',// 0:有效,1:无效 ,
        aTitle: '',//广告标题 ,
        taCity: '', //投放城市集合 ,
        currPage: 1,//查询分页参数：当前页，query必填 ,
        pageSize: 20,//查询分页参数：页面大小，query必填 ,
        userId: ''//用户编号
      },
      userVal: "",
      OptionsList:{},
      tableData: [],//table数据,
      currentId: '',//table当前索引
      currentPage: 1,//当前页数
      pageSizeAll: 1,//显示分页个数，
      tableDataTotal: 1,//分页总数目，
      departurePlaceFlag: false,//弹窗默认隐藏
    }
  },
  mounted() {
    this.defaultSelectList()
    this.defaultadvertisingList()
    this.getLocation()
  },
  computed: {
  },
  filters: {
    filterStartTime(value) {
      return new Date(value).format('yyyy-MM-dd')
    },
    filterAreaList(value) {
      let taCityArray = []
      for (let i = 0; i < value.length; i++) {
        taCityArray.push(value[i].taCity)
      }
      return taCityArray.join()
    }
  },
  methods: {
    //初始化获取用户列表
    defaultadvertisingList() {
      let url = api_prefix + "/advertisement/list"
      //        this.advertings
      let data = this.advertings;
      this.$http.post(url, data).then(response => {
        console.log(response)
        if (response.status === 200 && response.body.code != -1) {
          this.tableData = response.body.body.list
          //分页赋值
          this.currentPage = response.body.body.pageNum
          this.pageSizeAll = response.body.body.pageSize
          this.tableDataTotal = response.body.body.total
          this.PageCount = response.body.body.pages
        }
      })
    },
    //初始化单位选择
    defaultSelectList() {
      //        this.$refs.selectListRef.clearable=true
      let url = api_prefix + '/Company/selectAllCompanyWithTree?pageIndex=' + 1 + '&pageInteger=' + 1
      this.$http.post(url).then(response => {
        if (response.status === 200) {
          let listData = response.body.body.list
          for (let i in listData) {
            if (listData[i].children && listData[i].children.length <= 0) {
              delete listData[i].children
            }
          }
          this.selectList = listData
        }
      })
    },
    //单位选择
    handleChange(value) {
    },
    getLocation: function () {
      this.$http.post(api_prefix + 'Dictionaries/dictList',
        { "dGroupId": 133 }
      ).then(response => {
        if (response.data.code == 0) {
          this.OptionsList = response.data.body
        } else {
          this.$alert(response.data.message)
        }
      }, response => {
        console.log('出错了');
      });
    },
    //快速搜索
    firstSearch() {
      this.$http.post(api_prefix + '/advertisement/list', {
        aTitle: this.searchValue,
        aPlace: this.aPlace,
        aOther: this.searchValue,
        taCity: this.searchValue,
        aComment: this.searchValue
        // areaList : this.searchValue
      }).then(response => {
        if (response.data.code == 0) {
          this.tableData = response.body.body.list
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
    getSearchValue(value) {
      this.searchValue = value;
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
        this.$router.go(0)
      }, 1000);

    },
    //状态切换
    SwitchChange(value) {
      if (value.aStatus == 0) { value.aStatus++ } else { value.aStatus-- }
      this.$http.post(api_prefix + '/advertisement/update', value).then(response => {
        if (response.data.code != 0) {
          this.$alert(response.data.message)
          this.defaultadvertisingList()
          return;
        }
        this.defaultadvertisingList()
      }, response => {
        console.log('出错了');
      });
    },
    //删除行
    deleteRow(index, rows) {
      //点击删除
      let url = api_prefix + `/advertisement/delete/${index}`
      this.currentId = index;
      console.log('当前ID', this.currentId)
      this.$confirm('你确定要删除该内容？', '友情提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        this.$http.get(url).then(response => {
          if (response.data.code == 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          } else {
            this.$alert(response.data.message)
          }
          this.defaultadvertisingList()
        }, response => {
          console.log('出错了');
        });
      }).catch(() => {

            });
    },
    //编辑部门信息
    editInfo() {
    },
    //pageSize 改变时会触发
    sizeChange(size) {
      console.log(size)
    },
    //currentPage 改变时会触发
    handleCurrentChange(val) {
      console.log(val, 'val')
      this.advertings.currPage = val;
      this.defaultadvertisingList()
    },
    //添加用户
    addInfoRouter() {
      this.$router.push({ path: '/advertisingInfo' })
    }
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
  width: 300px
}

.jdy-content {
  min-height: initial;
  padding: 10px;
  box-sizing: border-box;
  ;
}
</style>

