package com.jdy.b2b.api.model.orderRefund;

import com.github.pagehelper.PageInfo;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by yangcheng on 2017/8/29.
 */
public class OrderRefundResult {
    private PageInfo<OrderRefundResultDO> pageInfo = new PageInfo<OrderRefundResultDO>();
    private Integer countNum;
    private Integer countRefund;
    private Integer countNumNow;
    private Integer countRefundNow;
    private String flag;

    public PageInfo<OrderRefundResultDO> getPageInfo() {
        return pageInfo;
    }

    public void setPageInfo(PageInfo<OrderRefundResultDO> pageInfo) {
        this.pageInfo = pageInfo;
    }

    public Integer getCountNum() {
        return countNum;
    }

    public void setCountNum(Integer countNum) {
        this.countNum = countNum;
    }

    public Integer getCountRefund() {
        return countRefund;
    }

    public void setCountRefund(Integer countRefund) {
        this.countRefund = countRefund;
    }

    public Integer getCountNumNow() {
        return countNumNow;
    }

    public void setCountNumNow(Integer countNumNow) {
        this.countNumNow = countNumNow;
    }

    public Integer getCountRefundNow() {
        return countRefundNow;
    }

    public void setCountRefundNow(Integer countRefundNow) {
        this.countRefundNow = countRefundNow;
    }

    public String getFlag() {
        return flag;
    }

    public void setFlag(String flag) {
        this.flag = flag;
    }
}
