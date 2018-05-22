package com.jdy.b2b.web.pojo.schedule;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotNull;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/8/1 15:36
 */
@ApiModel("车辆预留信息 新增DTO")
public class BusHoldAddDTO {

    @ApiModelProperty("预留单位ID")
    @NotNull
    private Long bCompanyId;

    @ApiModelProperty("预留账号")
    @NotNull
    private String bAccount;

    @ApiModelProperty("预留小时")
    @NotNull
    private Integer bHoldHours;

    @ApiModelProperty("预留位置，逗号分隔")
    @NotNull
    private String bSeat;

    public Long getbCompanyId() {
        return bCompanyId;
    }

    public void setbCompanyId(Long bCompanyId) {
        this.bCompanyId = bCompanyId;
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
}
