package com.jdy.b2b.web.pojo.schedule;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.util.Date;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/8/1 15:36
 */
@ApiModel("车辆预留信息")
public class BusHoldDTO {

    @ApiModelProperty("主键id")
    private Long id;

    @ApiModelProperty("车辆id")
    private Long bBusId;

    @ApiModelProperty("预留单位ID")
    private Long bCompanyId;

    @ApiModelProperty("预留单位名称")
    private String companyName;

    @ApiModelProperty("预留账号")
    private String bAccount;

    @ApiModelProperty("预留小时")
    private Integer bHoldHours;

    @ApiModelProperty("预留位置，逗号分隔")
    private String bSeat;

    private Date createTime;

    private Long createUser;

    private Date updateTime;

    private Long updateUser;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getbBusId() {
        return bBusId;
    }

    public void setbBusId(Long bBusId) {
        this.bBusId = bBusId;
    }

    public Long getbCompanyId() {
        return bCompanyId;
    }

    public void setbCompanyId(Long bCompanyId) {
        this.bCompanyId = bCompanyId;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getbAccount() {
        return bAccount;
    }

    public void setbAccount(String bAccount) {
        this.bAccount = bAccount;
    }

    public Integer getbHoldHours() {
        return bHoldHours;
    }

    public void setbHoldHours(Integer bHoldHours) {
        this.bHoldHours = bHoldHours;
    }

    public String getbSeat() {
        return bSeat;
    }

    public void setbSeat(String bSeat) {
        this.bSeat = bSeat;
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
