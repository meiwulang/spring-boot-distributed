package com.jdy.b2b.web.pojo.ticket;

import com.jdy.b2b.web.util.BaseVO;
import com.jdy.b2b.web.util.annotations.Save;
import com.jdy.b2b.web.util.annotations.Update;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotNull;

/**
 * Created by yangcheng on 2017/8/21.
 */
@ApiModel
public class TicketDefaultVo{
    @NotNull(groups = {Save.class,Update.class})
    private Long id;
    @ApiModelProperty(value="产品id,设为默认价格传值,修改状态不要传值")
    @NotNull(groups = Save.class)
    private Long tProductId;
    @ApiModelProperty(hidden = true)
    private Long updateUser;
    @ApiModelProperty(value="状态,设为默认价格不要传值,修改状态传值")
    @NotNull(groups = Update.class)
    private Integer tStatus;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long gettProductId() {
        return tProductId;
    }

    public void settProductId(Long tProductId) {
        this.tProductId = tProductId;
    }

    public Long getUpdateUser() {
        return updateUser;
    }

    public void setUpdateUser(Long updateUser) {
        this.updateUser = updateUser;
    }

    public Integer gettStatus() {
        return tStatus;
    }

    public void settStatus(Integer tStatus) {
        this.tStatus = tStatus;
    }
}
