package com.jdy.b2b.api.service;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.electroniccontract.*;

import java.util.List;

/**
 * Created by zhangfofa on 2017/12/14.
 */
public interface ElectronicContractService {

    int addContractTemplate(ContractTemplateInfo contractTemplateInfo);

    int addSignContractInfo(SignContractInfo signContractInfo);

    ResultBean querySignContractInfoByOrderNo(String orderNo, Integer status);

    ResultBean queryGenerateContractNeedInfoByOrderNo(String orderNo);

    void customerSignContractCallback(CustomerSignContractCallback customerSignContractCallback);

    ResultBean queryCustomerSignContractNeedInfoByOrderNo(String orderNo);

    ResultBean queryOrderByOrderNo(String orderNo);

    int updateCustomerTransactionNoByOrderNo(String customerTransactionNo, String orderNo);

    int updateSignContractInfoByContractNo(SignContractInfo signContractInfo);

    ResultBean queryContractViewAndDownloadUrlByOrderNo(String orderNo);

    ResultBean querySignContractSimplenessInfoByOrderNo(String orderNo);

    ResultBean queryProductWhetherBindingContractByOrderNo(String orderNo);

    List<ContractTemplateInfoExt> searchTmpList(ContractTemplateListDO vo);

    ResultBean bindProAndTmp(BindProAndTmpDO vo);

    ResultBean prodTempList(BindProAndTmpDO bindProAndTmpDO);

    ResultBean deleteTemp(Long id);
}
