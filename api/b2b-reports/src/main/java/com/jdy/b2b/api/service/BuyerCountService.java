package com.jdy.b2b.api.service;

import com.jdy.b2b.api.model.reports.BuyerCountDO;
import com.jdy.b2b.api.model.reports.BuyerCountQueryDTO;

import java.util.List;

/**
 * Created by yangcheng on 2017/9/11.
 */
public interface BuyerCountService {
    List<BuyerCountDO> buyerCountReportsList(BuyerCountQueryDTO dto);

    BuyerCountDO queryAllBuyerCount(BuyerCountQueryDTO dto);

}
