package com.jdy.b2b.api.vo.ticket;


import com.jdy.b2b.api.common.constants.annotations.Save;

import javax.validation.constraints.NotNull;

/**
 * Created by yangcheng on 2017/8/21.
 */
public class TicketDefaultVo{
    private Long id;
    private Long tProductId;
    private Long updateUser;
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

    public Integer gettStatus() {
        return tStatus;
    }

    public void settStatus(Integer tStatus) {
        this.tStatus = tStatus;
    }

    public Long getUpdateUser() {
        return updateUser;
    }

    public void setUpdateUser(Long updateUser) {
        this.updateUser = updateUser;
    }
}
