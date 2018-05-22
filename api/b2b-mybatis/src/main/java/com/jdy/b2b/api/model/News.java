package com.jdy.b2b.api.model;

import com.jdy.b2b.api.common.BaseVO;

import java.util.Date;

public class News extends BaseVO {
    private Long id;

    private String nTitle;

    private Integer nType;

    private Boolean nRecommend;

    private Integer nStatus;

    private Integer nSort;

    private Boolean nStatusB;

    private String nKeys;

    private Date createTime;

    private Long createUser;

    private Date updateTime;

    private Long updateUser;

    private String nContent;

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

    /**
     * 0-true-发布，1-false-隐藏
     */
    public Boolean getnStatusB() {
        if (nStatus == null) {
            return null;
        }
        return nStatus.equals(0);
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