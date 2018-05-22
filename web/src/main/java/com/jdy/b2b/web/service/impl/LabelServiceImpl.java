package com.jdy.b2b.web.service.impl;

import com.jdy.b2b.web.pojo.label.Label;
import com.jdy.b2b.web.pojo.label.LabelDTO;
import com.jdy.b2b.web.pojo.label.LabelQueryVo;
import com.jdy.b2b.web.pojo.label.LabelSaveOrUpdateVo;
import com.jdy.b2b.web.service.LabelService;
import com.jdy.b2b.web.util.BaseService;
import com.jdy.b2b.web.util.ResultBean;
import org.springframework.stereotype.Service;

/**
 * Created by yangcheng on 2017/7/12.
 */
@Service
public class LabelServiceImpl extends BaseService implements LabelService{
    @Override
    public ResultBean<Label> queryForLabelById(Long id) {
        StringBuffer url = new StringBuffer(systemCenterUrl).append("label/get/").append(id);
        return restTemplate.getForEntity(url.toString(),ResultBean.class).getBody();
    }

    @Override
    public ResultBean queryLabelListForPage(LabelQueryVo vo) {
        StringBuffer url = new StringBuffer(systemCenterUrl).append("label/list");
        return restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody();
    }

    @Override
    public ResultBean<Long> saveOrUpdateLabel(LabelSaveOrUpdateVo vo) {
        StringBuffer url = new StringBuffer(systemCenterUrl).append("label/saveOrUpdate");
        return restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody();
    }
}
