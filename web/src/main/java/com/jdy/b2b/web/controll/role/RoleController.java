package com.jdy.b2b.web.controll.role;

import com.jdy.b2b.web.pojo.role.Roles;
import com.jdy.b2b.web.pojo.role.RolesVO;
import com.jdy.b2b.web.service.RoleService;
import com.jdy.b2b.web.util.ResultBean;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * Created by strict on 2017/11/16.
 */
@Api(value = "role", description = "角色管理")
@RestController
@RequestMapping("/role")
public class RoleController {
    @Autowired
    private RoleService roleService;

    @ApiOperation(value = "查询角色列表",httpMethod = "POST")
    @PostMapping("/list")
    public ResultBean queryList(@RequestBody RolesVO rolesVO){
        return roleService.queryList(rolesVO);
    }

    @ApiOperation(value = "删除角色",httpMethod = "POST")
    @PostMapping("/removeRole")
    public ResultBean removeRole(@RequestBody Long roleId){
        return roleService.removeRole(roleId);
    }

    /**
     *
     * @param roles
     * @return
     */
    @ApiOperation(value = "获取角色对应模块",httpMethod = "POST")
    @PostMapping("/queryRoleModule")
    public ResultBean queryRoleModule(@RequestBody Roles roles){
        if ("admin".equals(roles.getPuAccount())){
            roles.setpRoleId(Long.MAX_VALUE);
        }
        return roleService.queryRoleModule(roles);
    }

    /**
     *
     * @param rolesVO
     * @return
     */
    @ApiOperation(value = "更新或新增角色",httpMethod = "POST")
    @PostMapping("/modifyRoleModule")
    public ResultBean modifyRoleModule(@RequestBody RolesVO rolesVO){
        return roleService.modifyRoleModule(rolesVO);
    }

}
