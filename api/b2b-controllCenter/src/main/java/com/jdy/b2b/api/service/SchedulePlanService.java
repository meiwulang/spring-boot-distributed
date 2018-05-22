package com.jdy.b2b.api.service;

import com.jdy.b2b.api.model.scheduleplan.*;

import java.util.List;
import java.util.Map;

/**
 * Created by yangcheng on 2017/12/5.
 */
public interface SchedulePlanService {
    SchedulePlanManageResult querySchedulePlanManageList(SchedulePlanManageDTO trans);

    List<SchedulePlanExportDO> queryBeforeExport(SchedulePlanManageDTO trans);

    SchedulePlanResult getPlanList(SchedulePlanManageDTO trans);

    List<SchedulePlanDetailQueryDO> planDetailList(SchedulePlanDetailQueryDTO trans);

    Map<String,Integer> getProductCountBeforeExport(SchedulePlanManageDTO trans);

    SchedulePlanNewResult newPlanList(SchedulePlanQueryDTO trans);
}
