package com.jdy.b2b.api.controller;

import com.jdy.b2b.api.common.OneTuple;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.common.TwoTuple;
import com.jdy.b2b.api.model.productStatistics.*;
import com.jdy.b2b.api.service.ProductStatisticsService;
import com.jdy.b2b.api.vo.neums.ProductStatisticsTypeEnum;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.*;
import java.util.function.Predicate;
import java.util.stream.Collectors;

/**
 * Created by dugq on 2017/11/16.
 */
@RestController
@RequestMapping("productStatistics")
public class ProductStatisticsController {
    @Autowired
    private ProductStatisticsService productStatisticsService;

    @RequestMapping("list")
    public ResultBean list(@RequestBody ListParam param) {
        ProductStatistics productStatistics = new ProductStatistics();
        ProductStatisticsTypeEnum productStatisticsTypeEnum = ProductStatisticsTypeEnum.ofValue(param.getDataLimit(), param.getGroupBy(), param.getFilterBy());
        List<Order4Statistics> productOrders = productStatisticsTypeEnum.getService(productStatisticsService).apply(param);
        productOrders = ProductStatisticsTypeEnum.filterByDate(productOrders,param);
        countProductPercent(productOrders,productStatistics);
        productOrders = productStatisticsTypeEnum.filter(productOrders,param);
        countOrdersSalesTourists(productOrders,productStatistics);
        productStatisticsTypeEnum.groupOrders2ProductStatistics(productOrders,productStatistics);
        ResultBean resultBean = new ResultBean("200", "SUCCESS");
        resultBean.setBody(productStatistics);
        return resultBean;
    }



    /**
     * 拼装饼图 获取前五的产品数据
     * @param orderList
     * @param productStatistics
     */
    private void countProductPercent(List<Order4Statistics> orderList, ProductStatistics productStatistics) {
        Map<Long, List<Order4Statistics>> collect = orderList.stream().collect(Collectors.groupingBy(order -> order.getProductId()));
        OneTuple<BigDecimal> totalSales = new OneTuple(new BigDecimal(0));
        PriorityQueue<TwoTuple<String, BigDecimal>> queue = new PriorityQueue<>(Comparator.comparingDouble(que -> -que.getB().doubleValue()));
        collect.forEach((key, value) -> {
            BigDecimal price = value.stream().reduce(new BigDecimal(0), (acc, order) -> acc.add(order.getPrice()), (left, right) -> {
                left.add(right);
                return left;
            });
            TwoTuple<String, BigDecimal> twoTuple = new TwoTuple<>(value.get(0).getProductName(), price);
            totalSales.setA(totalSales.getA().add(price));
            queue.add(twoTuple);
        });
        List<ProductPercent> productPercents = new ArrayList<>(6);
        List<String> names = new ArrayList<>(6);
        int i = 0;
        BigDecimal otherSales = totalSales.getA();
        int size = queue.size();
        while (i < size && i < 5) {
            TwoTuple<String, BigDecimal> twoTuple = queue.poll();
            ProductPercent percent = new ProductPercent();
            percent.setName(getSimpleString((i + 1) + "." + twoTuple.getA()));
            percent.setValue(twoTuple.getB());
            otherSales = otherSales.subtract(twoTuple.getB());
            names.add(getSimpleString((i + 1) + "." + twoTuple.getA()));
            productPercents.add(percent);
            i++;
        }
        if (size > 5) {
            names.add("其他");
            productPercents.add(new ProductPercent("其他", otherSales));
        }
        productStatistics.setChartNameArray(names);
        productStatistics.setChartObjectArray(productPercents);
    }



    private String getSimpleString(String source) {
        if (StringUtils.isBlank(source)) {
            return "";
        }
        if (source.length() > 9) {
            String s = "...";
            return source.substring(0, 9) + s;
        }
        return source;
    }

    //根据过滤条件过滤原始数据，并计算总销售量和订单数以及游客数
    private void countOrdersSalesTourists(List<Order4Statistics> orderList, ProductStatistics productStatistics) {
        TwoTuple<BigDecimal, Integer> result = new TwoTuple<>(new BigDecimal(0), 0);
        orderList.stream().forEach(order -> {
            BigDecimal sales = order.getPrice();
            if (Objects.isNull(sales))
                order.setPrice(new BigDecimal(0));
            result.setA(result.getA().add(order.getPrice()));
            result.setB(result.getB() + order.getTouristNum());
        });
        productStatistics.setTotalSales(result.getA());
        productStatistics.setTotalOrderNum(orderList.size());
        productStatistics.setTotalTouristNum(result.getB());
    }


}

