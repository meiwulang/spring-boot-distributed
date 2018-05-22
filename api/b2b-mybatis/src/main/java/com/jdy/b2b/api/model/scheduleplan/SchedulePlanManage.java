package com.jdy.b2b.api.model.scheduleplan;

/**
 * Created by yangcheng on 2017/12/5.
 */
public class SchedulePlanManage {
    private Long productId;
    private String pNO;//线路编号
    private String pName;//线路行程名称
    private String pManager;//产品经理
    private Integer pDays;//天数
    private Integer reserveNums;//预约人数合计
    private Integer payedNum;//付款人数合计
    private Integer totalNums;//合计

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getpNO() {
        return pNO;
    }

    public void setpNO(String pNO) {
        this.pNO = pNO;
    }

    public String getpName() {
        return pName;
    }

    public void setpName(String pName) {
        this.pName = pName;
    }

    public String getpManager() {
        return pManager;
    }

    public void setpManager(String pManager) {
        this.pManager = pManager;
    }

    public Integer getpDays() {
        return pDays;
    }

    public void setpDays(Integer pDays) {
        this.pDays = pDays;
    }

    public Integer getReserveNums() {
        return reserveNums;
    }

    public void setReserveNums(Integer reserveNums) {
        this.reserveNums = reserveNums;
    }

    public Integer getPayedNum() {
        return payedNum;
    }

    public void setPayedNum(Integer payedNum) {
        this.payedNum = payedNum;
    }

    public Integer getTotalNums() {
        return totalNums;
    }

    public void setTotalNums(Integer totalNums) {
        this.totalNums = totalNums;
    }
}
