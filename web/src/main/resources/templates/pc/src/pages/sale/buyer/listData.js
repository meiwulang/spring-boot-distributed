let tableData = [{
    "serialNumber": "151515", //序号
    "product": "桂林4日游", //产品名称
    "state": "已发布", //状态
    "productNumber": "11555", //产品编号
    "days": "1", //天数
    "share": "http://www.baidu.com", //分享
    "product2": "产品副标题", //产品副标题
    "customerService": "王小虎", //客服
    "confirmState": false, //确认状态
    "date": "2016-05-02", //编辑时间
    "operation": { //操作
      "line": 1, //线路
      "trip": 1, //行程
      "ticket": 1, //票价
      "schedule": 1, //班期
      "edit": 0, //编辑
      "del": 1 //删除 下架
    },
    "all": false
  },
  {
    "serialNumber": "151515", //序号
    "product": "桂林4日游", //产品名称
    "state": "已发布", //状态
    "productNumber": "11555", //产品编号
    "days": "1", //天数
    "share": "http://www.baidu.com", //分享
    "product2": "产品副标题", //产品副标题
    "customerService": "王小虎", //客服
    "confirmState": true, //确认状态
    "date": "2016-05-02", //编辑时间
    "operation": { //操作
      "line": 0, //线路
      "trip": 0, //行程
      "ticket": 0, //票价
      "schedule": 0, //班期
      "edit": 1, //编辑
      "del": 1 //删除 下架
    },
    "all": false
  },
  {
    "serialNumber": "151515", //序号
    "product": "桂林4日游", //产品名称
    "state": "已发布", //状态
    "productNumber": "11555", //产品编号
    "days": "1", //天数
    "share": "http://www.baidu.com", //分享
    "product2": "产品副标题", //产品副标题
    "customerService": "王小虎", //客服
    "confirmState": true, //确认状态
    "date": "2016-05-02", //编辑时间
    "operation": { //操作
      "line": 0, //线路
      "trip": 0, //行程
      "ticket": 0, //票价
      "schedule": 0, //班期
      "edit": 1, //编辑
      "del": 1 //删除 下架
    },
    "all": true
  }
];

let setkeySelectTags = [{
    type: 'gray',
    name: '样式二',
    classname: 'el-tag--gray',
    flag:false
  },
  {
    type: 'primary',
    name: '样式三',
    classname: 'el-tag--primary',
    flag:false
  },
  {
    type: 'success',
    name: '样式四',
    classname: 'el-tag--success',
    flag:false
  }, {
    type: 'warning',
    name: '样式五',
    classname: 'el-tag--warning',
    flag:false
  }, {
    type: 'danger',
    name: '样式六',
    classname: 'el-tag--danger',
    flag:false
  }, {
    type: '',
    name: '样式一',
    color: '#ff4949',
    classname: 'el-tag--one',
    flag:true
  }
];
let journalData = [{
    table: [{
      describe: '关键词更新成功1！',
      source: '1',
      people: 'xxxx',
      time: '2017-07-03'
    },{
      describe: '关键词更新成功2！',
      source: '12',
      people: 'xxxx',
      time: '2017-07-05'
    }],
    more: {
      company: '杭州正太旅行社有限公司', //单位
      name: '筱筱',
      accountNumber: '15355410021',
      describe: '设置线路，订单无需确认成功!',
      modular: 'Products',
      method: 'not_confirm'
    }
  },
  {
    table: [{
      describe: '关键词更新成功111！',
      source: '12',
      people: 'xxxx',
      time: '2017-07-04'
    },{
      describe: '关键词更新成功122！',
      source: '112',
      people: 'xxxx22',
      time: '2017-07-04'
    }],
    more: {
      company: '杭州正太旅行社有限公司2', //单位
      name: '筱筱22',
      accountNumber: '15355410021',
      describe: '设置线路，订单无需确认成功12!',
      modular: 'Products22',
      method: 'not_confirm11'
    }
  },
  {
    table: [{
      describe: '关键词更新成功1asas！',
      source: '12ss',
      people: 'xxxxaa',
      time: '2017-07-04'
    },{
      describe: '关键词更！',
      source: '112aaa',
      people: 'xxxx22',
      time: '2017-07-04'
    }],
    more: {
      company: '杭州正太旅行社有限公司22223', //单位
      name: '筱筱wq22aaasas',
      accountNumber: 'asdasdasd',
      describe: '设置线路，订单无需确认成功122222!',
      modular: 'Products2aazz2',
      method: 'not_confirm11aa'
    }
  }
];
let yjkTestData={
  "buyerCity": "string",
  "buyerProvince": "string",
  "createTime": "2017-09-25T03:24:23.571Z",
  "createUser": 0,
  "createrURealName": "string",
  "currPage": 0,
  "id": 0,
  "oBedNum": 0,
  "oBusSeat": "string",
  "oBuyerCompanyId": 0,
  "oBuyerCompanyName": "string",
  "oBuyerId": 0,
  "oBuyerName": "string",
  "oConfirmTime": "2017-09-25T03:24:23.572Z",
  "oContractNo": "string",
  "oExternalNo": "string",
  "oInvalidTime": "2017-09-25T03:24:23.572Z",
  "oInvoiceAmount": 0,
  "oIsmerge": "string",
  "oMarketPrice": 0,
  "oOrderNo": "string",
  "oPayMethod": 0,
  "oPeopleNum": 0,
  "oPlan": true,
  "oPreferentialAmount": 0,
  "oProductId": 0,
  "oRealPay": 0,
  "oRealPrice": 0,
  "oRemark": "string",
  "oRoomAdjust": 0,
  "oSalerCompanyId": 0,
  "oSalerCompanyName": "string",
  "oSalerId": 0,
  "oSalerName": "string",
  "oScheduleId": 0,
  "oServicer": "string",
  "oServicerPhone": "string",
  "oSettlementReferences": 0,
  "oStatus": 0,
  "oTotalPrice": 0,
  "pDays": 0,
  "pName": "string",
  "pNo": "string",
  "pType": 0,
  "pageSize": 0,
  "priceDetails": [
    {
      "createTime": "2017-09-25T03:24:23.572Z",
      "createUser": 0,
      "currPage": 0,
      "id": 0,
      "opActivityId": 0,
      "opNum": 0,
      "opOrderId": 0,
      "opPrice": 0,
      "opPriceName": "string",
      "opRemark": "string",
      "opStatus": "string",
      "opTotalPrice": 0,
      "opType": 0,
      "pageSize": 0,
      "updateTime": "2017-09-25T03:24:23.572Z",
      "updateUser": 0
    }
  ],
  "sCalendar": "2017-09-25T03:24:23.572Z",
  "salerCity": "string",
  "salerProvince": "string",
  "tourists": [
    {
      "createTime": "2017-09-25T03:24:23.572Z",
      "createUser": 0,
      "currPage": 0,
      "id": 0,
      "otLeaveId": 0,
      "otLeavePrice": 0,
      "otLeaveType": "string",
      "otLicenceType": 0,
      "otLincese": "string",
      "otName": "string",
      "otOrderId": 0,
      "otPhone": "string",
      "otReturnId": 0,
      "otReturnPrice": 0,
      "otReturnType": "string",
      "otTicketType": 0,
      "otType": 0,
      "pageSize": 0,
      "updateTime": "2017-09-25T03:24:23.572Z",
      "updateUser": 0
    }
  ],
  "updateTime": "2017-09-25T03:24:23.572Z",
  "updateUser": 0
}
module.exports = {
  tableData,
  setkeySelectTags,
  journalData,
  yjkTestData
}
