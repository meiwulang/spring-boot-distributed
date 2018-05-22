package com.jdy.b2b.api.model.scheduleplan;

/**
 * Created by yangcheng on 2017/12/5.
 */
public class SchedulePlanManageDO {
    private Long productId;
    private String pNO;//线路编号
    private String pName;//线路行程名称
    private String pManager;//产品经理
    private Integer pDays;//天数
    private Integer totalNums;//人数合计
    private Integer flag;//0 待付款  1已付款

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Integer getFlag() {
        return flag;
    }

    public void setFlag(Integer flag) {
        this.flag = flag;
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

    public Integer getTotalNums() {
        return totalNums;
    }

    public void setTotalNums(Integer totalNums) {
        this.totalNums = totalNums;
    }
}
