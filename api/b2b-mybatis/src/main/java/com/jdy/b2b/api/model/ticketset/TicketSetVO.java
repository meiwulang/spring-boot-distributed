package com.jdy.b2b.api.model.ticketset;

import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/10/27 17:05
 */
public class TicketSetVO extends TicketSet {
    private List<Long> setIds;

    public List<Long> getSetIds() {
        return setIds;
    }

    public void setSetIds(List<Long> setIds) {
        this.setIds = setIds;
    }
}
