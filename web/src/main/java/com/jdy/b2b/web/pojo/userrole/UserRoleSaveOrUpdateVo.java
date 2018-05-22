package com.jdy.b2b.web.pojo.userrole;


import com.jdy.b2b.web.util.BaseVO;
import com.jdy.b2b.web.util.annotations.Save;
import com.jdy.b2b.web.util.annotations.Update;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.NotNull;
import java.util.Date;

/**
 * Created by yangcheng on 2017/7/4.
 */
@ApiModel
public class UserRoleSaveOrUpdateVo extends BaseVO {
    @ApiModelProperty(value = "角色id,,更新必填")
    @NotNull(groups = Update.class,message = "id不能为空")
    private Long id;
    @ApiModelProperty(value = "公司id")
    private Long urCompanyId;
    @NotNull(groups = Save.class,message = "角色名称不能为空")
    @ApiModelProperty(value = "角色名称,新增/更新必填")
    @Length(max=50,message = "角色名称最长50个字",groups = Save.class)
    private String urRoleName;
    @NotNull(groups = Save.class,message = "角色编号不能为空")
    @ApiModelProperty(value = "角色编号,新增/更新必填")
    @Length(max=10,message = "角色编号最长10个字",groups = Save.class)
    private String urRoleNo;
    @Length(max=300,message = "备注最长300个字",groups = Save.class)
    @ApiModelProperty(value = "备注,限长300")
    private String urRemark;
    @NotNull(groups = Save.class,message = "权限json不能为空")
    @ApiModelProperty(value = "权限json,新增/更新必填")
    private String urRoleContent;
    @NotNull(groups = Save.class,message = "权限array不能为空")
    @ApiModelProperty(value = "权限array,新增/更新必填")
    private String urRoleContentArray;
    @NotNull(groups = Save.class,message = "排序不能为空")
    @ApiModelProperty(value = "排序,新增/更新必填")
    private Integer urSort;
    @ApiModelProperty(value = "状态 0:有效 1:无效")
    private Integer urStatus;
    @ApiModelProperty(value = "创建时间",hidden = true)
    private Date createTime;
    @ApiModelProperty(value = "创建者",hidden = true)
    private Long createUser;
    @ApiModelProperty(value = "更新时间",hidden = true)
    private Date updateTime;
    @ApiModelProperty(value = "更新者",hidden = true)
    private Long updateUser;


    public String getUrRoleContentArray() {
        return urRoleContentArray;
    }

    public void setUrRoleContentArray(String urRoleContentArray) {
        this.urRoleContentArray = urRoleContentArray;
    }

    public Integer getUrSort() {
        return urSort;
    }

    public void setUrSort(Integer urSort) {
        this.urSort = urSort;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUrCompanyId() {
        return urCompanyId;
    }

    public void setUrCompanyId(Long urCompanyId) {
        this.urCompanyId = urCompanyId;
    }

    public String getUrRoleName() {
        return urRoleName;
    }

    public void setUrRoleName(String urRoleName) {
        this.urRoleName = urRoleName == null ? null : urRoleName.trim();
    }

    public String getUrRoleNo() {
        return urRoleNo;
    }

    public void setUrRoleNo(String urRoleNo) {
        this.urRoleNo = urRoleNo == null ? null : urRoleNo.trim();
    }

    public String getUrRemark() {
        return urRemark;
    }

    public void setUrRemark(String urRemark) {
        this.urRemark = urRemark == null ? null : urRemark.trim();
    }

    public Integer getUrStatus() {
        return urStatus;
    }

    public void setUrStatus(Integer urStatus) {
        this.urStatus = urStatus;
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

    public String getUrRoleContent() {
        return urRoleContent;
    }

    public void setUrRoleContent(String urRoleContent) {
        this.urRoleContent = urRoleContent == null ? null : urRoleContent.trim();
    }
}
