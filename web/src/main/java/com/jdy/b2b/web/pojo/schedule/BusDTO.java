package com.jdy.b2b.web.pojo.schedule;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.util.Date;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/8/1 15:33
 */
@ApiModel("车辆信息")
public class BusDTO {

    @ApiModelProperty("主键id")
    private Long id;

    @ApiModelProperty("当前车号")
    private Integer bNo;

    @ApiModelProperty("班期ID")
    private Long bScheduleId;

    @ApiModelProperty("座位数")
    private Integer bSeatsNum;

    @ApiModelProperty("锁定位置，逗号分隔")
    private String bSeatsLock;

    @ApiModelProperty("状态 0:有效 1:无效")
    private Integer bStatus;

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

    public Integer getbNo() {
        return bNo;
    }

    public void setbNo(Integer bNo) {
        this.bNo = bNo;
    }

    public Long getbScheduleId() {
        return bScheduleId;
    }

    public void setbScheduleId(Long bScheduleId) {
        this.bScheduleId = bScheduleId;
    }

    public Integer getbSeatsNum() {
        return bSeatsNum;
    }

    public void setbSeatsNum(Integer bSeatsNum) {
        this.bSeatsNum = bSeatsNum;
    }

    public String getbSeatsLock() {
        return bSeatsLock;
    }

    public void setbSeatsLock(String bSeatsLock) {
        this.bSeatsLock = bSeatsLock;
    }

    public Integer getbStatus() {
        return bStatus;
    }

    public void setbStatus(Integer bStatus) {
        this.bStatus = bStatus;
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
