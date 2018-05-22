package com.jdy.b2b.web.controll.userrole;

import com.jdy.b2b.web.pojo.user.UserResultDTO;
import org.springframework.stereotype.Controller;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;

import com.jdy.b2b.web.pojo.userrole.UserForUserRolePrivilegeDTO;
import com.jdy.b2b.web.pojo.userrole.UserRoleEditDO;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.BaseVO;
import com.jdy.b2b.web.util.OrganizeRequestParamsUtil;
import com.jdy.b2b.web.util.ResultBean;

import javax.validation.constraints.NotNull;

/**
 * Created by zhangfofa on 2017/11/16.
 */
@Controller
@RequestMapping("userRolePrivilege")
public class UserRolePrivilegeController extends BaseController{

    @RequestMapping("/queryOrganizationalStructure")
    @ResponseBody
    public ResultBean queryOrganizationalStructure(@ModelAttribute BaseVO baseVO) {
        String url = systemCenterUrl + "userRolePrivilege/queryOrganizationalStructure";
        return restTemplate.postForEntity(url, baseVO, ResultBean.class).getBody();
    }

    @RequestMapping("/queryUserByDepartmentIdList")
    @ResponseBody
    public ResultBean queryUserByDepartmentIdList(@RequestBody UserForUserRolePrivilegeDTO userForUserRolePrivilegeDTO) {
        UserResultDTO user = getUser();
        //如果当前用户不是系统级权限,且公司id不为null,
        if(!getUser().getuDataLimit().equals(Integer.valueOf(3))){
            //如果companyid不匹配
            if(userForUserRolePrivilegeDTO.getCompanyId()!=null && (!userForUserRolePrivilegeDTO.getCompanyId().equals(getUser().getuCompanyId()))){
                return ResultBean.getFailResult("无权限查看数据!");
            }
            //如果传递的departmentid不是当前用户公司下的部门
            //TODO 需要判断部门id是否是当前公司下的  或者 前端无论查询什么数据都传递companyid
        }
        String url = systemCenterUrl + "userRolePrivilege/queryUserByDepartmentIdList";
        return restTemplate.postForEntity(url, userForUserRolePrivilegeDTO, ResultBean.class).getBody();
    }

    @RequestMapping(value = "/queryUserRolePrivilegeByUserId", method = RequestMethod.GET)
    @ResponseBody
    public ResultBean queryUserRolePrivilegeByUserId(@RequestParam Long userId,
                                                     @RequestParam Integer type) {
        String url = systemCenterUrl + "userRolePrivilege/queryUserRolePrivilegeByUserId";
        MultiValueMap map = OrganizeRequestParamsUtil.buildMultiValueMap(new String[]{"userId", "type"}, new String[]{userId.toString(), type.toString()});
        return restTemplate.postForEntity(url, map, ResultBean.class).getBody();
    }

    @RequestMapping(value = "/queryRoleListByUserId", method = RequestMethod.GET)
    @ResponseBody
    public ResultBean queryRoleListByUserId() {
        String url = systemCenterUrl + "userRolePrivilege/queryRoleListByUserId";
        return restTemplate.postForEntity(url, getUser(), ResultBean.class).getBody();
    }

    @RequestMapping(value = "/editUserRolePrivilege", method = RequestMethod.POST)
    @ResponseBody
    public ResultBean editUserRolePrivilege(@RequestBody UserRoleEditDO userRoleEditDO) {
        String url = systemCenterUrl + "userRolePrivilege/editUserRolePrivilege";
        return restTemplate.postForEntity(url, userRoleEditDO, ResultBean.class).getBody();
    }
}
