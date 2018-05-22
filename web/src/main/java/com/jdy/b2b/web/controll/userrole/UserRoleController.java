package com.jdy.b2b.web.controll.userrole;


import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;
import com.jdy.b2b.web.pojo.log.MyLog;
import com.jdy.b2b.web.pojo.schedule.BusDTO;
import com.jdy.b2b.web.pojo.user.User;
import com.jdy.b2b.web.pojo.user.UserQueryVo;
import com.jdy.b2b.web.pojo.user.UserResultDTO;
import com.jdy.b2b.web.pojo.userrole.UserRole;
import com.jdy.b2b.web.pojo.userrole.UserRoleQueryVo;
import com.jdy.b2b.web.pojo.userrole.UserRoleSaveOrUpdateVo;
import com.jdy.b2b.web.service.UserRoleService;
import com.jdy.b2b.web.service.UserService;
import com.jdy.b2b.web.util.*;
import com.jdy.b2b.web.util.annotations.Save;
import com.jdy.b2b.web.util.annotations.Update;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotNull;
import java.util.*;

/**
 * Created by yangcheng on 2017/7/11.
 */
@Api(value = "user", description = "操作角色")
@RequestMapping("user_role")
@RestController
public class UserRoleController extends BaseController {
    @Autowired
    private UserRoleService userRoleService;
    @Autowired
    private UserService userService;
    @Autowired
    private UserCacheBean userCacheBean;


    /**
     * 查询角色列表
     * @param vo
     * @return
     */
    @ApiOperation(value = "查询角色列表",notes = "")
    @RequestMapping(value="list",method = RequestMethod.POST)
    public ResultBean queryUserRoleList(@RequestBody @Validated UserRoleQueryVo vo){
        return userRoleService.queryRoleList(vo);
    }

    /**
     *根据id查询
     * @param id
     * @return
     */
    @ApiOperation(value = "根据id查询角色",notes = "")
    @RequestMapping(value="get/{id}",method = RequestMethod.GET)
    public ResultBean<UserRole> queryUserRoleById(@PathVariable @NotNull @ApiParam(value = "角色id",required = true,name = "id") Long id){
        return userRoleService.queryUserRoleById(id);
    }

    /**
     *新增,将权限保存为以','分割的字符串
     * @param vo
     * @return
     */
    @MyLog(SuccessInfo = "新增角色成功")
    @ApiOperation(value = "新增角色",notes = "")
    @RequestMapping(value="save",method = RequestMethod.POST)
    public ResultBean<Long> saveUserRole(@RequestBody @Validated(Save.class) UserRoleSaveOrUpdateVo vo) {
        String str = vo.getUrRoleContent();
        Object o = JSON.parse(str);
        StringBuilder sb = new StringBuilder();
        List<String> list = new ArrayList<>();
        List<String> newList = new ArrayList<>();
        dealNames("", o, list);
        list.forEach(p ->{
            if(p.substring(p.lastIndexOf(":")+1).equals("true")){
                p = p.substring(1, p.lastIndexOf(":"));
                newList.add(p);
            }});
        newList.forEach(k->{sb.append(k).append(",");});
        vo.setUrRoleContentArray(sb.toString());
        return userRoleService.saveOrUpdateUserRole(vo);
    }
    private static void dealNames(String k, Object v, List<String> list) {
        String finalK = k;
        if (v instanceof Map) {
            Map<String, Object> map = (Map) v;
            map.keySet().forEach(k1 -> {
                Object o = map.get(k1);
                if (o instanceof Collection) {
                    dealNames(finalK +":"+ k1, o, list);
                } else {
                    list.add(finalK + ":" + k1 + ":" + o);
                }
            });
        } else if (v instanceof JSONArray) {
            ((JSONArray) v).forEach(obj -> dealNames(finalK, obj, list));
        }
    }

        /**
         *修改,同步清空拥有此角色的用户的认证和授权缓存
         * @param vo
         * @return
         */
        @MyLog(SuccessInfo = "修改角色成功")
        @ApiOperation(value = "修改角色", notes = "")
        @RequestMapping(value = "update", method = RequestMethod.POST)
        public ResultBean<Long> updateUserRole
        (@RequestBody @Validated({Save.class, Update.class}) UserRoleSaveOrUpdateVo vo){
            //修改角色
            ResultBean<Long> resultBean = userRoleService.saveOrUpdateUserRole(vo);
            //查找拥有此角色的用户,不分页
            UserQueryVo userQueryVo = new UserQueryVo();
            userQueryVo.setuRoleId(vo.getId());
            ResultBean result = userService.queryUserListForPage(userQueryVo);

            List<UserResultDTO> users = JSON.parseObject(JSON.toJSONString(result.getBody()), new TypeReference<List<UserResultDTO>>() {
            });

            for (UserResultDTO dto : users) {
                userCacheBean.clearCurrentUserCache(dto.getuAccount());
            }

            return result;
        }

        /**
         *伪删除,同步清空拥有此角色的用户的认证和授权缓存
         * @param id
         * @return
         */
        @MyLog(SuccessInfo = "删除角色成功")
        @ApiOperation(value = "删除角色", notes = "")
        @RequestMapping(value = "delete/{id}", method = RequestMethod.GET)
        public ResultBean<Long> deleteUserRole
        (@PathVariable @NotNull @ApiParam(value = "角色id", required = true, name = "id") Long id){
            UserRoleSaveOrUpdateVo vo = new UserRoleSaveOrUpdateVo();
            vo.setId(id);
            vo.setUrStatus(Constants.EFFECT_NO);
            if (getUser() != null) {
                vo.setUpdateUser(getUser().getUserId());
            }else{
                return new ResultBean("-1","未获取到用户信息");
            }
            ResultBean<Long> resultBean = userRoleService.saveOrUpdateUserRole(vo);

            //查找拥有此角色的用户,不分页
            UserQueryVo userQueryVo = new UserQueryVo();
            userQueryVo.setuRoleId(id);
            ResultBean result = userService.queryUserListForPage(userQueryVo);
            List<UserResultDTO> users = JSON.parseObject(JSON.toJSONString(result.getBody()), new TypeReference<List<UserResultDTO>>() {
            });
            for (UserResultDTO dto : users) {
                userCacheBean.clearCurrentUserCache(dto.getuAccount());
            }
            return resultBean;
        }

}
