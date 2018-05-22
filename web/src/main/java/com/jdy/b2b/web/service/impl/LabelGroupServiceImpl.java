package com.jdy.b2b.web.service.impl;

import com.jdy.b2b.web.pojo.label.LabelGroup;
import com.jdy.b2b.web.pojo.label.LabelGroupQueryVo;
import com.jdy.b2b.web.pojo.label.LabelGroupSaveOrUpdateVo;
import com.jdy.b2b.web.service.LabelGroupService;
import com.jdy.b2b.web.util.BaseService;
import com.jdy.b2b.web.util.ResultBean;
import org.springframework.stereotype.Service;

/**
 * Created by yangcheng on 2017/7/12.
 */
@Service
public class LabelGroupServiceImpl extends BaseService implements LabelGroupService{
    @Override
    public ResultBean<LabelGroup> queryForLabelGroupById(Long id) {
        StringBuffer url = new StringBuffer(systemCenterUrl).append("label_group/get/").append(id);
        return restTemplate.getForEntity(url.toString(),ResultBean.class).getBody();
    }

    @Override
    public ResultBean<LabelGroup> queryForLabelGroupList(LabelGroupQueryVo vo) {
        StringBuffer url = new StringBuffer(systemCenterUrl).append("label_group/list");
        return restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody();
    }

    @Override
    public ResultBean<Long> saveOrUpdateLabelGroup(LabelGroupSaveOrUpdateVo vo) {
        StringBuffer url = new StringBuffer(systemCenterUrl).append("label_group/saveOrUpdate");
        return restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody();
    }
}
