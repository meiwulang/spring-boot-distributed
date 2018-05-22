package com.jdy.b2b.web.pojo.dict;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.util.Date;

@ApiModel(description = "字典名词")
public class Dict {
    @ApiModelProperty(value = "主键ID")
    private Long id;

    @ApiModelProperty(value = "公司id")
    private Long companyId;

    @ApiModelProperty(value = "字典名称")
    private String dName;

    @ApiModelProperty(value = "字典分组id")
    private Long dGroupId;

    @ApiModelProperty(value = "上级id")
    private Long dPid;

    @ApiModelProperty(value = "状态 0:有效 1:无效")
    private Integer dStatus;

    @ApiModelProperty(value = "排序")
    private Integer dSort;

    private Date createTime;

    private Long createUser;

    private Date updateTime;

    private Long updateUser;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public String getdName() {
        return dName;
    }

    public void setdName(String dName) {
        this.dName = dName == null ? null : dName.trim();
    }

    public Long getdGroupId() {
        return dGroupId;
    }

    public void setdGroupId(Long dGroupId) {
        this.dGroupId = dGroupId;
    }

    public Integer getdStatus() {
        return dStatus;
    }

    public void setdStatus(Integer dStatus) {
        this.dStatus = dStatus;
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

    public Integer getdSort() {
        return dSort;
    }

    public void setdSort(Integer dSort) {
        this.dSort = dSort;
    }

    public Long getdPid() {
        return dPid;
    }

    public void setdPid(Long dPid) {
        this.dPid = dPid;
    }
}