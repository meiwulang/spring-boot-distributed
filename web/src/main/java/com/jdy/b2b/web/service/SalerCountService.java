package com.jdy.b2b.web.service;

import com.jdy.b2b.web.pojo.reports.BuyerCountQueryVo;
import com.jdy.b2b.web.pojo.reports.SalerCountQueryVo;
import com.jdy.b2b.web.util.ResultBean;

import java.util.Map;

/**
 * Created by yangcheng on 2017/9/12.
 */
public interface SalerCountService {
    ResultBean<Map<String,Object>> querySalerCountPage(SalerCountQueryVo vo);

}
