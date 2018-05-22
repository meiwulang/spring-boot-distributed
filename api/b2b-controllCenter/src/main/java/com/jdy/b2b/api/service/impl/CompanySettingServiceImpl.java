package com.jdy.b2b.api.service.impl;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.dao.CompanyMapper;
import com.jdy.b2b.api.dao.CompanySettingMapper;
import com.jdy.b2b.api.model.Company;
import com.jdy.b2b.api.model.CompanySetting;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

/**
 * Created by dugq on 2017/7/14.
 */
@Service
@Transactional
public class CompanySettingServiceImpl implements com.jdy.b2b.api.service.CompanySettingService {
    @Autowired
    private CompanySettingMapper companySettingMapper;
    @Autowired
    private CompanyMapper companyMapper;

    @Override
    public int deleteByPrimaryKey(Long id) {
        return companySettingMapper.deleteByPrimaryKey(id);
    }

    @Override
    public int insert(CompanySetting record) {
        return companySettingMapper.insert(record);
    }

    @Override
    public int insertSelective(CompanySetting record) {
        return companySettingMapper.insertSelective(record);
    }

    @Override
    public CompanySetting selectByPrimaryKey(Long id) {
        return companySettingMapper.selectByPrimaryKey(id);
    }

    @Override
    public int updateByPrimaryKeySelective(CompanySetting record) {
        return companySettingMapper.updateByPrimaryKeySelective(record);
    }

    @Override
    public int updateByPrimaryKey(CompanySetting record) {
        return companySettingMapper.updateByPrimaryKey(record);
    }

    @Override
    public ResultBean saveByCompanyId(CompanySetting companySetting) {
        Company company = companyMapper.selectByPrimaryKey(companySetting.getCsCompanyId());
        if(Objects.isNull(company)){
            return new ResultBean("-1","单位不存在或已被删除");
        }
        CompanySetting companySetting1 = companySettingMapper.selectByCompanyId(companySetting.getCsCompanyId());
        int result = 0;
        if(Objects.isNull(companySetting1)){
            result = companySettingMapper.insertSelective(companySetting);
        }else{
            companySetting.setId(companySetting1.getId());
            result = companySettingMapper.updateByPrimaryKeySelective(companySetting);
        }
        return result == 1 ? ResultBean.getSuccessResult():new ResultBean("-1","保存失败");
    }

    @Override
    public CompanySetting selectByCompanyId(Long companyId) {
        return companySettingMapper.selectByCompanyId(companyId);
    }
}
