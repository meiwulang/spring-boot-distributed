package com.jdy.b2b.api.vo.user;


import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jdy.b2b.api.common.BaseVO;

/**
 * Created by yangcheng on 2017/7/4.
 */
public class UserQueryVo extends BaseVO{
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private  Date endDate;
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private  Date startDate;

    private Integer currPage; // 当前页
    private Integer pageSize; // 页面大小

    private  String uWxOpenId;

    private Long id;

    private String uAccount;

    private String uPassword;

    private String uRealName;

    private String uPym;

    private Long uCompanyId;

    private Long uDepartmentId;

    private Integer uDataLimit;

    private Long uRoleId;

    private Integer uType;

    private String uPost;

    private String uAddress;

    private String uTel;

    private String uIdcard;

    private Boolean uSex;

    private Date uBirthday;

    private Integer uDegree;

    private Integer uPolitical;

    private String uPhone;

    private String uFax;

    private String uQq;

    private String uEmail;

    private String uContacts;

    private String uContactsPhone;

    private String uRemark;

    private Integer uStatus;

    private Date createTime;

    private Long createUser;

    private Date updateTime;

    private Long updateUser;
    private Integer uStype;
    
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

    @Override
	public Integer getCurrPage() {
        return currPage;
    }

    @Override
	public void setCurrPage(Integer currPage) {
        this.currPage = currPage;
    }

    @Override
	public Integer getPageSize() {
        return pageSize;
    }

    @Override
	public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Long getuRoleId() {
        return uRoleId;
    }

    public void setuRoleId(Long uRoleId) {
        this.uRoleId = uRoleId;
    }

    public Integer getuType() {
        return uType;
    }

    public void setuType(Integer uType) {
        this.uType = uType;
    }

    public String getuPost() {
        return uPost;
    }

    public void setuPost(String uPost) {
        this.uPost = uPost == null ? null : uPost.trim();
    }

    public String getuAddress() {
        return uAddress;
    }

    public void setuAddress(String uAddress) {
        this.uAddress = uAddress == null ? null : uAddress.trim();
    }

    public String getuTel() {
        return uTel;
    }

    public void setuTel(String uTel) {
        this.uTel = uTel == null ? null : uTel.trim();
    }

    public String getuIdcard() {
        return uIdcard;
    }

    public void setuIdcard(String uIdcard) {
        this.uIdcard = uIdcard == null ? null : uIdcard.trim();
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

    public Integer getuPolitical() {
        return uPolitical;
    }

    public void setuPolitical(Integer uPolitical) {
        this.uPolitical = uPolitical;
    }

    public String getuPhone() {
        return uPhone;
    }

    public void setuPhone(String uPhone) {
        this.uPhone = uPhone == null ? null : uPhone.trim();
    }

    public String getuFax() {
        return uFax;
    }

    public void setuFax(String uFax) {
        this.uFax = uFax == null ? null : uFax.trim();
    }

    public String getuQq() {
        return uQq;
    }

    public void setuQq(String uQq) {
        this.uQq = uQq == null ? null : uQq.trim();
    }

    public String getuEmail() {
        return uEmail;
    }

    public void setuEmail(String uEmail) {
        this.uEmail = uEmail == null ? null : uEmail.trim();
    }

    public String getuContacts() {
        return uContacts;
    }

    public void setuContacts(String uContacts) {
        this.uContacts = uContacts == null ? null : uContacts.trim();
    }

    public String getuContactsPhone() {
        return uContactsPhone;
    }

    public void setuContactsPhone(String uContactsPhone) {
        this.uContactsPhone = uContactsPhone == null ? null : uContactsPhone.trim();
    }

    public String getuRemark() {
        return uRemark;
    }

    public void setuRemark(String uRemark) {
        this.uRemark = uRemark == null ? null : uRemark.trim();
    }

    public Integer getuStatus() {
        return uStatus;
    }

    public void setuStatus(Integer uStatus) {
        this.uStatus = uStatus;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Long getCreateUser() {
        return createUser;
    }

    public void setCreateUser(Long createUser) {
        this.createUser = createUser;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public Long getUpdateUser() {
        return updateUser;
    }

    public String getuWxOpenId() {
        return uWxOpenId;
    }

    public void setuWxOpenId(String uWxOpenId) {
        this.uWxOpenId = uWxOpenId;
    }

    public void setUpdateUser(Long updateUser) {
        this.updateUser = updateUser;
    }

}
