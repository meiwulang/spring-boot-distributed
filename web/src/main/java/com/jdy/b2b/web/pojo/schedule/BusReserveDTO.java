package com.jdy.b2b.web.pojo.schedule;

import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/8/1 15:57
 */
@ApiModel("车辆预留座位DTO")
public class BusReserveDTO extends BaseVO{

    @ApiModelProperty("true:reserve, false:release")
    @NotNull
    private Boolean reserve;

    @ApiModelProperty("车辆id")
    @NotNull
    private Long bBusId;

    @ApiModelProperty("公司id")
    private Long bCompanyId;

    @ApiModelProperty("账号")
    private String bAccount;

    @ApiModelProperty("预留时间")
    @Min(1)
    private Integer bHoldHours;

    @ApiModelProperty("预留、释放的座位，逗号分隔")
    @NotNull
    private String bSeat;

    public Boolean getReserve() {
        return reserve;
    }

    public void setReserve(Boolean reserve) {
        this.reserve = reserve;
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