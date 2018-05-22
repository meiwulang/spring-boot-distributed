package com.jdy.b2b.web.pojo.ticket;

import com.jdy.b2b.web.util.BaseVO;
import com.jdy.b2b.web.util.annotations.Save;
import com.jdy.b2b.web.util.annotations.Update;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotNull;
import java.util.Date;
@ApiModel("票价始发站vo")
public class TicketDepartureSaveOrUpdateVo extends BaseVO{

    @ApiModelProperty(value = "票价id,保存/更新必填",hidden = true)
    private Long ticketId;
    @NotNull(groups = {Save.class},message = "始发站不能为空")
    @ApiModelProperty(value = "始发站id,保存/更新必填")
    private Long departueId;
    @ApiModelProperty(value = "创建时间",hidden = true)
    private Date createTime;
    @ApiModelProperty(value = "创建者",hidden = true)
    private Long createUser;
    @ApiModelProperty(value = "更新时间",hidden = true)
    private Date updateTime;
    @ApiModelProperty(value = "更新者",hidden = true)
    private Long updateUser;


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

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Long getCreateUser() {
        return createUser;
    }

    public void setCreateUser(Long createUser) {
        this.createUser = createUser;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public Long getUpdateUser() {
        return updateUser;
    }

    public void setUpdateUser(Long updateUser) {
        this.updateUser = updateUser;
    }
}