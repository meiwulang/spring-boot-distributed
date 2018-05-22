package com.jdy.b2b.web.pojo.scenicspot;


import com.jdy.b2b.web.util.BaseVO;
import com.jdy.b2b.web.util.annotations.Save;
import com.jdy.b2b.web.util.annotations.Update;
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
public class ScenicSpotQueryVo extends BaseVO {
    @ApiModelProperty(value = "所属公司id")
    private Long companyId;
    @Length(max=20,groups = {Save.class},message = "名称最大为20个字")
    @ApiModelProperty(value = "景点名称")
    private String sName;
    @Length(max=10,groups = {Save.class},message = "简称最大为10个字")
    @ApiModelProperty(value = "简称")
    private String sSortName;
    @ApiModelProperty(value = "拼音码")
    private String sPym;

    @ApiModelProperty(value = "国家")
    private String sCountry;
    @ApiModelProperty(value = "省")
    private String sProvince;
    @ApiModelProperty(value = "城市")
    private String sCity;
    @ApiModelProperty(value = "区")
    private String sArea;

    @ApiModelProperty(value = "景点等级")
    private String sLevel;
    @ApiModelProperty(value = "景点简介")
    private String sIntroduce;

    @ApiModelProperty(value = "0:有效,1:无效")
    @Min(value=0,groups = Save.class,message = "状态最小为0")
    @Max(value=1,groups = Save.class,message = "状态最大为1")
    private Integer sStatus;

    @ApiModelProperty(value = "景区介绍")
    private String sDetail;

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
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

    public Integer getsStatus() {
        return sStatus;
    }

    public void setsStatus(Integer sStatus) {
        this.sStatus = sStatus;
    }


    public String getsDetail() {
        return sDetail;
    }

    public void setsDetail(String sDetail) {
        this.sDetail = sDetail == null ? null : sDetail.trim();
    }
}
