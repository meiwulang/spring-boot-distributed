package com.jdy.b2b.api.service;

import com.jdy.b2b.api.model.reports.BuyerCountDO;
import com.jdy.b2b.api.model.reports.BuyerCountQueryDTO;
import com.jdy.b2b.api.model.reports.SalerCountDO;
import com.jdy.b2b.api.model.reports.SalerCountQueryDTO;

import java.util.List;

/**
 * Created by yangcheng on 2017/9/11.
 */
public interface SalerCountService {
    List<SalerCountDO> salerCountReportsList(SalerCountQueryDTO dto);

    SalerCountDO queryAllSalerCount(SalerCountQueryDTO dto);

}
