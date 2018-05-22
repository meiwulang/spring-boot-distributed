package com.jdy.b2b.api.service;


import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.userrole.UserRole;

import java.util.List;

/**
 * Created by yangcheng on 2017/7/5.
 */
public interface UserRoleService {
    List<UserRole> getRoleList(UserRole role);

    UserRole queryUserRoleById(Long id);

    int updateUserRole(UserRole userRole);

    int SaveUserRole(UserRole userRole);
}
