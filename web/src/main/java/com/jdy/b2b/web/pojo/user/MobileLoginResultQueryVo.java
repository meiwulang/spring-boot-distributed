package com.jdy.b2b.web.pojo.user;


import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * Created by yangcheng on 2017/9/22.
 */
@ApiModel
public class MobileLoginResultQueryVo extends BaseVO {
    @ApiModelProperty(value = "手机号密码登录")
    private String uname;
    @ApiModelProperty(value = "手机号验证码登录")
    private String mobile;
    @ApiModelProperty
    private Integer flag;//1:手机号密码登录  2:手机号验证码登录

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
