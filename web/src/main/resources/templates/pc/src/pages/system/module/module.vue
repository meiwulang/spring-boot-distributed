<template>
  <div class="jl-information">
    <div class="jdy-content jdy-transfer fleft jl-ad">
      <div class="jdy-content-inner-trip">
        <div class="jdy-tab">
          <a href="javascript:;" title="" @click="jdytab(null)" :class="{ active: jdytabActive==null }">全部
            <span></span>
          </a>
          <a href="javascript:;" title="" v-for="item in firstMenuList" :key="item.id" @click="jdytab(item.id)" :class="{ active: jdytabActive == item.id }">{{item.mName}}
            <span></span>
          </a>
            <el-button @click="addInfoRouter" type="default" class="btnbg fr mt10 mr10">添加模块</el-button>
            <el-button @click="refreshBtn" v-loading.fullscreen.lock="fullscreenLoading" type="primary" class="btnbg fr mt10">刷新</el-button>
        </div>
        <div class="jdy-table p10">
          <el-table :data="tableData" border style="width: 100%" :row-class-name="tableRowClassName">
            <el-table-column type='index' label="序号" width="65">
            </el-table-column>
            <el-table-column prop="aTitle" label="菜单名称">
              <template scope="scope">
                <span class="jl-noticeTitle">{{scope.row.mName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="areaList" label="模块名称">
              <template scope="scope">
                <span class="jl-noticeTitle">{{scope.row.mEnName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="aEndTime" label="排序" width="100">
              <template scope="scope">
                <span>{{scope.row.mSort}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="aStatus" label="菜单类型">
              <template scope="scope">
                <span v-if="scope.row.mType == 0">一级菜单</span>
                <span v-if="scope.row.mType == 1">二级菜单</span>
                <span v-if="scope.row.mType == 2">三级菜单</span>
                <span v-if="scope.row.mType == 3">选项卡</span>
                <span v-if="scope.row.mType == 4">按钮</span>
                <span v-if="scope.row.mType == 5">链接</span>
              </template>
            </el-table-column>
            <el-table-column label="操作"  width="150">
              <template scope="scope">
                <el-button type="default" size="mini">
                  <router-link :to="{ name: 'editmodule',query: {id: scope.row.id,isAdd: false}}">编辑</router-link>
                </el-button>
                <el-button @click="deleteRow(scope.row.id)" type="default" size="mini" class="red">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <!--jdy-content end-->
  </div>
</template>

<script>
import jdyAlert from "@/components/Alert";
export default {
  components: {
    jdyAlert
  },
  name: "information",
  data() {
    return {
      tableData: [],
      firstMenuList: [],
      fullscreenLoading: false, //默认关闭的loadding框
      jdytabActive: null,
      menuId: null
    };
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    tableRowClassName(row, index) {
      if (row.mType === 0) {
        return "firstMenu";
      }
      if (row.mType === 1) {
        return "secondMenu";
      }
      if (row.mType === 2) {
        return "thirdMenu";
      }
      if (row.mType === 3) {
        return "fourthMenu";
      }
      if (row.mType === 4) {
        return "fivththMenu";
      }
      return "";
    },
    getTableData() {
      //更新table数据
      this.$http
        .post(api_prefix + "/module/list", {
          id: this.menuId
        })
        .then(
          response => {
            console.log(this.menuId,'this.menuId')
            let data = response.data.body;
            this.tableData = data;
          },
          response => {
            console.log("出错了");
          }
        );
      this.$http.get(api_prefix + "/module/firstModuleList").then(
        response => {
          let data = response.data.body;
          this.firstMenuList = data;
        },
        response => {
          console.log("出错了");
        }
      );
    },
    jdytab(index) {
      this.jdytabActive = index;
      this.menuId = index;
      console.log(index, "index");
      this.getTableData();
    },
    addInfoRouter() {
      //添加模块
      this.$router.push({ path: "/editmodule", query: { isAdd: true } });
    },
    //刷新页面
    refreshBtn() {
      this.fullscreenLoading = true;
      setTimeout(() => {
        this.fullscreenLoading = false;
        this.$message({
          showClose: true,
          message: "刷新成功",
          type: "success"
        });
        this.getTableData();
      }, 1000);
    },
    //删除行
    deleteRow(index) {
      //点击删除
      let url = api_prefix + "/module/delete/" + index;
      this.currentId = index;
      console.log("当前ID", this.currentId);
      this.$confirm("你确定要删除该内容？", "友情提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
        .then(() => {
          this.$http.get(url).then(
            response => {
              if (response.data.code == 0) {
                this.getTableData();
                setTimeout(() => {
                  this.$message({
                    showClose: true,
                    message: "删除成功",
                    type: "success"
                  });
                }, 500);
              } else {
                this.$alert(response.data.message);
              }
            },
            response => {
              console.log("出错了");
            }
          );
        })
        .catch(() => {});
    }
  }
};
</script>
<style scoped>
.gz-itemMragin {
  margin-top: 10px;
}

.gz-Bg {
  background: rgba(0, 0, 0, 0.6);
  position: fixed;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  z-index: 99;
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
  width: 300px;
}

.jdy-content {
  min-height: initial;
  box-sizing: border-box;
}
</style>

