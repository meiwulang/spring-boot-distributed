package com.jdy.b2b.api.vo.schedule;

import com.jdy.b2b.api.model.Schedule;
import com.jdy.b2b.api.model.ticket.Ticket;

import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/19 17:12
 */
public class ScheduleUpdateVO extends Schedule {

    /**
     * 选择的票是否有变化，便于系统操作
     */
    private Boolean ticketsChanged;
    //来自区域产品 true
    private Boolean fromProductListMenu;

    /**
     * 选中的票，含自定义选项
     */
    private List<Ticket> tickets;

    private Integer flag;

    public Integer getFlag() {
        return flag;
    }

    public void setFlag(Integer flag) {
        this.flag = flag;
    }

    public Boolean getFromProductListMenu() {
        return fromProductListMenu;
    }

    public void setFromProductListMenu(Boolean fromProductListMenu) {
        this.fromProductListMenu = fromProductListMenu;
    }

    public Boolean getTicketsChanged() {
        return ticketsChanged;
    }

    public void setTicketsChanged(Boolean ticketsChanged) {
        this.ticketsChanged = ticketsChanged;
    }

    public List<Ticket> getTickets() {
        return tickets;
    }

    public void setTickets(List<Ticket> tickets) {
        this.tickets = tickets;
    }

}
