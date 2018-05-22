package com.jdy.b2b.web.pojo.user;


import com.jdy.b2b.web.util.BaseVO;
import com.jdy.b2b.web.util.annotations.Save;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;
import org.hibernate.validator.constraints.Range;

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
public class UserUpdateVo extends BaseVO implements Serializable{

    private static final long serialVersionUID = 8197064114754580914L;
    @NotNull(message = "id不能为空")
    @ApiModelProperty(value = "用户id,修改必填")
    private Long id;

    @NotBlank(message = "账号不能为空")
    @Length(max=100,message = "账号最短为100个字")
    @ApiModelProperty(value = "账号")
    private String uAccount;
    @NotBlank(message = "真实姓名不能为空")
    @ApiModelProperty(value = "真实姓名")
    @Length(max = 45,message = "姓名最长为45个字")
    private String uRealName;
    @ApiModelProperty(value = "自动生成员工编号")
    private String uNo;
    @Length(max=20,message = "职务最长为20个字")
    @ApiModelProperty(value = "职务",allowableValues = "range[0,20]")
    private String uPost;
    @NotNull(message = "公司不能为空")
    @ApiModelProperty(value = "公司id")
    private Long uCompanyId;
    @ApiModelProperty(value = "部门id")
    private Long uDepartmentId;
    @NotNull(message = "负责人类型不能为空")
    @Range(min=0,max = 5,message = "负责人类型 0:普通代理人 1:负责人2:法人 3:法人+部门领导  4:部门领导 5:负责人+法人")
    private Integer uDtype;
    @Length(max=200,message = "地址最长200个字")
    @ApiModelProperty(value = "地址",allowableValues = "range[0,200]")
    private String uAddress;
    @NotBlank(message = "手机号不能为空")
    @Pattern(regexp = "^1[3|4|5|6|7|8|9]\\d{9}$",message = "手机号不符合规则")
    @ApiModelProperty(value = "手机号")
    private String uTel;
    @ApiModelProperty(value = "身份证")
    @Pattern(regexp = "^$|^(^[1-9]\\d{7}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])\\d{3}$)|(^[1-9]\\d{5}[1-9]\\d{3}((0\\d)|(1[0-2]))(([0|1|2]\\d)|3[0-1])((\\d{4})|\\d{3}[Xx])$)$",message = "身份证号不符合规则")
    private String uIdcard;
    @ApiModelProperty(value = "性别 女:true 男:false")
    private Boolean uSex;
    @ApiModelProperty(value = "生日")
    private Date uBirthday;
    @ApiModelProperty(value = "文化程度")
    private Integer uDegree;
    @ApiModelProperty("微信号")
    private String uWxname;
    @ApiModelProperty(value = "电话")
    private String uPhone;
    @ApiModelProperty(value = "邮箱")
    @Pattern(regexp = "^$|^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\\.[a-zA-Z0-9_-]+)+$", groups = { Save.class},message = "邮箱不符合规则")
    @Length(max = 30,message = "邮箱最长30个字")
    private String uEmail;
    @ApiModelProperty(value = "qq")
    private String uQq;
    @ApiModelProperty(value = "紧急联系人")
    @Length(max = 45,message = "紧急联系人最长为45个字")
    private String uContacts;
    @Length(max=200,message = "备注最长200个字")
    @ApiModelProperty(value = "备注",allowableValues = "range[0,20]")
    private String uRemark;
    @ApiModelProperty(value = "用户类型0:供应商1:分销商2:管理公司/总公司 3:分销中心")
    @Min(value=0,message = "用户类型最小为0")
    @Max(value=3,message = "用户类型最大为3")
    private Integer uType;
    @ApiModelProperty(value = "状态 0:有效 1:无效 2:锁定")
    private Integer uStatus;
    private Long updateUser;
    /*后台添加密码可以为空*/
    @ApiModelProperty(value = "密码,前台注册必填,修改不填",hidden = true)
    private String uPassword;
    @ApiModelProperty(value = "数据级别0:用户级 1:部门级2:单位级3:系统级")
    private Integer uDataLimit;
    @ApiModelProperty(value = "最后登录时间",hidden = true)
    private Date uLastLogin;//最后登录时间
    @ApiModelProperty(value = "用户销售类型 0:非销售类 1:销售类 2:签约人员 3:路人甲")
    @NotNull(message = "用户销售类型不能为空")
    @Min(value=0,message = "用户类型最小为0")
    @Max(value=3,message = "用户类型最大为3")
    private Integer  uStype;

    @ApiModelProperty(value = "上级岗位员工id")
    private String uPuserid;
    @ApiModelProperty(value = "岗位id： 字典表")
    private Long uPositionId;

    public Integer getuStype() {
        return uStype;
    }

    public void setuStype(Integer uStype) {
        this.uStype = uStype;
    }

    public Integer getuDtype() {
        return uDtype;
    }

    public void setuDtype(Integer uDtype) {
        this.uDtype = uDtype;
    }

    public Date getuLastLogin() {
        return uLastLogin;
    }

    public void setuLastLogin(Date uLastLogin) {
        this.uLastLogin = uLastLogin;
    }

    public Integer getuDataLimit() {
        return uDataLimit;
    }

    public void setuDataLimit(Integer uDataLimit) {
        this.uDataLimit = uDataLimit;
    }

    public Long getUpdateUser() {
        return updateUser;
    }

    public void setUpdateUser(Long updateUser) {
        this.updateUser = updateUser;
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

    public String getuAccount() {
        return uAccount;
    }

    public void setuAccount(String uAccount) {
        this.uAccount = uAccount;
    }

    public String getuRealName() {
        return uRealName;
    }

    public void setuRealName(String uRealName) {
        this.uRealName = uRealName;
    }

    public String getuNo() {
        return uNo;
    }

    public void setuNo(String uNo) {
        this.uNo = uNo;
    }

    public String getuPost() {
        return uPost;
    }

    public void setuPost(String uPost) {
        this.uPost = uPost;
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

    public Integer getUdType() {
        return uDtype;
    }

    public void setUdType(Integer uDtype) {
        this.uDtype = uDtype;
    }

    public String getuAddress() {
        return uAddress;
    }

    public void setuAddress(String uAddress) {
        this.uAddress = uAddress;
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

    public Boolean getuSex() {
        return uSex;
    }

    public void setuSex(Boolean uSex) {
        this.uSex = uSex;
    }

    public Date getuBirthday() {
        return uBirthday;
    }

    public void setuBirthday(Date uBirthday) {
        this.uBirthday = uBirthday;
    }

    public Integer getuDegree() {
        return uDegree;
    }

    public void setuDegree(Integer uDegree) {
        this.uDegree = uDegree;
    }

    public String getuWxname() {
        return uWxname;
    }

    public void setuWxname(String uWxname) {
        this.uWxname = uWxname;
    }

    public String getuPhone() {
        return uPhone;
    }

    public void setuPhone(String uPhone) {
        this.uPhone = uPhone;
    }

    public String getuEmail() {
        return uEmail;
    }

    public void setuEmail(String uEmail) {
        this.uEmail = uEmail;
    }

    public String getuQq() {
        return uQq;
    }

    public void setuQq(String uQq) {
        this.uQq = uQq;
    }

    public String getuContacts() {
        return uContacts;
    }

    public void setuContacts(String uContacts) {
        this.uContacts = uContacts;
    }

    public String getuRemark() {
        return uRemark;
    }

    public void setuRemark(String uRemark) {
        this.uRemark = uRemark;
    }

    public Integer getuType() {
        return uType;
    }

    public void setuType(Integer uType) {
        this.uType = uType;
    }

    public String getuPassword() {
        return uPassword;
    }

    public void setuPassword(String uPassword) {
        this.uPassword = uPassword;
    }

    public String getuPuserid() {
        return uPuserid;
    }

    public void setuPuserid(String uPuserid) {
        this.uPuserid = uPuserid;
    }

    public Long getuPositionId() {
        return uPositionId;
    }

    public void setuPositionId(Long uPositionId) {
        this.uPositionId = uPositionId;
    }
}
