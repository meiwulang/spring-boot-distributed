package com.jdy.b2b.web.pojo.department;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.jdy.b2b.web.annotation.Phone;
import com.jdy.b2b.web.util.annotations.Query;
import com.jdy.b2b.web.util.annotations.Save;
import com.jdy.b2b.web.util.annotations.Update;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotBlank;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import java.io.Serializable;
import java.util.Date;
@ApiModel
public class DepartmentVo implements Serializable{
    private static final long serialVersionUID = 6612994435507770002L;


    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private  Date endDate;
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    private  Date startDate;




    @ApiModelProperty("部门id")
    @Null(message = "部门已经存在",groups = Save.class)
    @NotNull(message = "请选择部门",groups = {Update.class})
    private Long id;

    @ApiModelProperty("单位id")
    @NotNull(message = "单位不能为空")
    private Long companyId;

    @ApiModelProperty("单位父id")
    @NotNull(message = "单位父id不能为空")
    private Long dPid;

    @ApiModelProperty("部门编号")
    @NotBlank(message = "编号不可为空")
    @Length(max = 10,message = "部门编号最多10个字")
    private String dNo;

    @ApiModelProperty("部门名称")
    @NotBlank(message = "部门名称不可为空")
    @Length(max = 20,message = "部门名称最多20字")
    private String dName;

    @ApiModelProperty("电话号码")
    @Phone
    private String dPhone;

    @ApiModelProperty("传真")
    private String dFax;

    @ApiModelProperty("部门简介")
    @Length(max = 1000,message = "部门名称最多1000个字")
    private String dIntroduce;

    @ApiModelProperty("单位级别")
    @NotNull(message = "单位级别不能为空")
    private Integer dLevel;

    @ApiModelProperty("部门状态")
    private Integer dStatus;

    @ApiModelProperty("部门创建时间")
    private Date createTime;

    @ApiModelProperty("部门创建人")
    private Long createUser;

    @ApiModelProperty("部门跟新时间")
    private Date updateTime;
    @ApiModelProperty("部门跟新人")
    private Long updateUser;

    private Byte departmentType;
    private Long leader;

    public Byte getDepartmentType() {
        return departmentType;
    }

    public void setDepartmentType(Byte departmentType) {
        this.departmentType = departmentType;
    }

    public Long getLeader() {
        return leader;
    }

    public void setLeader(Long leader) {
        this.leader = leader;
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

    public Long getdPid() {
        return dPid;
    }

    public void setdPid(Long dPid) {
        this.dPid = dPid;
    }

    public String getdNo() {
        return dNo;
    }

    public void setdNo(String dNo) {
        this.dNo = dNo;
    }

    public String getdName() {
        return dName;
    }

    public void setdName(String dName) {
        this.dName = dName;
    }

    public String getdPhone() {
        return dPhone;
    }

    public void setdPhone(String dPhone) {
        this.dPhone = dPhone;
    }

    public String getdFax() {
        return dFax;
    }

    public void setdFax(String dFax) {
        this.dFax = dFax;
    }

    public String getdIntroduce() {
        return dIntroduce;
    }

    public void setdIntroduce(String dIntroduce) {
        this.dIntroduce = dIntroduce;
    }

    public Integer getdLevel() {
        return dLevel;
    }

    public void setdLevel(Integer dLevel) {
        this.dLevel = dLevel;
    }

    public Integer getdStatus() {
        return dStatus;
    }

    public void setdStatus(Integer dStatus) {
        this.dStatus = dStatus;
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

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }
}