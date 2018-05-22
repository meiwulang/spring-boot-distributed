package com.jdy.b2b.api.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jdy.b2b.api.common.BaseController;
import com.jdy.b2b.api.common.JSONUtil;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.credit.Credit;
import com.jdy.b2b.api.model.credit.CreditDTO;
import com.jdy.b2b.api.service.CreditService;
import com.jdy.b2b.api.vo.credit.CreditQueryVo;
import com.jdy.b2b.api.model.credit.CreditResultDO;
import com.jdy.b2b.api.vo.credit.CreditSaveOrUpdateVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;
import java.util.List;
import java.util.Objects;

/**
 * Created by yangcheng on 2017/8/30.
 */
@RestController
@RequestMapping("credit")
public class CreditController extends BaseController{
    @Autowired
    private CreditService creditService;

    /**
     * 新增或修改授信
     * @param vo
     * @return
     */
    @PostMapping("saveOrUpdate")
    public ResultBean<Long> saveOrUpdateCredit(@RequestBody CreditSaveOrUpdateVo vo){
        Credit credit = JSONUtil.trans(vo, Credit.class);

        if(Objects.isNull(credit.getId())){
            //执行新增,没有状态
            credit.setCreateUser(vo.getPuserId());
            credit.setCreateTime(new Date());
            int result = creditService.saveCredit(credit);
            if(result>0){
                return ResultBean.getSuccessResult(credit.getId());
            }else{
                return new ResultBean<Long>("-1","新增授信失败!");
            }
        }else{
            //执行修改
            credit.setUpdateUser(vo.getPuserId());
            credit.setUpdateTime(new Date());
            int result = creditService.updateCredit(credit);
            if(result>0){
                return ResultBean.getSuccessResult((long)result);
            }else{
                return new ResultBean<Long>("-1","修改授信失败!");
            }
        }
    }

    /**
     * 查询授信列表
     */
    @PostMapping("list")
    public ResultBean<PageInfo<CreditResultDO>> queryCreditPage(@RequestBody CreditQueryVo vo){
        if (vo.getCurrPage() != null && vo.getPageSize() != null) {
            PageHelper.startPage(vo.getCurrPage(), vo.getPageSize());
        }
        CreditDTO creditDTO = JSONUtil.trans(vo, CreditDTO.class);
        List<CreditResultDO> list = creditService.queryCreditPage(creditDTO);
        return ResultBean.getSuccessResult(new PageInfo<CreditResultDO>(list));
    }



}
