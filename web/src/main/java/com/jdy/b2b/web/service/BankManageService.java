package com.jdy.b2b.web.service;

import com.github.pagehelper.PageInfo;
import com.jdy.b2b.web.pojo.bankManage.*;
import com.jdy.b2b.web.util.ResultBean;

/**
 * Created by yangcheng on 2017/9/1.
 */
public interface BankManageService {
    ResultBean<BankManageQueryDO> getBankManageInfo(Long id);

    ResultBean<Long> saveOrUpdateBankManage(BankManageSaveOrUpdateVo saveOrUpdateVo);

    ResultBean<PageInfo<BankManageQueryDO>> queryBankManagePage(BankManageQueryVo vo);

    ResultBean<PageInfo<Bank>> queryBankPage(BankQueryVo vo);

    ResultBean<PageInfo<BankBranch>> queryBankBranchPage(BankBranchQueryVo vo);
}
