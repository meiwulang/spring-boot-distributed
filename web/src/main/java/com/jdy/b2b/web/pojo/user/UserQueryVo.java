package com.jdy.b2b.web.pojo.user;


import java.io.Serializable;
import java.util.Date;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jdy.b2b.web.util.BaseVO;
import com.jdy.b2b.web.util.annotations.Save;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * Created by yangcheng on 2017/7/4.
 */
@ApiModel
public class UserQueryVo extends BaseVO implements Serializable{

    private static final long serialVersionUID = -5198600154301711395L;
    private  String uWxOpenId;
    private Long id;
    private Integer uStype;


    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private  Date endDate;
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private  Date startDate;

    
    public Integer getuStype() {
		return uStype;
	}

	public void setuStype(Integer uStype) {
		this.uStype = uStype;
	}

	public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    @ApiModelProperty(value = "账号")
    private String uAccount;

    private String newPassword;
    @ApiModelProperty(value = "真实姓名")
    private String uRealName;
    @ApiModelProperty(value = "拼音码")
    private String uPym;
    @ApiModelProperty(value = "公司id")
    private Long uCompanyId;
    @ApiModelProperty(value = "部门id")
    private Long uDepartmentId;
    @ApiModelProperty(value = "数据级别0:用户级 1:部门级2:单位级3:系统级")
    @Min(value=0,groups = Save.class,message = "数据级别最小为0")
    @Max(value=3,groups = Save.class,message = "数据级别最大为3")
    private Integer uDataLimit;
    @ApiModelProperty(value = "角色id")
    private Long uRoleId;

    @ApiModelProperty(value = "手机号")
    private String uTel;

    @ApiModelProperty(value = "状态 0:有效 1:无效 2:锁定")
    @Min(value=0,groups = Save.class,message = "状态最小为0")
    @Max(value=2,groups = Save.class,message = "状态最大为2")
    private Integer uStatus;

    public Long getuRoleId() {
        return uRoleId;
    }

    public void setuRoleId(Long uRoleId) {
        this.uRoleId = uRoleId;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }


    public String getuPym() {
        return uPym;
    }

    public void setuPym(String uPym) {
        this.uPym = uPym;
    }

    public String getuAccount() {
        return uAccount;
    }

    public void setuAccount(String uAccount) {
        this.uAccount = uAccount == null ? null : uAccount.trim();
    }

    public String getuRealName() {
        return uRealName;
    }

    public void setuRealName(String uRealName) {
        this.uRealName = uRealName == null ? null : uRealName.trim();
    }

    public Long getuCompanyId() {
        return uCompanyId;
    }

    public void setuCompanyId(Long uCompanyId) {
        this.uCompanyId = uCompanyId;
    }

    public Long getuDepartmentId() {
        return uDepartmentId;
    }

    public void setuDepartmentId(Long uDepartmentId) {
        this.uDepartmentId = uDepartmentId;
    }

    public Integer getuDataLimit() {
        return uDataLimit;
    }

    public void setuDataLimit(Integer uDataLimit) {
        this.uDataLimit = uDataLimit;
    }

    public String getuTel() {
        return uTel;
    }

    public void setuTel(String uTel) {
        this.uTel = uTel == null ? null : uTel.trim();
    }

    public Integer getuStatus() {
        return uStatus;
    }

    public void setuStatus(Integer uStatus) {
        this.uStatus = uStatus;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getuWxOpenId() {
        return uWxOpenId;
    }

    public void setuWxOpenId(String uWxOpenId) {
        this.uWxOpenId = uWxOpenId;
    }

}
