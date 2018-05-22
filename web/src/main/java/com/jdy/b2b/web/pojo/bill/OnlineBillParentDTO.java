package com.jdy.b2b.web.pojo.bill;

import com.jdy.b2b.web.pojo.order.Bill;
import io.swagger.annotations.ApiModel;

import java.util.List;

/**
 * Created by strict on 2017/9/1.
 */
@ApiModel(description = "在线父账单")
public class OnlineBillParentDTO extends Bill {

    private List<Bill> subBillList;

    public List<Bill> getSubBillList() {
        return subBillList;
    }

    public void setSubBillList(List<Bill> subBillList) {
        this.subBillList = subBillList;
    }
}
