package com.jdy.b2b.web.controll.credit;

import com.github.pagehelper.PageInfo;
import com.jdy.b2b.web.pojo.credit.*;
import com.jdy.b2b.web.service.CreditService;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.JSONUtil;
import com.jdy.b2b.web.util.ResultBean;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Created by yangcheng on 2017/8/30.
 */
@Api(value = "credit", description = "授信管理")
@RestController
@RequestMapping("credit")
public class CreditController extends BaseController{
    @Autowired
    private CreditService creditService;

    /**
     * 新增授信
     * @param vo
     * @return
     */
    @ApiOperation(value = "新增授信")
    @PostMapping("save")
    public ResultBean<Long> saveCredit(@RequestBody @Validated CreditSaveVo vo){
        CreditSaveOrUpdateVo saveOrUpdateVo = JSONUtil.trans(vo, CreditSaveOrUpdateVo.class);
        saveOrUpdateVo.setcCreditBalance(saveOrUpdateVo.getcCreditQuota());
        saveOrUpdateVo.setcCreditUsed(saveOrUpdateVo.getcCreditQuota().subtract(saveOrUpdateVo.getcCreditBalance()));
        return creditService.saveOrUpdateCredit(saveOrUpdateVo);
    }

    /**
     * 修改授信
     * 同时修改剩余额度
     * @param vo
     * @return
     */
    @ApiOperation(value = "修改授信")
    @PostMapping("update")
    public ResultBean<Long> updateCredit(@RequestBody @Validated CreditUpdateVo vo){
        CreditSaveOrUpdateVo saveOrUpdateVo = JSONUtil.trans(vo, CreditSaveOrUpdateVo.class);
        saveOrUpdateVo.setcCreditBalance(saveOrUpdateVo.getcCreditQuota().subtract(vo.getcCreditUsed()));
        return creditService.saveOrUpdateCredit(saveOrUpdateVo);
    }

    /**
     * 查询列表
     * @param vo
     * @return
     */
    @ApiOperation(value = "查询列表")
    @PostMapping("list")
    public ResultBean<PageInfo<CreditResultDO>> queryCreditPage(@RequestBody @Validated CreditQueryVo vo){
        return creditService.queryCreditPage(vo);
    }

}
