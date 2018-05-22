package com.jdy.b2b.web.pojo.label;


import com.jdy.b2b.web.util.BaseVO;
import com.jdy.b2b.web.util.annotations.Save;
import com.jdy.b2b.web.util.annotations.Update;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.NotBlank;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.util.Date;
@ApiModel("标签分组查询vo")
public class LabelGroupQueryVo extends BaseVO {

    @ApiModelProperty(value = "所属公司id")
    private Long companyId;
    @ApiModelProperty(value = "分组名称")
    private String lgName;
    @ApiModelProperty(value = "上级分组id")
    private Long lgPid;
    @Min(value=0,groups = Save.class,message = "状态最小为0")
    @Max(value=1,groups = Save.class,message = "状态最大为1")
    @ApiModelProperty(value = "0:有效,1:无效")
    private Integer lgStatus;


    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public String getLgName() {
        return lgName;
    }

    public void setLgName(String lgName) {
        this.lgName = lgName == null ? null : lgName.trim();
    }

    public Long getLgPid() {
        return lgPid;
    }

    public void setLgPid(Long lgPid) {
        this.lgPid = lgPid;
    }

    public Integer getLgStatus() {
        return lgStatus;
    }

    public void setLgStatus(Integer lgStatus) {
        this.lgStatus = lgStatus;
    }


}