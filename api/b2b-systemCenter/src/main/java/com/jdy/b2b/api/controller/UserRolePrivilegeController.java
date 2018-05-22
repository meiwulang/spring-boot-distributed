package com.jdy.b2b.api.controller;

import java.util.List;
import java.util.Map;

import com.jdy.b2b.api.common.BaseVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.github.pagehelper.PageInfo;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.user.UserResultDTO;
import com.jdy.b2b.api.model.userrole.UserForUserRolePrivilegeDO;
import com.jdy.b2b.api.model.userrole.UserForUserRolePrivilegeDTO;
import com.jdy.b2b.api.model.userrole.UserRoleEditDO;
import com.jdy.b2b.api.model.userrole.UserRolePrivilegeDO;
import com.jdy.b2b.api.service.UserRolePrivilegeService;

/**
 * Created by zhangfofa on 2017/11/15.
 */
@Controller
@RequestMapping("userRolePrivilege")
public class UserRolePrivilegeController{

    @Autowired
    private UserRolePrivilegeService userRolePrivilegeService;

    @RequestMapping("/queryOrganizationalStructure")
    @ResponseBody
    public ResultBean queryOrganizationalStructure(@RequestBody BaseVO baseVO) {
        String resultStr = userRolePrivilegeService.queryOrganizationalStructure(baseVO);
        return ResultBean.getIndexSuccessResult(resultStr);
    }

    @RequestMapping("/queryUserByDepartmentIdList")
    @ResponseBody
    public ResultBean<PageInfo> queryUserByDepartmentIdList(@RequestBody UserForUserRolePrivilegeDTO userForUserRolePrivilegeDTO) {
        List<UserForUserRolePrivilegeDO> userList = userRolePrivilegeService.queryUserByDepartmentIdList(userForUserRolePrivilegeDTO);
        return ResultBean.getIndexSuccessResult(new PageInfo(userList));
    }

    @RequestMapping("/queryUserRolePrivilegeByUserId")
    @ResponseBody
    public ResultBean queryUserRolePrivilegeByUserId(Long userId, Integer type) {
        UserRolePrivilegeDO userRolePrivilege = userRolePrivilegeService.queryUserRolePrivilegeByUserId(userId, type);
        return ResultBean.getIndexSuccessResult(userRolePrivilege);
    }

    @RequestMapping("/queryRoleListByUserId")
    @ResponseBody
    public ResultBean queryRoleListByUserId(@RequestBody UserResultDTO userResultDTO) {
        List<Map> mapList = userRolePrivilegeService.queryRoleListByUserId(userResultDTO.getUserId());
        return ResultBean.getIndexSuccessResult(mapList);
    }

    @RequestMapping("/editUserRolePrivilege")
    @ResponseBody
    public ResultBean editUserRolePrivilege(@RequestBody UserRoleEditDO userRoleEditDO) {
        return userRolePrivilegeService.editUserRolePrivilege(userRoleEditDO);
    }
}
