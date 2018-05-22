const tableData = [{
    hotelName: "hotelName1",
    grade: "grade1",
    address: "address1",
    abbreviation: "abbreviation1",
    operation: {
      edit: 1,
      del: 1,
      pic: 1
    }
  },
  {
    hotelName: "hotelName2",
    grade: "grade2",
    address: "address2",
    abbreviation: "abbreviation2",
    operation: {
      edit: 1,
      del: 1,
      pic: 1
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
