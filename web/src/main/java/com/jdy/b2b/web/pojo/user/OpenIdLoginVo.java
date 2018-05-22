package com.jdy.b2b.web.pojo.user;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotNull;

/**
 * Created by yangcheng on 2017/10/20.
 */
@ApiModel
public class OpenIdLoginVo {
    @ApiModelProperty(value = "openId")
    @NotNull(message = "openId不能为空")
    private String openId;

    public String getOpenId() {
        return openId;
    }

    public void setOpenId(String openId) {
        this.openId = openId;
    }
}
