package com.jdy.b2b.api.model.diy;

import com.jdy.b2b.api.model.Bus;
import org.springframework.beans.BeanUtils;

import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/25 9:57
 */
public class BusDTO extends Bus {

    private List<BusHoldDTO> busHolds;
    private Integer seatsSoldNum;
    private String seatsSold;

    public BusDTO() {}

    public BusDTO(Bus bus) {
        BeanUtils.copyProperties(bus, this);
    }

    public List<BusHoldDTO> getBusHolds() {
        return busHolds;
    }

    public void setBusHolds(List<BusHoldDTO> busHolds) {
        this.busHolds = busHolds;
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
