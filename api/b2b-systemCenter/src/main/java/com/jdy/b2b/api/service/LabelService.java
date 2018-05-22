package com.jdy.b2b.api.service;


import com.jdy.b2b.api.model.label.Label;
import com.jdy.b2b.api.model.label.LabelDTO;

import java.util.List;

/**
 * Created by yangcheng on 2017/7/6.
 */
public interface LabelService {
    List<LabelDTO> getLabelListForPage(Label label);

    int updateLabel(Label label);

    int saveLabel(Label label);

    Label queryForLabelById(Long id);

}