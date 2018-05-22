package com.jdy.b2b.web.pojo.user;


import com.jdy.b2b.web.util.BaseVO;
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
public class DistUserUpdateVo extends BaseVO implements Serializable{
    private static final long serialVersionUID = 8197064114754580914L;

    @NotNull(message = "id不能为空")
    @ApiModelProperty(value = "用户id,修改必填")
    private Long id;
    @NotBlank(message = "真实姓名不能为空")
    @ApiModelProperty(value = "真实姓名")
    @Length(max = 5,message = "姓名最长为5个字")
    private String uRealName;
    @NotBlank(message = "手机号不能为空")
    @Pattern(regexp = "(?:(\\(\\+?86\\))(0[0-9]{2,3}\\-?)?([2-9][0-9]{6,7})+(\\-[0-9]{1,4})?)|(?:(86-?)?(0[0-9]{2,3}\\-?)?([2-9][0-9]{6,7})+(\\-[0-9]{1,4})?)|^(1[34578]\\d{9})?$", groups = { Save.class},message = "手机号不符合规则")
    @ApiModelProperty(value = "手机号")
    private String uTel;
    @ApiModelProperty(value = "身份证")
    @Pattern(regexp = "^$|^(^[1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}$)|(^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])((\\d{4})|\\d{3}[Xx])$)$", groups = { Save.class},message = "身份证号不符合规则")
    @NotNull(message = "身份证不能为空")
    private String uIdcard;
    @ApiModelProperty(value = "上级代理人openid")
    @NotNull(message = "上级代理人openid不能为空")
    private String pid;
    @ApiModelProperty(value = "等级")
    @NotNull(message = "等级不能为空")
    private Byte level;
    @ApiModelProperty(value = "部门类型0:普通代理人 1:负责人")
    @NotNull(message = "部门类型必填")
    private Integer uDtype;
    @NotNull(message = "部门code必传")
    @ApiModelProperty(value = "部门code")
    private Integer uDepartmentCode;
    @NotNull(message = "部门id必填")
    @ApiModelProperty(value = "部门id")
    private Long uDepartmentId;

    public Integer getuDepartmentCode() {
        return uDepartmentCode;
    }

    public void setuDepartmentCode(Integer uDepartmentCode) {
        this.uDepartmentCode = uDepartmentCode;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getuRealName() {
        return uRealName;
    }

    public void setuRealName(String uRealName) {
        this.uRealName = uRealName;
    }

    public String getuTel() {
        return uTel;
    }

    public void setuTel(String uTel) {
        this.uTel = uTel;
    }

    public String getuIdcard() {
        return uIdcard;
    }

    public void setuIdcard(String uIdcard) {
        this.uIdcard = uIdcard;
    }

    public String getPid() {
        return pid;
    }

    public void setPid(String pid) {
        this.pid = pid;
    }

    public Byte getLevel() {
        return level;
    }

    public void setLevel(Byte level) {
        this.level = level;
    }

    public Integer getuDtype() {
        return uDtype;
    }

    public void setuDtype(Integer uDtype) {
        this.uDtype = uDtype;
    }

    public Long getuDepartmentId() {
        return uDepartmentId;
    }

    public void setuDepartmentId(Long uDepartmentId) {
        this.uDepartmentId = uDepartmentId;
    }
}
