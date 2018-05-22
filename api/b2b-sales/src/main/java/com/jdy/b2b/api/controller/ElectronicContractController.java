package com.jdy.b2b.api.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.electroniccontract.*;
import com.jdy.b2b.api.service.ElectronicContractService;


/**
 * Created by zhangfofa on 2017/12/14.
 */
@Controller
@RequestMapping("electronicContract")
public class ElectronicContractController {
    private final Logger logger = LoggerFactory.getLogger(ElectronicContractController.class);

    @Autowired
    private ElectronicContractService electronicContractService;

    @RequestMapping("/addContractTemplate")
    @ResponseBody
    public ResultBean addContractTemplate(@RequestBody ContractTemplateInfo contractTemplateInfo) {
        electronicContractService.addContractTemplate(contractTemplateInfo);
        return ResultBean.getSuccessResult();
    }

    @RequestMapping("/addSignContractInfo")
    @ResponseBody
    public ResultBean addSignContractInfo(@RequestBody SignContractInfo signContractInfo) {
        electronicContractService.addSignContractInfo(signContractInfo);
        return ResultBean.getSuccessResult();
    }

    @RequestMapping("/querySignContractInfoByOrderNo")
    @ResponseBody
    public ResultBean querySignContractInfoByOrderNo(String orderNo, Integer status) {
        return electronicContractService.querySignContractInfoByOrderNo(orderNo, status);
    }

    @RequestMapping("/queryGenerateContractNeedInfoByOrderNo")
    @ResponseBody
    public ResultBean queryGenerateContractNeedInfoByOrderNo(@RequestBody String orderNo) {
        return electronicContractService.queryGenerateContractNeedInfoByOrderNo(orderNo);
    }

    @RequestMapping("/customerSignContractCallback")
    @ResponseBody
    public void customerSignContractCallback(@RequestBody CustomerSignContractCallback customerSignContractCallback) {
        electronicContractService.customerSignContractCallback(customerSignContractCallback);
    }

    @RequestMapping("/queryCustomerSignContractNeedInfoByOrderNo")
    @ResponseBody
    public ResultBean queryCustomerSignContractNeedInfoByOrderNo(@RequestBody String orderNo) {
        return electronicContractService.queryCustomerSignContractNeedInfoByOrderNo(orderNo);
    }

    @RequestMapping("queryOrderByOrderNo")
    @ResponseBody
    public ResultBean queryOrderByOrderNo(@RequestBody String orderNo) {
        return electronicContractService.queryOrderByOrderNo(orderNo);
    }

    @RequestMapping("/updateCustomerTransactionNoByOrderNo")
    @ResponseBody
    public ResultBean updateCustomerTransactionNoByOrderNo(String customerTransactionNo, String orderNo) {
        electronicContractService.updateCustomerTransactionNoByOrderNo(customerTransactionNo, orderNo);
        return ResultBean.getSuccessResult();
    }

    @RequestMapping("/queryContractViewAndDownloadUrlByOrderNo")
    @ResponseBody
    public ResultBean queryContractViewAndDownloadUrlByOrderNo(@RequestBody String orderNo) {
        return electronicContractService.queryContractViewAndDownloadUrlByOrderNo(orderNo);
    }

    @RequestMapping("/querySignContractSimplenessInfoByOrderNo")
    @ResponseBody
    public ResultBean querySignContractSimplenessInfoByOrderNo(@RequestBody String orderNo) {
        return electronicContractService.querySignContractSimplenessInfoByOrderNo(orderNo);
    }

    @RequestMapping("/updateSignContractInfoByContractNo")
    @ResponseBody
    public ResultBean updateSignContractInfoByContractNo(@RequestBody SignContractInfo signContractInfo) {
        electronicContractService.updateSignContractInfoByContractNo(signContractInfo);
        return ResultBean.getIndexSuccessResult("修改成功！");
    }

    @RequestMapping("/queryProductWhetherBindingContractByOrderNo")
    @ResponseBody
    public ResultBean queryProductWhetherBindingContractByOrderNo(@RequestBody String orderNo) {
        return electronicContractService.queryProductWhetherBindingContractByOrderNo(orderNo);
    }

    @PostMapping("/searchList")
    @ResponseBody
    public ResultBean searchList(@RequestBody ContractTemplateListDO vo) {
        PageHelper.startPage(vo.getCurrPage(), vo.getPageSize());
        return ResultBean.getSuccessResult(new PageInfo<>(electronicContractService.searchTmpList(vo)));
    }

    @GetMapping("/deleteTemp/{id}")
    @ResponseBody
    public ResultBean deleteTemp(@PathVariable Long id) {
        return electronicContractService.deleteTemp(id);
    }


    @PostMapping("/bindProAndTmp")
    @ResponseBody
    public ResultBean bindProAndTmp(@RequestBody BindProAndTmpDO vo) {
        return electronicContractService.bindProAndTmp(vo);
    }

    @PostMapping("/prodTempList")
    @ResponseBody
    public ResultBean prodTempList(@RequestBody BindProAndTmpDO bindProAndTmpDO) {
        return electronicContractService.prodTempList(bindProAndTmpDO);
    }
}
