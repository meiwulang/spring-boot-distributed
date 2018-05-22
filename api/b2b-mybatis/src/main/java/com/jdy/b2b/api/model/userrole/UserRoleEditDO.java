package com.jdy.b2b.api.model.userrole;

import com.jdy.b2b.api.common.BaseVO;

import java.util.List;

/**
 * Created by zhangfofa on 2017/11/21.
 */
public class UserRoleEditDO extends BaseVO {

    private Long userId;

    private Integer privilegeLevel;

    private List<Integer> roleIdList;

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

    public List<Integer> getRoleIdList() {
        return roleIdList;
    }

    public void setRoleIdList(List<Integer> roleIdList) {
        this.roleIdList = roleIdList;
    }
}
