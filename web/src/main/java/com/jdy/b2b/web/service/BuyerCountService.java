package com.jdy.b2b.web.service;

import com.github.pagehelper.PageInfo;
import com.jdy.b2b.web.pojo.reports.BuyerCountDO;
import com.jdy.b2b.web.pojo.reports.BuyerCountQueryVo;
import com.jdy.b2b.web.util.ResultBean;

import java.util.Map;

/**
 * Created by yangcheng on 2017/9/12.
 */
public interface BuyerCountService {
    ResultBean<Map<String,Object>> queryBuyerCountPage(BuyerCountQueryVo vo);
}
