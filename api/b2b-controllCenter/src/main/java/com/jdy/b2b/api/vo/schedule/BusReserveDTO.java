package com.jdy.b2b.api.vo.schedule;

import com.jdy.b2b.api.model.BusHold;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/25 11:47
 */
public class BusReserveDTO extends BusHold {

    /**
     * true:reserve, false:release
     */
    private Boolean reserve;

    public Boolean getReserve() {
        return reserve;
    }

    public void setReserve(Boolean reserve) {
        this.reserve = reserve;
    }
}
