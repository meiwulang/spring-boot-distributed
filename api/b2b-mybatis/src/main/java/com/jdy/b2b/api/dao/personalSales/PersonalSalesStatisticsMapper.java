package com.jdy.b2b.api.dao.personalSales;

import com.jdy.b2b.api.model.personalSales.PersonalSalesList;
import com.jdy.b2b.api.model.personalSales.PersonalSalesParam;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * Created by dugq on 2017/12/18.
 */
@Mapper
public interface PersonalSalesStatisticsMapper {
    List<PersonalSalesList> selectList(PersonalSalesParam param);
}
