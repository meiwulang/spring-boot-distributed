package com.jdy.b2b.api.dao.electroniccontract;

import com.jdy.b2b.api.model.OrderContract;
import com.jdy.b2b.api.model.electroniccontract.CustomerSignContractCallback;
import com.jdy.b2b.api.model.electroniccontract.SignContract;
import com.jdy.b2b.api.model.electroniccontract.SignContractInfo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface SignContractInfoMapper {
    int deleteByPrimaryKey(Long id);

    int insert(SignContractInfo record);

    int insertSelective(SignContractInfo record);

    SignContractInfo selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(SignContractInfo record);

    int updateByPrimaryKey(SignContractInfo record);

    SignContractInfo selectSignContractInfoByOrderNo(@Param("orderNo") String orderNo,
                                                     @Param("status") Integer status);

    List<OrderContract> selectSignContractInfoListByOrderNo(@Param("orderNo") String orderNo);

    int customerSignContractCallback(CustomerSignContractCallback customerSignContractCallback);

    int updateSignContractInfoByContractNo(SignContractInfo signContractInfo);

    int updateCustomerTransactionNoByOrderNo(@Param("customerTransactionNo") String customerTransactionNo,
                                             @Param("orderNo") String orderNo);

    Map selectContractViewAndDownloadUrlByOrderNo(@Param("orderNo") String orderNo);

    SignContract selectSignContractSimplenessInfoByOrderNo(@Param("orderNo") String orderNo);

    SignContractInfo selectSingContractByContractNo(@Param("contractNo") String contractNo);
}