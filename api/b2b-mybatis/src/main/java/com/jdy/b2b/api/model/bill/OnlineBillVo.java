package com.jdy.b2b.api.model.bill;

/**
 * 应收在线账单搜索入参类
 * Created by guyong on 2017/8/30.
 */
public class OnlineBillVo extends Bill{
    private String createTimeS;
    private String createTimeE;

    public String getCreateTimeE() {
        return createTimeE;
    }

    public void setCreateTimeE(String createTimeE) {
        this.createTimeE = createTimeE;
    }

    public String getCreateTimeS() {
        return createTimeS;
    }

    public void setCreateTimeS(String createTimeS) {
        this.createTimeS = createTimeS;
    }
}
