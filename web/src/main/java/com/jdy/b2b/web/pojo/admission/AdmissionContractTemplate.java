package com.jdy.b2b.web.pojo.admission;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotNull;

import com.jdy.b2b.web.util.BaseVO;

import java.util.Date;

@ApiModel
public class AdmissionContractTemplate extends BaseVO{
    @NotNull
    private Long id;

    @NotNull
    @ApiModelProperty(value = "门票id")
    private Long pid;

    @NotNull
    @ApiModelProperty(value = "合同模板id")
    private Long tId;

    private Long createUser;

    private Date createTime;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPid() {
        return pid;
    }

    public void setPid(Long pid) {
        this.pid = pid;
    }

    public Long gettId() {
        return tId;
    }

    public void settId(Long tId) {
        this.tId = tId;
    }

    public Long getCreateUser() {
        return createUser;
    }

    public void setCreateUser(Long createUser) {
        this.createUser = createUser;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }
}