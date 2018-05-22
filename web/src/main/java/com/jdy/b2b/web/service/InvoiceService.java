package com.jdy.b2b.web.service;

import com.github.pagehelper.PageInfo;
import com.jdy.b2b.web.pojo.invoice.InvoiceInfoDO;
import com.jdy.b2b.web.pojo.invoice.InvoiceListDO;
import com.jdy.b2b.web.pojo.invoice.InvoiceQueryVo;
import com.jdy.b2b.web.pojo.invoice.InvoiceSaveOrUpdateVo;
import com.jdy.b2b.web.util.ResultBean;

/**
 * Created by yangcheng on 2017/9/6.
 */
public interface InvoiceService {
    ResultBean<Long> saveOrUpdateInvoice(InvoiceSaveOrUpdateVo saveOrUpdateVo);

    ResultBean<InvoiceInfoDO> getInvoiceInfo(Long id);

    ResultBean<PageInfo<InvoiceListDO>> queryInvoicePage(InvoiceQueryVo vo);

    ResultBean<Integer> deleteInvoiceAndDetail(Long id);
}
