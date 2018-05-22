package com.jdy.b2b.web.service;

import com.jdy.b2b.web.pojo.userrole.UserRole;
import com.jdy.b2b.web.pojo.userrole.UserRoleQueryVo;
import com.jdy.b2b.web.pojo.userrole.UserRoleSaveOrUpdateVo;
import com.jdy.b2b.web.util.ResultBean;

import java.util.List;


/**
 * Created by yangcheng on 2017/7/12.
 */
public interface UserRoleService {

    ResultBean queryRoleList(UserRoleQueryVo vo);

    ResultBean<UserRole> queryUserRoleById(Long id);

    ResultBean<Long> saveOrUpdateUserRole(UserRoleSaveOrUpdateVo vo);
}
