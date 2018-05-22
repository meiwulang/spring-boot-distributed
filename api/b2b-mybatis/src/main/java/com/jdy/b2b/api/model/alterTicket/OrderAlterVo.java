package com.jdy.b2b.api.model.alterTicket;

import com.jdy.b2b.api.common.BaseVO;

/**
 * @Description
 * @Author yyf
 * @DateTime 2018/4/23 14:31
 */
public class OrderAlterVo extends BaseVO{

    private Long alterId;
    private Integer status;

    public Long getAlterId() {
        return alterId;
    }

    public void setAlterId(Long alterId) {
        this.alterId = alterId;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}
