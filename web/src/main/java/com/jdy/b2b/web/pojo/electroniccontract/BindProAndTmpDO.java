package com.jdy.b2b.web.pojo.electroniccontract;

import com.jdy.b2b.web.util.BaseVO;

import javax.validation.constraints.NotNull;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/12/14 20:06
 */
public class BindProAndTmpDO extends BaseVO {
    @NotNull
    private Long pid;
    @NotNull
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
