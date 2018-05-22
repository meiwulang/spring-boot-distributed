package com.jdy.b2b.api.dao;

import com.jdy.b2b.api.model.bill.BillDetail;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.LinkedList;
@Mapper
public interface BillDetailMapper {
    int deleteByPrimaryKey(Long id);

    int insert(BillDetail record);

    int insertSelective(BillDetail record);

    BillDetail selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(BillDetail record);

    int updateByPrimaryKey(BillDetail record);

    int bathInsert(@Param("billDetailList") LinkedList<BillDetail> billDetailList);
}