package com.jdy.b2b.web.service;

import com.jdy.b2b.web.pojo.label.Label;
import com.jdy.b2b.web.pojo.label.LabelDTO;
import com.jdy.b2b.web.pojo.label.LabelQueryVo;
import com.jdy.b2b.web.pojo.label.LabelSaveOrUpdateVo;
import com.jdy.b2b.web.util.ResultBean;


/**
 * Created by yangcheng on 2017/7/12.
 */
public interface LabelService {

    ResultBean<Label> queryForLabelById(Long id);

    ResultBean queryLabelListForPage(LabelQueryVo vo);

    ResultBean<Long> saveOrUpdateLabel(LabelSaveOrUpdateVo vo);

}
