package com.jdy.b2b.web.controll.personalSales;


import com.jdy.b2b.web.pojo.personalSales.PersonalSalesParam;
import com.jdy.b2b.web.pojo.productStatistic.ListParam;
import com.jdy.b2b.web.service.PersonalSalesService;
import com.jdy.b2b.web.service.ProductStatisticsService;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ResultBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;

/**
 * Created by dugq on 2017/12/18.
 */
@RestController
@RequestMapping("personalSales")
public class PersonalSalesStatisticsController extends BaseController{
    @Autowired
    private PersonalSalesService personalSalesService;



    @RequestMapping("list")
    public ResultBean PersonalSalesStatistics(@RequestBody PersonalSalesParam param){
        param.initDateByType();
        param.setDataLimit(getUser().getuDataLimit());
        if(param.getDataLimit() != 3){
            param.setCompanyId(getUser().getuCompanyId());
        }
        return personalSalesService.selectList(param);
    }

}
