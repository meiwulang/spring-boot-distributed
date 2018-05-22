package com.jdy.b2b.web.pojo.log;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.util.Date;
@ApiModel
public class BusiLogs {

    @ApiModelProperty("id")
    private Long id;

    @ApiModelProperty("公司名称")
    private String blCompany;

    @ApiModelProperty("操作人真实姓名")
    private String blUsername;

    @ApiModelProperty("操作用户名")
    private String blAccount;

    @ApiModelProperty("操作描述")
    private String blDescription;

    @ApiModelProperty("操作模块")
    private String blModule;

    @ApiModelProperty("操作记录")
    private Long blPid;

    @ApiModelProperty("操作方法")
    private String blMethod;

    @ApiModelProperty("客户端域名")
    private String blDomain;

    @ApiModelProperty("客户端ip")
    private String blIp;

    @ApiModelProperty("客户端浏览器信息")
    private String blBrowser;

    @ApiModelProperty("日志生成时间")
    private Date createTime;

    @ApiModelProperty("操作人id")
    private Long createUser;

    private Date updateTime;

    private Long updateUser;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBlCompany() {
        return blCompany;
    }

    public void setBlCompany(String blCompany) {
        this.blCompany = blCompany == null ? null : blCompany.trim();
    }

    public String getBlUsername() {
        return blUsername;
    }

    public void setBlUsername(String blUsername) {
        this.blUsername = blUsername == null ? null : blUsername.trim();
    }

    public String getBlAccount() {
        return blAccount;
    }

    public void setBlAccount(String blAccount) {
        this.blAccount = blAccount == null ? null : blAccount.trim();
    }

    public String getBlDescription() {
        return blDescription;
    }

    public void setBlDescription(String blDescription) {
        this.blDescription = blDescription == null ? null : blDescription.trim();
    }

    public String getBlModule() {
        return blModule;
    }

    public void setBlModule(String blModule) {
        this.blModule = blModule == null ? null : blModule.trim();
    }

    public Long getBlPid() {
        return blPid;
    }

    public void setBlPid(Long blPid) {
        this.blPid = blPid;
    }

    public String getBlMethod() {
        return blMethod;
    }

    public void setBlMethod(String blMethod) {
        this.blMethod = blMethod == null ? null : blMethod.trim();
    }

    public String getBlDomain() {
        return blDomain;
    }

    public void setBlDomain(String blDomain) {
        this.blDomain = blDomain == null ? null : blDomain.trim();
    }

    public String getBlIp() {
        return blIp;
    }

    public void setBlIp(String blIp) {
        this.blIp = blIp == null ? null : blIp.trim();
    }

    public String getBlBrowser() {
        return blBrowser;
    }

    public void setBlBrowser(String blBrowser) {
        this.blBrowser = blBrowser == null ? null : blBrowser.trim();
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


    public BusiLogs copy(Long pid){
        BusiLogs busiLogs = new BusiLogs();
        busiLogs.setBlBrowser(this.blBrowser);
        busiLogs.setBlDomain(this.blDomain);
        busiLogs.setBlAccount(this.blAccount);
        busiLogs.setBlDescription(this.blDescription);
        busiLogs.setBlCompany(this.blCompany);
        busiLogs.setBlIp(this.blIp);
        busiLogs.setBlModule(this.blModule);
        busiLogs.setBlMethod(this.blMethod);
        busiLogs.setBlUsername(this.blUsername);
        busiLogs.setBlPid(pid);
        return busiLogs;
    }
}