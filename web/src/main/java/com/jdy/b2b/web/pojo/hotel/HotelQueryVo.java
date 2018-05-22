package com.jdy.b2b.web.pojo.hotel;


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
@ApiModel(value="酒店查询vo")
public class HotelQueryVo extends BaseVO {
    @ApiModelProperty(value = "酒店id")
    private Long id;
    @ApiModelProperty(value = "所属公司id")
    private Long companyId;
    @Length(max=20,message = "酒店名称最长为20")
    @ApiModelProperty(value = "酒店名称",allowableValues = "range[0,20]")
    private String hName;
    @Length(max=10,message = "简称最长为10")
    @ApiModelProperty(value = "简称",allowableValues = "range[0,10]")
    private String hShortName;
    @ApiModelProperty(value = "拼音码")
    private String hPym;
    @ApiModelProperty(value = "所属国家")
    private String hCountry;
    @ApiModelProperty(value = "省份")
    private String hProvince;
    @ApiModelProperty(value = "城市")
    private String hCity;
    @ApiModelProperty(value = "区")
    private String hArea;

    @ApiModelProperty(value = "等级")
    private String hLevel;
    @Length(max=200,message = "简介最长为200")
    @ApiModelProperty(value = "简介",allowableValues = "range[0,200]")
    private String hIntroduce;

    @Min(value=0,message = "状态最小为0")
    @Max(value=1,message = "状态最大为0")
    @ApiModelProperty(value = "0:有效,1:无效")
    private Integer hStatus;


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

    public Integer gethStatus() {
        return hStatus;
    }

    public void sethStatus(Integer hStatus) {
        this.hStatus = hStatus;
    }


}