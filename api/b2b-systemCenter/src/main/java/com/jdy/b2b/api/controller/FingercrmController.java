package com.jdy.b2b.api.controller;

import java.util.Objects;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.jdy.b2b.api.common.BaseController;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.service.UserService;
import com.jdy.b2b.api.vo.user.SynchronizeUserInfo;
import com.jdy.b2b.api.vo.user.UserSearchVO;

/**
 * Created by dugq on 2017/10/10.
 */
@Controller
@RequestMapping
public class FingercrmController extends BaseController {

    @Autowired
    private UserService userService;

    @RequestMapping("1/user/to")
    public String test(){
        return "testvue";
    }

    @RequestMapping(value="/fingercrm/user/synchro",method = RequestMethod.POST)
    @ResponseBody
    public ResultBean userSynchro(@RequestBody SynchronizeUserInfo info){
        if(StringUtils.isBlank(info.getOpenid())){
            return new ResultBean("-1","openId不可为空~");
        }
        if(StringUtils.isBlank(info.getIdcard())){
            return new ResultBean("-1","idCard不可为空~");
        }
        if(StringUtils.isBlank(info.getPhone())){
            return new ResultBean("-1","phone不可为空~");
        }
        if(StringUtils.isBlank(info.getRealname())){
            return new ResultBean("-1","realname不可为空~");
        }
        if(StringUtils.isBlank(info.getPid())){
            return new ResultBean("-1","pid不可为空~");
        }
        if(Objects.isNull(info.getLevel())){
            return new ResultBean("-1","level不可为空~");
        }
        /*if(StringUtils.isBlank(info.getGroupId())){
            return new ResultBean("-1","groupId不可为空~");
        }
        if(StringUtils.isBlank(info.getGroupName())){
            return new ResultBean("-1","groupName不可为空~");
        }*/
        if (StringUtils.isBlank(info.getUid())){
            return new ResultBean("-1","uid不可为空~");
        }
        int result = userService.synchronizeUserInfo(info);
        return result > 0 ? ResultBean.getSuccessResult() : new ResultBean("-1","同步失败");
    }

    @RequestMapping(value = "/fingercrm/user/search", method = RequestMethod.POST)
    @ResponseBody
    public ResultBean queryUserByUserNameAndPhone(@RequestBody UserSearchVO userSearchVO) {
        logger.error("入参: realname: "+userSearchVO.getRealname()+", phone: "+userSearchVO.getPhone()+";");
        return userService.queryUserByRealNameAndPhone(userSearchVO.getRealname(), userSearchVO.getPhone());
    }
}
