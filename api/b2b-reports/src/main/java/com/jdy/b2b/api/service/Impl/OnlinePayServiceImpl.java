package com.jdy.b2b.api.service.Impl;

import com.jdy.b2b.api.common.BaseService;
import com.jdy.b2b.api.dao.reports.OnlinePayMapper;
import com.jdy.b2b.api.service.OnlinePayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by yangcheng on 2017/9/14.
 */
@Service
public class OnlinePayServiceImpl extends BaseService implements OnlinePayService {
    @Autowired
    private OnlinePayMapper onlinePayMapper;
}
