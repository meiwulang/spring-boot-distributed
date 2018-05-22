package com.jdy.b2b.web.pojo.user;


import com.jdy.b2b.web.util.annotations.Save;
import com.jdy.b2b.web.util.annotations.Update;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import java.io.Serializable;
import java.util.Date;

/**
 * Created by yangcheng on 2017/7/5.
 */
@ApiModel
public class UserLoginVo implements Serializable{

    private static final long serialVersionUID = 8197064114754580914L;

    //不记住密码,可以避免重启后获取不到用户信息的bug
    @ApiModelProperty(value = "是否记住密码",hidden = true)
    private Boolean rememberMe = false;
    /*@ApiModelProperty(value = "验证码")
    private String verifiCode;*/
    @NotBlank(message = "账号不能为空")
    @Length(max=20,message = "账号最长为20")
    @ApiModelProperty(value = "账号")
    private String uAccount;
    @NotBlank(message = "密码不能为空.")
    @ApiModelProperty(value = "密码")
    private String uPassword;

    public Boolean getRememberMe() {
        return rememberMe;
    }

    public void setRememberMe(Boolean rememberMe) {
        this.rememberMe = rememberMe;
    }

    public String getuAccount() {
        return uAccount;
    }

    public void setuAccount(String uAccount) {
        this.uAccount = uAccount;
    }

    public String getuPassword() {
        return uPassword;
    }

    public void setuPassword(String uPassword) {
        this.uPassword = uPassword;
    }
}
