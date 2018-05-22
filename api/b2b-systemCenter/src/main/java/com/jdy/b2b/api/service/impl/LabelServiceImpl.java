package com.jdy.b2b.api.service.impl;

import com.jdy.b2b.api.common.BaseService;
import com.jdy.b2b.api.dao.label.LabelMapper;
import com.jdy.b2b.api.model.label.Label;
import com.jdy.b2b.api.model.label.LabelDTO;
import com.jdy.b2b.api.service.LabelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by yangcheng on 2017/7/6.
 */
@Service
public class LabelServiceImpl extends BaseService implements LabelService{
@Autowired
private LabelMapper labelMapper;

    @Override
    public List<LabelDTO> getLabelListForPage(Label label) {
        return labelMapper.queryLabelListForPage(label);
    }

    @Override
    public int updateLabel(Label label) {
        return labelMapper.updateByPrimaryKeySelective(label);
    }

    @Override
    public int saveLabel(Label label) {
        return labelMapper.insert(label);
    }

    @Override
    public Label queryForLabelById(Long id) {
        return labelMapper.selectByPrimaryKey(id);
    }
}
