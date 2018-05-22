package com.jdy.b2b.web.service;

import com.jdy.b2b.web.pojo.role.Roles;
import com.jdy.b2b.web.pojo.role.RolesVO;
import com.jdy.b2b.web.util.ResultBean;

/**
 * Created by strict on 2017/11/16.
 */
public interface RoleService {

    ResultBean queryList(RolesVO rolesVO);

    ResultBean queryRoleModule(Roles roles);

    ResultBean modifyRoleModule(RolesVO rolesVO);

    ResultBean removeRole(Long roleId);
}
