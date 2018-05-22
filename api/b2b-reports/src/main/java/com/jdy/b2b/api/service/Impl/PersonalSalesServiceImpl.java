package com.jdy.b2b.api.service.Impl;

import com.jdy.b2b.api.dao.personalSales.PersonalSalesStatisticsMapper;
import com.jdy.b2b.api.model.personalSales.PersonalSalesList;
import com.jdy.b2b.api.model.personalSales.PersonalSalesParam;
import com.jdy.b2b.api.service.PersonalSalesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

/**
 * Created by dugq on 2017/12/18.
 */
@Service
public class PersonalSalesServiceImpl implements PersonalSalesService {

    @Autowired
    private PersonalSalesStatisticsMapper personalSalesStatisticsMapper;

    @Override
    public List<PersonalSalesList> selectList(PersonalSalesParam param) {
            return personalSalesStatisticsMapper.selectList(param);
    }
}
