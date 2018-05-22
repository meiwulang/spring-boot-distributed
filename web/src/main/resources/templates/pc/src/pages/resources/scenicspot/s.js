const tableData = [{
    scenicspotName: "scenicspotName1",
    grade: "grade1",
    attribute:"attribute1",
    address: "address1",
    phone: "1313131331",
    operation: {
      edit: 1,
      del: 1
    }
  },
  {
    scenicspotName: "scenicspotName2",
    grade: "grade2",
     attribute:"attribute2",
    address: "address2",
    phone: "1212121211",
    operation: {
      edit: 1,
      del: 1
    }
  }
];

const departurePlaceForm = {
  departurePlaceForm: '',
  type: '',
  province: "",
  city: "",
  area: "",
  map: ""

}


const departurePlaceRule = {
  departurePlaceForm: [{
    required: true,
    message: '请输入班期编号',
    trigger: 'blur'
  }],
  type: [{
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
  departurePlaceForm,
  departurePlaceRule
}
