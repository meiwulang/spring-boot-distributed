package com.jdy.b2b.web.pojo.ticket;

import com.jdy.b2b.web.util.BaseVO;
import com.jdy.b2b.web.util.annotations.Update;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotNull;
import java.util.Date;
@ApiModel
public class TicketDepartureQueryVo extends BaseVO{
    @ApiModelProperty(value="始发站中间表id",hidden = true)
    private Long id;
    @ApiModelProperty(value="票价id")
    private Long ticketId;
    @ApiModelProperty(value="始发站id")
    private Long departueId;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTicketId() {
        return ticketId;
    }

    public void setTicketId(Long ticketId) {
        this.ticketId = ticketId;
    }

    public Long getDepartueId() {
        return departueId;
    }

    public void setDepartueId(Long departueId) {
        this.departueId = departueId;
    }


}