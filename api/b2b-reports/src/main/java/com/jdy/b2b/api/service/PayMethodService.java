package com.jdy.b2b.api.service;

import com.jdy.b2b.api.model.reports.PayMethodQueryDO;
import com.jdy.b2b.api.model.reports.PayMethodQueryDTO;
import com.jdy.b2b.api.vo.PayMethodResultDO;

import java.util.List;

/**
 * Created by yangcheng on 2017/9/18.
 */
public interface PayMethodService {
    List<PayMethodResultDO> queryPayMethodList(PayMethodQueryDTO trans);
}
