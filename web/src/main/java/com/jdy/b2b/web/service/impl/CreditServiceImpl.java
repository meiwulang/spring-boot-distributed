package com.jdy.b2b.web.service.impl;

import com.github.pagehelper.PageInfo;
import com.jdy.b2b.web.pojo.credit.CreditQueryVo;
import com.jdy.b2b.web.pojo.credit.CreditResultDO;
import com.jdy.b2b.web.pojo.credit.CreditSaveOrUpdateVo;
import com.jdy.b2b.web.service.CreditService;
import com.jdy.b2b.web.util.BaseService;
import com.jdy.b2b.web.util.ResultBean;
import org.springframework.stereotype.Service;

/**
 * Created by yangcheng on 2017/8/30.
 */
@Service
public class CreditServiceImpl extends BaseService implements CreditService{

    @Override
    public ResultBean<Long> saveOrUpdateCredit(CreditSaveOrUpdateVo saveOrUpdateVo) {
        StringBuffer url = new StringBuffer(financeCenterUrl).append("credit/saveOrUpdate");
        return restTemplate.postForEntity(url.toString(),saveOrUpdateVo, ResultBean.class).getBody();
    }

    @Override
    public ResultBean<PageInfo<CreditResultDO>> queryCreditPage(CreditQueryVo vo) {
        StringBuffer url = new StringBuffer(financeCenterUrl).append("credit/list");
        return restTemplate.postForEntity(url.toString(),vo, ResultBean.class).getBody();
    }
}
