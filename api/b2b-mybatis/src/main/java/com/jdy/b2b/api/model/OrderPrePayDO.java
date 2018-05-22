package com.jdy.b2b.api.model;

import java.util.Date;

public class OrderPrePayDO {
    private Long id;

    private String ppOrderNo;

    private String ppOrderRandom;

    private Long ppUserid;

    private Date createTime;

    private Long createUser;

    private Date updateTime;

    private Long updateUser;

    private Integer oSource;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPpOrderNo() {
        return ppOrderNo;
    }

    public void setPpOrderNo(String ppOrderNo) {
        this.ppOrderNo = ppOrderNo == null ? null : ppOrderNo.trim();
    }

    public String getPpOrderRandom() {
        return ppOrderRandom;
    }

    public void setPpOrderRandom(String ppOrderRandom) {
        this.ppOrderRandom = ppOrderRandom == null ? null : ppOrderRandom.trim();
    }

    public Long getPpUserid() {
        return ppUserid;
    }

    public void setPpUserid(Long ppUserid) {
        this.ppUserid = ppUserid;
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

    public Integer getoSource() {
        return oSource;
    }

    public void setoSource(Integer oSource) {
        this.oSource = oSource;
    }
}