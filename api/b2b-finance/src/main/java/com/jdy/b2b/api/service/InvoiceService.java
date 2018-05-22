package com.jdy.b2b.api.service;


import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.invoice.*;

import java.math.BigDecimal;
import java.util.List;


/**
 * Created by yangcheng on 2017/9/1.
 */
public interface InvoiceService {
    InvoiceInfoDO getInvoiceInfo(Long id);

    List<InvoiceListDO> queryInvoicePage(InvoiceQueryDTO invoice);

    int saveInvoice(Invoice invoice);

    int updateInvoice(Invoice invoice);

    int deleteInvoiceDetail(Long id);

    int saveInvoiceDetailBash(List<InvoiceDetail> list);


    //发票调用接口
    BigDecimal getInvoiceAmountTotal(List<Long> idList);

    int updateInvoiceAmount(List<Long> idList);

    int updateBash(List<InvoiceOrderDO> orderList);
}
