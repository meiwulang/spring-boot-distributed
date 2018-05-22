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
    classname: 'el-tag--gray'
  },
  {
    type: 'primary',
    name: '样式三',
    classname: 'el-tag--primary'
  },
  {
    type: 'success',
    name: '样式四',
    classname: 'el-tag--success'
  }, {
    type: 'warning',
    name: '样式五',
    classname: 'el-tag--warning'
  }, {
    type: 'danger',
    name: '样式六',
    classname: 'el-tag--danger'
  }, {
    type: '',
    name: '样式一',
    color: '#ff4949',
    classname: ''
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
]
module.exports = {
  tableData,
  setkeySelectTags,
  journalData
}
