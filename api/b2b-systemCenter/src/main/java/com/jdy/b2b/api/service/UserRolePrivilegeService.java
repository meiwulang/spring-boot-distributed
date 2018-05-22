package com.jdy.b2b.api.service;

import java.util.List;
import java.util.Map;

import com.jdy.b2b.api.common.BaseVO;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.userrole.UserForUserRolePrivilegeDO;
import com.jdy.b2b.api.model.userrole.UserForUserRolePrivilegeDTO;
import com.jdy.b2b.api.model.userrole.UserRoleEditDO;
import com.jdy.b2b.api.model.userrole.UserRolePrivilegeDO;

/**
 * Created by zhangfofa on 2017/11/15.
 */
public interface UserRolePrivilegeService {

    String queryOrganizationalStructure(BaseVO baseVO);

    List<UserForUserRolePrivilegeDO> queryUserByDepartmentIdList(UserForUserRolePrivilegeDTO userForUserRolePrivilegeDTO);

    UserRolePrivilegeDO queryUserRolePrivilegeByUserId(Long userId, Integer type);

    ResultBean editUserRolePrivilege(UserRoleEditDO userRoleEditDO);

    List<Map> queryRoleListByUserId(Long userId);
}
