package com.jdy.b2b.web.service;

import com.jdy.b2b.web.pojo.reports.ProductCountQueryVo;
import com.jdy.b2b.web.util.ResultBean;

import java.util.Map;

/**
 * Created by yangcheng on 2017/9/14.
 */
public interface ProductCountService {
    ResultBean<Map<String,Object>> queryProductCountPage(ProductCountQueryVo vo);
}
