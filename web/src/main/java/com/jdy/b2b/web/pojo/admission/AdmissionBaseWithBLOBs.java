package com.jdy.b2b.web.pojo.admission;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel
public class AdmissionBaseWithBLOBs extends AdmissionBase {
    @ApiModelProperty(value = "入园须知")
    private String admissions;

    @ApiModelProperty(value = "景点介绍")
    private String attractions;

    public String getAdmissions() {
        return admissions;
    }

    public void setAdmissions(String admissions) {
        this.admissions = admissions == null ? null : admissions.trim();
    }

    public String getAttractions() {
        return attractions;
    }

    public void setAttractions(String attractions) {
        this.attractions = attractions == null ? null : attractions.trim();
    }
}