<template>
  <div class="jdy-content jdy-resources fleft">
    <div class="jdy-content-inner-trip">
      <div class="resources-tab">
        <div>
          <div class="inlineblock mr10 ">
            交通类型：
            <el-select v-model="search.dTraffic" placeholder="请选择交通方式" class="jdy-search-edit  mr10">
              <el-option label="全部类型" key=null    value=null>全部类型</el-option>
              <!-- <el-option label="汽车" key=null v-if="companyType!=2"  value='2'>汽车</el-option> -->
              <el-option v-for="(value, key) in dTypes" :label="value" :key="key" :value="key">{{value}}</el-option>
            </el-select>
          </div>
          <div class="inlineblock mr10">
            快速搜索：
            <el-input placeholder="始发站名称" v-model="search.dName" class="w200">
            </el-input>
          </div>
          <el-button type="primary" @click="getTableData" class="el-button btnbg el-button--primary btnInTab">搜索</el-button>
        </div>
        <div>
          <el-button type="default" class="btnInTab" @click="updatePage" v-loading.fullscreen.lock="fullscreenLoading">刷新</el-button>
          <el-button type="primary" class="btnInTab" @click="addStartStation">添加</el-button>          
        </div>
      </div>
      <!--jdy-search end-->

      <!--table begin-->
      <div class="jdy-table jdy-table-padding">
        <el-table :data="tableData" border class=" all">
          <el-table-column label="序号" type="index" width="60">
          </el-table-column>
          <el-table-column label="站点名称" width="">
            <template scope="scope">
              {{ scope.row.dName }}
            </template>
          </el-table-column>
          <el-table-column label="类型" width="">
            <template scope="scope">
              <span v-if="scope.row.dType==0">始发站</span>
            </template>
          </el-table-column>
          <el-table-column label="交通类型" width="">
            <template scope="scope">
              <div v-for="(value, key) in dTypes" :key="key">
                <span v-if="scope.row.dTraffic==key">{{ value }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="所属区域" width="">
            <template scope="scope">
              {{ scope.row.dProvince }}-{{ scope.row.dCity }}-{{ scope.row.dArea }}
            </template>
          </el-table-column>

          <el-table-column label="操作" width="250" fixed="right">
            <template scope="scope">
              <el-button type="default" size="mini" @click="editStartStation(scope.row)" class="mr15">
                编辑
              </el-button>

              <el-button type="default" class="red" @click="delStartStation(scope.row.id)" size="mini">
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

      <jdy-alert title="添加/编辑始发站信息" @closeAlert="addStartStationClose" v-if="addStartStationFlag" class=" alertStartStation dialog-lv">

        <el-form :model="addForm" :rules="addFormRule" ref="addForm" class="demo-form-inline" label-width="120px">
          <div class="clearfix p10 pr50">
            <el-row>
              <el-form-item label="站点名称:" prop="dName">
                <el-input v-model="addForm.dName" placeholder="请输入站点名称">
                </el-input>
              </el-form-item>
              <el-form-item label="交通方式:" prop="dTraffic">
                <el-select v-model="addForm.dTraffic" placeholder="请选择交通方式" class="all">
                  <el-option v-for="(value, key) in dTypes" :label="value" :key="key" :value="key">{{value}}</el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="三字编码:" prop="dThree">
                <el-input v-model="addForm.dThree" placeholder="请输入三字编码">
                </el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="省份:" prop="dProvince">
                <!--<el-select v-model="addForm.dProvince" placeholder="请选择省份" @change="getCityData(2,addForm.dProvinceId)" class="all">
                    <el-option v-for="item in cityData.dProvince" :key="item.id" :label="item.name" :value="item.name">
                      <div @click="setProvincId(item.id)">{{item.name}}</div>
                    </el-option>
                  </el-select>-->
                <!--new-->
                <el-select v-model="addForm.dProvince" clearable placeholder="请选择省份" class="all" @change="provinceChange">
                  <el-option v-for="item in provinceList" :value="item.name" :label="item.name" :key="item.id">
                    <span :kes="item.id">{{item.name}}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="城市:" prop="dCity">
                <!--<el-select v-model="addForm.dCity" @change="getCityData(3,addForm.dCityId)" placeholder="请选择城市" class="all">
                    <el-option v-for="item in cityData.dCity" :key="item.id" :label="item.name" :value="item.name">
                      <div @click="setCityId(item.id)">{{item.name}}</div>
                    </el-option>
                  </el-select>-->
                <!--new-->
                <el-select v-model="addForm.dCity" clearable placeholder="请选择城市" class="all" @change="cityChange">
                  <el-option v-for="item in cityList" :value="item.name" :label="item.name" :key="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="区/县:" prop="dArea">
                <!--<el-select v-model="addForm.dArea" placeholder="请选择区/县" class="all">
                    <el-option v-for="item in cityData.dArea" :key="item.id" :label="item.name" :value="item.name">
                    </el-option>
                  </el-select>-->
                <!--new-->
                <el-select v-model="addForm.dArea" clearable placeholder="请选择行政区" class="all" @change="areaChange">
                  <el-option v-for="item in AreaList" :value="item.name" :key="item.name" :label="item.name">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="地图:">
                <jyd-map :bDMapx='bDMapx' :bDMapy='bDMapy' :bcityName='bcityName' @mapClick='getPoint'></jyd-map>
              </el-form-item>
            </el-row>

          </div>
          <div class="alertfoot1 clearfix">
            <el-button class="fright mt10 mr10" @click="addStartStationClose">关闭</el-button>
            <el-button type="primary" class="fright mt10 mr10"  :disabled="btnFlag" @click="submitForm('addForm')">保存</el-button>
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
import jydMap from '@/components/BMapComponent.vue';
import sData from './s.js';
export default {
  name: 'Schedule',
  data() {
    return {
      btnFlag:false,
      fullscreenLoading: false,
      //列表总数
      tableDataTotal: 0,
      journalTotal: 0,
      msg: 'Schedule',
      search: {
        dType: 0, dTraffic: null, companyId: null, dName: null, dStatus: 0,
        pageSize: 20,
        currPage: 1
      },
      tableData: sData.tableData, //列表数据 array
      addStartStationFlag: false,
      currentPage: 1, //列表当前所在页,
      pageSize: 20,
      multipleSelection: [],
      multipleSelection3: [],
      dTypes: {},
      bDMapx: null,
      bDMapy: null,
      bcityName: null,
      companiesOptions: [],
      addForm: {
        "companyId": null,
        "dArea": null,
        "dCity": null,
        "dCityId": null,
        "dCountry": null,
        "dMapx": null,
        "dMapy": null,
        "dName": null,
        "dProvince": '',
        "dProvinceId": '',
        "dThree": null,
        "dTraffic": null,
        "dType": 0,
        "puserId": 0
      },
      addFormRule: {
        dName: [{ required: true, message: '请输入站点名称', trigger: 'blur' }],
        dArea: [{ required: true, message: '请输入区/县', trigger: 'blur', type: 'string' }],
        dCity: [{ required: true, message: '请输入城市', trigger: 'blur', type: 'string' }],
        dProvince: [{ required: true, message: '请输入省份', trigger: 'blur', type: 'string' }],
        dTraffic: [{ required: true, message: '请输入交通方式', trigger: 'blur'}],
        dThree:[{max: 3,message: '最多输入三个字符'}]
      },
      cityData: {
        dProvince: [],
        dCity: [],
        dArea: []
      },
      // 用于省，市，区相关
      provinceDate: "",
      cityDate: "",
      areaDate: "",
      provinceList: [],
      cityList: [],
      AreaList: [],
      companyType: null
    }
  },
  mounted() {
    let logindata = JSON.parse(sessionStorage.loginData)
        this.dTypes = { 0: "飞机", 1: "火车", 2: "汽车", 3: "邮轮" }
    this.search.companyId = logindata.uCompanyId
    this.addForm.companyId = logindata.uCompanyId
    this.companyType = logindata.cType
    this.search.dTraffic='null'
    // if(this.companyType==2){
    //   this.search.dTraffic='null'
    // }else{
    //   this.search.dTraffic='2'
    // }
    this.getTableData();
    // this.getCityData(1, 0)
    this.defaultProvinceData();
    //初始化公司列表
    this.$http.post(api_prefix + '/Company/index?pageIndex=1', {
      fastSearchStr:logindata.cName
    }, { emulateJSON: true }).then(response => {
      this.companiesOptions = response.body.body.list;
    }, response => {
      console.log('出错了');
    });
  },
  methods: {
    defaultProvinceData() { //加载省列表
      let url = api_prefix + '/City/selectCities';
      let city = { level: 1 }
      this.$http.post(url, city).then(response => {
        if (response.body.code === "-1") {
          this.$alert(response.body.message, "温馨提示", { type: 'error' });
          return
        }
        this.provinceList = response.body.body;
        if (this.addForm.dProvince) {
          this.provinceDate = this.addForm.dProvince;
        }
      }, response => {
        this.$alert("网络出错啦~", "温馨提示", { type: 'error' });
      });
    },
    provinceChange(value, cityvalue) { //省修改，并加载城市列表
      let id = 0;
      for (var i in this.provinceList) {
        if (this.provinceList[i].name == value) {
          id = this.provinceList[i].id;
        }
      }
      if (id == 0 || id == undefined) {
        return;
      }
      this.addForm.dProvince = value;
      let url = api_prefix + '/City/selectCities';
      let city = { level: 2, pid: id }
      this.$http.post(url, city).then(response => {
        if (response.body.code === "-1") {
          this.$alert(response.body.message, "温馨提示", { type: 'error' });
          return
        }
        this.cityList = response.body.body;
        if (cityvalue != undefined) {
          this.cityChange(cityvalue);
        }
        this.cityDate = '';
        for (var city in this.cityList) {
          if (this.cityList[city].name == this.addForm.dCity) {
            this.cityDate = this.addForm.dCity;
            break;
          }
        }
        this.addForm.dCity = this.cityDate;
      }, response => {
        this.$alert("网络出错啦~", "温馨提示", { type: 'error' });
      });
    },
    cityChange(value) { //城市修改回掉函数。 修改城市属性并加载区县列表
      let id = 0;
      for (var i in this.cityList) {
        if (this.cityList[i].name == value) {
          id = this.cityList[i].id;
        }
      }
      if (id == 0 || id == undefined) {
        return;
      }
      this.addForm.dCity = value;
      let url = api_prefix + '/City/selectCities';
      let city = { level: 3, pid: id };
      this.$http.post(url, city).then(response => {
        if (response.body.code === "-1") {
          this.$alert(response.body.message, "温馨提示", { type: 'error' });
          return
        }
        this.AreaList = response.body.body;
        this.areaDate = '';
        for (var p in this.AreaList) {
          if (this.AreaList[p].name == this.addForm.dArea) {
            this.areaDate = this.addForm.dArea;
          }
        }
        this.addForm.dArea = this.areaDate;
      }, response => {
        this.$alert("网络出错啦~", "温馨提示", { type: 'warning' });
      });
    },
    areaChange(value) {  //区县值修改回掉函数
      this.addForm.dArea = value;
    },
    //搜索公司列表
    searchCompanies: function(val) {
      if (!val) {
        this.search.companyId = null;
      }
      this.companiesOptions = null;
      this.$http.post(api_prefix + '/Company/index?pageIndex=1', {
        fastSearchStr: val
      }, { emulateJSON: true }).then(response => {
        this.companiesOptions = response.body.body.list;
      }, response => {
        console.log('出错了');
      });

    },
    //设置provinceid
    setProvincId(val) {
      this.addForm.dProvinceId = val;
    },
    setCityId(val) {
      this.addForm.dCityId = val;
    },
    //回填数据
    getPoint(x, y) {
      this.bDMapx = x
      this.bDMapy = y

      this.addForm.dMapx = x
      this.addForm.dMapy = y
    },
    //省市县数据接口
    getCityData(level, pid) {
      if (!pid || pid.length < 1) {//默认取省
        pid = null;
        level = 1;
      }
      if (level == 1) {
        // this.addForm.dCity = null
        this.cityData.dCity = null;
        this.cityData.dArea = null;
      }
      if (level == 2) {
        this.addForm.dCity = null
        this.cityData.dArea = null;
      }
      if (level == 3) {
        this.addForm.dArea = null;
      }
      this.$http.post(api_prefix + 'City/selectCities', { "level": level, "pid": pid }).then(response => {
        if (level == 1) {
          this.cityData.dProvince = response.data.body
          this.cityData.dCity = null;
          this.cityData.dArea = null;
        }
        if (level == 2) {
          this.cityData.dCity = response.data.body
          this.cityData.dArea = null;
        }
        if (level == 3) {
          this.cityData.dArea = response.data.body
        }
      }, response => {
        console.log('出错了');
      });
    },
    editStartStation(data, id) {
      console.log(data)
      this.addForm = data;
      this.addForm.dMapx = Number(this.addForm.dMapx)
      this.addForm.dMapy = Number(this.addForm.dMapy)
      this.bDMapx = this.addForm.dMapx
      this.bDMapy = this.addForm.dMapy
      this.addForm.dTraffic = this.addForm.dTraffic.toString();
      this.addForm.isUpdate = true;
      this.provinceChange(this.addForm.dProvince, this.addForm.dCity);
      console.log(this.addForm, 'this.addForm')
      this.addStartStation()
    },
    delStartStation(id) {
      var that = this;
      this.$confirm('确定删除吗', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.post(api_prefix + 'departure/del',
          {
            "companyId": 0,
            "id": id,
            "puserId": 0
          }).then(response => {
            if (response.data.code == 0) {
              this.$message({
                showClose: true,
                message: '删除成功',
                type: 'success'
              });
            } else {
              this.$alert(response.data.message)
            }
            this.getTableData();
          }, response => {
            console.log('出错了');
          });
      }).catch(() => {

      });
    },
    alertJournal() {

    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.btnFlag = true;
          if (this.addForm.isUpdate == true) {
            this.addForm.puserId = "0"
            this.$http.post(api_prefix + 'departure/update',
              this.addForm
            ).then(response => {
              this.btnFlag = false;
              if (response.data.code == 0) {
                this.$message({
                  showClose: true,
                  message: '修改成功',
                  type: 'success'
                });
                this.addStartStationClose();
                this.getTableData();
              } else {
                this.$alert(response.data.message)
              }
            }, response => {
              console.log('出错了');
            });
          } else {
            this.$http.post(api_prefix + 'departure/save',
              this.addForm
            ).then(response => {
              this.btnFlag = false;
              if (response.data.code == 0) {
                this.$message({
                  showClose: true,
                  message: '添加成功',
                  type: 'success'
                });
                this.addStartStationClose();
              } else {
                this.$alert(response.data.message)
              }
              this.getTableData();
            }, response => {
              console.log('出错了');
            });
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
      this.getTableData()
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
        this.search.currPage = val;
        this.search.pageNum = val;
        this.getTableData();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
    ,
    handleSelectionChange3(val) {
      this.multipleSelection3 = val;
    },
    addStartStation(value) {
      var alertClass = 'alertStartStation';
      this.addStartStationFlag = true;
      if (this.addStartStationFlag) {
        this.$nextTick(function() {
          jdyFn.setAlertStyle(alertClass);
          // this.search.addProduct = '';
        });
      }
    },
    addStartStationClose() {
      this.btnFlag = false;
      this.addStartStationFlag = false;
      this.getTableData();
      this.addForm = {
        "companyId": 1,
        "dArea": null,
        "dCity": null,
        "dCityId": null,
        "dCountry": null,
        "dMapx": null,
        "dMapy": null,
        "dName": null,
        "dProvince": '',
        "dProvinceId": '',
        "dThree": null,
        "dTraffic": null,
        "dType": 0,
        "puserId": 0
      }
      this.bDMapx = 116.404
      this.bDMapy = 39.915
      $('.alertbgg').remove();
    }, theLocation() {
      var city = document.getElementById("cityName").value;
      if (city != "") {
        this.map.centerAndZoom(city, 11);      // 用城市名设置地图中心点
      }
    },
    updatePage() {
      this.fullscreenLoading = true;
      setTimeout(() => {
        this.fullscreenLoading = false;
        this.$message({
          showClose: true,
          message: '刷新成功',
          type: 'success'
        });
        this.currentPage=1
        this.getTableData('all');
      }, 1000);
    },
    getTableData(flag) {
      if (flag == 'all') {
        this.search = {
          dType: 0, dTraffic: null, companyId: JSON.parse(sessionStorage.loginData).uCompanyId, dName: null, dStatus: 0,
          pageSize: 20,
          currPage: 1
        }
      }
      this.$http.post(api_prefix + 'departure/list', this.search).then(response => {
        var data = response.data.body;
        this.tableData = data.resultList;
        this.tableDataTotal = data.totalNum
      }, response => {
        console.log('出错了');
      });
    }
  },
  components: {
    jdyAlert,
    jydMap
  },
  computed: {
  },
}
</script>

