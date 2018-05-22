package com.jdy.b2b.api.dao.reports;

import com.jdy.b2b.api.model.reports.BuyerCountDO;
import com.jdy.b2b.api.model.reports.BuyerCountQueryDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * Created by yangcheng on 2017/9/11.
 */
@Mapper
public interface BuyerCountMapper {

    List<BuyerCountDO> buyerCountReportsList(BuyerCountQueryDTO dto);

    BuyerCountDO queryAllBuyerCount(BuyerCountQueryDTO dto);
}
