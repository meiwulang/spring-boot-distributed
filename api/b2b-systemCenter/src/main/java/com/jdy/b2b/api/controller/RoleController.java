package com.jdy.b2b.api.controller;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.role.Roles;
import com.jdy.b2b.api.model.role.RolesVO;
import com.jdy.b2b.api.service.ModuleService;
import com.jdy.b2b.api.service.RoleModuleService;
import com.jdy.b2b.api.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by strict on 2017/11/15.
 */
@RestController
@RequestMapping("/role")
public class RoleController {
    @Autowired
    private RoleService roleService;
    @Autowired
    private ModuleService moduleService;
    @Autowired
    private RoleModuleService roleModuleService;

    @PostMapping("/list")
    public ResultBean queryList(@RequestBody RolesVO rolesVO){
        return roleService.queryList(rolesVO);
    }

    @PostMapping("/removeRole")
    public ResultBean removeRole(@RequestBody Long roleId){
        return roleService.removeRoleId(roleId);
    }

    /**
     * 获取 模块
     * @return
     */
    @PostMapping("/queryRoleModule")
    public ResultBean queryRoleModule(@RequestBody Roles roles){
        //RolesVO rolesDTO = new RolesVO();
        Map<String,Object> res = new HashMap<>();
        Map<String,Object> treeMap = moduleService.getModuleJsonByRoldId(roles.getpRoleId());
        res.put("tree",treeMap.get("tree"));
        res.put("allTreeId",treeMap.get("allTreeId"));
        if (roles.getId() != null){
            Map<String,Object> checkeMap = moduleService.queryModuleByRole(roles);
            //List<ModuleTreeDO> treeList = (List<ModuleTreeDO>) treeMap.get("tree");
            //checkLastChildren(treeList,lastCheckedChildren);
            res.putAll(checkeMap);
            //res.put("checkedKeys",moduleIdList);
        }
        return ResultBean.getSuccessResult(res);
    }

    /*private void checkLastChildren(List<ModuleTreeDO> treeList, List<Integer> lastCheckedChildren) {
        if (lastCheckedChildren != null && lastCheckedChildren.size() > 0){

        }
    }*/

    /**
     * 更新 或者 新增一个 角色 (赋予对应的模块id)
     * @param rolesVO
     * @return
     */
    @PostMapping("/modifyRoleModule")
    public ResultBean modifyRoleModule(@RequestBody RolesVO rolesVO){
        return roleService.modifyRole(rolesVO);
    }
}
