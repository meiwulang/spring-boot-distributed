package com.jdy.b2b.web.pojo.advertisement;


import com.jdy.b2b.web.annotation.MyValidator;
import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by yangcheng on 2017/7/5.
 */
@ApiModel(value="广告查询VO",description = "")
public class AdvertisementQueryVo extends BaseVO {
    @ApiModelProperty(value = "广告所属分公司id")
    private Long companyId;
    @ApiModelProperty(value = "广告位置")
    private Integer aPlace;
    @ApiModelProperty(value = "广告标题",allowableValues = "range[0,100]")
    @Length(max=100,message = "广告标题长度最大为100")
    private String aTitle;
    @Length(max=100,message = "其他内容长度最大为100")
    @ApiModelProperty(value = "其他内容",allowableValues = "range[0,200]")
    private String aOther;
    @Length(max=200,message = "广告说明长度最大为200")
    @ApiModelProperty(value = "广告说明",allowableValues = "range[0,200]")
    private String aComment;
    @ApiModelProperty(value="0:有效,1:无效",allowableValues = "range[0,1]")
    @Min(value=0,message = "状态最小值为0")
    @Max(value=1,message = "状态最大值为1")
    private Integer aStatus;

    /*查询投放城市集合*/
    @ApiModelProperty(value="投放城市集合")
    private String taCity;

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public String getTaCity() {
        return taCity;
    }

    public void setTaCity(String taCity) {
        this.taCity = taCity;
    }

    public Integer getaPlace() {
        return aPlace;
    }

    public void setaPlace(Integer aPlace) {
        this.aPlace = aPlace;
    }

    public String getaTitle() {
        return aTitle;
    }

    public void setaTitle(String aTitle) {
        this.aTitle = aTitle == null ? null : aTitle.trim();
    }

    public String getaOther() {
        return aOther;
    }

    public void setaOther(String aOther) {
        this.aOther = aOther == null ? null : aOther.trim();
    }

    public String getaComment() {
        return aComment;
    }

    public void setaComment(String aComment) {
        this.aComment = aComment == null ? null : aComment.trim();
    }

    public Integer getaStatus() {
        return aStatus;
    }

    public void setaStatus(Integer aStatus) {
        this.aStatus = aStatus;
    }


}
