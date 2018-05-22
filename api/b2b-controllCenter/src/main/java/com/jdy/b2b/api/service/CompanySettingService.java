package com.jdy.b2b.api.service;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.CompanySetting;

/**
 * Created by dugq on 2017/7/14.
 */
public interface CompanySettingService {
    int deleteByPrimaryKey(Long id);

    int insert(CompanySetting record);

    int insertSelective(CompanySetting record);

    CompanySetting selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(CompanySetting record);

    int updateByPrimaryKey(CompanySetting record);

    ResultBean saveByCompanyId(CompanySetting companySetting);

    CompanySetting selectByCompanyId(Long companyId);
}
