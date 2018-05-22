package com.jdy.b2b.web.pojo.news;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import java.util.Date;

@ApiModel(description = "资讯公告")
public class News {

    @ApiModelProperty("资讯公告ID")
    private Long id;

    @ApiModelProperty(value = "文章标题")
    private String nTitle;

    @ApiModelProperty(value = "类型1:资讯 2:公告")
    private Integer nType;

    @ApiModelProperty(value = "是否推荐0:否 1:是")
    private Boolean nRecommend;

    @ApiModelProperty(value = "状态 0:发布 1:隐藏 2:删除")
    private Integer nStatus;

    @ApiModelProperty(value = "true-发布，false-隐藏")
    private Boolean nStatusB;

    @ApiModelProperty(value = "排序(最小为1)")
    private Integer nSort;

    @ApiModelProperty(value = "关键词")
    private String nKeys;

    @ApiModelProperty(value = "内容")
    private String nContent;

    @ApiModelProperty(value = "创建时间")
    private Date createTime;

    @ApiModelProperty(value = "创建人")
    private Long createUser;

    @ApiModelProperty(value = "更新时间")
    private Date updateTime;

    @ApiModelProperty(value = "更新人")
    private Long updateUser;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getnTitle() {
        return nTitle;
    }

    public void setnTitle(String nTitle) {
        this.nTitle = nTitle == null ? null : nTitle.trim();
    }

    public Integer getnType() {
        return nType;
    }

    public void setnType(Integer nType) {
        this.nType = nType;
    }

    public Boolean getnRecommend() {
        return nRecommend;
    }

    public void setnRecommend(Boolean nRecommend) {
        this.nRecommend = nRecommend;
    }

    public Integer getnStatus() {
        return nStatus;
    }

    public void setnStatus(Integer nStatus) {
        this.nStatus = nStatus;
    }

    public Boolean getnStatusB() {
        return nStatusB;
    }

    public void setnStatusB(Boolean nStatusB) {
        this.nStatusB = nStatusB;
    }

    public Integer getnSort() {
        return nSort;
    }

    public void setnSort(Integer nSort) {
        this.nSort = nSort;
    }

    public String getnKeys() {
        return nKeys;
    }

    public void setnKeys(String nKeys) {
        this.nKeys = nKeys == null ? null : nKeys.trim();
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

    public String getnContent() {
        return nContent;
    }

    public void setnContent(String nContent) {
        this.nContent = nContent == null ? null : nContent.trim();
    }
}