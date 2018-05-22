import resourceObj from './resource';


export default {
  //查询公司部门组织架构
  getOrgTreeList: (data) => {
    return resourceObj.orgTreeResource.get({id:'queryOrganizationalStructure'});
  },
  //查询负责人
  getChargePersonList: (data) => {
    return resourceObj.orgResource.save({
      id: 'managers'
    }, data)
  },
  //设置负责人POST /struct/setmanager
  saveChargePersonList: (data) => {
    return resourceObj.orgResource.save({
      id: 'setmanager'
    }, data)
  },
  //查询指导员
  getChargeLeaderList: (data) => {
    return resourceObj.orgResource.save({
      id: 'leader'
    }, data)
  },
  //设置指导员POST /struct/setmanager
  saveChargeLeaderList: (data) => {
    return resourceObj.orgResource.save({
      id: 'setLeader'
    }, data)
  },
  //新增公司POST /struct/createcompany
  addCompany: (data) => {
    return resourceObj.orgResource.save({
      id: 'createcompany'
    }, data)
  },
  //新增部门POST /struct/createdepartment
  addDepartment: (data) => {
    return resourceObj.orgResource.save({
      id: 'createdepartment'
    }, data)
  },
  //编辑公司/部门名称POST /struct/changeorgname
  editOrgName: (data) => {
    return resourceObj.orgResource.save({
      id: 'changeorgname'
    }, data)
  },
  //撤销公司/部门
  deleteOrg: (data) => {
    return resourceObj.orgResource.get({
      id: 'delete',
      orgId: data.orgId,
      type: data.type
    })
  },


  // 用户基本信息管理列表
  userBaseList: (data) => {
    return resourceObj.userbaseResource.save({
      id: 'queryUserByDepartmentIdList'
    }, data)
  },

  //用户更新
  userUpdate: (data) => {
    return resourceObj.adduserResource.save({
      id: 'status',
      val: data.id,
      status: data.status,
      account: data.userName
    })
  },

  //获取用户详情
  getUserDetail: (data) => {
    return resourceObj.userResource.get({
      id: 'get',
      val: data
    })
  },
  //保存编辑用户权限
  addUser: (data) => {
    return resourceObj.orgUser.save({
      id: 'editUserRolePrivilege'
    }, data)
  },


}
