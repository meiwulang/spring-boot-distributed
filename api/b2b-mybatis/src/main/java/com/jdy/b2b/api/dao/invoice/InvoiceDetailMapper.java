package com.jdy.b2b.api.dao.invoice;

import com.jdy.b2b.api.model.invoice.InvoiceDetail;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface InvoiceDetailMapper {
    int deleteByPrimaryKey(Long id);

    int insert(InvoiceDetail record);

    int insertSelective(InvoiceDetail record);

    InvoiceDetail selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(InvoiceDetail record);

    int updateByPrimaryKey(InvoiceDetail record);

    int deleteByInvoiceId(Long invoiceId);

    int saveBash(List<InvoiceDetail> list);
}