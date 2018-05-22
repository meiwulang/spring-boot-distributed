package com.jdy.b2b.api.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jdy.b2b.api.common.JSONUtil;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.reports.PayMethodQueryDO;
import com.jdy.b2b.api.model.reports.PayMethodQueryDTO;
import com.jdy.b2b.api.service.PayMethodService;
import com.jdy.b2b.api.vo.PayMethodQueryVo;
import com.jdy.b2b.api.vo.PayMethodResultDO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * Created by yangcheng on 2017/9/18.
 */
@RestController
@RequestMapping("payMethod")
public class PayMethodController {
    @Autowired
    private PayMethodService payMethodService;

    @PostMapping("list")
    public ResultBean<PageInfo<PayMethodResultDO>> queryPayMethodList(@RequestBody PayMethodQueryVo vo){
        if (vo.getCurrPage() != null && vo.getPageSize() != null) {
            PageHelper.startPage(vo.getCurrPage(), vo.getPageSize());
        }
        PayMethodQueryDTO trans = JSONUtil.trans(vo, PayMethodQueryDTO.class);

        return ResultBean.getSuccessResult(new PageInfo<PayMethodResultDO>(payMethodService.queryPayMethodList(trans)));
    }

}
