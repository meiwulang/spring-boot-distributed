const tableData = [{
  state: true,
  departureDate: '2017,7.2',
  stopTime: '2017,7.3',
  seatNumber: '',
  sold: '',
  regiments: '',
  effective: '',
  block: '',
  reserve: '',
  locking: '',
  limitingCondition: '',
  week: '',
  accordingly: '',
  operation: {
    edit: 1,
    editSeat: 1,
    del: 1
  }
}];

const banqiForm = {
  number: '',
  startTime: '',
  week: '',
  car: '',
  carNumber: '',
  seatNumber: '',
  goTime: '',
  endTime: '',
  fictitious: '',
  right: '',
  peopleNumber: '',
  sStopType:'1',
  tableData: [{
    applicableSite: '',
    ticketName: '',
    rackRate: '',
    colleaguePrice: '',
    week: '',
    inventory: '',
    presetType: '',
    restrictionType: '',
    limitingCondition: ''

  }]

}

const banqiForm2 = {
  number: '',
  startTime: '',
  car: '',
  carNumber: '',
  fictitious: '',
  seatNumber: '',
  daying: '',
  right: '',
  peopleNumber: '',
  endTime: '',
  tableData: [{
      state:'',
    applicableSite: '',
    ticketName: '',
    rackRate: '',
    colleaguePrice: '',
    week: '',
    inventory: '',
    presetType: '',
    restrictionType: '',
    limitingCondition: ''

  }]
}

const banqiRule = {
  number: [{
    required: true,
    message: '请输入班期编号',
    trigger: 'blur'
  }],
  carNumber: [{
    required: true,
    message: '请输入车俩数',
    trigger: 'blur'
  }],
  seatNumber: [{
    required: true,
    message: '请输入座位数',
    trigger: 'blur'
  }],
  endTime: [{
    required: true,
    message: '请输入停售时间',
    trigger: 'change'
  }]
}

const banqiRule2 = {
  number: [{
    required: true,
    message: '请输入班期编号',
    trigger: 'blur'
  }],
  carNumber: [{
    required: true,
    message: '请输入车俩数',
    trigger: 'blur'
  }],
  seatNumber: [{
    required: true,
    message: '请输入座位数',
    trigger: 'blur'
  }],
  endTime: [{
    required: true,
    message: '请输入停售时间',
    trigger: 'change'
  }]
}



module.exports = {
  tableData,
  banqiForm,
  banqiForm2,
  banqiRule,
  banqiRule2
}
