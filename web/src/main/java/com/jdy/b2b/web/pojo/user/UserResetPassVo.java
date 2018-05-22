package com.jdy.b2b.web.pojo.user;


import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;

import javax.validation.constraints.NotNull;
import java.io.Serializable;

/**
 * Created by yangcheng on 2017/7/5.
 */
@ApiModel
public class UserResetPassVo extends BaseVO implements Serializable{

    private static final long serialVersionUID = 8197064114754580914L;
    @NotNull(message = "用户id不能为空")
    @ApiModelProperty(value = "用户id,修改密码必填")
    private Long id;
    @NotBlank(message = "账号不能为空")
    @Length(max=20,message = "账号不能为空")
    @ApiModelProperty(value = "账号,修改密码必填")
    private String uAccount;
    /*后台添加密码可以为空*/
    //@NotNull(message = "密码,修改密码必填")
    @ApiModelProperty(value = "旧密码")
    private String uPassword;
    @NotNull(message = "新密码,修改密码必填")
    @NotBlank(message = "新密码,修改密码必填")
    @ApiModelProperty(value = "新密码,修改密码必填")
    private String newPassword;
    @NotNull(message = "真实姓名,修改密码必填")
    @ApiModelProperty(value = "真实姓名,修改密码必填")
    private String uRealName;


    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public String getuAccount() {
        return uAccount;
    }

    public void setuAccount(String uAccount) {
        this.uAccount = uAccount == null ? null : uAccount.trim();
    }

    public String getuPassword() {
        return uPassword;
    }

    public void setuPassword(String uPassword) {
        this.uPassword = uPassword == null ? null : uPassword.trim();
    }

    public String getuRealName() {
        return uRealName;
    }

    public void setuRealName(String uRealName) {
        this.uRealName = uRealName == null ? null : uRealName.trim();
    }


}
