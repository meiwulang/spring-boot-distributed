package com.jdy.b2b.api.vo.user;

import java.io.Serializable;

/**
 * Created by zhangfofa on 2017/12/4.
 */
public class UserSearchVO implements Serializable {
    private static final long serialVersionUID = 8560054941435413806L;

    private String realname;

    private String phone;

    public String getRealname() {
        return realname;
    }

    public void setRealname(String realname) {
        this.realname = realname;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
