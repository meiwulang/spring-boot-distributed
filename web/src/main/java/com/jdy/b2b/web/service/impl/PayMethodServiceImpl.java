package com.jdy.b2b.web.service.impl;

import com.github.pagehelper.PageInfo;
import com.jdy.b2b.web.pojo.reports.PayMethodQueryVo;
import com.jdy.b2b.web.pojo.reports.PayMethodResultDO;
import com.jdy.b2b.web.service.PayMethodService;
import com.jdy.b2b.web.util.BaseService;
import com.jdy.b2b.web.util.ResultBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by yangcheng on 2017/9/18.
 */
@Service
public class PayMethodServiceImpl extends BaseService implements PayMethodService {
    @Autowired
    private PayMethodService payMethodService;


    @Override
    public ResultBean<PageInfo<PayMethodResultDO>> queryPayMethodPage(PayMethodQueryVo vo) {
        StringBuffer url = new StringBuffer(reportsCenterUrl).append("payMethod/list");
        return restTemplate.postForEntity(url.toString(),vo, ResultBean.class).getBody();
    }
}
