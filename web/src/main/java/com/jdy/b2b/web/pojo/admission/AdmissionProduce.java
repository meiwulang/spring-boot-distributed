package com.jdy.b2b.web.pojo.admission;

import com.fasterxml.jackson.annotation.JsonFormat;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.Max;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.Date;

@ApiModel
public class AdmissionProduce {
    @NotNull
    private Long id;

    @Max(value = 50,message="生产批次号:最大长度为：50")
    @NotNull
    @ApiModelProperty(value = "生产批次号:")
    private String produceNo;

    @NotNull
    @ApiModelProperty(value = "数量")
    private Integer produceNum;

    @JsonFormat(pattern="yyyy-MM-dd",timezone = "GMT+8")
    @DateTimeFormat(pattern="yyyy-MM-dd")
    @ApiModelProperty(value = "生效日期", example = "2016-01-01")
    private LocalDate lifeEndDate;

    @JsonFormat(pattern="yyyy-MM-dd",timezone = "GMT+8")
    @DateTimeFormat(pattern="yyyy-MM-dd")
    @ApiModelProperty(value = "失效日期" , example = "2016-01-01")
    private LocalDate lifeStartDate;

    @Max(value = 30,message="说明最大长度为：30")
    @NotNull
    @ApiModelProperty(value = "说明")
    private String remark;

    @NotNull
    @ApiModelProperty(value = "门票id")
    private Long pid;

    @NotNull
    @ApiModelProperty(value = "生产状态 0:正常 1:暂停 2:已删除")
    private Integer aStatus;

    @NotNull
    @ApiModelProperty(value = "销售状态 0:已上架 1:已下架")
    private Integer pStatus;

    @ApiModelProperty(value = "创建者")
    private Long createUser;

    @ApiModelProperty(value = "创建时间")
    private Date createTime;

    @ApiModelProperty(value = "更新时间")
    private Date updateTime;

    @ApiModelProperty(value = "更新者")
    private Long updateUser;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getProduceNo() {
        return produceNo;
    }

    public void setProduceNo(String produceNo) {
        this.produceNo = produceNo == null ? null : produceNo.trim();
    }

    public Integer getProduceNum() {
        return produceNum;
    }

    public void setProduceNum(Integer produceNum) {
        this.produceNum = produceNum;
    }

    public LocalDate getLifeEndDate() {
        return lifeEndDate;
    }

    public void setLifeEndDate(LocalDate lifeEndDate) {
        this.lifeEndDate = lifeEndDate;
    }

    public LocalDate getLifeStartDate() {
        return lifeStartDate;
    }

    public void setLifeStartDate(LocalDate lifeStartDate) {
        this.lifeStartDate = lifeStartDate;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark == null ? null : remark.trim();
    }

    public Long getPid() {
        return pid;
    }

    public void setPid(Long pid) {
        this.pid = pid;
    }

    public Integer getaStatus() {
        return aStatus;
    }

    public void setaStatus(Integer aStatus) {
        this.aStatus = aStatus;
    }

    public Integer getpStatus() {
        return pStatus;
    }

    public void setpStatus(Integer pStatus) {
        this.pStatus = pStatus;
    }

    public Long getCreateUser() {
        return createUser;
    }

    public void setCreateUser(Long createUser) {
        this.createUser = createUser;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
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