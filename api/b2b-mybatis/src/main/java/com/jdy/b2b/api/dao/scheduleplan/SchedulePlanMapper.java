package com.jdy.b2b.api.dao.scheduleplan;

import com.jdy.b2b.api.model.scheduleplan.*;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

/**
 * Created by yangcheng on 2017/12/5.
 */
@Mapper
public interface SchedulePlanMapper {


    List<Long> queryProductList(@Param("beginDate") LocalDate beginDate,@Param("endDate") LocalDate endDate,
                                @Param("startNum") Integer startNum,@Param("pageSize")Integer pageSize,
                                @Param("companyId") Long companyId);

    List<SchedulePlanManageDO> querySchedulePlanManageList(@Param("pids") List<Long> pids,@Param("beginDate") LocalDate beginDate,@Param("endDate") LocalDate endDate);

    List<Long> queryAllProductIds(@Param("beginDate") LocalDate beginDate, @Param("endDate") LocalDate endDate,@Param("companyId") Long companyId);

    List<SchedulePlanManageCountDO> querySchedulePlanManageCountData(@Param("beginDate") LocalDate beginDate, @Param("endDate") LocalDate endDate,@Param("companyId") Long companyId,@Param("pids") List<Long> pids);

    List<SchedulePlanDO> getPlanList(@Param("trans") SchedulePlanManageDTO trans,@Param("begin") LocalDate begin,@Param("end") LocalDate end);

    List<Long> getTicketIdList(Long productId);

    Long selectSchedulePlanManageTotal(SchedulePlanManageDTO trans);

    List<SchedulePlanAllSumDO> getAllSumDOList(SchedulePlanManageDTO trans);

    List<SchedulePlanDetailQueryDO> planDetailList(SchedulePlanDetailQueryDTO trans);

    List<SchedulePlanDetailQueryDO> planDetailListReserve(SchedulePlanDetailQueryDTO trans);

    List<SchedulePlanDetailQueryDO> planDetailListPayed(SchedulePlanDetailQueryDTO trans);

    List<LocalDate> getCalendarList(@Param("productId") Long productId,@Param("startNum") Integer startNum,@Param("pageSize") Integer pageSize,
                                    @Param("beginDate") LocalDate beginDate,@Param("endDate") LocalDate endDate);

    Long queryProductCount(@Param("beginDate") LocalDate beginDate, @Param("endDate") LocalDate endDate, @Param("companyId")Long companyId);

    Long getCalendarCount(@Param("productId") Long productId, @Param("beginDate") LocalDate beginDate, @Param("endDate") LocalDate endDate);


    List<SchedulePlanExportDO> queryBeforeExport(SchedulePlanManageDTO trans);

    List<SchedulePlanExportProductCountDO> getProductCountBeforeExport(SchedulePlanManageDTO trans);

    List<SchedulePlanQueryDO> newPlanList(SchedulePlanQueryDTO trans);

    List<SchedulePlanCateExpendDO> getCateListOfEverySchedule(List<Long> ids);
}
