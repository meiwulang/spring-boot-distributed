package com.jdy.b2b.api.service;

import com.jdy.b2b.api.model.personalSales.PersonalSalesList;
import com.jdy.b2b.api.model.personalSales.PersonalSalesParam;

import java.util.List;

/**
 * Created by dugq on 2017/12/18.
 */
public interface PersonalSalesService {
    List<PersonalSalesList> selectList(PersonalSalesParam param);
}
