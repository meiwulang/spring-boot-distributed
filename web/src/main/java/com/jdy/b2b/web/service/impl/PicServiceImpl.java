package com.jdy.b2b.web.service.impl;

import com.jdy.b2b.web.pojo.pic.PicVO;
import com.jdy.b2b.web.service.PicService;
import com.jdy.b2b.web.util.BaseService;
import com.jdy.b2b.web.util.ResultBean;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * Created by yangcheng on 2017/7/13.
 */
@Service
public class PicServiceImpl extends BaseService implements PicService{
    @Override
    public ResultBean<Map<String, Object>> save(PicVO picVo) {
        StringBuffer attachUrl = new StringBuffer(controllCenterUrl).append("Pic/upload_pic");
        ResultBean<Map<String, Object>> atresult = restTemplate.postForEntity(attachUrl.toString(), picVo, ResultBean.class).getBody();
        return atresult;
    }
}
