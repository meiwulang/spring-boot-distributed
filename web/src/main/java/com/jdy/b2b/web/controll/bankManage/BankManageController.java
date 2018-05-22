package com.jdy.b2b.web.controll.bankManage;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jdy.b2b.web.pojo.bankManage.*;
import com.jdy.b2b.web.service.BankManageService;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.Constants;
import com.jdy.b2b.web.util.JSONUtil;
import com.jdy.b2b.web.util.ResultBean;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Objects;

/**
 * Created by yangcheng on 2017/9/1.
 */
@Api(value = "bank_manage", description = "银行卡管理")
@RestController
@RequestMapping("bank_manage")
public class BankManageController extends BaseController{
    @Autowired
    private BankManageService bankManageService;

    /**
     * 新增
     * @param vo
     * @return
     */
    @ApiOperation(value = " 新增银行卡")
    @PostMapping("save")
    public ResultBean<Long> saveBankManage(@RequestBody @Validated BankManageSaveVo vo){
        BankManageSaveOrUpdateVo saveOrUpdateVo = JSONUtil.trans(vo, BankManageSaveOrUpdateVo.class);
        saveOrUpdateVo.setbCurrency("CNY");
        return bankManageService.saveOrUpdateBankManage(saveOrUpdateVo);
    }

    /**
     * 修改银行卡信息
     * @param vo
     * @return
     */
    @ApiOperation(value = " 修改银行卡 注意:单位不可修改")
    @PostMapping("update")
    public ResultBean<Long> updateBankManage(@RequestBody @Validated BankManageUpdateVo vo){
        BankManageSaveOrUpdateVo saveOrUpdateVo = JSONUtil.trans(vo, BankManageSaveOrUpdateVo.class);
        return bankManageService.saveOrUpdateBankManage(saveOrUpdateVo);
    }

    /**
     *删除
     * @param id
     * @return
     */
    @ApiOperation("删除银行卡")
    @GetMapping("delete/{id}")
    public ResultBean<Long> updateBankManage(@PathVariable @NotNull @ApiParam(value = "银行卡id", required = true, name = "id") Long id){
        BankManageSaveOrUpdateVo vo = new BankManageSaveOrUpdateVo();
        vo.setId(id);
        vo.setbStatus(Constants.BANKMANAGE_EFFECT_NO);
        return bankManageService.saveOrUpdateBankManage(vo);
    }

    /**
     * 编辑之前获取信息
     * @param id
     * @return
     */
    @ApiOperation("获取银行卡编辑信息")
    @GetMapping("get/{id}")
    public ResultBean<BankManageQueryDO> getBankManageInfo(@PathVariable @NotNull @ApiParam(value = "银行卡id", required = true, name = "id") Long id){
        return bankManageService.getBankManageInfo(id);
    }

    /**
     * 银行卡列表
     * @return
     */
    @ApiOperation("获取银行卡列表")
    @PostMapping("list")
    public ResultBean<PageInfo<BankManageQueryDO>> queryBankPage(@RequestBody @Validated BankManageQueryVo vo){
        if(Objects.nonNull(vo.getSearchStr())){
            vo.setSearchStr(vo.getSearchStr().trim());
        }
        return bankManageService.queryBankManagePage(vo);
    }


    @ApiOperation("获取总行列表")
    @PostMapping("headBankList")
    public ResultBean<PageInfo<Bank>> queryBankPage(@RequestBody @Validated BankQueryVo vo){
        return bankManageService.queryBankPage(vo);
    }

    @ApiOperation("获取支行列表")
    @PostMapping("bankBranchList")
    public ResultBean<PageInfo<BankBranch>> queryBankBranchPage(@RequestBody @Validated BankBranchQueryVo vo){
        return bankManageService.queryBankBranchPage(vo);
    }
}
