package com.jdy.b2b.web.service;

import com.jdy.b2b.web.pojo.bill.OnlineBillVo;
import com.jdy.b2b.web.pojo.bill.ParamDto4ExportBillList;
import com.jdy.b2b.web.util.ResultBean;

/**
 * Created by strict on 2017/9/19.
 */
public interface OnlineBillService {
    //ResultBean queryBillList()
    ResultBean queryOnlineBillList(OnlineBillVo onlineBillVo);

    ResultBean queryOnlineBill(Long id);

    ResultBean queryOnlineBillList4Export(ParamDto4ExportBillList param);
}
