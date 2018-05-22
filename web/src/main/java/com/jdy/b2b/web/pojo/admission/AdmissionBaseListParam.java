package com.jdy.b2b.web.pojo.admission;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/**
 * Created by dugq on 2018/4/17.
 */
@ApiModel("门票列表搜索条件")
public class AdmissionBaseListParam {

    @ApiModelProperty("门票类型 1：成人票 0： 儿童票")
    private Byte admissionType;

    @ApiModelProperty("搜索字符串")
    private String searchString;

    @ApiModelProperty("分页的当前页")
    private Integer pageIndex;

    @ApiModelProperty(value = "0:未提交列表  1：已提交列表  [1,0]:待申报列表 2：已完成列表  3：入库（未上架）列表   4：已上架（销售中列表） [3,4]:已入库列表（库存全部列表）",example = "[1,2]")
    private Byte[] status;


    public Byte[] getStatus() {
        return status;
    }

    public void setStatus(Byte[] status) {
        this.status = status;
    }

    public Integer getPageIndex() {
        return pageIndex;
    }

    public void setPageIndex(Integer pageIndex) {
        this.pageIndex = pageIndex;
    }

    public Byte getAdmissionType() {
        return admissionType;
    }

    public void setAdmissionType(Byte admissionType) {
        this.admissionType = admissionType;
    }

    public String getSearchString() {
        return searchString;
    }

    public void setSearchString(String searchString) {
        this.searchString = searchString;
    }
}
