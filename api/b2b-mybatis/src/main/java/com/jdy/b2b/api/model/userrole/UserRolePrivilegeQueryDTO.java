package com.jdy.b2b.api.model.userrole;

import com.jdy.b2b.api.common.BaseVO;

/**
 * Created by zhangfofa on 2017/11/21.
 */
public class UserRolePrivilegeQueryDTO extends BaseVO {

    private Long userId;

    private Integer type;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }
}
