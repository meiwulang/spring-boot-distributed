const tableData = [{
siteName:"",
type:"",
trafficType:"",
subordinateArea:"",
  operation: {
    edit: 1,
    del: 1
  }
}];

const startStationForm = {
  siteName: '',
  trafficType: '',
  threeCoding: '',
  province:"",
  city:"",
  area:"",
  map:""

}


const startStationRule = {
  siteName: [{
    required: true,
    message: '请输入班期编号',
    trigger: 'blur'
  }],
  trafficType: [{
    required: true,
    message: '请输入交通方式',
    trigger: 'change'
  }],
  province: [{
    required: true,
    message: '请输入省份',
    trigger: 'change'
  }],
  city: [{
    required: true,
    message: '请输入城市',
    trigger: 'change'
  }],
  area: [{
    required: true,
    message: '请输入区县',
    trigger: 'change'
  }]
}



module.exports = {
  tableData,
  startStationForm,
  startStationRule
}
