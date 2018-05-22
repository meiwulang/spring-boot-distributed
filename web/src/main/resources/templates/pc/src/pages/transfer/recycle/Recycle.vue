<template>
  <div class="jdy-content jdy-transfer fleft">
    <el-row class="jdy-content-inner">
      <!--jdy-search begin-->
      <div class="jdy-search">
        <span class="f14  mt20">类型：</span>
        <el-select v-model="search.type" @change="getTableData" clearable placeholder="选择类型" class="jdy-search-edit hasbg mr10">
          <el-option key="0" label="类型0" :value="0">
          </el-option>
          <el-option key="1" label="类型1" :value="1">
          </el-option>
        </el-select>
        <el-select v-model="search.company" @change="getTableData" clearable placeholder="选择单位" class="jdy-search-edit hasbg mr10">
          <el-option key="0" label="单位0" :value="0">
          </el-option>
          <el-option key="1" label="单位1" :value="1">
          </el-option>
        </el-select>
        <div class="inlineblock mr10 w300 ">
          <el-input placeholder="产品名称、拼音码" v-model="search.selectProduct" class="">
            <el-select v-model="search.selectProduct_select" slot="prepend" placeholder="请选择" class="w100 hasbg">
              <el-option label="品牌0：" value="0"></el-option>
              <el-option label="品牌1：" value="1"></el-option>
            </el-select>
            <el-button slot="append" icon="search" class="btnbg" @click="getTableData"></el-button>
          </el-input>
        </div>
  
        <el-button type="default" class="btnbg">刷新</el-button>
        <el-button type="default" icon="delete" class="btnbg">
          <router-link to="/list" class="inlineblock">返回</router-link>
        </el-button>
      </div>
      <!--jdy-search end-->
  
      <!--table begin-->
      <div class="jdy-table">
        <el-table :data="tableData" border class="mt20 all">
          <el-table-column label="序号" type="index" width="60">
          </el-table-column>
          <el-table-column label="产品名称" width="">
            <template scope="scope">
              【预览】</span>{{ scope.row.pName }}
              <el-tag type="primary">特色游</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="发布状态" width="100">
            <template scope="scope">
              {{ scope.row.pStatus }}
            </template>
          </el-table-column>
          <el-table-column label="产品编号" width="100">
            <template scope="scope">
              {{ scope.row.pNo }}
            </template>
          </el-table-column>
          <el-table-column label="天数" width="80">
            <template scope="scope">
              {{ scope.row.pDays }}
            </template>
          </el-table-column>
          <el-table-column label="分享" width="140">
            <template scope="scope">
              <a :href="scope.row.share" class="green">【分享分析】</a>
            </template>
          </el-table-column>
          <el-table-column label="产品副标题" width="180">
            <template scope="scope">
              <span>{{ scope.row.pShortName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="客服" width="80">
            <template scope="scope">
              {{ scope.row.pContacts }}
            </template>
          </el-table-column>
          <el-table-column label="是否确认" width="100">
            <template scope="scope">
              <el-switch v-model="scope.row.confirmState" on-color="#71dc1c" on-text="" off-text="">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="编辑时间" width="140">
            <template scope="scope">
              <span>{{ scope.row.updateTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="250">
            <template scope="scope">
              <el-button type="default" size="mini" @click="effect(scope.row.companyId,scope.row.id, scope.row.updateUser)">
                恢复
              </el-button>
            </template>
          </el-table-column>
        </el-table>
  
        <!-- 分页   begin-->
        <div class="clearfix">
          <el-pagination class="fright mt20" 
                @size-change="handleSizeChange" 
                @current-change="handleCurrentChange" 
                :current-page.sync="currentPage" 
                :page-size="pageSize" 
                layout="prev, pager, next, jumper" 
                :total="tableDataTotal">
          </el-pagination>
        </div>
        <!-- 分页   end-->
      </div>
      <!--table end-->
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'recycle',
  data() {
    return {
      search: {
        edit: '',
        type: '',
        company: '',
        selectProduct: '',
        selectProduct_select: '',
        addProduct: ''
      },
      tableData: [], //列表数据 array
      currentPage: 3, //列表当前所在页,
      pageSize: 100
    }
  },
  methods: {
    //恢复
    effect(companyId,id,updateUser){
       this.$http.post(api_prefix+'product/effect',
          {
            "companyId":companyId,
            "id": id,
            "puserId": updateUser
          }
      ).then(response => {
        alert("刷新页面数据");
      }, response => {
        console.log('出错了');
      });
    },
    getTableData(opt) {//更新table数据
      alert('请求数据')
      let search = this.search,
        data = { "data": search };
      if (opt) {
        for (var i in opt) {
          if (i == 'data') { return false }
          data[i] = opt[i];
        }
      }
      console.log(data);
      this.$http.post(api_prefix+'product/list',{
         "puserId":null,
        "companyId":"1",
        "pName":null,
        "pBrand":null,
        "pType":null,
        "pStatus":"1"
      }).then(response => {
        let data = response.data.body;
        this.tableData = data.resultList;
      }, response => {
        console.log('出错了');
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      if (val) {
        alert('当前页'+val)
        var obj = { 'currentPage': val }
        this.getTableData(obj);
        this.currentPage = val;
        //console.log(`当前页: ${val}`);
      }


    }
  },
  created() {
    this.$http.post(api_prefix+'product/list', { 
         "puserId":null,
        "companyId":"1",
        "pName":null,
        "pBrand":null,
        "pType":null,
        "pStatus":"1" }).then(response => {

      var data = response.data.body;
      this.tableData = data.resultList;
    }, response => {
      console.log('出错了');
    });
  },
  computed: {
    tableDataTotal() {
      return 500
    }
  }
}
</script>

