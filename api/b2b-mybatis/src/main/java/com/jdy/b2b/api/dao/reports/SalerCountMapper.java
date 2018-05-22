package com.jdy.b2b.api.dao.reports;

import com.jdy.b2b.api.model.reports.BuyerCountDO;
import com.jdy.b2b.api.model.reports.BuyerCountQueryDTO;
import com.jdy.b2b.api.model.reports.SalerCountDO;
import com.jdy.b2b.api.model.reports.SalerCountQueryDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * Created by yangcheng on 2017/9/11.
 */
@Mapper
public interface SalerCountMapper {

    List<SalerCountDO> salerCountReportsList(SalerCountQueryDTO dto);

    SalerCountDO queryAllSalerCount(SalerCountQueryDTO dto);
}
