package com.jdy.b2b.web.service.impl;

import com.jdy.b2b.web.pojo.reports.BuyerCountQueryVo;
import com.jdy.b2b.web.pojo.reports.SalerCountQueryVo;
import com.jdy.b2b.web.service.BuyerCountService;
import com.jdy.b2b.web.service.SalerCountService;
import com.jdy.b2b.web.util.BaseService;
import com.jdy.b2b.web.util.ResultBean;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Created by yangcheng on 2017/9/12.
 */
@Service
public class SalerCountServiceImpl extends BaseService implements SalerCountService {

    @Override
    public ResultBean<Map<String, Object>> querySalerCountPage(SalerCountQueryVo vo) {
        StringBuffer url = new StringBuffer(reportsCenterUrl).append("salerCount/list");
        return restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody();
    }

}
