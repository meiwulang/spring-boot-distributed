package com.jdy.b2b.api.service.impl;

import com.jdy.b2b.api.dao.roleModule.RoleModuleMapper;
import com.jdy.b2b.api.model.role.Roles;
import com.jdy.b2b.api.service.RoleModuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by strict on 2017/11/16.
 */
@Service
public class RoleModuleServiceImpl implements RoleModuleService {
    @Autowired
    private RoleModuleMapper roleModuleMapper;

    @Override
    public List<Long> queryModuleByRole(Roles roles) {
        return roleModuleMapper.selectModuleIdByRole(roles);
    }
}
