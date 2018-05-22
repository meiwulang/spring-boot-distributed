package com.jdy.b2b.api.controller;

import com.jdy.b2b.api.common.BaseController;
import com.jdy.b2b.api.common.Constants;
import com.jdy.b2b.api.common.JSONUtil;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.userrole.UserRole;
import com.jdy.b2b.api.service.UserRoleService;
import com.jdy.b2b.api.vo.userrole.UserRoleQueryVo;
import com.jdy.b2b.api.vo.userrole.UserRoleSaveOrUpdateVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

/**
 * Created by yangcheng on 2017/7/5.
 */

@RestController
@RequestMapping("user_role")
public class UserRoleController extends BaseController {
    @Autowired
    private UserRoleService userRoleService;

    /**
     * 条件查询角色列表 可用于添加用户时显示角色名称列表 需在web处理
     * @param vo
     * @return
     */
    @RequestMapping(value="list",method = RequestMethod.POST)
    public ResultBean<List<UserRole>> getRoleList(@RequestBody UserRoleQueryVo vo) {
        UserRole userRole = JSONUtil.trans(vo, UserRole.class);
        userRole.setUrStatus(Constants.ROLE_EFFECT_YES);
        List<UserRole> roleList = userRoleService.getRoleList(userRole);

        return ResultBean.getSuccessResult(roleList);
    }

    /**
     * 根据id查询角色信息
     * @param id
     * @return
     */
    @RequestMapping(value="get/{id}",method = RequestMethod.GET)
    public ResultBean<UserRole> queryUserRoleById(@PathVariable Long id){
        return ResultBean.getSuccessResult(userRoleService.queryUserRoleById(id));
    }

    /**
     * 新增或修改,伪删除
     * @param vo
     * @return
     */
    @RequestMapping(value="saveOrUpdate",method = RequestMethod.POST)
    public ResultBean<Long> saveOrUpdateUserRole(@RequestBody UserRoleSaveOrUpdateVo vo){
        UserRole userRole = JSONUtil.trans(vo,UserRole.class);
        if(userRole!=null && userRole.getId()!=null){
            //执行修改
            userRole.setUpdateUser(vo.getPuserId());
            if(vo.getUpdateUser()==null){
                userRole.setUpdateTime(new Date());
            }

            int result = userRoleService.updateUserRole(userRole);
            if(result>0){
                return ResultBean.getSuccessResult((long)result);
            }else{
                return new ResultBean("-1","修改角色失败");
            }

        }else{
            //执行新增
            userRole.setCreateTime(new Date());
            userRole.setCreateUser(vo.getPuserId());
            userRole.setUrStatus(Constants.EFFECT_YES);

            int result = userRoleService.SaveUserRole(userRole);
            if(result>0){
                ResultBean<Long> successResult = ResultBean.getSuccessResult(userRole.getId());
                successResult.setId(userRole.getId());
                return successResult;
            }else{
                return new ResultBean("-1","新增角色失败");
            }
        }
    }
}
