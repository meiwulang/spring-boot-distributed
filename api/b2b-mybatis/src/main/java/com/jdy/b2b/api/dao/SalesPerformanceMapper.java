package com.jdy.b2b.api.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.jdy.b2b.api.model.salesperformance.SalesPerformanceDTO;

/**
 * Created by zhangfofa on 2017/11/10.
 */
@Mapper
public interface SalesPerformanceMapper {

    List<Map> selectDaysOfOrderAmount(@Param("companyId") Long companyId);

    List<Map> selectDaysOfOrderAmountByDepartmentId(@Param("departmentId") Long departmentId);

    List<Map> selectSalesPerformanceByIdAndDateType(SalesPerformanceDTO salesPerformanceDTO);

    List<Map> selectIdListByPid(@Param("openIds") List<String> openIds);

    String selectPidById(@Param("id") Long id);
}
