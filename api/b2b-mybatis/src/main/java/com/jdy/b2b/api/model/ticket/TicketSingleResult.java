package com.jdy.b2b.api.model.ticket;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by yangcheng on 2017/12/15.
 */
public class TicketSingleResult {
    private String groupBy;
    private Integer amount;
    private List<TicketListDO> tickList = new ArrayList<>();

    public String getGroupBy() {
        return groupBy;
    }

    public void setGroupBy(String groupBy) {
        this.groupBy = groupBy;
    }

    public Integer getAmount() {
        return amount;
    }

    public void setAmount(Integer amount) {
        this.amount = amount;
    }

    public List<TicketListDO> getTickList() {
        return tickList;
    }

    public void setTickList(List<TicketListDO> tickList) {
        this.tickList = tickList;
    }
}
