package com.jdy.b2b.api.vo.scheduleplan;


import com.jdy.b2b.api.common.BaseVO;

import java.time.LocalDate;

/**
 * Created by yangcheng on 2017/12/7.
 */
public class SchedulePlanDetailQueryVO extends BaseVO {
    private LocalDate sCalendar;
    private Integer flag;
    private Long productId;
    private Long ticketId;

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public LocalDate getsCalendar() {
        return sCalendar;
    }

    public void setsCalendar(LocalDate sCalendar) {
        this.sCalendar = sCalendar;
    }

    public Integer getFlag() {
        return flag;
    }

    public void setFlag(Integer flag) {
        this.flag = flag;
    }

    public Long getTicketId() {
        return ticketId;
    }

    public void setTicketId(Long ticketId) {
        this.ticketId = ticketId;
    }
}
