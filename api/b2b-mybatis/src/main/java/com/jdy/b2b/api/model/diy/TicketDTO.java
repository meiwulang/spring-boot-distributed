package com.jdy.b2b.api.model.diy;

import com.jdy.b2b.api.model.ticket.Ticket;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/19 15:48
 */
public class TicketDTO extends Ticket {

    /*是否被选中*/
    private Integer chosen;

    /*站点数量*/
    private Integer departureNum;

    public Integer getChosen() {
        return chosen;
    }

    public void setChosen(Integer chosen) {
        this.chosen = chosen;
    }

    public Integer getDepartureNum() {
        return departureNum;
    }

    public void setDepartureNum(Integer departureNum) {
        this.departureNum = departureNum;
    }
}
