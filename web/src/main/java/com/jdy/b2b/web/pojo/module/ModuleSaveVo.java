package com.jdy.b2b.web.pojo.module;


import com.jdy.b2b.web.util.BaseVO;
import com.jdy.b2b.web.util.annotations.Save;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Range;

import javax.validation.constraints.NotNull;

@ApiModel
public class ModuleSaveVo extends BaseVO {
    @ApiModelProperty(value = "模块名称")
    @NotNull(message = "模块名称不能为空")
    private String mName;
    @ApiModelProperty(value = "Class名")
    @NotNull(groups = Save.class,message = "Class名不能为空")
    private String mEnName;
    @NotNull(groups = Save.class,message = "模块类型不能为空")
    @ApiModelProperty(value = "模块类型")
    @Range(min = 0,max = 5,message = "类型最小为0,最大为5")
    private Integer mType;
    @NotNull(groups = Save.class,message = "上一级ID不能为空")
    @ApiModelProperty(value = "上一级ID 顶级模块pid为0")
    private Integer mPid;
    @NotNull(groups = Save.class,message = "请求地址不能为空")
    @ApiModelProperty(value = "请求地址")
    private String mUrl;
    @ApiModelProperty(value="排序")
    private Integer mSort;
    @ApiModelProperty(value="操作",hidden = true)
    private String mOperation;
    @ApiModelProperty(value = "图片",hidden = true)
    private String mImg;


    public String getmOperation() {
        return mOperation;
    }

    public void setmOperation(String mOperation) {
        this.mOperation = mOperation;
    }

    public Integer getmSort() {
        return mSort;
    }

    public void setmSort(Integer mSort) {
        this.mSort = mSort;
    }

    public String getmImg() {
        return mImg;
    }

    public void setmImg(String mImg) {
        this.mImg = mImg;
    }

    public String getmUrl() {
        return mUrl;
    }

    public void setmUrl(String mUrl) {
        this.mUrl = mUrl;
    }

    public String getmName() {
        return mName;
    }

    public void setmName(String mName) {
        this.mName = mName == null ? null : mName.trim();
    }

    public String getmEnName() {
        return mEnName;
    }

    public void setmEnName(String mEnName) {
        this.mEnName = mEnName == null ? null : mEnName.trim();
    }

    public Integer getmType() {
        return mType;
    }

    public void setmType(Integer mType) {
        this.mType = mType;
    }

    public Integer getmPid() {
        return mPid;
    }

    public void setmPid(Integer mPid) {
        this.mPid = mPid;
    }

}