package com.jdy.b2b.api.service;

import com.jdy.b2b.api.model.labelgroup.LabelGroup;
import com.jdy.b2b.api.vo.labelgroup.LabelGroupQueryVo;

import java.util.List;

/**
 * Created by yangcheng on 2017/7/14.
 */
public interface LabelGroupService {
    int updateLabelGroup(LabelGroup labelGroup);

    int saveLabelGroup(LabelGroup labelGroup);

    List<LabelGroup> queryForLabelGroupList(LabelGroup labelGroup);
}
