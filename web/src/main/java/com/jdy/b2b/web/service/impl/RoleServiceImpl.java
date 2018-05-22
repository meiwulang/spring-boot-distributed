package com.jdy.b2b.web.service.impl;

import com.jdy.b2b.web.pojo.role.Roles;
import com.jdy.b2b.web.pojo.role.RolesVO;
import com.jdy.b2b.web.service.RoleService;
import com.jdy.b2b.web.util.BaseService;
import com.jdy.b2b.web.util.ResultBean;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

/**
 * Created by strict on 2017/11/16.
 */
@Service
public class RoleServiceImpl extends BaseService implements RoleService {

    private String roleListUrl;
    private String roleModuleUrl;
    private String modifyRoleModuleUrl;
    private String removeRoleUrl;


    @PostConstruct
    private void initUrl(){
        roleListUrl =  systemCenterUrl + "role/list";
        roleModuleUrl = systemCenterUrl + "role/queryRoleModule";
        modifyRoleModuleUrl = systemCenterUrl + "role/modifyRoleModule";
        removeRoleUrl = systemCenterUrl + "role/removeRole";
    }

    @Override
    public ResultBean queryList(RolesVO rolesVO) {
        return restTemplate.postForObject(roleListUrl,rolesVO,ResultBean.class);
    }

    @Override
    public ResultBean queryRoleModule(Roles roles) {
        return restTemplate.postForObject(roleModuleUrl,roles,ResultBean.class);
    }

    @Override
    public ResultBean modifyRoleModule(RolesVO rolesVO) {
        return restTemplate.postForObject(modifyRoleModuleUrl,rolesVO,ResultBean.class);
    }

    @Override
    public ResultBean removeRole(Long roleId) {
        return restTemplate.postForObject(removeRoleUrl,roleId,ResultBean.class);
    }
}
