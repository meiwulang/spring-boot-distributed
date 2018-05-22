package com.jdy.b2b.api.dao.bankManage;

import com.jdy.b2b.api.model.bankManage.BankManage;
import com.jdy.b2b.api.model.bankManage.BankManageQueryDO;
import com.jdy.b2b.api.model.bankManage.BankManageQueryDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface BankManageMapper {
    int deleteByPrimaryKey(Long id);

    int insert(BankManage record);

    int insertSelective(BankManage record);

    BankManage selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(BankManage record);

    int updateByPrimaryKey(BankManage record);

    BankManageQueryDO getBankManageInfo(Long id);

    List<BankManageQueryDO> queryBankManagePage(BankManageQueryDTO record);

}