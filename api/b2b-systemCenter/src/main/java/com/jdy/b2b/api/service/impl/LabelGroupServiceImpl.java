package com.jdy.b2b.api.service.impl;

import com.jdy.b2b.api.common.BaseService;
import com.jdy.b2b.api.dao.labelgroup.LabelGroupMapper;
import com.jdy.b2b.api.model.labelgroup.LabelGroup;
import com.jdy.b2b.api.service.LabelGroupService;
import com.jdy.b2b.api.service.LabelService;
import com.jdy.b2b.api.vo.labelgroup.LabelGroupQueryVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by yangcheng on 2017/7/14.
 */
@Service
public class LabelGroupServiceImpl extends BaseService implements LabelGroupService {
    @Autowired
    private LabelGroupMapper labelGroupMapper;

    @Override
    public int updateLabelGroup(LabelGroup labelGroup) {
       return  labelGroupMapper.updateByPrimaryKeySelective(labelGroup);
    }

    @Override
    public int saveLabelGroup(LabelGroup labelGroup) {
        return labelGroupMapper.insert(labelGroup);
    }

    @Override
    public List<LabelGroup> queryForLabelGroupList(LabelGroup labelGroup) {
        return labelGroupMapper.queryForLabelGroupList(labelGroup);
    }
}
