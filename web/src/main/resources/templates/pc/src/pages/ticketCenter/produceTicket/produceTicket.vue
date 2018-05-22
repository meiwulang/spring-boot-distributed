 <template>
  <div class="jl-information jl-onlinebill">
    <div class="jdy-content jdy-transfer fleft jl-ad gridmain">
        <div class="ticketLeft">
            left
        </div>
        <div class="ticketRight">
            right
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "information",
  data() {
    return {
      currentPage:1,
      pageSizeAll:20,
      tableDataTotal:0,
      tableData: [
        {
          tNo: 'SC20180305',
          tName: '雪乡梦幻家园门票',
          tType: 1,
          pManager: '李小鹏',
          tStatus: 1,
          tTime: '2018-03-24 18:24',
        }
      ],
      fullscreenLoading: false, //默认关闭的loadding框
      jdytabActive: null,
      ruleForm: {
        tType:'',
        searchName: '',
        pageSize: 20,
        currPage: 1,
      },
      //门票类型
      ticketList:[
        {
          id: 1,
          tName: "成人票"
        },
        {
          id: 2,
          tName: "儿童票"
        }
      ],
    };
  },
  mounted() {
    // this.getTableData();
  },
  methods: {
    getTableData() {
      //更新table数据
      this.$http
        .post(api_prefix + "/SchedulePlan/manageList", this.ruleForm)
        .then(
          response => {
            let data = response.body.body;
            this.tableData = data.pageInfo.list;
            this.tableDataOne = data.pageTotalInfo.list;
            this.tableDataTwo = data.totalInfo.list;
            this.tableDataTotal = data.pageInfo.total;
          },
          response => {
            console.log("出错了");
          }
        );
    },
    jdytab(index) {
      this.jdytabActive = index;
      console.log(index, "index");
      this.getTableData();
    },
    //currentPage 改变时会触发
    handleCurrentChange(val) {
      console.log(val, 'val')
      this.ruleForm.currPage = val;
      this.getTableData()
    },
    firstSearch(){
        this.getTableData();
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
    //申报
    declaration(){
      
    },
    addTicket(){
      this.$router.push({ name:'ticketDeclarationInformation'})
    },
    //编辑票信息
    editTicket(){
      this.$router.push({ name:'ticketDeclarationInformation'})
    },
    //删除行
    deleteTicket(index) {
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
<style scoped lang="less">
.gridmain{
    display: grid;    
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: 900px;
    grid-column-gap:10px;
    // grid-gap: 5px; 
    grid-template-areas: 
        "l l l r r r r r r r";
    .ticketLeft{
        grid-area: l;
    };
    .ticketRight{
        grid-area: r;
    };
}
</style>

