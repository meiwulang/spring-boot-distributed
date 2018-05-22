package com.jdy.b2b.api.service;

import com.jdy.b2b.api.model.role.Roles;

import java.util.List;

/**
 * Created by strict on 2017/11/16.
 */
public interface RoleModuleService {

    List<Long> queryModuleByRole(Roles roles);
}
