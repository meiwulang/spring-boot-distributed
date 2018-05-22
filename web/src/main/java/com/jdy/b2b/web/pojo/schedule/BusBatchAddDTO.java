package com.jdy.b2b.web.pojo.schedule;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/8/1 15:57
 */
@ApiModel("批量添加车辆DTO")
public class BusBatchAddDTO {

    @ApiModelProperty("座位预留信息")
    @Valid
    private List<BusHoldAddDTO> busHolds;

    @ApiModelProperty("座位数")
    @NotNull
    private Integer bSeatsNum;

    @ApiModelProperty("锁定位置，逗号分隔")
    private String bSeatsLock;

    public List<BusHoldAddDTO> getBusHolds() {
        return busHolds;
    }

    public void setBusHolds(List<BusHoldAddDTO> busHolds) {
        this.busHolds = busHolds;
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

}
