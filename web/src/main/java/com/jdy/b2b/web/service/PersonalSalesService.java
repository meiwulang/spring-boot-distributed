package com.jdy.b2b.web.service;

import com.jdy.b2b.web.pojo.personalSales.PersonalSalesParam;
import com.jdy.b2b.web.util.ResultBean;

/**
 * Created by dugq on 2017/12/18.
 */
public interface PersonalSalesService {
    ResultBean selectList(PersonalSalesParam param);
}
