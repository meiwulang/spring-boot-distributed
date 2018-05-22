package com.jdy.b2b.api.vo.neums;

import com.jdy.b2b.api.common.TwoTuple;
import com.jdy.b2b.api.model.productStatistics.*;
import com.jdy.b2b.api.service.ProductStatisticsService;

import java.math.BigDecimal;
import java.util.*;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;

/**
 * Created by dugq on 2017/12/13.
 */
public enum ProductStatisticsTypeEnum {
    ADMIN_PRODUCT(3,0,0),
    ADMIN_COMPANY_PRODUCT(3,3,1),
    ADMIN_COMPANY(3,3,0),
    ADMIN_AGENT_PRODUCT(3,2,1),
    ADMIN_DEPARTMENT_AGENT_PRODUCT(3,12,1),

    COMPANY_PRODUCT(2,0,0),
    COMPANY_DEPARTMENT_AGENT_PRODUCT(2,12,1),

    DEPARTMENT_PRODUCT(1,0,0),
    DEPARTMENT_AGENT_PRODUCT(1,2,1),

    AGENT_PRODUCT(0,0,0);
    //数据级别0:用户级 1:部门级2:单位级3:系统级
    private int datalimit;
    //分组条件  0：产品  1：部门 2：人员（销售经理） 3:单位   12:组合1和2（需要两组数据）
    private int groupByCondition;
    //过滤条件（由上级选择进入详情时附加的条件）：0：无 1：产品id
    private int filterCondition;

    ProductStatisticsTypeEnum(int datalimit, int groupBy,int filterCondition) {
        this.datalimit = datalimit;
        this.groupByCondition = groupBy;
        this.filterCondition = filterCondition;
    }

    public int getDatalimit() {
        return datalimit;
    }

    public int getGroupByCondition() {
        return groupByCondition;
    }

    public int getFilterCondition() {
        return filterCondition;
    }

    public Function<ListParam,List<Order4Statistics>> getService(ProductStatisticsService productStatisticsService){
        switch (this.datalimit){
            case 0:
                return productStatisticsService::selectOrderListByAgent;
            case 1:
                return productStatisticsService::selectOrderListByDepartment;
            case 2:
                return productStatisticsService::selectOrderListByCompany;
            case 3:
                return productStatisticsService::selectOrderList;
            default: throw new RuntimeException("....");
        }
    }

    public static ProductStatisticsTypeEnum ofValue(int dataLimit, int groupBy,int filterCondition){
        for(ProductStatisticsTypeEnum tableType : ProductStatisticsTypeEnum.values()){
            if(tableType.getDatalimit() == dataLimit && tableType.getFilterCondition() == filterCondition && tableType.getGroupByCondition() == groupBy){
                return tableType;
            }
        }
        throw new RuntimeException("no such ProductStatisticsTypeEnum:"+dataLimit+":"+groupBy+"："+filterCondition);
    }

    public static List<Order4Statistics> filterByDate(List<Order4Statistics> order4StatisticsList,ListParam param){
        if(Objects.isNull(param.getStartDate())){
            return order4StatisticsList;
        }
        Predicate<Order4Statistics> order4StatisticsPredicate = order4Statistics -> order4Statistics.isDateInRange(param.getStartDate(),param.getEndDate());
        return order4StatisticsList.stream().filter(order4StatisticsPredicate).collect(Collectors.toList());
    }

    public List<Order4Statistics> filter(List<Order4Statistics> order4StatisticsList,ListParam param){
        if(this.filterCondition!=1){
            return order4StatisticsList;
        }
        Predicate<Order4Statistics> order4StatisticsPredicate = order4Statistics ->  Objects.equals(order4Statistics.getProductId(), param.getProductId());
        return order4StatisticsList.stream().filter(order4StatisticsPredicate).collect(Collectors.toList());
    }

    public void groupOrders2ProductStatistics(List<Order4Statistics> productOrders, ProductStatistics productStatistics) {
        switch (this.groupByCondition){
            case 0:
                buliderProductList(productOrders, productStatistics);
                break;
            case 1:
                builderDepartmentList(productOrders, productStatistics);
                break;
            case 2:
                builderAgentList(productOrders, productStatistics);
                break;
            case 12:
                builderDepartmentList(productOrders, productStatistics);
                builderAgentList(productOrders, productStatistics);
                break;
            case 3:
                builderCompanyAndDepartmentList(productOrders, productStatistics);
                break;
            default: throw new RuntimeException("....");
        }


    }

    private void builderCompanyAndDepartmentList(List<Order4Statistics> productOrders, ProductStatistics productStatistics){
        List<Order4Statistics> departmentList = productOrders.stream().filter(productOrder -> productOrder.getFirstCompanyId() == 0).collect(Collectors.toList());
        builderDepartmentList(departmentList,productStatistics);
        builderFirstCompanyList(productOrders,productStatistics);
        List<ParentOrder> parentList = new ArrayList<>( productStatistics.getCompanyList());
        parentList.addAll(productStatistics.getDepartmentList());
        parentList.sort(Comparator.comparingDouble(parentOrder->-parentOrder.getSales().doubleValue()));
        productStatistics.setList(parentList);

    }

    private void builderFirstCompanyList(List<Order4Statistics> productOrders, ProductStatistics productStatistics){
        List<Order4Statistics> orderList = productOrders.stream().filter(productOrder -> productOrder.getFirstCompanyId() != 0).collect(Collectors.toList());
        Map<Long, List<Order4Statistics>> collect2 = orderList.stream().collect(Collectors.groupingBy(order -> order.getFirstCompanyId()));
        List<CompanyOrder> companyOrders = new LinkedList<>();
        collect2.forEach((key, value) -> {
            CompanyOrder companyOrder = new CompanyOrder();
            companyOrder.setCompanyId(key);
            for(Order4Statistics order : value){
                if(order.getCompanyId().equals(key))
                    companyOrder.setCompanyName(order.getCompanyName());
            }
            companyOrder.setOrderNum(value.size());
            TwoTuple<Integer, BigDecimal> reduce = getIntegerBigDecimalTwoTuple(value);
            companyOrder.setTouristNum(reduce.getA());
            companyOrder.setSales(reduce.getB());
            companyOrders.add(companyOrder);
        });
        companyOrders.sort(Comparator.comparingDouble(agentOrder->-agentOrder.getSales().doubleValue()));
        productStatistics.setCompanyList(companyOrders);

    }

    private void builderAgentList(List<Order4Statistics> productOrders, ProductStatistics productStatistics) {
        Map<Long, List<Order4Statistics>> collect2 = productOrders.stream().collect(Collectors.groupingBy(order -> order.getAgentId()));
        List<AgentOrder> agentList = new LinkedList<>();
        collect2.forEach((key, value) -> {
            Order4Statistics statistics = value.get(0);
            AgentOrder agentOrder = new AgentOrder();
            agentOrder.setAgentId(key);
            agentOrder.setAgentName(statistics.getAgentName());
            agentOrder.setDepartmentName(statistics.getDepartmentName());
            agentOrder.setOrderNum(value.size());
            TwoTuple<Integer, BigDecimal> reduce = getIntegerBigDecimalTwoTuple(value);
            agentOrder.setTouristNum(reduce.getA());
            agentOrder.setSales(reduce.getB());
            agentList.add(agentOrder);
        });
        agentList.sort(Comparator.comparingDouble(agentOrder->-agentOrder.getSales().doubleValue()));
        productStatistics.setAgentList(agentList);
    }

    private void builderDepartmentList(List<Order4Statistics> productOrders, ProductStatistics productStatistics) {
        Map<Long, List<Order4Statistics>> collect = productOrders.stream().collect(Collectors.groupingBy(order -> order.getDepartmentId()));
        List<DepartmentOrder> list = new LinkedList<>();
        collect.forEach((key, value) -> {
            DepartmentOrder departmentOrder = new DepartmentOrder();
            departmentOrder.setDepartmentId(key);
            departmentOrder.setDepartmentName(value.get(0).getDepartmentName());
            departmentOrder.setOrderNum(value.size());
            TwoTuple<Integer, BigDecimal> reduce = getIntegerBigDecimalTwoTuple(value);
            departmentOrder.setTouristNum(reduce.getA());
            departmentOrder.setSales(reduce.getB());
            list.add(departmentOrder);
        });
        list.sort(Comparator.comparingDouble(departmentOrder->-departmentOrder.getSales().doubleValue()));
        productStatistics.setDepartmentList(list);
    }

    private void buliderProductList(List<Order4Statistics> productOrders, ProductStatistics productStatistics) {
        Map<Long, List<Order4Statistics>> productCollect = productOrders.stream().collect(Collectors.groupingBy(order -> order.getProductId()));
        List<ProductOrder> productList = new LinkedList<>();
        productCollect.forEach((key, value) -> {
            ProductOrder productOrder = new ProductOrder();
            productOrder.setProductId(value.get(0).getProductId());
            productOrder.setProductName(value.get(0).getProductName());
            TwoTuple<Integer, BigDecimal> reduce = getIntegerBigDecimalTwoTuple(value);
            productOrder.setTouristNum(reduce.getA());
            productOrder.setSales(reduce.getB());
            productOrder.setOrderNum(value.size());
            productList.add(productOrder);
        });
        productList.sort(Comparator.comparingDouble(productOrder->-productOrder.getSales().doubleValue()));
        productStatistics.setProductList(productList);
    }

    protected TwoTuple<Integer, BigDecimal> getIntegerBigDecimalTwoTuple(List<Order4Statistics> value) {
        return value.stream().reduce(new TwoTuple<>(0, new BigDecimal(0)), (acc, order) -> {
                    acc.setA(acc.getA() + order.getTouristNum());
                    acc.setB(acc.getB().add(order.getPrice()));
                    return acc;
                },
                (left, right) -> {
                    left.setA(left.getA() + right.getA());
                    left.setB(left.getB().add(right.getB()));
                    return left;
                });
    }
}
