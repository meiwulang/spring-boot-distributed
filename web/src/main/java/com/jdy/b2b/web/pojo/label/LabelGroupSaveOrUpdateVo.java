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
@ApiModel(value="标签分组新增/删除vo")
public class LabelGroupSaveOrUpdateVo extends BaseVO {
    @NotNull(groups = {Update.class},message = "id不能为空")
    @ApiModelProperty(value = "标签id,更新必填")
    private Long id;
    @NotNull(groups = {Save.class},message = "公司不能为空")
    @ApiModelProperty(value = "所属公司id,保存/更新必填")
    private Long companyId;
    @NotBlank(groups = {Save.class},message = "分组名称不能为空")
    @ApiModelProperty(value = "分组名称")
    private String lgName;
    @NotNull(groups = {Save.class},message = "上级分组id不能为空")
    @ApiModelProperty(value = "上级分组id")
    private Long lgPid;
    @Min(value=0,groups = Save.class,message = "状态最小为0")
    @Max(value=1,groups = Save.class,message = "状态最大为1")
    @ApiModelProperty(value = "0:有效,1:无效")
    private Integer lgStatus;

    @ApiModelProperty(value = "创建时间",hidden = true)
    private Date createTime;
    @ApiModelProperty(value = "创建者",hidden = true)
    private Long createUser;
    @ApiModelProperty(value = "更新时间",hidden = true)
    private Date updateTime;
    @ApiModelProperty(value = "更新者",hidden = true)
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