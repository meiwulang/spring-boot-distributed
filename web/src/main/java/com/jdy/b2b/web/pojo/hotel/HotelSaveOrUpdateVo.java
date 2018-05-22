package com.jdy.b2b.web.pojo.hotel;


import com.jdy.b2b.web.util.BaseVO;
import com.jdy.b2b.web.util.annotations.Delete;
import com.jdy.b2b.web.util.annotations.Save;
import com.jdy.b2b.web.util.annotations.Update;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.util.Date;
@ApiModel(value="酒店新增/修改vo")
public class HotelSaveOrUpdateVo extends BaseVO {
    @ApiModelProperty(value = "酒店id,更新必填")
    @NotNull(groups = {Update.class},message = "id不能为空")
    private Long id;
    @NotNull(groups = {Save.class},message = "所属公司不能为空")
    @ApiModelProperty(value = "所属公司id,保存/更新必填")
    private Long companyId;
    @NotBlank(groups = {Save.class},message = "酒店名称不能为空")
    @Length(max=20,groups = {Save.class},message = "酒店名称最长20个字")
    @ApiModelProperty(value = "酒店名称,保存/更新必填",allowableValues = "range[0,20]")
    private String hName;
    @Length(max=10,groups = {Save.class},message = "简称最长10个字")
    @ApiModelProperty(value = "简称",allowableValues = "range[0,10]")
    private String hShortName;
    @ApiModelProperty(value = "拼音码")
    private String hPym;
    @ApiModelProperty(value = "所属国家,保存/更新必填")
    @NotBlank(groups = {Save.class},message = "国家不能为空")
    private String hCountry;
    @ApiModelProperty(value = "省份,保存/更新必填")
    @NotBlank(groups = {Save.class},message = "省份不能为空")
    private String hProvince;
    @ApiModelProperty(value = "城市,保存/更新必填")
    @NotBlank(groups = {Save.class},message = "城市不能为空")
    private String hCity;
    @ApiModelProperty(value = "区,保存/更新必填")
    @NotBlank(groups = {Save.class},message = "地区不能为空")
    private String hArea;
    @ApiModelProperty(value = "地址")
    @Length(max=255,groups = {Save.class},message = "地址最长255个字")
    private String hAdress;
    @ApiModelProperty(value = "附加属性")
    private String hAdditional;
    @NotBlank(groups = {Save.class},message = "等级不能为空")
    @ApiModelProperty(value = "等级")
    private String hLevel;
    @Length(max=200,groups = {Save.class},message = "简介最大200个字")
    @ApiModelProperty(value = "简介",allowableValues = "range[0,200]")
    private String hIntroduce;
    @ApiModelProperty(value = "经度")
    private String hMapx;
    @ApiModelProperty(value = "纬度")
    private String hMapy;
    @Min(value=0,groups = Save.class,message = "状态最小为0")
    @Max(value=1,groups = Save.class,message = "状态最大为1")
    @ApiModelProperty(value = "0:有效,1:无效")
    private Integer hStatus;
    @ApiModelProperty(value = "创建时间",hidden = true)
    private Date createTime;
    @ApiModelProperty(value = "创建用户",hidden = true)
    private Long createUser;
    @ApiModelProperty(value = "更新时间",hidden = true)
    private Date updateTime;
    @ApiModelProperty(value = "更新用户",hidden = true)
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

    public String gethName() {
        return hName;
    }

    public void sethName(String hName) {
        this.hName = hName == null ? null : hName.trim();
    }

    public String gethShortName() {
        return hShortName;
    }

    public void sethShortName(String hShortName) {
        this.hShortName = hShortName == null ? null : hShortName.trim();
    }

    public String gethPym() {
        return hPym;
    }

    public void sethPym(String hPym) {
        this.hPym = hPym == null ? null : hPym.trim();
    }

    public String gethCountry() {
        return hCountry;
    }

    public void sethCountry(String hCountry) {
        this.hCountry = hCountry == null ? null : hCountry.trim();
    }

    public String gethProvince() {
        return hProvince;
    }

    public void sethProvince(String hProvince) {
        this.hProvince = hProvince == null ? null : hProvince.trim();
    }

    public String gethCity() {
        return hCity;
    }

    public void sethCity(String hCity) {
        this.hCity = hCity == null ? null : hCity.trim();
    }

    public String gethArea() {
        return hArea;
    }

    public void sethArea(String hArea) {
        this.hArea = hArea == null ? null : hArea.trim();
    }

    public String gethAdress() {
        return hAdress;
    }

    public void sethAdress(String hAdress) {
        this.hAdress = hAdress == null ? null : hAdress.trim();
    }

    public String gethAdditional() {
        return hAdditional;
    }

    public void sethAdditional(String hAdditional) {
        this.hAdditional = hAdditional == null ? null : hAdditional.trim();
    }

    public String gethLevel() {
        return hLevel;
    }

    public void sethLevel(String hLevel) {
        this.hLevel = hLevel == null ? null : hLevel.trim();
    }

    public String gethIntroduce() {
        return hIntroduce;
    }

    public void sethIntroduce(String hIntroduce) {
        this.hIntroduce = hIntroduce == null ? null : hIntroduce.trim();
    }

    public String gethMapx() {
        return hMapx;
    }

    public void sethMapx(String hMapx) {
        this.hMapx = hMapx == null ? null : hMapx.trim();
    }

    public String gethMapy() {
        return hMapy;
    }

    public void sethMapy(String hMapy) {
        this.hMapy = hMapy == null ? null : hMapy.trim();
    }

    public Integer gethStatus() {
        return hStatus;
    }

    public void sethStatus(Integer hStatus) {
        this.hStatus = hStatus;
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