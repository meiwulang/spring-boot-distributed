package com.jdy.b2b.api.service.Impl;

import com.jdy.b2b.api.common.BaseService;
import com.jdy.b2b.api.dao.reports.SalerCountMapper;
import com.jdy.b2b.api.model.reports.SalerCountDO;
import com.jdy.b2b.api.model.reports.SalerCountQueryDTO;
import com.jdy.b2b.api.service.SalerCountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by yangcheng on 2017/9/13.
 */
@Service
public class SalerCountServiceImpl extends BaseService implements SalerCountService{
    @Autowired
    private SalerCountMapper salerCountMapper;

    @Override
    public List<SalerCountDO> salerCountReportsList(SalerCountQueryDTO dto) {
        return salerCountMapper.salerCountReportsList(dto);
    }

    @Override
    public SalerCountDO queryAllSalerCount(SalerCountQueryDTO dto) {
        return salerCountMapper.queryAllSalerCount(dto);
    }
}
