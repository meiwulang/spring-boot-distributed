package com.jdy.b2b.web.pojo.ticket;


import com.jdy.b2b.web.util.BaseVO;
import com.jdy.b2b.web.util.annotations.Save;
import com.jdy.b2b.web.util.annotations.Update;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.NotBlank;

import javax.validation.constraints.NotNull;
import java.util.Date;
@ApiModel("票价投放城市vo")
public class TicketAreaSaveOrUpdateVo extends BaseVO{

    @ApiModelProperty(value="票价id,保存/更新必填")
    private Long taTicketId;
    @NotBlank(groups = {Save.class},message = "国家不能为空")
    @ApiModelProperty(value="国家,保存/更新必填")
    private String taCountry;
    @NotBlank(groups = {Save.class},message = "省不能为空")
    @ApiModelProperty(value="省,保存/更新必填")
    private String taProvince;
    @NotBlank(groups = {Save.class},message = "城市不能为空")
    @ApiModelProperty(value="城市,保存/更新必填")
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


    public Long getTaTicketId() {
        return taTicketId;
    }

    public void setTaTicketId(Long taTicketId) {
        this.taTicketId = taTicketId;
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