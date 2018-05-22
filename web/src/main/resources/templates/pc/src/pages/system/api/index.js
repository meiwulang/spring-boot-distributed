import resourceObj from './resource';


export default {
  //查询公司部门组织架构
  getOrgTreeList: (data) => {
    if(process.env.NODE_ENV==='development'){
      return resourceObj.orgTreeResource.get({id:'queryOrganizationalStructure',companyId:data})
    }else{
      return resourceObj.orgTreeResource.get({
        id: 'queryOrganizationalStructure'
      })      
    }
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
  // 查询角色列表
  getRoleList: (data) => {
    return resourceObj.roleResource.save({
      id: 'list'
    }, data)
  },
  // 更新角色
  roleUpdate: (data) => {
    return resourceObj.roleResource.save({
      id: 'modifyRoleModule'
    }, data)
  },
  // 获取角色
  roleEdit: (data) => {
    return resourceObj.roleResource.save({
      id: 'queryRoleModule'
    }, data)
  },
  // 删除角色
  roleRemove: (data) => {
    return resourceObj.roleResource.save({
      id: 'removeRole'
    }, data)
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
  //查询角色列表
  queryRoleList: (data) => {
    return resourceObj.orgTreeResource.get({
      id: 'queryRoleListByUserId'
    }, data)
  },
  //查看角色权限明细
  getAuthenticDetail: (data) => {
    return resourceObj.orgTreeResource.get({
      id: 'queryUserRolePrivilegeByUserId',
      userId: data.userId,
      type: data.type
    })
  },

}
