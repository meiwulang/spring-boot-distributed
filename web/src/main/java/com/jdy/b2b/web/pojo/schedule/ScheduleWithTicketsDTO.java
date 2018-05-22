package com.jdy.b2b.web.pojo.schedule;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.util.List;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/8/1 14:51
 */
@ApiModel("班期")
public class ScheduleWithTicketsDTO extends ScheduleDTO {

    @ApiModelProperty("相关票信息")
    private List<TicketDTO> tickets;

    private String shifa;
    private String chufa;

    public List<TicketDTO> getTickets() {
        return tickets;
    }

    public void setTickets(List<TicketDTO> tickets) {
        this.tickets = tickets;
    }

    public String getShifa() {
        return shifa;
    }

    public void setShifa(String shifa) {
        this.shifa = shifa;
    }

    public String getChufa() {
        return chufa;
    }

    public void setChufa(String chufa) {
        this.chufa = chufa;
    }
}
