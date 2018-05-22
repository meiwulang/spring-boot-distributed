package com.jdy.b2b.web.controll.reports;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.jdy.b2b.web.pojo.salesperformance.SalesPerformanceDTO;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ResultBean;

import java.util.Objects;

/**
 * Created by zhangfofa on 2017/11/10.
 */
@Controller
@RequestMapping("salesPerformance")
public class SalesPerformanceController extends BaseController{

    @RequestMapping("/queryDaysOfOrderAmount")
    @ResponseBody
    public ResultBean queryDaysOfOrderAmount(@RequestParam Long companyId) {
        String url = reportsCenterUrl + "salesPerformance/queryDaysOfOrderAmount";
        return restTemplate.postForEntity(url, companyId, ResultBean.class).getBody();
    }

    @RequestMapping("/queryDaysOfOrderAmountByDepartmentId")
    @ResponseBody
    public ResultBean queryDaysOfOrderAmountByDepartmentId(@RequestParam Long departmentId) {
        String url = reportsCenterUrl + "salesPerformance/queryDaysOfOrderAmountByDepartmentId";
        return restTemplate.postForEntity(url, departmentId, ResultBean.class).getBody();
    }

    @RequestMapping(value = "/querySalesPerformanceBySystemAndDateType")
    @ResponseBody
    public ResultBean querySalesPerformanceBySystemAndDateType(@RequestBody SalesPerformanceDTO salesPerformanceDTO) {
        String url = reportsCenterUrl + "salesPerformance/querySalesPerformanceByIdAndDateType";
        salesPerformanceDTO.setDataLevel(0);
        return restTemplate.postForObject(url, salesPerformanceDTO, ResultBean.class);
    }

    @RequestMapping(value = "/querySalesPerformanceByCompanyIdAndDateType")
    @ResponseBody
    public ResultBean querySalesPerformanceByCompanyIdAndDateType(@RequestBody SalesPerformanceDTO salesPerformanceDTO) {
        String url = reportsCenterUrl + "salesPerformance/querySalesPerformanceByIdAndDateType";
        salesPerformanceDTO.setDataLevel(1);
        if(Objects.equals(salesPerformanceDTO.getId(), null)) {
            salesPerformanceDTO.setId(salesPerformanceDTO.getPcompanyId());
        }
        return restTemplate.postForObject(url, salesPerformanceDTO, ResultBean.class);
    }

    @RequestMapping(value = "/querySalesPerformanceByDepartmentIdAndDateType")
    @ResponseBody
    public ResultBean querySalesPerformanceByDepartmentIdAndDateType(@RequestBody SalesPerformanceDTO salesPerformanceDTO) {
        String url = reportsCenterUrl + "salesPerformance/querySalesPerformanceByIdAndDateType";
        if(salesPerformanceDTO.getDataLevel() != null && salesPerformanceDTO.getDataLevel().intValue() == 0) {
            return restTemplate.postForObject(url, salesPerformanceDTO, ResultBean.class);
        }
        salesPerformanceDTO.setDataLevel(2);
        if(Objects.equals(salesPerformanceDTO.getId(), null)) {
            salesPerformanceDTO.setId(salesPerformanceDTO.getPuDepartmentId());
        }
        return restTemplate.postForObject(url, salesPerformanceDTO, ResultBean.class);
    }

    @RequestMapping(value = "/querySalesPerformanceByUserIdAndDateType")
    @ResponseBody
    public ResultBean querySalesPerformanceByUserIdAndDateType(@RequestBody SalesPerformanceDTO salesPerformanceDTO) {
        String url = reportsCenterUrl + "salesPerformance/querySalesPerformanceByIdAndDateType";
        salesPerformanceDTO.setDataLevel(3);
        if(Objects.equals(salesPerformanceDTO.getId(), null)) {
            salesPerformanceDTO.setId(salesPerformanceDTO.getPuserId());
        }
        return restTemplate.postForObject(url, salesPerformanceDTO, ResultBean.class);
    }
}
