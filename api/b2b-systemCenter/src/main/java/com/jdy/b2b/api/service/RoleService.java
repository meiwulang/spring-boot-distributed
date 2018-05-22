package com.jdy.b2b.api.service;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.role.RolesVO;

/**
 * Created by strict on 2017/11/16.
 */
public interface RoleService {

    ResultBean queryList(RolesVO rolesVO);

    ResultBean modifyRole(RolesVO rolesVO);

    ResultBean removeRoleId(Long roleId);
}
