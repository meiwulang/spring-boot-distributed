package com.jdy.b2b.web.pojo.label;


import com.jdy.b2b.web.util.BaseVO;
import com.jdy.b2b.web.util.annotations.Save;
import com.jdy.b2b.web.util.annotations.Update;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.util.Date;

/**
 * Created by yangcheng on 2017/7/6.
 */
@ApiModel(value = "标签新增/编辑vo")
public class LabelSaveOrUpdateVo extends BaseVO {
    @NotNull(groups = {Update.class},message = "id不能为空")
    @ApiModelProperty(value = "广告id,更新必填")
    private Long id;
    @NotNull(groups = {Save.class},message = "公司不能为空")
    @ApiModelProperty(value = "公司id,保存/更新必填")
    private Long companyId;
    @ApiModelProperty(value = "标签名称")
    @Length(max = 10,groups = Save.class,message = "标签名称最长为8")
    @NotNull(groups = {Save.class},message = "标签名称不能为空")
    private String lName;
    @ApiModelProperty(value = "分组id")
    private Long lGroupId;
    @ApiModelProperty(value = "模块id")
    private Long lModuleId;
    @ApiModelProperty(value = "排序")
    private Integer lSort;
    @ApiModelProperty(value = "颜色")
    @NotNull(groups = {Save.class},message = "上级分组id不能为空")
    private String lColor;
    @ApiModelProperty(value = "0:有效,1:无效")
    @Min(value=0,groups = Save.class,message = "状态最小为0")
    @Max(value=1,groups = Save.class,message = "状态最大为1")
    private Integer lStatus;

    @ApiModelProperty(value = "创建时间",hidden = true)
    private Date createTime;
    @ApiModelProperty(value = "创建者",hidden = true)
    private Long createUser;
    @ApiModelProperty(value = "更新时间",hidden = true)
    private Date updateTime;
    @ApiModelProperty(value = "更新者",hidden = true)
    private Long updateUser;

    public Long getlModuleId() {
        return lModuleId;
    }

    public void setlModuleId(Long lModuleId) {
        this.lModuleId = lModuleId;
    }

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

    public Integer getlSort() {
        return lSort;
    }

    public void setlSort(Integer lSort) {
        this.lSort = lSort;
    }

    public String getlColor() {
        return lColor;
    }

    public void setlColor(String lColor) {
        this.lColor = lColor == null ? null : lColor.trim();
    }

    public Integer getlStatus() {
        return lStatus;
    }

    public void setlStatus(Integer lStatus) {
        this.lStatus = lStatus;
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
