package com.jdy.b2b.api.service.impl;

import com.jdy.b2b.api.common.BaseService;
import com.jdy.b2b.api.dao.bank.BankMapper;
import com.jdy.b2b.api.dao.bankBranch.BankBranchMapper;
import com.jdy.b2b.api.dao.bankManage.BankManageMapper;
import com.jdy.b2b.api.model.bank.Bank;
import com.jdy.b2b.api.model.bankBranch.BankBranch;
import com.jdy.b2b.api.model.bankManage.BankManage;
import com.jdy.b2b.api.service.BankManageService;
import com.jdy.b2b.api.model.bankManage.BankManageQueryDO;
import com.jdy.b2b.api.model.bankManage.BankManageQueryDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by yangcheng on 2017/8/31.
 */
@Service
public class BankManageServiceImpl extends BaseService implements BankManageService {
    @Autowired
    private BankManageMapper bankManageMapper;
    @Autowired
    private BankMapper bankMapper;
    @Autowired
    private BankBranchMapper bankBranchMapper;

    @Override
    public int saveBankManage(BankManage bankManage) {
        return bankManageMapper.insert(bankManage);
    }

    @Override
    public int updateBankManage(BankManage bankManage) {
        return bankManageMapper.updateByPrimaryKeySelective(bankManage);
    }

    @Override
    public BankManageQueryDO getBankManageInfo(Long id) {
        return bankManageMapper.getBankManageInfo(id);
    }

    @Override
    public List<BankManageQueryDO> queryBankManagePage(BankManageQueryDTO dto) {
        return bankManageMapper.queryBankManagePage(dto);
    }

    @Override
    public List<Bank> queryBankPage(Bank bank) {
        return bankMapper.queryBankPage(bank);
    }

    @Override
    public List<BankBranch> queryBankBranchPage(BankBranch bankBranch) {
        return bankBranchMapper.queryBankBranchPage(bankBranch);
    }


}
