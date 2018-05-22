package com.jdy.b2b.web.pojo.label;


import com.jdy.b2b.web.util.BaseVO;
import com.jdy.b2b.web.util.annotations.Save;
import com.jdy.b2b.web.util.annotations.Update;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.util.Date;

/**
 * Created by yangcheng on 2017/7/6.
 */
@ApiModel("标签查询vo")
public class LabelQueryVo extends BaseVO {
    @ApiModelProperty(value = "公司id")
    private Long companyId;
    @ApiModelProperty(value = "标签名称")
    private String lName;
    @ApiModelProperty(value = "分组id")
    private Long lGroupId;
    @ApiModelProperty(value = "模块id")
    private Long lModuleId;

    @ApiModelProperty(value = "0:有效,1:无效")
    @Min(value=0,message = "状态最小为0")
    @Max(value=1,message = "状态最大为1")
    private Integer lStatus;


    public Long getlModuleId() {
        return lModuleId;
    }

    public void setlModuleId(Long lModuleId) {
        this.lModuleId = lModuleId;
    }


    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public String getlName() {
        return lName;
    }

    public void setlName(String lName) {
        this.lName = lName == null ? null : lName.trim();
    }

    public Long getlGroupId() {
        return lGroupId;
    }

    public void setlGroupId(Long lGroupId) {
        this.lGroupId = lGroupId;
    }

    public Integer getlStatus() {
        return lStatus;
    }

    public void setlStatus(Integer lStatus) {
        this.lStatus = lStatus;
    }

}
