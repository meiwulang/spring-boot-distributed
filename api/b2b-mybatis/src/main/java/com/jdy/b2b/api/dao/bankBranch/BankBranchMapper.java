package com.jdy.b2b.api.dao.bankBranch;

import com.jdy.b2b.api.model.bankBranch.BankBranch;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface BankBranchMapper {
    int deleteByPrimaryKey(Integer bbId);

    int insert(BankBranch record);

    int insertSelective(BankBranch record);

    BankBranch selectByPrimaryKey(Integer bbId);

    int updateByPrimaryKeySelective(BankBranch record);

    int updateByPrimaryKey(BankBranch record);

    List<BankBranch> queryBankBranchPage(BankBranch bankBranch);
}