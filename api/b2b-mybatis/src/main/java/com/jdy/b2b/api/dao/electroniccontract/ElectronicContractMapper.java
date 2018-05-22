package com.jdy.b2b.api.dao.electroniccontract;

import com.jdy.b2b.api.model.electroniccontract.ContractTemplateInfo;
import com.jdy.b2b.api.model.electroniccontract.CustomerSignContractNeedInfo;
import com.jdy.b2b.api.model.electroniccontract.TicketPrice;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * Created by zhangfofa on 2017/12/14.
 */
@Mapper
public interface ElectronicContractMapper {

    CustomerSignContractNeedInfo selectCustomerSignContractNeedInfoByOrderNo(@Param("orderNo") String orderNo);

    Map selectGenerateContractNeedInfoByOrderNo(@Param("orderNo") String orderNo);

    int updateOrderContractSignInfoByContractNo(@Param("contractNo") String contractNo);

    List<TicketPrice> selectTicketPriceByScheduleId(@Param("scheduleId") Long scheduleId);

    ContractTemplateInfo selectProductWhetherBindingContractByOrderNo(@Param("orderNo") String orderNo);

}
