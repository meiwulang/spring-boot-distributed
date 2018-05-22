package com.jdy.b2b.web.pojo.dict;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.util.Date;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/31 16:41
 */
@ApiModel(description = "字典分组")
public class DictGroup {

    @ApiModelProperty(value = "主键ID")
    private Long id;

    @ApiModelProperty(value = "分组名称")
    private String dgName;

    @ApiModelProperty(value = "级别等级0:非系统级 1:系统级")
    private Integer dgLevel;

    @ApiModelProperty(value = "排序")
    private Integer dgSort;

    @ApiModelProperty(value = "状态 0:有效 1:无效")
    private Integer dgStatus;

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

    public String getDgName() {
        return dgName;
    }

    public void setDgName(String dgName) {
        this.dgName = dgName;
    }

    public Integer getDgLevel() {
        return dgLevel;
    }

    public void setDgLevel(Integer dgLevel) {
        this.dgLevel = dgLevel;
    }

    public Integer getDgSort() {
        return dgSort;
    }

    public void setDgSort(Integer dgSort) {
        this.dgSort = dgSort;
    }

    public Integer getDgStatus() {
        return dgStatus;
    }

    public void setDgStatus(Integer dgStatus) {
        this.dgStatus = dgStatus;
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
