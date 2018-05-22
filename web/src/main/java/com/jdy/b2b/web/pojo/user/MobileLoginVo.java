package com.jdy.b2b.web.pojo.user;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

/**
 * Created by yangcheng on 2017/9/22.
 */
@ApiModel
public class MobileLoginVo {
    @ApiModelProperty(value = "手机号")
    @Pattern(regexp = "(?:(\\(\\+?86\\))(0[0-9]{2,3}\\-?)?([2-9][0-9]{6,7})+(\\-[0-9]{1,4})?)|(?:(86-?)?(0[0-9]{2,3}\\-?)?([2-9][0-9]{6,7})+(\\-[0-9]{1,4})?)|^(1[34578]\\d{9})?$",message = "手机号不符合规则")
    @NotNull(message = "手机号不能为空")
    private String uname;
    @ApiModelProperty(value = "密码")
    @NotNull(message = "密码不能为空")
    private String upass;

    public String getUname() {
        return uname;
    }

    public void setUname(String uname) {
        this.uname = uname;
    }

    public String getUpass() {
        return upass;
    }

    public void setUpass(String upass) {
        this.upass = upass;
    }
}
