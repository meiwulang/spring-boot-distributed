package com.jdy.b2b.web.service;

import com.jdy.b2b.web.pojo.label.LabelGroup;
import com.jdy.b2b.web.pojo.label.LabelGroupQueryVo;
import com.jdy.b2b.web.pojo.label.LabelGroupSaveOrUpdateVo;
import com.jdy.b2b.web.util.ResultBean;

/**
 * Created by yangcheng on 2017/7/12.
 */
public interface LabelGroupService {

    ResultBean<LabelGroup> queryForLabelGroupById(Long id);

    ResultBean<LabelGroup> queryForLabelGroupList(LabelGroupQueryVo vo);

    ResultBean<Long> saveOrUpdateLabelGroup(LabelGroupSaveOrUpdateVo vo);
}
