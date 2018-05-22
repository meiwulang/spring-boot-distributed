<template>
  <div class="jdy-content jdy-transfer fleft jl-information jl-List">
    <div class="jdy-content-inner-trip">
      <!--jdy-tab begin-->
      <div class="jdy-tab">
        <a href="#" title="" @click="jdytab(null)" :class="{ active: jdytabActive==null }">全部
          <span></span>
        </a>
        <a href="#" title="" @click="jdytab(2)" :class="{ active: jdytabActive==2 }">待入库
          <span></span>
        </a>
        <a href="#" title="" @click="jdytab(3)" :class="{ active: jdytabActive==3 }">已入库
          <span></span>
        </a>
        <a href="#" title="" @click="jdytab(0)" :class="{ active: jdytabActive==0 }">已发布
          <span></span>
        </a>

      </div>
      <!--jdy-tab end-->
      <!--jdy-search begin-->
      <div class="jdy-searchPart">
        <el-select v-model="searchParams.companyId" placeholder="所属单位" v-show="companyIdFlag" clearable @change="getTableData" class="mr10">
            <el-option v-for="item in BuyerCompanyIdArr" :key="item.id" :label="item.cName" :value="item.id"></el-option>
        </el-select>
        <el-select v-model="searchParams.pType" placeholder="请选择类型" class="jdy-search-edit hasbg mr10" style="vertical-align: top;">
          <el-option v-for="(key,value) in type" :label="key" :value="value" :key="value">
          </el-option>
        </el-select>
        <div class="inlineblock mr10">
          <el-input placeholder="产品名称、产品编号、拼音码" v-model="searchParams.pName" class="" style="width:300px">
          </el-input>
        </div>
            <el-button type="primary" @click="getTableData" class="btnInTab">搜索</el-button>
      </div>
      <!--jdy-search end-->

      <!--table begin-->
      <div class="jdy-table p10">
        <el-table :data="tableData" border class="all" @row-click="rowclickHandler" highlight-current-row>
          <el-table-column label="序号" type="index">
          </el-table-column>
          <el-table-column label="产品编号" width="150" prop="pNo">
          </el-table-column>
          <el-table-column label="产品名称" min-width="200">
            <template scope="scope">
              <div style="text-align:left;padding:10px 0 10px 30px;">
                <a href="javascript:;">
                  <span @click="gotoH5(scope.row.id)" style="color:#20a0ff">{{ scope.row.pName }}</span>
                  <el-badge value="改" class="item" v-if="scope.row.updated != 0"></el-badge>
                </a>
                <span v-for="(item,index) in scope.row.productKeys" :key="item.id">
                  <span v-if="index==0">
                    <br/>
                  </span>
                  <span class="jl-noticeTitle bkone" v-if='item.kColor == 0'>{{item.kName}}</span>
                  <span class="jl-noticeTitle bktwo" v-if='item.kColor == 1'>{{item.kName}}</span>
                  <span class="jl-noticeTitle bkthree" v-if='item.kColor == 2'>{{item.kName}}</span>
                  <span class="jl-noticeTitle bkfour" v-if='item.kColor == 3'>{{item.kName}}</span>
                  <span class="jl-noticeTitle bkfive" v-if='item.kColor == 4'>{{item.kName}}</span>
                  <span class="jl-noticeTitle bksix" v-if='item.kColor == 5'>{{item.kName}}</span>
                  <span class="jl-noticeTitle bkseven" v-if='item.kColor == 6'>{{item.kName}}</span>
                  <span class="jl-noticeTitle bkeight" v-if='item.kColor == 7'>{{item.kName}}</span>
                </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="天数" width="80" prop="pDays">
          </el-table-column>
          <el-table-column label="产品经理" width="140">
            <template scope="scope">
              {{ scope.row.pContactName }}
            </template>
          </el-table-column>
          <el-table-column label="编辑时间" width="140">
            <template scope="scope">
              <span>{{ scope.row.updateTime|changeCreate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template scope="scope">
              <span v-if="scope.row.pStatus==3">已入库</span>
              <span v-else-if="scope.row.pStatus==0">已发布</span>
              <span v-else>待入库</span>
            </template>
          </el-table-column>
          <el-table-column label="排序" width="100" prop="pSort">
          </el-table-column>
          <el-table-column label="操作" width="190">
            <template scope="scope">
              <el-select v-model="editType[scope.row.id]" @change="gotoEditPage" size="mini" class="goto-update" placeholder="编辑" value="">
                <el-option key="1" value="1" label="线路信息"></el-option>
                <el-option key="2" value="2" label="行程信息"></el-option>
                <el-option key="3" value="3" label="预算成本信息"></el-option>
                <el-option key="4" value="4" label="出厂价信息"></el-option>
                <el-option key="5" value="5" label="票价信息"></el-option>
                <el-option key="6" value="6" label="班期信息"></el-option>
                <el-option key="7" value="7" label="库存信息"></el-option>
                <el-option key="8" value="8" label="关键词设置"></el-option>
              </el-select>
              <el-button type="default" v-if="scope.row.pStatus!=0 && scope.row.pStatus==3" @click="uneffect(scope.row.companyId,scope.row.id, scope.row.updateUser)" size="mini" class="red">出库</el-button>
              <el-button type="default" v-if="scope.row.pStatus!=0 && scope.row.pStatus==2" @click="effect(scope.row.companyId,scope.row.id, scope.row.updateUser)" size="mini" class="red">入库</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页   begin-->
        <div class="clearfix">
          <el-pagination class="fright pageMargin" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper" :total="tableDataTotal">
          </el-pagination>
        </div>
        <!-- 分页   end-->
      </div>

      <!-- 关键词设置 弹窗  begin-->
      <jdy-alert title="关键词设置" @closeAlert="alertSetkey" v-if="alertSetkeyFlag" class="alertSetkey">
        <div class="setkey p18 clearfix">
          <div class="setkey-top clearfix">
            <span v-for="item in productsKeywords" :key="item.id">
              <span class="bkone jl-keyWords jl-keyWordsLarge" style="display: inline-block;" v-if='item.kColor == 0'>{{item.kName}}
                <span @click="deleteRelation(item)">
                  <i class="el-icon-circle-cross"></i>
                </span>
              </span>
              <span class="bktwo jl-keyWords jl-keyWordsLarge" style="display: inline-block;" v-if='item.kColor == 1'>{{item.kName}}
                <span @click="deleteRelation(item)">
                  <i class="el-icon-circle-cross"></i>
                </span>
              </span>
              <span class="bkthree jl-keyWords jl-keyWordsLarge" style="display: inline-block;" v-if='item.kColor == 2'>{{item.kName}}
                <span @click="deleteRelation(item)">
                  <i class="el-icon-circle-cross"></i>
                </span>
              </span>
              <span class="bkfour jl-keyWords jl-keyWordsLarge" style="display: inline-block;" v-if='item.kColor == 3'>{{item.kName}}
                <span @click="deleteRelation(item)">
                  <i class="el-icon-circle-cross"></i>
                </span>
              </span>
              <span class="bkfive jl-keyWords jl-keyWordsLarge" style="display: inline-block;" v-if='item.kColor == 4'>{{item.kName}}
                <span @click="deleteRelation(item)">
                  <i class="el-icon-circle-cross"></i>
                </span>
              </span>
              <span class="bksix jl-keyWords jl-keyWordsLarge" style="display: inline-block;" v-if='item.kColor == 5'>{{item.kName}}
                <span @click="deleteRelation(item)">
                  <i class="el-icon-circle-cross"></i>
                </span>
              </span>
              <span class="bkseven jl-keyWords jl-keyWordsLarge" style="display: inline-block;" v-if='item.kColor == 6'>{{item.kName}}
                <span @click="deleteRelation(item)">
                  <i class="el-icon-circle-cross"></i>
                </span>
              </span>
              <span class="bkeight jl-keyWords jl-keyWordsLarge" style="display: inline-block;" v-if='item.kColor == 7'>{{item.kName}}
                <span @click="deleteRelation(item)">
                  <i class="el-icon-circle-cross"></i>
                </span>
              </span>
            </span>
            <p class="c1 f12" style="margin:10px 0 0 15px;">当前产品可选标签数为{{setkeyTagsMax}}，已选择{{setkeyTagsNumber}}，剩余数量{{setkeyTagsMax-setkeyTagsNumber}}！</p>
            <div class="mt10">
              <el-tag class="mr10" :key="tag.name" v-for="tag in setkeyTags" :closable="true" :type="tag.type" :close-transition="false" @close="handleSetkeyClose(tag)">
                {{tag.name}}
              </el-tag>
              <el-button class="fright" type="primary" size="small" @click="saveSetkey">保存</el-button>
            </div>
          </div>
          <div class="setkey-box mt20 clearfix" style="width: 625px;">
            <el-form label-width="80px">
              <el-row class="alertTagMain jl-keyWordsMain" style="height:200px;line-height:36px;">
                <!-- <div class="jl-keyWords active">关键词</div> -->
                <span v-for="item in allProductsKeywords" :key="item.id" @click="getCurrentKeyword(item)">
                  <span class="jl-keyWords bkone" :class="{'active':currentSelectKey == item.id }" style="display: inline-block;" v-if='item.kColor == 0'>{{item.kName}}</span>
                  <span class="jl-keyWords bktwo" :class="{'active':currentSelectKey == item.id }" style="display: inline-block;" v-if='item.kColor == 1'>{{item.kName}}</span>
                  <span class="jl-keyWords bkthree" :class="{'active':currentSelectKey == item.id }" style="display: inline-block;" v-if='item.kColor == 2'>{{item.kName}}</span>
                  <span class="jl-keyWords bkfour" :class="{'active':currentSelectKey == item.id }" style="display: inline-block;" v-if='item.kColor == 3'>{{item.kName}}</span>
                  <span class="jl-keyWords bkfive" :class="{'active':currentSelectKey == item.id }" style="display: inline-block;" v-if='item.kColor == 4'>{{item.kName}}</span>
                  <span class="jl-keyWords bksix" :class="{'active':currentSelectKey == item.id }" style="display: inline-block;" v-if='item.kColor == 5'>{{item.kName}}</span>
                  <span class="jl-keyWords bkseven" :class="{'active':currentSelectKey == item.id }" style="display: inline-block;" v-if='item.kColor == 6'>{{item.kName}}</span>
                  <span class="jl-keyWords bkeight" :class="{'active':currentSelectKey == item.id }" style="display: inline-block;" v-if='item.kColor == 7'>{{item.kName}}</span>
                </span>
              </el-row>
            </el-form>
                <el-form label-width="80px" :rules="rules" ref="newKeywordForm" :model="newKeywordForm">
                  <el-row class="alertTagTop">
                    <el-col :span="8">
                      <el-form-item label="名称：" prop='kName'>
                        <el-input v-model="newKeywordForm.kName" placeholder="请输入名称"></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="排序:" prop='lSort'>
                        <el-input-number v-model="newKeywordForm.lSort" class="all" :min="1"></el-input-number>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <div class="fr jl-TagViewBtn">{{newKeywordForm.kName || '预览样式'}}</div>
                    </el-col>
                  </el-row>
                  <el-row class="alertTagMain jl-keyWordsMainCss">
                    <ul>
                      <a href="javascript:;">
                        <li class="bkone" @click="changeColor(0)"></li>
                      </a>
                      <a href="javascript:;">
                        <li class="bktwo" @click="changeColor(1)"></li>
                      </a>
                      <a href="javascript:;">
                        <li class="bkthree" @click="changeColor(2)"></li>
                      </a>
                      <a href="javascript:;">
                        <li class="bkfour" @click="changeColor(3)"></li>
                      </a>
                      <a href="javascript:;">
                        <li class="bkfive" @click="changeColor(4)"></li>
                      </a>
                      <a href="javascript:;">
                        <li class="bksix" @click="changeColor(5)"></li>
                      </a>
                      <a href="javascript:;">
                        <li class="bkseven" @click="changeColor(6)"></li>
                      </a>
                      <a href="javascript:;">
                        <li class="bkeight" @click="changeColor(7)"></li>
                      </a>
                    </ul>
                  </el-row>
                  <el-row class="alertTagFooter">
                    <el-col :span="8">
                      <el-button type="primary" class="btnbg fr addBtn" @click="saveAddTag('addTagStyle')">
                        添加
                      </el-button>
                    </el-col>
                  </el-row>
                </el-form>
          </div>
        </div>
      </jdy-alert>
      <!--关键词设置 弹窗  end-->

      <!--系统日志查看 弹窗  begin-->
      <jdy-alert title="系统日志查看" v-if="alertJournalFlag" @closeAlert="alertJournal" class="alertJournal">
        <jdy-log :alertJournalFlag="alertJournalFlag" :journalCurrentData="journalCurrentData" :journalTotal="journalTotal" :pid="pid" :module="module" @listenToChildEvent="alertJournal"></jdy-log>
      </jdy-alert>
      <!--系统日志查看 弹窗  begin-->
      <!-- 合同弹窗 -->
      <jdy-alert title="绑定合同模板" v-if="contractFlag" @closeAlert="closeContract" class="showtfcity">
        <div class="alertBody">
          <el-radio-group v-model="tempId">
            <el-radio :label="item.id" v-for="item in tempIdGroup" :key="item.id">{{item.templateTitle}}</el-radio>
          </el-radio-group>
        </div>
        <div class="alertFoot">
          <el-button type="primary" @click="closeContract" class="fright">取消</el-button>
          <el-button type="primary" @click="saveContract" class="fright mr10">确定</el-button>
        </div>
      </jdy-alert>
    </div>
  </div>
  <!--jdy-content end-->
</template>

<script>
import jdyAlert from '@/components/Alert';
import jdyLog from '@/components/Log';

$(function () {
  $('.jdy-main-scroll').scrollTop(0)
  // $('.jdy-main-scroll').scroll(function(){
  //  $(this).scrollTop(0)
  // })
})

export default {
  name: 'list',
  data() {
    return {
      h5Url:'',
      confirmlist: [],
      puserId: 1,
      jdytabActive: null,
      type: {
        "0": "全部类型",
        "10": "周边短线",
        "11": "国内长线",
        "20": "出境长线",
        "21": "出境短线",
        "30": "邮轮",
        "50": "自由行",
        "51": "出境海岛",
        "52": "定制旅游",
        "54": "团队会奖",
        "55": "签证服务",
        "56": "机票预订",
        "57": "酒店预订",
        "58": "单项委托",
        "59": "其他服务",
        "60": "户外拓展",
        "61": "游学/研学",
        "62": "自驾游",
        "63": "全球旅拍",
        "64": "旅游金融",
        "65": "旅游地产",
        "66": "亲子",
        "67": "单一资源+拍",
        "68": "主题游",
      },
      brandList: [],
      brandSearchParams: {
        "bCompanyId": null,
        "bDel": null,
        "bName": null,
        "bStatus": null,
        "puserId": 0
      },
      tableData: [], //列表数据 array
      companyData: [],
      companyValue: '',
      setkeyTags: [], //关键词设置数据 array
      setkeyTagsAll: [], //词库关键词
      setkeyInputVisible: false,  //添加关键词 点击触发显示隐藏  input
      setkeyTagsMax: 4,  //产品可选标签数
      setkeyTagsNumber: 0,  //产品可选标签数
      setkeyInputValue: '', //添加关键词 Input 输入
      setkeyTagType: 'danger', //默认添加关键词 tag 格式
      alertSetkeyFlag: false, //添加关键词 弹窗 判断值
      setkeyStyle: { //添加关键词弹窗位置

      },
      setkeySelectTags: [],  //标签样式选择 数据  array
      alertJournalFlag: false, //系统日志查看 弹窗值
      journalStyle: { //系统日志弹窗位置
        top: '164px',
        left: '300px'
      },
      // journalCurrentData: {}, //日志数据ww
      currentPage: 1, //列表当前所在页,
      pageSize: 10,
      companyName: '',
      companyType:null,
      companiesOptions: [],
      searchParams: {//搜索参数
        "puserId": null,
        "companyId": null,
        "pName": null,
        "pBrand": null,
        "pType": "0",
        "isSaler":1,
        // ascription:0,
        // BuyerCompanyId:null,
        pageSize: 10,
        currPage: 1
      },
      deleteTripsParams: {
        "tProductId": '',
        "tType": 1,
        "puserId": 0,
        "tcStartDay": null,
        "tcEndDay": null
      },
      //列表总数
      tableDataTotal: 0,
      addFlag: null,

      productsKeywords: [],//查询指定产品的关键词列表
      allProductsKeywords: [],//全部关键词列表
      currentSelectKey: null,//当前选中的关键词
      newKeywordForm: {
        companyId: null,
        kName: null,//添加系统关键词输入框
        lSort: null,
        kColor: null
      },
      isOpen: '1',
      //编辑类型
      editType: [],
      //行程天数
      tripDays: 0,
      //日志相关参数
      pid: null,
      c_id:null,
      module: "Product",
      journalTotal: 0,
      journalCurrentData: [], //日志数据
      rules: {
        kName: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { max: 5, message: '最多输入5个字符', trigger: 'blur' }
        ],
        lSort: [
          { type: 'number', message: '排序必须为数字值' }
        ]
      },
      fullscreenLoading: false,
      loading: false,
      // 合同模板相关
      contractFlag:false,
      tempId:null,
      tempIdGroup:[],
      // 系统级需要有查询公司功能
      BuyerCompanyIdArr:[],
      companyIdFlag:false,
    }
  },
  mounted() {
    //初始化公司列表
    let logindata=JSON.parse(sessionStorage.loginData)
      this.companyId=logindata.uCompanyId
      this.newKeywordForm.companyId=logindata.uCompanyId
      this.companyType=logindata.cType
      this.brandSearchParams.bCompanyId=this.companyId
      this.brandSearchParams.companyId=this.companyId
      // this.searchParams.companyId=logindata.uCompanyId
      // this.companyId=this.searchParams.companyId;
      if(logindata.uDataLimit==3){
        this.searchParams.companyId=logindata.uCompanyId
        this.getBuyerCompanyId();
        this.companyIdFlag=true;
      }else{
        this.searchParams.companyId=logindata.uCompanyId
      }
    this.$http.post(api_prefix + '/Company/index?pageIndex=1', {
      fastSearchStr: logindata.cName
    }, { emulateJSON: true }).then(response => {
      this.companiesOptions = response.body.body.list;
    }, response => {
      console.log('出错了');
    });
    this.getTableData()
   this.searchBrands();
  },
  methods: {
    //产品预览
    gotoH5(id){
      var urlHead = '';
      let logindata = JSON.parse(sessionStorage.loginData);
      if(location.host == 'b2b.fingercrm.cn'){
        urlHead = 'http://m.sopin.fingercrm.cn'
      }else{
        urlHead = 'http://sp.h5.test.fingercrm.cn'
      }
      this.h5Url = `${urlHead}/product-detail/${id}?access_token=${logindata.distributionSystemDTO.accessToken}&source=dist`
      window.open(this.h5Url)  
    },
    //删除关键词关联关系
    deleteRelation(item) {
      this.$http.post(api_prefix + '/productKey/deleteProductKeyRelation?keyId=' + item.id + '&productId=' + this.pid
      ).then(response => {
        if (response.data.code == 0) {
          //this.getProductsKeywords();
          let keyindex=this.productsKeywords.indexOf(item)
         if( keyindex>-1){
          this.productsKeywords.splice(keyindex,1)
          this.setkeyTagsNumber--
         }
          this.$message({
            showClose: true,
            message: '删除成功',
            type: 'success'
          });
        }
        //this.$alert(response.data.message)
      }, response => {
        console.log('获取日志出错了');
      });
    },
    //新增关键词点击修改颜色
    changeColor(val) {//点击样式标签并获取对应的val
      $('.alertTagMain a li').removeClass('active');
      $('.alertTagMain a li').eq(val).addClass('active');
      this.newKeywordForm.kColor = val;
      this.changeViewBtn();
    },
    //选中当前点击关键词
    getCurrentKeyword(item) {
      console.log(item,'item')
      console.log(this.setkeyTagsNumber,'setkeyTagsNumber')
      if (this.setkeyTagsNumber < 4) {
        if (this.productsKeywords.indexOf(item) < 0) {
          this.productsKeywords.push(item)
          this.currentSelectKey = item.id
          this.setkeyTagsNumber++
        } else {
          this.$alert('请不要重复选择同一关键词')
        }
      } else {
        this.$alert('最多可以选择4个关键词')
      }
    },
    //保存系统关键词
    saveAddTag() {
      this.$refs.newKeywordForm.validate((valid) => {
        if (valid) {
          this.$http.post(api_prefix + 'productKey/saveNewKey', this.newKeywordForm
          ).then(response => {
            if (response.data.code == 0) {
              this.$message({
                showClose: true,
                message: '添加成功',
                type: 'success'
              });
              this.getProductsKeywords();
              this.getAllProductsKeywords();
            } else {
              this.$message({
                type: 'success',
                message: '保存成功!'
              });
            }
          }, response => {
            console.log('出错了');
          });
        }

      })

    },
    //查询该企业的全部关键词
    getAllProductsKeywords() {

      let _self = this;
      this.$http.post(api_prefix + 'productKey/selectKeyListByCompanyId', { companyId: this.companyId, currPage: 1, pageSize: 1000 }
      ).then(response => {
        _self.allProductsKeywords = []
        response.data.body.resultList.forEach(function (value) {
          _self.allProductsKeywords.push(value);
        });
      }, response => {
        console.log('获取日志出错了');
      });
    },
    //查询指定产品的关键词
    getProductsKeywords() {
      let _self = this;
      this.$http.post(api_prefix + '/productKey/selectKeyListByProductId?productId=' + this.pid
      ).then(response => {
        _self.productsKeywords = []
        response.data.body.forEach(function (value) {
          _self.productsKeywords.push(value);
          _self.setkeyTagsNumber = response.data.body.length > 0 ? response.data.body.length : 0
        });
      }, response => {
        console.log('获取日志出错了');
      });
    },
    //关闭关键词弹窗
    alertSetkey() {
      this.newKeywordForm.kName = null
      this.newKeywordForm.lSort = null
      this.newKeywordForm.kColor = null
      this.kName = null;
      this.currentSelectKey = null;
      this.alertSetkeyFlag = !this.alertSetkeyFlag;
      this.setkeyTagsNumber = 0;
      this.$set(this.editType, this.pid, null)
    },
    //编辑页面跳转
    gotoEditPage(val) {
      if (this.alertJournalFlag == true && !this.pid) {
        this.$alert("请选择产品");
        return
      }
      if (val == 1) { this.$router.push({ name: "ProductDeployLine",query: { id: this.pid,c_id:this.c_id }});}//线路信息
      if (val == 2) { this.$router.push({ name: "ProductDeployTrip",query: { id: this.pid,c_id:this.c_id }});}//行程信息
      if (val == 3) { this.$router.push({ name: "ProductDeployCostList",query: { id: this.pid,c_id:this.c_id }});}//预算成本信息
      if (val == 4) { this.$router.push({ name: "ProductDeployExfactoryPrice",query: { id: this.pid,c_id:this.c_id }});}//出厂价信息
      if (val == 5) { this.$router.push({ name: "ProductDeployTicketprice",query: { id: this.pid,c_id:this.c_id }});}//票价信息
      if (val == 6) { this.$router.push({ name: "ProductDeploySchedule",query: { id: this.pid,c_id:this.c_id }});}//班期信息
      if (val == 7) { this.$router.push({ name: "ProductDeployInventory",query: { id: this.pid,c_id:this.c_id }});}//库存信息
      if (val == 8) { this.alertSetkeyFlag = true; }//关键词设置
      if (!this.pid) {
        this.$alert("请选择产品");
        return
      }
    },
    // 合同模板-查询
    getContract(){
      this.$http.get(api_prefix + 'front/order/m/electronicContract/prodTempList/'+this.pid).then(response => {
        if (response.data.code == 0) {
          this.openContract();
          let data=response.data.body;
          this.tempId=data.id;
          this.tempIdGroup=data.list
          // 增加线下签署
          this.tempIdGroup.push({
            "templateTitle":"线下签署",
            "id":0
          })
        } else {
          this.$alert(response.data.message)
        }
      }, response => {
        console.log('出错了');
      });
    },
    // 合同模板-保存
    saveContract(){
      let param={
        currPage: 1,
        pageSize: 20,
        pid: this.pid,
        tid: this.tempId,
      };
      this.$http.post(api_prefix + 'front/order/m/electronicContract/bindProAndTmp',param).then(response => {
        if (response.data.code == 0) {
          this.$message.info("保存成功！");
          this.closeContract();
        } else {
          this.$alert(response.data.message)
        }
        this.getTableData();
      }, response => {
        console.log('出错了');
      });
    },
    // 合同模板-打开弹窗
    openContract(){
      this.contractFlag=true;
      this.$nextTick(function(){
          jdyFn.setAlertStyle('showtfcity');
      });
    },
    // 合同模板-关闭弹窗
    closeContract(){
      this.contractFlag=false;
      $('.alertbgg').remove();
      this.$set(this.editType, this.pid, null)
    },
    // 删除待入库产品
    deleteProduct(id){
      this.$confirm('是否要删除该产品？', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        // console.log("id",id)
        this.$http.post(api_prefix + 'product/delete/'+id).then(response => {
          if (response.data.code == 0) {
            this.$message.success("删除成功")
          } else {
            this.$alert(response.data.message)
          }
          this.getTableData()
        }, response => {
          console.log('出错了');
        });
      }).catch(() => {

      });
    },

    //----------日志相关逻辑 start-----
    //关闭,打开日志弹窗
    alertJournal(alertJournalFlag) {
      if (!this.pid) { this.$alert("请选择产品"); return }
      this.alertJournalFlag = !this.alertJournalFlag
      if (this.alertJournalFlag) {
        this.$nextTick(function () {
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
        response.data.body.list.forEach(function (value) {
          _self.journalCurrentData.push(value);
        });
        // this.journalCurrentData=response.data.body.list
      }, response => {
        console.log('获取日志出错了');
      });
    },
    //table行点击事件
    rowclickHandler(row, event, column) {
      this.pid = row.id;
      this.c_id=row.companyId;
      //if (!this.companyId) { this.companyId = row.companyId }
      this.tripDays = row.pDays;
      this.getLogData(1)
      this.getProductsKeywords()
      this.getAllProductsKeywords()
    },
    //----------日志相关逻辑 end-----
    //删除补充行程
    deleteTrips(pid, tripStartCalendar, tripEndCalendar) {
      this.deleteTripsParams.tProductId = pid
      this.deleteTripsParams.tcStartDay = tripStartCalendar
      this.deleteTripsParams.tcEndDay = tripEndCalendar
      this.$confirm('你确定要删除该行程？', '温馨提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        this.$http.post(api_prefix + '/trip/batchDelete', this.deleteTripsParams).then(response => {

          if (response.data.code == 0) {
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            });
          } else {
            this.$alert(response.data.message)
          }
          this.getTableData()
        }, response => {
          console.log('出错了');
        });
      })

    },
    //修改状态
    changeConfirm(val) {
      if (val.pConfirm == 0) {
        val.pConfirm = 1
      } else {
        val.pConfirm = 0
      }
      val.lineType=0
      console.log("pConfirm", val.pConfirm);
      delete val.pQq
      delete val.pContacts
      val.puserId = this.puserId
      this.$http.post(api_prefix + '/product/update', val).then(response => {
        if (response.data.code != 0) {
          this.$alert(response.data.message)
        }
      }, response => {
        console.log('出错了');
      });
    },
    changeBrand(){
      this.searchParams.pBrand=null
       this.brandList = null;
      this.searchBrands();
    },
    //获取品牌列表
    searchBrands(val) {
      if(this.searchParams.companyId){
          this.brandSearchParams.companyId=this.searchParams.companyId
          this.brandSearchParams.bCompanyId=this.searchParams.companyId
      }else{
        return;
      }
      this.brandSearchParams.bName = val;
      if (!val) {
        this.searchParams.pBrand = null;

      }
      this.brandList = null;
      this.$http.post(api_prefix + '/brand/list', this.brandSearchParams).then(response => {
        this.brandList = response.data.body.resultList;
      }, response => {
        console.log('出错了');
      });
    },
    //搜索公司列表
    // searchCompanies(val) {
    //   if (!val) {
    //     this.searchParams.companyId = null;
    //   }
    //   this.companiesOptions = null;
    //   this.$http.post(api_prefix + '/Company/index?pageIndex=1' + '&fastSearchStr=' + $.trim(val), { emulateJSON: true }).then(response => {
    //     this.companiesOptions = response.body.body.list;
    //   }, response => {
    //     console.log('出错了');
    //   });

    // },
    jdytab(index) {
      this.jdytabActive = index;
      this.searchParams.pStatus = index
      this.getTableData()
    },
    getChangeType(value) {
      this.pType = value;
      this.getTableData();
    },

    //查询补充行程
    queryExtTrips(tProductId) {

      this.$http.post(api_prefix + 'trip/list',
        {
          "tProductId": tProductId,
          "tType": 1,
        }
      ).then(response => {
        this.$alert(response.body.message);
      }, response => {
        console.log('出错了');
      });
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
        this.getTableData();
      }, 1000);
    },
    //产品添加关键词
    addProductKey() {
      this.$http.post(api_prefix + 'productKey/saveProductKeyRelation?productId=' + 1 + '&keyId=' + 1

      ).then(response => {
        this.$alert(response.body.message);
      }, response => {
        console.log('出错了');
      });
    },
    //恢复
    effect(companyId, id, updateUser) {
      this.$confirm('你确定要将该产品入库？', '温馨提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        this.$http.post(api_prefix + 'product/effect',
          {
            "companyId": companyId,
            "id": id,
            "puserId": updateUser
          }
        ).then(response => {
          if (response.data.code == 0) {
            this.$message({
              showClose: true,
              message: '入库成功',
              type: 'success'
            });
            this.getTableData();
          } else {
            this.$alert(response.data.message)
          }
        }, response => {
          console.log('出错了');
        });
      })
    },
    uneffect(companyId, id, updateUser) {
      this.$confirm('你确定要将该产品移出？', '温馨提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        this.$http.post(api_prefix + 'product/uneffect',
          {
            "companyId": companyId,
            "id": id,
            "puserId": updateUser
          }
        ).then(response => {
          if (response.data.code == 0) {
            this.$message({
              showClose: true,
              message: '出库成功',
              type: 'success'
            });
            this.getTableData();
          } else {
            this.$alert(response.data.message)
          }
        }, response => {
          console.log('出错了');
        });
      })

    },
    getTableData() {//更新table数据
    // if(JSON.parse(sessionStorage.loginData).cType == 2){
    //   this.searchParams.companyId = null
    // }
    let params= JSON.parse(JSON.stringify(this.searchParams)) ;
   if( params.pType=='0'){
     delete params.pType
   }
      //if (!this.searchParams.companyId) { this.search
      // Params.companyId = 1 }
      // eventHub.$emit('isLoading','open');
      this.$http.post(api_prefix + 'product/list', params
      ).then(response => {
        // eventHub.$emit('isLoading','close');
        let data = response.data.body;
        this.tableData = data.resultList;
        this.tableDataTotal = data.totalNum
      }, response => {
        // eventHub.$emit('isLoading','close');
        console.log('出错了');
      });
    },
    handleSetkeyClose(tag) {//删除关键字
      // 删除关键字的索引值
      this.setkeyTags.splice(this.setkeyTags.indexOf(tag), 1);
    },
    showSetkeyInput() {//显示input框
      this.setkeyInputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleSetkeyInputConfirm() {//添加到词库的关键词
      let setkeyInputValue = this.setkeyInputValue;
      let setkeyTagType = this.setkeyTagType;
      console.log(setkeyTagType)
      if (setkeyInputValue) {
        let obj = {
          name: setkeyInputValue,
          type: setkeyTagType,
          classname: 'el-tag--' + setkeyTagType
        }
        this.setkeyTagsAll.push(obj);
      }
      this.setkeyInputVisible = false;
      this.setkeyInputValue = '';
    },
    saveSetkey(a, b, c) { //保存关键词
      if (this.productsKeywords.length > 4) {
        this.$alert("最多可以添加4个关键词"); return;
      }
      //if(this.currentSelectKey==null){this.$alert('请选择词条');return ;}
      if (this.productsKeywords.length < 1) { this.$alert('请选择词条'); return; }
      let keyIds = [];
      this.productsKeywords.forEach(function (val) {
        keyIds.push(val.id)
      })
      //保存关联关系
      this.$http.post(api_prefix + '/productKey/batchSaveProductKeyRelation', { "productId": this.pid, "keyIds": keyIds }).then(response => {
        if (response.data.code == 0) {
          this.getProductsKeywords();
          this.getTableData();
          this.getAllProductsKeywords();
        }
        this.$message({
          type: 'success',
          message: '保存成功!'
        });
      }, response => {
        console.log('获取日志出错了');

      });
    },
    setType(type, name, index) {
      var arr = this.setkeySelectTags,
        len = arr.length,
        i = 0;
      for (; i < len; i++) {
        this.setkeySelectTags[i]['flag'] = false;
      }
      this.setkeySelectTags[index]['flag'] = true;
      this.setkeyTagType = type;
    },

    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      if (val) {
        this.searchParams.currPage = val;
        this.searchParams.pageNum = val;
        this.getTableData();
        //console.log(`当前页: ${val}`);
      }
    },
    changeViewBtn() {//预览标签样式
      switch (this.newKeywordForm.kColor) {
        case 0:
          $('.alertTagTop .jl-TagViewBtn').removeClass('bkone bktwo bkthree bkfour bkfive bksix bkseven bkeight')
          $('.alertTagTop .jl-TagViewBtn').addClass('bkone')
          break;
        case 1:
          $('.alertTagTop .jl-TagViewBtn').removeClass('bkone bktwo bkthree bkfour bkfive bksix bkseven bkeight')
          $('.alertTagTop .jl-TagViewBtn').addClass('bktwo')
          break;
        case 2:
          $('.alertTagTop .jl-TagViewBtn').removeClass('bkone bktwo bkthree bkfour bkfive bksix bkseven bkeight')
          $('.alertTagTop .jl-TagViewBtn').addClass('bkthree')
          break;
        case 3:
          $('.alertTagTop .jl-TagViewBtn').removeClass('bkone bktwo bkthree bkfour bkfive bksix bkseven bkeight')
          $('.alertTagTop .jl-TagViewBtn').addClass('bkfour')
          break;
        case 4:
          $('.alertTagTop .jl-TagViewBtn').removeClass('bkone bktwo bkthree bkfour bkfive bksix bkseven bkeight')
          $('.alertTagTop .jl-TagViewBtn').addClass('bkfive')
          break;
        case 5:
          $('.alertTagTop .jl-TagViewBtn').removeClass('bkone bktwo bkthree bkfour bkfive bksix bkseven bkeight')
          $('.alertTagTop .jl-TagViewBtn').addClass('bksix')
          break;
        case 6:
          $('.alertTagTop .jl-TagViewBtn').removeClass('bkone bktwo bkthree bkfour bkfive bksix bkseven bkeight')
          $('.alertTagTop .jl-TagViewBtn').addClass('bkseven')
          break;
        case 7:
          $('.alertTagTop .jl-TagViewBtn').removeClass('bkone bktwo bkthree bkfour bkfive bksix bkseven bkeight')
          $('.alertTagTop .jl-TagViewBtn').addClass('bkeight')
          break;
      }
      this.tagViewBtnColor = $(".jl-TagViewBtn").css('color');
      console.log(this.tagViewBtnColor);
    },
    //系统级查询公司
    getBuyerCompanyId(key){
        this.$http.post(api_prefix + 'Company/index', { pid:343 ,searchType:1, pageIndex: 1, fastSearchStr: $.trim(key)}, { emulateJSON: true }).then(response => {
            if(response.body.code==0){
                this.BuyerCompanyIdArr=response.body.body.list
            }else{

            };
        });
    },
  },watch:{
    "searchParams.companyId":"changeBrand"
  },
  components: {
    jdyAlert,
    jdyLog
  },
  created() {
    jdyFn.scrollToTop()
  },
  filters: {
    changeCreate: function (value) {
      var unixTimestamp = new Date(value);
      var oYear = unixTimestamp.getFullYear();
      var oMonth = unixTimestamp.getMonth() + 1;
      var oDay = unixTimestamp.getDate();
      var oHour = unixTimestamp.getHours();
      var oMin = unixTimestamp.getMinutes();
      var oSen = unixTimestamp.getSeconds();
      var oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay) + ' ' + getzf(oHour) + ':' + getzf(oMin) + ':' + getzf(oSen);//最后拼接时间
      //补0操作
      function getzf(num) {
        if (parseInt(num) < 10) {
          num = '0' + num;
        }
        return num;
      }
      return value = oTime.substr(0, 10);
    },
  }
}


</script>
<style scoped>
#to-line-page {
  line-height: 14px;
  padding: 0;
}

.jl-noticeTitle {
  width: 70px;
  font-size: 12px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  display: inline-block;
  margin-top: 5px;
}

.el-table__expanded-cell {
  padding: 0px;
  padding-right: 26px;
  padding-left: 90px;
}

.el-dropdown .el-button-group .el-button {
  float: left;
}

.el-dropdown-menu__item span {
  font-size: 14px;
  width: 95px;
  display: inline-block
}
button.mleft0{
  margin-left: 0;
}

.alertBody{
  width: 100%-20px;
  padding: 10px;
}
.alertFoot{
  width: 100%-20px;
  height: 40px;
  padding: 10px;
  background: #f9fafc;
}
.el-radio-group .el-radio {
    display: block;
    margin: 10px 30px;
}
</style>



