package com.jdy.b2b.api.controller;

import com.jdy.b2b.api.common.BaseController;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.common.ThreeTuple;
import com.jdy.b2b.api.common.TwoTuple;
import com.jdy.b2b.api.model.personalSales.PersonalSalesList;
import com.jdy.b2b.api.model.personalSales.PersonalSalesParam;
import com.jdy.b2b.api.model.personalSales.PersonalSalesResult;
import com.jdy.b2b.api.model.productStatistics.*;
import com.jdy.b2b.api.service.PersonalSalesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Created by dugq on 2017/12/18.
 */
@RestController
@RequestMapping("personalSales")
public class PersonalSalesStatisticsController extends BaseController{
    @Autowired
    private PersonalSalesService personalSalesService;

    @RequestMapping("list")
    @ResponseBody
    public ResultBean PersonalSalesStatistics(@RequestBody PersonalSalesParam param){
        List<PersonalSalesList> personalSalesLists = personalSalesService.selectList(param);
        if (param.getDataLimit() ==3 && Objects.isNull(param.getCompanyId()) && Objects.isNull(param.getDepartmentId())){
            return ResultBean.getSuccessResult(builderCompanyAndDepartmentList(personalSalesLists));
        }else{
            return ResultBean.getSuccessResult(new PersonalSalesResult(personalSalesLists));
        }

    }

    private ProductStatistics builderCompanyAndDepartmentList(List<PersonalSalesList> personalSalesLists) {
        ProductStatistics productStatistics = new ProductStatistics();
        countOrdersSalesTourists(personalSalesLists,productStatistics);
        List<PersonalSalesList> departmentList = personalSalesLists.stream().filter(personalSalesList -> personalSalesList.getFirstCompanyId() == 0).collect(Collectors.toList());
        List<PersonalSalesList> companyList = personalSalesLists.stream().filter(personalSalesList -> personalSalesList.getFirstCompanyId() != 0).collect(Collectors.toList());
        Map<Long, List<PersonalSalesList>> companyMap = companyList.stream().collect(Collectors.groupingBy(company -> company.getFirstCompanyId()));
        Map<Long, List<PersonalSalesList>> departmentMap = departmentList.stream().collect(Collectors.groupingBy(company -> company.getDepartmentId()));
        List<DepartmentOrder> list = new LinkedList<>();
        departmentMap.forEach((key, value) -> {
            DepartmentOrder departmentOrder = new DepartmentOrder();
            departmentOrder.setDepartmentId(key);
            departmentOrder.setDepartmentName(value.get(0).getDepartmentName());
            ThreeTuple<Integer, BigDecimal,Integer> reduce = getIntegerBigDecimalTwoTuple(value);
            departmentOrder.setTouristNum(reduce.getA());
            departmentOrder.setSales(reduce.getB());
            departmentOrder.setOrderNum(reduce.getC());
            list.add(departmentOrder);
        });
        productStatistics.setDepartmentList(list);

        List<CompanyOrder> companyOrders = new LinkedList<>();
        companyMap.forEach((key, value) -> {
            CompanyOrder companyOrder = new CompanyOrder();
            companyOrder.setCompanyId(key);
            for(PersonalSalesList order : value){
                if(order.getCompanyId().equals(key))
                    companyOrder.setCompanyName(order.getCompanyName());
            }
            ThreeTuple<Integer, BigDecimal,Integer> reduce = getIntegerBigDecimalTwoTuple(value);
            companyOrder.setTouristNum(reduce.getA());
            companyOrder.setSales(reduce.getB());
            companyOrder.setOrderNum(reduce.getC());
            companyOrders.add(companyOrder);
        });
        productStatistics.setCompanyList(companyOrders);
        List<ParentOrder> parentList = new ArrayList(list);
        parentList.addAll(companyOrders);
        parentList.sort(Comparator.comparingDouble(order->-order.getSales().doubleValue()));
        productStatistics.setList(parentList);
        return productStatistics;
    }

    private void countOrdersSalesTourists(List<PersonalSalesList> orderList, ProductStatistics productStatistics) {
        ThreeTuple<BigDecimal, Integer,Integer> result = new ThreeTuple<>(new BigDecimal(0), 0,0);
        orderList.stream().forEach(order -> {
            BigDecimal sales = order.getSales();
            if (Objects.isNull(sales))
                order.setSales(new BigDecimal(0));
            if (Objects.isNull(order.getTouristNum()))
                order.setTouristNum(0);
            if (Objects.isNull(order.getOrderNum()))
                order.setOrderNum(0);
            result.setA(result.getA().add(order.getSales()));
            result.setB(result.getB() + order.getTouristNum());
            result.setC(result.getC() + order.getOrderNum());
        });
        productStatistics.setTotalSales(result.getA());
        productStatistics.setTotalOrderNum(result.getC());
        productStatistics.setTotalTouristNum(result.getB());
    }

    protected ThreeTuple<Integer, BigDecimal,Integer> getIntegerBigDecimalTwoTuple(List<PersonalSalesList> value) {
        return value.stream().reduce(new ThreeTuple<>(0, new BigDecimal(0),0), (acc, order) -> {
                    acc.setA(acc.getA() + order.getTouristNum());
                    acc.setB(acc.getB().add(order.getSales()));
                    acc.setC(acc.getC()+order.getOrderNum());
                    return acc;
                },
                (left, right) -> {
                    left.setA(left.getA() + right.getA());
                    left.setB(left.getB().add(right.getB()));
                    left.setC(left.getC()+right.getC());
                    return left;
                });
    }
}