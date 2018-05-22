package com.jdy.b2b.api.dao.credit;

import com.jdy.b2b.api.model.credit.Credit;
import com.jdy.b2b.api.model.credit.CreditDTO;
import com.jdy.b2b.api.model.credit.CreditResultDO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface CreditMapper {
    int deleteByPrimaryKey(Long id);

    int insert(Credit record);

    int insertSelective(Credit record);

    Credit selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(Credit record);

    int updateByPrimaryKey(Credit record);

    List<CreditResultDO> queryCreditPage(CreditDTO creditDTO);
}