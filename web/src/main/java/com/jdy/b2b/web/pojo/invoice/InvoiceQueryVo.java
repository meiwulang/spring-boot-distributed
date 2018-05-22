package com.jdy.b2b.web.pojo.invoice;


import com.jdy.b2b.web.util.BaseVO;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

import javax.validation.constraints.Min;
import java.util.Date;
@ApiModel
public class InvoiceQueryVo extends BaseVO {
    @ApiModelProperty(value="状态 0:未处理 1:已处理 2:已撤销")
    @Min(value=0,message = "")
    private Integer iStatus;
    @ApiModelProperty(value="")
    private Long iSupplierId;
    @ApiModelProperty(value="")
    private Long iBuyerId;
    @ApiModelProperty(value="")
    private Date minCreateTime;
    @ApiModelProperty(value="")
    private Date maxCreateTime;
    @ApiModelProperty(value="")
    private Date minUpdateTime;
    @ApiModelProperty(value="")
    private Date maxUpdateTime;
    @ApiModelProperty(value="")
    private String searchStr;

    public Integer getiStatus() {
        return iStatus;
    }

    public void setiStatus(Integer iStatus) {
        this.iStatus = iStatus;
    }

    public Long getiSupplierId() {
        return iSupplierId;
    }

    public void setiSupplierId(Long iSupplierId) {
        this.iSupplierId = iSupplierId;
    }

    public Long getiBuyerId() {
        return iBuyerId;
    }

    public void setiBuyerId(Long iBuyerId) {
        this.iBuyerId = iBuyerId;
    }

    public Date getMinCreateTime() {
        return minCreateTime;
    }

    public void setMinCreateTime(Date minCreateTime) {
        this.minCreateTime = minCreateTime;
    }

    public Date getMaxCreateTime() {
        return maxCreateTime;
    }

    public void setMaxCreateTime(Date maxCreateTime) {
        this.maxCreateTime = maxCreateTime;
    }

    public Date getMinUpdateTime() {
        return minUpdateTime;
    }

    public void setMinUpdateTime(Date minUpdateTime) {
        this.minUpdateTime = minUpdateTime;
    }

    public Date getMaxUpdateTime() {
        return maxUpdateTime;
    }

    public void setMaxUpdateTime(Date maxUpdateTime) {
        this.maxUpdateTime = maxUpdateTime;
    }

    public String getSearchStr() {
        return searchStr;
    }

    public void setSearchStr(String searchStr) {
        this.searchStr = searchStr;
    }
}