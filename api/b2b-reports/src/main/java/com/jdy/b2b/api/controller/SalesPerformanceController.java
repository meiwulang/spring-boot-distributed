package com.jdy.b2b.api.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.salesperformance.SalesPerformanceDTO;
import com.jdy.b2b.api.service.SalesPerformanceService;

/**
 * Created by zhangfofa on 2017/11/10.
 */
@Controller
@RequestMapping("salesPerformance")
public class SalesPerformanceController {

    @Autowired
    private SalesPerformanceService salesPerformanceService;


    @RequestMapping("/queryDaysOfOrderAmount")
    @ResponseBody
    public ResultBean<Map<String, List>> queryDaysOfOrderAmount(@RequestBody Long companyId) {
        Map<String, List> resultMap = salesPerformanceService.queryDaysOfOrderAmount(companyId);
        return ResultBean.getIndexSuccessResult(resultMap);
    }

    @RequestMapping("/queryDaysOfOrderAmountByDepartmentId")
    @ResponseBody
    public ResultBean<Map<String, List>> queryDaysOfOrderAmountByDepartmentId(@RequestBody Long departmentId) {
        Map<String, List> resultMap = salesPerformanceService.queryDaysOfOrderAmountByDepartmentId(departmentId);
        return ResultBean.getIndexSuccessResult(resultMap);
    }

    @RequestMapping("/querySalesPerformanceByIdAndDateType")
    @ResponseBody
    public ResultBean<Map<String, List>> querySalesPerformanceByIdAndDateType(@RequestBody SalesPerformanceDTO salesPerformanceDTO) {
        Map<String, List> resultMap = salesPerformanceService.querySalesPerformanceByIdAndDateType(salesPerformanceDTO);
        return ResultBean.getIndexSuccessResult(resultMap);
    }
}
