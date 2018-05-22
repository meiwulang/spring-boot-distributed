package com.jdy.b2b.web.service;

import com.github.pagehelper.PageInfo;
import com.jdy.b2b.web.pojo.reports.PayMethodQueryVo;
import com.jdy.b2b.web.pojo.reports.PayMethodResultDO;
import com.jdy.b2b.web.util.ResultBean;

/**
 * Created by yangcheng on 2017/9/18.
 */
public interface PayMethodService {
    ResultBean<PageInfo<PayMethodResultDO>> queryPayMethodPage(PayMethodQueryVo vo);
}
