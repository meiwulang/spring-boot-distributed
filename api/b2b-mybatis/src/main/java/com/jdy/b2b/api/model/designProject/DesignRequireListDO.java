package com.jdy.b2b.api.model.designProject;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

public class DesignRequireListDO  implements Comparable<DesignRequireListDO>{
    private Long id;
    private Integer type;
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    private Date createTime;
    private Boolean isLast;
    private String drName;
    private Long productId;

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Boolean getLast() {
        return isLast;
    }


    public String getDrName() {
        return drName;
    }

    public void setDrName(String drName) {
        this.drName = drName;
    }

    public void setLast(Boolean last) {
        isLast = last;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    @Override
    public int compareTo(DesignRequireListDO d) {
        return d.getCreateTime().compareTo(this.getCreateTime());
    }
}