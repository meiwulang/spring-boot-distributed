package com.jdy.b2b.api.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jdy.b2b.api.common.BaseController;
import com.jdy.b2b.api.common.Constants;
import com.jdy.b2b.api.common.JSONUtil;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.bank.Bank;
import com.jdy.b2b.api.model.bankBranch.BankBranch;
import com.jdy.b2b.api.model.bankManage.BankManage;
import com.jdy.b2b.api.service.BankManageService;
import com.jdy.b2b.api.model.bankManage.BankManageQueryDO;
import com.jdy.b2b.api.model.bankManage.BankManageQueryDTO;
import com.jdy.b2b.api.vo.bankManage.BankBranchQueryVo;
import com.jdy.b2b.api.vo.bankManage.BankManageQueryVo;
import com.jdy.b2b.api.vo.bankManage.BankManageSaveOrUpdateVo;
import com.jdy.b2b.api.vo.bankManage.BankQueryVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Objects;

/**
 * Created by yangcheng on 2017/8/31.
 */
@RestController
@RequestMapping("bank_manage")
public class BankManageController extends BaseController{
    @Autowired
    private BankManageService bankManageService;

    /**
     * 新增或者编辑银行卡
     * @param vo
     * @return
     */
    @PostMapping("saveOrUpdate")
    public ResultBean<Long> saveBankManage(@RequestBody BankManageSaveOrUpdateVo vo){
        BankManage bankManage =  JSONUtil.trans(vo,BankManage.class);
        if(Objects.isNull(bankManage.getId())){
            //执行新增
            bankManage.setCreateUser(vo.getPuserId());
            bankManage.setCreateTime(new Date());
            int result = bankManageService.saveBankManage(bankManage);
            if(result>0){
                return ResultBean.getSuccessResult(bankManage.getId());
            }else{
                return new ResultBean<Long>("-1","新增银行卡失败!");
            }
        }else{
            //执行修改
            bankManage.setUpdateUser(vo.getPuserId());
            bankManage.setUpdateTime(new Date());
            int result = bankManageService.updateBankManage(bankManage);
            if(result>0){
                return ResultBean.getSuccessResult((long)result);
            }else{
                return new ResultBean<Long>("-1","修改银行卡失败!");
            }
        }
    }

    /**
     * 编辑时多表获取银行卡信息
     * @param id
     * @return
     */
    @GetMapping("get/{id}")
    public ResultBean<BankManageQueryDO> getBankManageInfo(@PathVariable Long id){
       return  ResultBean.getSuccessResult(bankManageService.getBankManageInfo(id));
    }

    /**
     * 查询列表
     * @param vo
     * @return
     */
    @PostMapping("list")
    public ResultBean<PageInfo<BankManageQueryDO>> queryBankManagePage(@RequestBody BankManageQueryVo vo){
        if (vo.getCurrPage() != null && vo.getPageSize() != null) {
            PageHelper.startPage(vo.getCurrPage(), vo.getPageSize());
        }
        BankManageQueryDTO dto = JSONUtil.trans(vo, BankManageQueryDTO.class);
        List<BankManageQueryDO> list = bankManageService.queryBankManagePage(dto);
        return ResultBean.getSuccessResult(new PageInfo<BankManageQueryDO>(list));
    }

    /**
     * 总行不分页
     * @param vo
     * @return
     */
    @PostMapping("headBankList")
    public ResultBean<PageInfo<Bank>> queryBankPage(@RequestBody @Validated BankQueryVo vo){
        if (vo.getCurrPage() != null && vo.getPageSize() != null) {
            PageHelper.startPage(vo.getCurrPage(), vo.getPageSize());
        }
        Bank bank = JSONUtil.trans(vo, Bank.class);
        List<Bank> list = bankManageService.queryBankPage(bank);
        return ResultBean.getSuccessResult(new PageInfo<Bank>(list));
    }

    /**
     * 支行不分页
     * @param vo
     * @return
     */
    @PostMapping("branchBankList")
    public ResultBean<PageInfo<BankBranch>> queryBankBranchPage(@RequestBody @Validated BankBranchQueryVo vo){
        if (vo.getCurrPage() != null && vo.getPageSize() != null) {
            PageHelper.startPage(vo.getCurrPage(), vo.getPageSize());
        }
        BankBranch bankBranch = JSONUtil.trans(vo, BankBranch.class);
        List<BankBranch> list = bankManageService.queryBankBranchPage(bankBranch);
        return ResultBean.getSuccessResult(new PageInfo<BankBranch>(list));
    }
}

