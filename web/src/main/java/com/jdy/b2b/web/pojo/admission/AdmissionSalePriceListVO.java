package com.jdy.b2b.web.pojo.admission;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

@ApiModel
public class AdmissionSalePriceListVO {
    @ApiModelProperty("查询分页参数：页面大小，query必填")
    @Min(1)
    private Integer pageSize;
    @ApiModelProperty(value = "查询分页参数：分页开始值，query必填", hidden = true)
    private Integer startNum;
    @ApiModelProperty("查询分页参数：当前页，query必填")
    @Min(1)
    private Integer currPage;
    @ApiModelProperty(value = "门票id")
    @NotNull
    private Long pid;
    
	public Long getPid() {
		return pid;
	}
	public void setPid(Long pid) {
		this.pid = pid;
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
	public Integer getCurrPage() {
		return currPage;
	}
	public void setCurrPage(Integer currPage) {
		this.currPage = currPage;
	}
	public void calc() {
		currPage = currPage > 0 ? currPage - 1 : 0;
		startNum = currPage * pageSize;
		if (startNum < 0) {
			startNum = 0;
		}
	}
}