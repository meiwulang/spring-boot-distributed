package com.jdy.b2b.web.pojo.user;

import java.util.Date;

public class QueryByTelUserDO {
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

    private Date createTime;

    private Long createUser;

    private Date updateTime;

    private Long updateUser;

    private Integer uStatus;

    private String uPic;

    private Date uLastLogin;

    private String vMd5;

    private Date vCreateTime;

    private Long vId;

    public Long getvId() {
        return vId;
    }

    public void setvId(Long vId) {
        this.vId = vId;
    }

    public Date getvCreateTime() {
        return vCreateTime;
    }

    public void setvCreateTime(Date vCreateTime) {
        this.vCreateTime = vCreateTime;
    }

    public String getvMd5() {
        return vMd5;
    }

    public void setvMd5(String vMd5) {
        this.vMd5 = vMd5;
    }

    public Date getuLastLogin() {
        return uLastLogin;
    }

    public void setuLastLogin(Date uLastLogin) {
        this.uLastLogin = uLastLogin;
    }

    public String getuPic() {
        return uPic;
    }

    public void setuPic(String uPic) {
        this.uPic = uPic;
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

    public void setUpdateUser(Long updateUser) {
        this.updateUser = updateUser;
    }
}