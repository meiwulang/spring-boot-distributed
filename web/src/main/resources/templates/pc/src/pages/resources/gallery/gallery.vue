<template>
    <div class="jdy-content jdy-resources fleft noborder">
	    <div class="jdy-content-inner-trip">
           <div class="jdy-search clearfix p10">
           		<div class="inlineblock mr10 ">
	                选择类型:
	               	<el-select v-model="search.edit" @change="getTableData" clearable placeholder="选择类型" class="jdy-search-edit hasbg mr10">
			          <el-option key="1" label="全部1" :value="1">
			          </el-option>
			          <el-option key="2" label="全部2" :value="2">
			          </el-option>
			        </el-select>
	            </div>
	            <div class="inlineblock mr10 ">
	                快速搜索:
	                <el-input placeholder="始发站名称" v-model="search.search" class="w200">
	                <el-button slot="append" icon="search" class="btnbg" @click="getTableData"></el-button>
	              </el-input>
	            </div>
	            <el-button type="default" class="btnbg" @click="add">添加</el-button>
	            <el-button type="default" class="btnbg mr10">刷新</el-button>
	        </div><!--jdy-search end-->


			<div class="jdy-table p10">
	          <el-table :data="tableData" border class=" all">
	            <el-table-column label="序号" type="index" width="60">
	            </el-table-column>
	            <el-table-column label="出发地点" width="">
	              <template scope="scope">
	                 {{ scope.row.departurePlace }}
	              </template>
	            </el-table-column>
	            <el-table-column label="类型" width="">
	              <template scope="scope">
	                {{ scope.row.type }}
	              </template>
	            </el-table-column>
	            <el-table-column label="所属区域" width="">
	              <template scope="scope">
	                {{ scope.row.subordinateArea }}
	              </template>
	            </el-table-column>
	            <el-table-column label="班车情况" width="">
	              <template scope="scope">
	                {{ scope.row.shuttleBus }}
	              </template>
	            </el-table-column>
	            <el-table-column label="操作" width="250" fixed="right">
	              <template scope="scope">
	                <el-button type="default" size="mini" @click="edit" v-if="scope.row.operation.edit==1">
	                  编辑
	                </el-button>
	                <el-button type="default" class="red" @click="busManage" size="mini" v-if="scope.row.operation.bus==1">
	                  班车管理
	                </el-button>
	                <el-button type="default" class="red" @click="del" size="mini" v-if="scope.row.operation.del==1">
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

		    <!--jdy-alert begin -->
		    <jdy-alert title="添加/编辑始发站信息" @closeAlert="departurePlaceClose" v-if="departurePlaceFlag" class="alertAddProduct alertDeparturePlace">

       			 <el-form :inline="true" :model="departurePlaceForm" :rules="departurePlaceRule" ref="departurePlaceForm" class="demo-form-inline" label-width="90px">
		          <div class="clearfix p10">
		            <el-row>
		              <el-form-item label="出发地点:" prop="departurePlace">
		                <el-input v-model="departurePlaceForm.departurePlace" placeholder="请输入班期编号">
		                </el-input>
		              </el-form-item>
		              <el-form-item label="类型:" prop="type">
		                <el-select v-model="departurePlaceForm.type" placeholder="请选择交通方式">
		                  <el-option :key="0" label="班车类型0" value="0">
		                  </el-option>
		                  <el-option :key="1" label="班车类型1" value="1">
		                  </el-option>
		                </el-select>
		              </el-form-item>
		            </el-row>
		            <el-row>
		              <el-form-item label="省份:" prop="province">
		                <el-select v-model="departurePlaceForm.province" placeholder="请选择省份">
		                  <el-option :key="0" label="北京" value="0">
		                  </el-option>
		                  <el-option :key="1" label="浙江" value="1">
		                  </el-option>
		                </el-select>
		              </el-form-item>
		              <el-form-item label="城市:" prop="city">
		                <el-select v-model="departurePlaceForm.city" placeholder="请选择城市">
		                  <el-option :key="0" label="杭州" value="0">
		                  </el-option>
		                  <el-option :key="1" label="宁波" value="1">
		                  </el-option>
		                </el-select>
		              </el-form-item>
		              <el-form-item label="区/县:" prop="area">
		                <el-select v-model="departurePlaceForm.area" placeholder="请选择区/县">
		                  <el-option :key="0" label="萧山" value="0">
		                  </el-option>
		                  <el-option :key="1" label="江干" value="1">
		                  </el-option>
		                </el-select>
		              </el-form-item>
		            </el-row>

		          </div>
		          <div class="alertfoot1 clearfix">
		            <el-button type="primary" class="fright mt10 mr10" @click="departurePlaceClose">取消</el-button>
		            <el-button type="primary" class="fright mt10 mr10" :disabled="btnFlag" @click="submitForm('departurePlaceForm')">保存</el-button>
		          </div>
		        </el-form>
		      </jdy-alert>

      <!--jdy-alert end-->

	    </div><!--jdy-content-inner-trip end-->
    </div><!--jdy-content end-->
</template>

<script>
import jdyAlert from '@/components/Alert';
import oData from './o.js';
export default {
  name: 'Schedule',
  data() {
  	return {
      btnFlag:false,
  		search:{
  			type:'',
  			search:''
  		},
  		tableData:oData.tableData,
  		currentPage: 3, //列表当前所在页,
        pageSize: 100,
        departurePlaceFlag:false,
        departurePlaceForm:oData.departurePlaceForm,
        departurePlaceRule:oData.departurePlaceRule

  	}
  },
  methods: {
  	getTableData() {
  		console.log('更新数据')
  	},
  	add() {
  		var alertClass = 'alertDeparturePlace';
  		this.departurePlaceFlag = true;

      if (this.departurePlaceFlag ) {
        this.$nextTick(function () {
          jdyFn.setAlertStyle(alertClass);
          // this.search.addProduct = '';
        });
      }
  	},
  	edit() {

  	},
  	del() {

  	},
  	busManage() {

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
    departurePlaceClose() {
    	this.departurePlaceFlag = false;
    	$('.alertbgg').remove();
    }
  },
  components: {
    jdyAlert
  },
  computed:{
    tableDataTotal() { //列表页数
      return 500
    }
  }
}
</script>
