package com.jdy.b2b.web.controll.invoice;

import com.github.pagehelper.PageInfo;
import com.jdy.b2b.web.pojo.invoice.*;
import com.jdy.b2b.web.service.InvoiceService;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.JSONUtil;
import com.jdy.b2b.web.util.ResultBean;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotNull;

/**
 * Created by yangcheng on 2017/9/6.
 */
@Api(value = "invoice", description = "发票申请/发票管理")
@RestController
@RequestMapping("invoice")
public class InvoiceController extends BaseController{
    @Autowired
    private InvoiceService invoiceService;

    @ApiOperation(value = "发票申请")
    @PostMapping("save")
    public ResultBean<Long> saveInvoice(@RequestBody @Validated InvoiceSaveVo vo){
        InvoiceSaveOrUpdateVo saveOrUpdateVo = JSONUtil.trans(vo, InvoiceSaveOrUpdateVo.class);
        return invoiceService.saveOrUpdateInvoice(saveOrUpdateVo);
    }
    @ApiOperation(value = "处理发票")
    @PostMapping("update")
    public ResultBean<Long> updateInvoice(@RequestBody @Validated InvoiceUpdateVo vo){
        InvoiceSaveOrUpdateVo saveOrUpdateVo = JSONUtil.trans(vo, InvoiceSaveOrUpdateVo.class);
        return invoiceService.saveOrUpdateInvoice(saveOrUpdateVo);
    }
    @ApiOperation(value = "根据id查询")
    @GetMapping("get/{id}")
    public ResultBean<InvoiceInfoDO> getInvoiceInfo(@PathVariable @NotNull @ApiParam(value = "发票id", required = true, name = "id") Long id){
        return invoiceService.getInvoiceInfo(id);
    }

    @ApiOperation(value = "查列表")
    @PostMapping("list")
    public ResultBean<PageInfo<InvoiceListDO>> queryInvoicePage(@RequestBody InvoiceQueryVo vo){
        return invoiceService.queryInvoicePage(vo);
    }

    @ApiOperation(value = "撤销发票")
    @GetMapping("delete/{id}")
    public ResultBean<Integer> deleteInvoiceAndDetail(@PathVariable @NotNull @ApiParam(value = "广告id", required = true, name = "id") Long id){
        return invoiceService.deleteInvoiceAndDetail(id);
    }
}
