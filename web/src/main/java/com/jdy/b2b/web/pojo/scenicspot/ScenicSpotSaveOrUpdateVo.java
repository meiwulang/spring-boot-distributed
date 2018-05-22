package com.jdy.b2b.web.pojo.scenicspot;


import com.jdy.b2b.web.util.BaseVO;
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

/**
 * Created by yangcheng on 2017/7/7.
 */
@ApiModel("景点新增/删除vo")
public class ScenicSpotSaveOrUpdateVo extends BaseVO {
    @NotNull(groups = {Update.class},message = "id不能为空")
    @ApiModelProperty(value = "景点id,更新必填")
    private Long id;
    @NotNull(groups = Save.class,message = "自定义目的地不能为空")
    @ApiModelProperty(value = "自定义目的地")
    private String sCustomPlace;
    @NotNull(groups = {Save.class},message = "所属公司id不能为空")
    @ApiModelProperty(value = "所属公司id,保存/更新必填")
    private Long companyId;
    @NotBlank(groups = {Save.class},message = "景点名称不能为空")
    @Length(max=20,groups = {Save.class},message = "id不能为空")
    @ApiModelProperty(value = "景点名称,保存/更新必填")
    private String sName;
    @Length(max=10,groups = {Save.class},message = "简称不能为空")
    @ApiModelProperty(value = "简称")
    private String sSortName;
    @ApiModelProperty(value = "拼音码")
    private String sPym;
    @ApiModelProperty(value = "排序")
    private Long sSort;
    @ApiModelProperty(value = "电话")
    private String sPhone;
    @NotNull(groups = {Save.class},message = "景区属性不能为空")
    @ApiModelProperty(value = "景区属性,保存/更新必填")
    private Integer sAttribute;
    @NotBlank(groups = {Save.class},message = "国家不能为空")
    @ApiModelProperty(value = "国家,保存/更新必填")
    private String sCountry;
    @NotBlank(groups = {Save.class},message = "省不能为空")
    @ApiModelProperty(value = "省,保存/更新必填")
    private String sProvince;
    @NotBlank(groups = {Save.class},message = "城市不能为空")
    @ApiModelProperty(value = "城市,保存/更新必填")
    private String sCity;
    @NotBlank(groups = {Save.class},message = "区不能为空")
    @ApiModelProperty(value = "区,保存/更新必填")
    private String sArea;
    @ApiModelProperty(value = "地址")
    @Length(max=255,groups = {Save.class},message = "地址最长255个字")
    private String sAdress;
    @ApiModelProperty(value = "附加属性")
    private String sAdditional;
    @ApiModelProperty(value = "开放时间")
    private Date sStartTime;
    @ApiModelProperty(value = "关闭时间")
    private Date sEndTime;
    @NotBlank(groups = {Save.class},message = "景点等级不能为空")
    @ApiModelProperty(value = "景点等级,保存/更新必填")
    private String sLevel;
    @Length(max=600,groups = {Save.class},message = "景点简介最长600个字")
    @ApiModelProperty(value = "景点简介")
    private String sIntroduce;
    @ApiModelProperty(value = "经度")
    private String sMapx;
    @ApiModelProperty(value = "纬度")
    private String sMapy;
    @ApiModelProperty(value = "0:有效,1:无效")
    @Min(value=0,groups = Save.class,message = "状态最小为0")
    @Max(value=1,groups = Save.class,message = "状态最大为1")
    private Integer sStatus;
    @ApiModelProperty(value = "创建时间")
    private Date createTime;
    @ApiModelProperty(value = "创建者")
    private Long createUser;
    @ApiModelProperty(value = "更新时间")
    private Date updateTime;
    @ApiModelProperty(value = "更新者")
    private Long updateUser;
    @Length(max=600,groups = {Save.class},message = "景区介绍最多600字")
    @ApiModelProperty(value = "景区介绍")
    private String sDetail;
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

    public String getsCustomPlace() {
        return sCustomPlace;
    }

    public void setsCustomPlace(String sCustomPlace) {
        this.sCustomPlace = sCustomPlace;
    }

    public String getsName() {
        return sName;
    }

    public void setsName(String sName) {
        this.sName = sName == null ? null : sName.trim();
    }

    public String getsSortName() {
        return sSortName;
    }

    public void setsSortName(String sSortName) {
        this.sSortName = sSortName == null ? null : sSortName.trim();
    }

    public String getsPym() {
        return sPym;
    }

    public void setsPym(String sPym) {
        this.sPym = sPym == null ? null : sPym.trim();
    }

    public Long getsSort() {
        return sSort;
    }

    public void setsSort(Long sSort) {
        this.sSort = sSort;
    }

    public String getsPhone() {
        return sPhone;
    }

    public void setsPhone(String sPhone) {
        this.sPhone = sPhone == null ? null : sPhone.trim();
    }

    public Integer getsAttribute() {
        return sAttribute;
    }

    public void setsAttribute(Integer sAttribute) {
        this.sAttribute = sAttribute;
    }

    public String getsCountry() {
        return sCountry;
    }

    public void setsCountry(String sCountry) {
        this.sCountry = sCountry == null ? null : sCountry.trim();
    }

    public String getsProvince() {
        return sProvince;
    }

    public void setsProvince(String sProvince) {
        this.sProvince = sProvince == null ? null : sProvince.trim();
    }

    public String getsCity() {
        return sCity;
    }

    public void setsCity(String sCity) {
        this.sCity = sCity == null ? null : sCity.trim();
    }

    public String getsArea() {
        return sArea;
    }

    public void setsArea(String sArea) {
        this.sArea = sArea == null ? null : sArea.trim();
    }

    public String getsAdress() {
        return sAdress;
    }

    public void setsAdress(String sAdress) {
        this.sAdress = sAdress == null ? null : sAdress.trim();
    }

    public String getsAdditional() {
        return sAdditional;
    }

    public void setsAdditional(String sAdditional) {
        this.sAdditional = sAdditional == null ? null : sAdditional.trim();
    }

    public Date getsStartTime() {
        return sStartTime;
    }

    public void setsStartTime(Date sStartTime) {
        this.sStartTime = sStartTime;
    }

    public Date getsEndTime() {
        return sEndTime;
    }

    public void setsEndTime(Date sEndTime) {
        this.sEndTime = sEndTime;
    }

    public String getsLevel() {
        return sLevel;
    }

    public void setsLevel(String sLevel) {
        this.sLevel = sLevel;
    }

    public String getsIntroduce() {
        return sIntroduce;
    }

    public void setsIntroduce(String sIntroduce) {
        this.sIntroduce = sIntroduce == null ? null : sIntroduce.trim();
    }

    public String getsMapx() {
        return sMapx;
    }

    public void setsMapx(String sMapx) {
        this.sMapx = sMapx == null ? null : sMapx.trim();
    }

    public String getsMapy() {
        return sMapy;
    }

    public void setsMapy(String sMapy) {
        this.sMapy = sMapy == null ? null : sMapy.trim();
    }

    public Integer getsStatus() {
        return sStatus;
    }

    public void setsStatus(Integer sStatus) {
        this.sStatus = sStatus;
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

    public String getsDetail() {
        return sDetail;
    }

    public void setsDetail(String sDetail) {
        this.sDetail = sDetail == null ? null : sDetail.trim();
    }
}
