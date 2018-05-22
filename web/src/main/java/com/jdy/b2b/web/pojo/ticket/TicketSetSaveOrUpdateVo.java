package com.jdy.b2b.web.pojo.ticket;

import com.jdy.b2b.web.pojo.base.Base;
import com.jdy.b2b.web.util.BaseVO;
import com.jdy.b2b.web.util.annotations.Save;
import com.jdy.b2b.web.util.annotations.Update;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotNull;
import java.util.Date;
@ApiModel("套票关联vo")
public class TicketSetSaveOrUpdateVo extends BaseVO{

    @ApiModelProperty(value="套票id,新增/更新必填",hidden = true)
    private Long tsSetId;
    @NotNull(groups = {Save.class},message = "单票id不能为空")
    @ApiModelProperty(value="单票id,新增/更新必填")
    private Long tsSingleId;
    @ApiModelProperty(value="占座数,新增/更新必填")
    @NotNull(groups = {Save.class},message = "占座数不能为空")
    private Integer tsSeats;

    @ApiModelProperty(value = "创建时间",hidden = true)
    private Date createTime;
    @ApiModelProperty(value = "创建者",hidden = true)
    private Long createUser;
    @ApiModelProperty(value = "更新时间",hidden = true)
    private Date updateTime;
    @ApiModelProperty(value = "更新者",hidden = true)
    private Long updateUser;

    public Long getTsSetId() {
        return tsSetId;
    }

    public void setTsSetId(Long tsSetId) {
        this.tsSetId = tsSetId;
    }

    public Long getTsSingleId() {
        return tsSingleId;
    }

    public void setTsSingleId(Long tsSingleId) {
        this.tsSingleId = tsSingleId;
    }

    public Integer getTsSeats() {
        return tsSeats;
    }

    public void setTsSeats(Integer tsSeats) {
        this.tsSeats = tsSeats;
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