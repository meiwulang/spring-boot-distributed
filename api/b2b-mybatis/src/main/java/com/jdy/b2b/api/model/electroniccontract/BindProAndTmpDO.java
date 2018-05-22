package com.jdy.b2b.api.model.electroniccontract;

import com.jdy.b2b.api.common.BaseVO;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/12/14 20:06
 */
public class BindProAndTmpDO extends BaseVO {
    private Long pid;
    private Long tid;

    public Long getPid() {
        return pid;
    }

    public void setPid(Long pid) {
        this.pid = pid;
    }

    public Long getTid() {
        return tid;
    }

    public void setTid(Long tid) {
        this.tid = tid;
    }
}
