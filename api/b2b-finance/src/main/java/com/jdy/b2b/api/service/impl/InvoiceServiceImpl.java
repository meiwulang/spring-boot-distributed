package com.jdy.b2b.api.service.impl;

import com.jdy.b2b.api.common.BaseService;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.dao.invoice.InvoiceDetailMapper;
import com.jdy.b2b.api.dao.invoice.InvoiceMapper;
import com.jdy.b2b.api.model.invoice.*;
import com.jdy.b2b.api.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

/**
 * Created by yangcheng on 2017/9/1.
 */
@Service
public class InvoiceServiceImpl extends BaseService implements InvoiceService {
    @Autowired
    private InvoiceMapper invoiceMapper;
    @Autowired
    private InvoiceDetailMapper invoiceDetailMapper;

    @Override
    public InvoiceInfoDO getInvoiceInfo(Long id) {
        return invoiceMapper.getInvoiceInfo(id);
    }

    @Override
    public List<InvoiceListDO> queryInvoicePage(InvoiceQueryDTO invoice) {
        return invoiceMapper.queryInvoicePage(invoice);
    }

    /**
     * 插入发票表
     * @param invoice
     * @return
     */
    @Override
    public int saveInvoice(Invoice invoice) {
        return invoiceMapper.insert(invoice);
    }


    @Override
    public int deleteInvoiceDetail(Long invoiceId) {
        return invoiceDetailMapper.deleteByInvoiceId(invoiceId);
    }

    @Override
    public int saveInvoiceDetailBash(List<InvoiceDetail> list) {
        return invoiceDetailMapper.saveBash(list);
    }

    @Override
    public BigDecimal getInvoiceAmountTotal(List<Long> idList) {
        return invoiceMapper.getInvoiceAmountTotal(idList);
    }

    @Override
    public int updateInvoiceAmount(List<Long> idList) {
        return invoiceMapper.updateInvoiceAmount(idList);
    }

    @Override
    public int updateBash(List<InvoiceOrderDO> orderList) {
        return invoiceMapper.updateBash(orderList);
    }

    @Override
    public int updateInvoice(Invoice invoice) {
        return invoiceMapper.updateByPrimaryKeySelective(invoice);
    }
}
