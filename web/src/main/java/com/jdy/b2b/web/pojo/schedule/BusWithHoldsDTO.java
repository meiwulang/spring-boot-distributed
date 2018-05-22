package com.jdy.b2b.web.pojo.schedule;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/8/1 15:35
 */
@ApiModel("车辆信息，带预留信息")
public class BusWithHoldsDTO extends BusDTO {

    @ApiModelProperty("车辆预留信息")
    List<BusHoldDTO> busholds;

    @ApiModelProperty("售出座位数量")
    private Integer seatsSoldNum;
    @ApiModelProperty("售出座位(逗号分隔)")
    private String seatsSold;

    public List<BusHoldDTO> getBusholds() {
        return busholds;
    }

    public void setBusholds(List<BusHoldDTO> busholds) {
        this.busholds = busholds;
    }

    public Integer getSeatsSoldNum() {
        return seatsSoldNum;
    }

    public void setSeatsSoldNum(Integer seatsSoldNum) {
        this.seatsSoldNum = seatsSoldNum;
    }

    public String getSeatsSold() {
        return seatsSold;
    }

    public void setSeatsSold(String seatsSold) {
        this.seatsSold = seatsSold;
    }
}
