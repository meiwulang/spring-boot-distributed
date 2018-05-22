package com.jdy.b2b.api.dao;

import com.jdy.b2b.api.model.bill.*;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface BillMapper {
    int deleteByPrimaryKey(Long id);

    int insert(Bill record);

    int insertSelective(Bill record);

    Bill selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(Bill record);

    int updateByPrimaryKey(Bill record);


    List<OnlineBillParentDTO> selectOnlineBillList(OnlineBillVo onlineBillVo);

    BillTotalInfoDTO sumOnlineBillTotal(OnlineBillVo onlineBillVo);

    List<CreditBillDTO> selectCreditBillList(CreditBillVo creditBillVo);

    BillTotalInfoDTO sumCreditBillTotal(CreditBillVo creditBillVo);

    CreditBillDetailDTO selectCreditBillDetail(String billNo);

    BillWithOrderPayDto selectBillWithOrderPayDto(Long id);

    List<BillDto4ExportBillList> queryOnlineBillList4Export(ParamDto4ExportBillList param);
}