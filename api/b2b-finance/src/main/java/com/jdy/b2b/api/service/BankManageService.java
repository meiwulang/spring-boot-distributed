package com.jdy.b2b.api.service;

import com.jdy.b2b.api.model.bank.Bank;
import com.jdy.b2b.api.model.bankBranch.BankBranch;
import com.jdy.b2b.api.model.bankManage.BankManage;
import com.jdy.b2b.api.model.bankManage.BankManageQueryDO;
import com.jdy.b2b.api.model.bankManage.BankManageQueryDTO;

import java.util.List;

/**
 * Created by yangcheng on 2017/8/31.
 */
public interface BankManageService {

    int saveBankManage(BankManage bankManage);

    int updateBankManage(BankManage bankManage);

    BankManageQueryDO getBankManageInfo(Long id);

    List<BankManageQueryDO> queryBankManagePage(BankManageQueryDTO dto);

    List<Bank> queryBankPage(Bank bank);

    List<BankBranch> queryBankBranchPage(BankBranch bankBranch);
}
