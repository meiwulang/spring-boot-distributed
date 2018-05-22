package com.jdy.b2b.api.service.Impl;

import com.jdy.b2b.api.common.BaseService;
import com.jdy.b2b.api.dao.reports.BuyerCountMapper;
import com.jdy.b2b.api.model.reports.BuyerCountDO;
import com.jdy.b2b.api.model.reports.BuyerCountQueryDTO;
import com.jdy.b2b.api.service.BuyerCountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by yangcheng on 2017/9/11.
 */
@Service
public class BuyerServiceImpl extends BaseService implements BuyerCountService{
    @Autowired
    private BuyerCountMapper buyerCountMapper;

    @Override
    public List<BuyerCountDO> buyerCountReportsList(BuyerCountQueryDTO dto) {
        return buyerCountMapper.buyerCountReportsList(dto);
    }

    @Override
    public BuyerCountDO queryAllBuyerCount(BuyerCountQueryDTO dto) {
        return buyerCountMapper.queryAllBuyerCount(dto);
    }
}
