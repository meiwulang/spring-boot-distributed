package com.jdy.b2b.web.pojo.advertisement;


import com.jdy.b2b.web.annotation.EnumValue;
import com.jdy.b2b.web.annotation.MyValidator;
import com.jdy.b2b.web.util.BaseVO;
import com.jdy.b2b.web.util.annotations.Delete;
import com.jdy.b2b.web.util.annotations.Save;
import com.jdy.b2b.web.util.annotations.Update;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;
import org.hibernate.validator.constraints.NotEmpty;
import org.hibernate.validator.constraints.Range;

import javax.validation.Valid;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * Created by yangcheng on 2017/7/5.
 */
@ApiModel(value="广告新增/修改VO")
public class AdvertisementSaveOrUpdateVo extends BaseVO {
    @NotNull(groups = {Update.class},message = "广告id不能为空")
    @ApiModelProperty(value = "广告id,更新必填")
    private Long id;
    @NotNull(groups = {Save.class},message = "分公司id不能为空")
    @ApiModelProperty(value = "投放公司id(总公司或子公司),保存/更新必填")
    private Long companyId;
    @NotNull(groups = {Save.class},message = "广告位置不能为空")
    @ApiModelProperty(value = "广告位置,保存/更新必填")
    private Integer aPlace;
    @NotNull(groups = {Save.class},message = "开始时间不能为空")
    @ApiModelProperty(value = "开始时间,保存/更新必填")
    private Date aStartTime;
    @NotNull(groups = {Save.class},message = "结束时间不能为空")
    @ApiModelProperty(value = "结束时间,保存/更新必填")
    private Date aEndTime;
    @ApiModelProperty(value = "广告标题,保存/更新必填",allowableValues = "range[0,100]")
    @Length(max=100,groups = {Save.class},message = "广告标题最长为100个字")
    private String aTitle;
    @ApiModelProperty(value="外部链接")
    private String aLink;
    @Length(max=100,groups = {Save.class},message = "其他内容最长为100个字")
    @ApiModelProperty(value = "其他内容,保存/更新必填",allowableValues = "range[0,200]")
    private String aOther;
    @Length(max=200,groups = {Save.class},message ="广告说明最长200字")
    @ApiModelProperty(value = "广告说明,保存/更新必填",allowableValues = "range[0,200]")
    private String aComment;
    @NotNull(groups = {Save.class},message ="打开方式不能为空")
    @ApiModelProperty(value = "打开方式,保存/更新必填",allowableValues = "range[0,1]")
    @Min(value=0,groups = Save.class,message ="打开方式最小为0")
    @Max(value=1,groups = Save.class,message ="打开方式最大为1")
    private Integer aOpenType;
    @ApiModelProperty(value = "排序")
    private Integer aSort;
    @ApiModelProperty(value = "是否显示 0显示 1不显示")
    @Min(value=0,groups = Save.class,message ="是否显示最小为0")
    @Max(value=1,groups = Save.class,message ="是否显示最大为1")
    @NotNull(groups = {Save.class},message = "是否显示不能为空")
    private Integer aShow;
    @ApiModelProperty(value="0:有效,1:无效")
    @Min(value=0,groups = Save.class,message ="状态最小为0")
    @Max(value=1,groups = Save.class,message ="状态最大为1")
    private Integer aStatus;
    @ApiModelProperty(value = "创建时间",hidden = true)
    private Date createTime;
    @ApiModelProperty(value = "创建者",hidden = true)
    private Long createUser;
    @ApiModelProperty(value = "更新时间",hidden = true)
    private Date updateTime;
    @ApiModelProperty(value = "更新者",hidden = true)
    private Long updateUser;
    @ApiModelProperty(value = "附件url")
    @NotNull(groups = {Save.class},message = "附件url不能为空")
    private String attachUrl;

    @ApiModelProperty(value = "附件id")
    @NotNull(groups = {Update.class},message = "修改时附件id不能为空")
    private Long attachId;


    /*保存投放城市集合*/
    //@NotEmpty(groups = {Save.class})
    @ApiModelProperty(value="投放城市集合")
    @Valid
    private List<AdverAreaSaveOrUpdateVo> areaList = new ArrayList<AdverAreaSaveOrUpdateVo>();

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public Integer getaShow() {
        return aShow;
    }

    public void setaShow(Integer aShow) {
        this.aShow = aShow;
    }

    public Long getAttachId() {
        return attachId;
    }

    public void setAttachId(Long attachId) {
        this.attachId = attachId;
    }

    public String getAttachUrl() {
        return attachUrl;
    }

    public void setAttachUrl(String attachUrl) {
        this.attachUrl = attachUrl;
    }

    public List<AdverAreaSaveOrUpdateVo> getAreaList() {
        return areaList;
    }

    public void setAreaList(List<AdverAreaSaveOrUpdateVo> areaList) {
        this.areaList = areaList;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getaPlace() {
        return aPlace;
    }

    public void setaPlace(Integer aPlace) {
        this.aPlace = aPlace;
    }

    public Date getaStartTime() {
        return aStartTime;
    }

    public void setaStartTime(Date aStartTime) {
        this.aStartTime = aStartTime;
    }

    public Date getaEndTime() {
        return aEndTime;
    }

    public void setaEndTime(Date aEndTime) {
        this.aEndTime = aEndTime;
    }

    public String getaTitle() {
        return aTitle;
    }

    public void setaTitle(String aTitle) {
        this.aTitle = aTitle == null ? null : aTitle.trim();
    }

    public String getaLink() {
        return aLink;
    }

    public void setaLink(String aLink) {
        this.aLink = aLink == null ? null : aLink.trim();
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

    public Integer getaOpenType() {
        return aOpenType;
    }

    public void setaOpenType(Integer aOpenType) {
        this.aOpenType = aOpenType;
    }

    public Integer getaSort() {
        return aSort;
    }

    public void setaSort(Integer aSort) {
        this.aSort = aSort;
    }

    public Integer getaStatus() {
        return aStatus;
    }

    public void setaStatus(Integer aStatus) {
        this.aStatus = aStatus;
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
