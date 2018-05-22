package com.jdy.b2b.web.service.impl;

import com.github.pagehelper.PageInfo;
import com.jdy.b2b.web.pojo.invoice.InvoiceInfoDO;
import com.jdy.b2b.web.pojo.invoice.InvoiceListDO;
import com.jdy.b2b.web.pojo.invoice.InvoiceQueryVo;
import com.jdy.b2b.web.pojo.invoice.InvoiceSaveOrUpdateVo;
import com.jdy.b2b.web.service.InvoiceService;
import com.jdy.b2b.web.util.BaseService;
import com.jdy.b2b.web.util.ResultBean;
import org.springframework.stereotype.Service;

/**
 * Created by yangcheng on 2017/9/6.
 */
@Service
public class InvoiceServiceImpl extends BaseService implements InvoiceService {

    @Override
    public ResultBean<Long> saveOrUpdateInvoice(InvoiceSaveOrUpdateVo saveOrUpdateVo) {
        StringBuffer url = new StringBuffer(financeCenterUrl).append("invoice/saveOrUpdate");
        return restTemplate.postForEntity(url.toString(), saveOrUpdateVo, ResultBean.class).getBody();
    }

    @Override
    public ResultBean<InvoiceInfoDO> getInvoiceInfo(Long id) {
        StringBuffer url = new StringBuffer(financeCenterUrl).append("invoice/get/").append(id);
        return restTemplate.getForEntity(url.toString(),  ResultBean.class).getBody();
    }

    @Override
    public ResultBean<PageInfo<InvoiceListDO>> queryInvoicePage(InvoiceQueryVo vo) {
        StringBuffer url = new StringBuffer(financeCenterUrl).append("invoice/list");
        return restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody();
    }

    @Override
    public ResultBean<Integer> deleteInvoiceAndDetail(Long id) {
        StringBuffer url = new StringBuffer(financeCenterUrl).append("invoice/deleteDetail/").append(id);
        return restTemplate.getForEntity(url.toString(),  ResultBean.class).getBody();
    }
}
