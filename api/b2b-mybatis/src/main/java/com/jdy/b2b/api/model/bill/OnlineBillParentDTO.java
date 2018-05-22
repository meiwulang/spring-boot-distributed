package com.jdy.b2b.api.model.bill;

import java.util.List;

/**
 * Created by strict on 2017/9/1.
 */
public class OnlineBillParentDTO extends Bill {
    private List<Bill> subBillList;

    public List<Bill> getSubBillList() {
        return subBillList;
    }

    public void setSubBillList(List<Bill> subBillList) {
        this.subBillList = subBillList;
    }
}
