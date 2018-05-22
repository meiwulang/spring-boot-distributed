package com.jdy.b2b.api.service;

import java.util.List;
import java.util.Map;

import com.jdy.b2b.api.model.salesperformance.SalesPerformanceDTO;

/**
 * Created by zhangfofa on 2017/11/10.
 */
public interface SalesPerformanceService {

    Map<String, List> queryDaysOfOrderAmount(Long companyId);

    Map<String, List> queryDaysOfOrderAmountByDepartmentId(Long departmentId);

    Map<String, List> querySalesPerformanceByIdAndDateType(SalesPerformanceDTO salesPerformanceDTO);
}
