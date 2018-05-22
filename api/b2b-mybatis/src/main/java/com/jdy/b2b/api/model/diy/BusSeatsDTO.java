package com.jdy.b2b.api.model.diy;

import com.jdy.b2b.api.model.Bus;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/24 11:18
 */
public class BusSeatsDTO extends Bus {
    
    /**
     * 预留座位（逗号分隔）,多条预留记录的合并
     */
    private String bSeat;

    public String getbSeat() {
        return bSeat;
    }

    public void setbSeat(String bSeat) {
        this.bSeat = bSeat;
    }
}
