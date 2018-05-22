package com.jdy.b2b.api.dao;

import com.jdy.b2b.api.model.CompanySetting;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface CompanySettingMapper {
    int deleteByPrimaryKey(Long id);

    int insert(CompanySetting record);

    int insertSelective(CompanySetting record);

    CompanySetting selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(CompanySetting record);

    int updateByPrimaryKey(CompanySetting record);

    CompanySetting selectByCompanyId(Long companyId);

    int deleteByCompanyId(Long companyId);
}