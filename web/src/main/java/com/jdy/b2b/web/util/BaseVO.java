package com.jdy.b2b.web.util;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.Min;

@ApiModel
public class BaseVO {
    @ApiModelProperty(value = "用户编号",hidden = true)
    private Long puserId;
    @ApiModelProperty(value = "用户真实姓名",hidden = true)
    private String pURealName;
    @ApiModelProperty(value= "用户名称",hidden = true)
    private String puAccount;
    @ApiModelProperty(value="用户所属公司id",hidden = true)
    private Long pcompanyId;
    @ApiModelProperty(value="手机号",hidden = true)
    private String puTel;
    @ApiModelProperty(value="数据级别0:用户级 1:部门级2:单位级3:系统级",hidden = true)
    private Integer puDataLimit;
    @ApiModelProperty(value="部门id",hidden = true)
    private Long puDepartmentId;
    @ApiModelProperty(value="公司名称",hidden = true)
    private String pcName;
    @ApiModelProperty(value="公司类型 0:供应商 1:分销商 2:管理公司",hidden = true)
    private Integer pcType;
    @ApiModelProperty(value="部门名称",hidden = true)
    private String pdName;
    @ApiModelProperty(value="用户角色id",hidden = true)
    private Long pRoleId;

    @ApiModelProperty("查询分页参数：当前页，query必填")
    @Min(1)
    private Integer currPage;
    @ApiModelProperty("查询分页参数：页面大小，query必填")
    @Min(1)
    private Integer pageSize;
    @ApiModelProperty(value = "查询分页参数：分页开始值，query必填", hidden = true)
    private Integer startNum;
    @ApiModelProperty(value = "当前用户stype", hidden = true)
    private Integer pStype;

    public Integer getpStype() {
        return pStype;
    }

    public void setpStype(Integer pStype) {
        this.pStype = pStype;
    }

    public Long getpRoleId() {
        return pRoleId;
    }

    public void setpRoleId(Long pRoleId) {
        this.pRoleId = pRoleId;
    }

    public String getpURealName() {
        return pURealName;
    }

    public void setpURealName(String pURealName) {
        this.pURealName = pURealName;
    }

    public Long getPcompanyId() {
        return pcompanyId;
    }

    public void setPcompanyId(Long pcompanyId) {
        this.pcompanyId = pcompanyId;
    }

    public Integer getCurrPage() {
        return currPage;
    }

    public void setCurrPage(Integer currPage) {
        this.currPage = currPage;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }

    public Integer getStartNum() {
        return startNum;
    }

    public void setStartNum(Integer startNum) {
        this.startNum = startNum;
    }

    public Long getPuserId() {
        return puserId;
    }

    public void setPuserId(Long puserId) {
        this.puserId = puserId;
    }

    public String getPuAccount() {
        return puAccount;
    }

    public void setPuAccount(String puAccount) {
        this.puAccount = puAccount;
    }

    public String getPuTel() {
        return puTel;
    }

    public void setPuTel(String puTel) {
        this.puTel = puTel;
    }

    public Long getPuDepartmentId() {
        return puDepartmentId;
    }

    public void setPuDepartmentId(Long puDepartmentId) {
        this.puDepartmentId = puDepartmentId;
    }

    public String getPcName() {
        return pcName;
    }

    public void setPcName(String pcName) {
        this.pcName = pcName;
    }

    public Integer getPcType() {
        return pcType;
    }

    public void setPcType(Integer pcType) {
        this.pcType = pcType;
    }

    public String getPdName() {
        return pdName;
    }

    public void setPdName(String pdName) {
        this.pdName = pdName;
    }

    public Integer getPuDataLimit() {
        return puDataLimit;
    }

    public void setPuDataLimit(Integer puDataLimit) {
        this.puDataLimit = puDataLimit;
    }
}
