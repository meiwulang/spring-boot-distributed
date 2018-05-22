package com.jdy.b2b.web.service.impl;

import com.github.pagehelper.PageInfo;
import com.jdy.b2b.web.pojo.bankManage.*;
import com.jdy.b2b.web.service.BankManageService;
import com.jdy.b2b.web.util.BaseService;
import com.jdy.b2b.web.util.ResultBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by yangcheng on 2017/9/1.
 */
@Service
public class BankManageServiceImpl extends BaseService implements BankManageService{

    @Override
    public ResultBean<BankManageQueryDO> getBankManageInfo(Long id) {
        StringBuffer url = new StringBuffer(financeCenterUrl).append("bank_manage/get/").append(id);
        return restTemplate.getForEntity(url.toString(), ResultBean.class).getBody();
    }

    @Override
    public ResultBean<Long> saveOrUpdateBankManage(BankManageSaveOrUpdateVo saveOrUpdateVo) {
        StringBuffer url = new StringBuffer(financeCenterUrl).append("bank_manage/saveOrUpdate");
        return restTemplate.postForEntity(url.toString(), saveOrUpdateVo, ResultBean.class).getBody();
    }

    @Override
    public ResultBean<PageInfo<BankManageQueryDO>> queryBankManagePage(BankManageQueryVo vo) {
        StringBuffer url = new StringBuffer(financeCenterUrl).append("bank_manage/list");
        return restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody();
    }

    @Override
    public ResultBean<PageInfo<Bank>> queryBankPage(BankQueryVo vo) {
        StringBuffer url = new StringBuffer(financeCenterUrl).append("bank_manage/headBankList");
        return restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody();
    }

    @Override
    public ResultBean<PageInfo<BankBranch>> queryBankBranchPage(BankBranchQueryVo vo) {
        StringBuffer url = new StringBuffer(financeCenterUrl).append("bank_manage/branchBankList");
        return restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody();
    }
}
