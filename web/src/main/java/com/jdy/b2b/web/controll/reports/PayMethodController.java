package com.jdy.b2b.web.controll.reports;

import com.github.pagehelper.PageInfo;
import com.jdy.b2b.web.pojo.reports.PayMethodQueryVo;
import com.jdy.b2b.web.pojo.reports.PayMethodResultDO;
import com.jdy.b2b.web.service.PayMethodService;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.JSONUtil;
import com.jdy.b2b.web.util.ResultBean;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import java.util.List;

/**
 * Created by yangcheng on 2017/9/18.
 */
@Api(value = "payMethod", description = "支付方式汇总统计")
@RestController
@RequestMapping("payMethod")
public class PayMethodController extends BaseController{
    @Autowired
    private PayMethodService payMethodService;

    @ApiOperation("列表查询")
    @PostMapping("list")
    public ResultBean<PageInfo<PayMethodResultDO>> queryPayMehodPage(@RequestBody @Validated PayMethodQueryVo vo){
        return payMethodService.queryPayMethodPage(vo);
    }

    @ApiOperation("导出报表")
    @ApiIgnore
    @GetMapping("list")
    public ResultBean export(@RequestBody @Validated PayMethodQueryVo vo){
        ResultBean<PageInfo<PayMethodResultDO>> pageInfoResultBean = payMethodService.queryPayMethodPage(vo);
        PageInfo pageInfo = pageInfoResultBean.getParsedEnitity(PageInfo.class);
        List trans = JSONUtil.trans(pageInfo.getList(), PayMethodResultDO.class);
        return ResultBean.getSuccessResult();
    }

}
