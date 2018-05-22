package com.jdy.b2b.api.vo.user;

import com.jdy.b2b.api.common.BaseVO;

/**
 * Created by yangcheng on 2017/9/22.
 */
public class MobileLoginResultQueryVo extends BaseVO{
    private String uname;
    private String mobile;
    private Integer flag;//1:用户名  2:手机号

    public String getUname() {
        return uname;
    }

    public void setUname(String uname) {
        this.uname = uname;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public Integer getFlag() {
        return flag;
    }

    public void setFlag(Integer flag) {
        this.flag = flag;
    }
}
