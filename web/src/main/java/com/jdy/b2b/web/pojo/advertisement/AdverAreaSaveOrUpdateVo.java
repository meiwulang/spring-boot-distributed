package com.jdy.b2b.web.pojo.advertisement;


import com.jdy.b2b.web.util.BaseVO;
import com.jdy.b2b.web.util.annotations.Save;
import com.jdy.b2b.web.util.annotations.Update;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.NotNull;
import java.util.Date;
@ApiModel(value = "广告投放城市新增/修改vo")
public class AdverAreaSaveOrUpdateVo extends BaseVO{

    @ApiModelProperty(value="广告id,保存/更新必填")
    private Long aaAdverId;
    @NotNull(groups = {Save.class},message = "国家名不能为空")
    @ApiModelProperty(value="国家名,保存/更新必填")
    private String taCountry;
    @NotNull(groups = {Save.class},message = "省名称不能为空")
    @ApiModelProperty(value="省名称,保存/更新必填")
    private String taProvince;
    @NotNull(groups = {Save.class},message = "城市名称不能为空")
    @ApiModelProperty(value="城市名称,保存/更新必填")
    private String taCity;
    @ApiModelProperty(value="区")
    private String taArea;
    @ApiModelProperty(value = "创建时间",hidden = true)
    private Date createTime;
    @ApiModelProperty(value = "创建用户",hidden = true)
    private Long createUser;
    @ApiModelProperty(value = "更新时间",hidden = true)
    private Date updateTime;
    @ApiModelProperty(value = "更新用户",hidden = true)
    private Long updateUser;


    public Long getAaAdverId() {
        return aaAdverId;
    }

    public void setAaAdverId(Long aaAdverId) {
        this.aaAdverId = aaAdverId;
    }

    public String getTaCountry() {
        return taCountry;
    }

    public void setTaCountry(String taCountry) {
        this.taCountry = taCountry == null ? null : taCountry.trim();
    }

    public String getTaProvince() {
        return taProvince;
    }

    public void setTaProvince(String taProvince) {
        this.taProvince = taProvince == null ? null : taProvince.trim();
    }

    public String getTaCity() {
        return taCity;
    }

    public void setTaCity(String taCity) {
        this.taCity = taCity == null ? null : taCity.trim();
    }

    public String getTaArea() {
        return taArea;
    }

    public void setTaArea(String taArea) {
        this.taArea = taArea == null ? null : taArea.trim();
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