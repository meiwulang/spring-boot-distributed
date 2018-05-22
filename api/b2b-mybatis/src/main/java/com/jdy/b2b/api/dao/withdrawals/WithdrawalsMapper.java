package com.jdy.b2b.api.dao.withdrawals;

import com.jdy.b2b.api.model.withdrawals.Withdrawals;
import com.jdy.b2b.api.model.withdrawals.WithdrawalsQueryDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface WithdrawalsMapper {
    int deleteByPrimaryKey(Long id);

    int insert(Withdrawals record);

    int insertSelective(Withdrawals record);

    Withdrawals selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(Withdrawals record);

    int updateByPrimaryKey(Withdrawals record);

    List<Withdrawals> queryWithdrawalsPage(WithdrawalsQueryDTO withdrawals);

}