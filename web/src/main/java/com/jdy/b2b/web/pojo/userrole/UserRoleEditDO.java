package com.jdy.b2b.web.pojo.userrole;

import com.jdy.b2b.web.util.BaseVO;

/**
 * Created by zhangfofa on 2017/11/21.
 */
public class UserRoleEditDO extends BaseVO {

    private Long userId;

    private Integer privilegeLevel;

    private Integer[] roleIdList;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Integer getPrivilegeLevel() {
        return privilegeLevel;
    }

    public void setPrivilegeLevel(Integer privilegeLevel) {
        this.privilegeLevel = privilegeLevel;
    }

    public Integer[] getRoleIdList() {
        return roleIdList;
    }

    public void setRoleIdList(Integer[] roleIdList) {
        this.roleIdList = roleIdList;
    }
}
