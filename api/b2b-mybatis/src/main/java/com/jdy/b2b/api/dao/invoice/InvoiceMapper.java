package com.jdy.b2b.api.dao.invoice;

import com.jdy.b2b.api.model.invoice.*;
import org.apache.ibatis.annotations.Mapper;

import java.math.BigDecimal;
import java.util.List;

@Mapper
public interface InvoiceMapper {
    int deleteByPrimaryKey(Long id);

    int insert(Invoice record);

    int insertSelective(Invoice record);

    Invoice selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(Invoice record);

    int updateByPrimaryKey(Invoice record);

    List<InvoiceListDO> queryInvoicePage(InvoiceQueryDTO invoice);

    InvoiceInfoDO getInvoiceInfo(Object p0);

    //发票调用接口
    BigDecimal getInvoiceAmountTotal(List<Long> idList);

    int updateInvoiceAmount(List<Long> idList);

    int updateBash(List<InvoiceOrderDO> orderList);

}