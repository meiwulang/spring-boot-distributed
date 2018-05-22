package com.jdy.b2b.api.service.impl;

import com.jdy.b2b.api.common.BaseService;
import com.jdy.b2b.api.dao.userrole.UserRoleMapper;
import com.jdy.b2b.api.model.userrole.UserRole;
import com.jdy.b2b.api.service.UserRoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by yangcheng on 2017/7/5.
 */
@Service
public class RoleServiceImpl extends BaseService implements UserRoleService {
    @Autowired
    private UserRoleMapper userRoleMapper;

    @Override
    public List<UserRole> getRoleList(UserRole userRole) {
        return  userRoleMapper.getRoleList(userRole);
    }

    @Override
    public UserRole queryUserRoleById(Long id) {
        return userRoleMapper.selectByPrimaryKey(id);
    }

    @Override
    public int updateUserRole(UserRole userRole) {
        return userRoleMapper.updateByPrimaryKeySelective(userRole);
    }

    @Override
    public int SaveUserRole(UserRole userRole) {
        return userRoleMapper.insert(userRole);
    }
}
