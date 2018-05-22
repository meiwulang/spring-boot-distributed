package com.jdy.b2b.api.service.impl;

import com.jdy.b2b.api.common.BaseService;
import com.jdy.b2b.api.dao.credit.CreditMapper;
import com.jdy.b2b.api.model.credit.Credit;
import com.jdy.b2b.api.model.credit.CreditDTO;
import com.jdy.b2b.api.service.CreditService;
import com.jdy.b2b.api.model.credit.CreditResultDO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by yangcheng on 2017/8/30.
 */
@Service
public class CreditServiceImpl extends BaseService implements CreditService{
    @Autowired
    private CreditMapper creditMapper;

    @Override
    public int saveCredit(Credit credit) {
        return creditMapper.insert(credit);
    }

    @Override
    public int updateCredit(Credit credit) {
        return creditMapper.updateByPrimaryKeySelective(credit);
    }

    @Override
    public List<CreditResultDO> queryCreditPage(CreditDTO creditDTO) {
        return creditMapper.queryCreditPage(creditDTO);
    }
}
