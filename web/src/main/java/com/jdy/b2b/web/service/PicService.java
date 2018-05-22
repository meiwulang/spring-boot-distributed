package com.jdy.b2b.web.service;

import com.jdy.b2b.web.pojo.pic.PicVO;
import com.jdy.b2b.web.util.ResultBean;

import java.util.Map;

/**
 * Created by yangcheng on 2017/7/13.
 */
public interface PicService {
    ResultBean<Map<String,Object>> save(PicVO picVo);
}
