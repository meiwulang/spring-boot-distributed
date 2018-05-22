package com.jdy.b2b.web.service.impl;

import com.jdy.b2b.web.pojo.personalSales.PersonalSalesParam;
import com.jdy.b2b.web.service.PersonalSalesService;
import com.jdy.b2b.web.util.BaseService;
import com.jdy.b2b.web.util.ResultBean;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

/**
 * Created by dugq on 2017/12/18.
 */
@Service
public class PersonalSalesServiceImpl extends BaseService implements PersonalSalesService {
    private String listUrl;

    @PostConstruct
    public void init(){
        listUrl = reportsCenterUrl + "personalSales/list";
    }

    @Override
    public ResultBean selectList(PersonalSalesParam param) {
        return restTemplate.postForEntity(listUrl,param, ResultBean.class).getBody();
    }
}
