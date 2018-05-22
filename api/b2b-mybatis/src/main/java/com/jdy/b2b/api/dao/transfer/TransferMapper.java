package com.jdy.b2b.api.dao.transfer;

import com.jdy.b2b.api.model.transfer.Transfer;
import com.jdy.b2b.api.model.transfer.TransferQueryDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface TransferMapper {
    int deleteByPrimaryKey(Long id);

    int insert(Transfer record);

    int insertSelective(Transfer record);

    Transfer selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(Transfer record);

    int updateByPrimaryKey(Transfer record);

    List<Transfer> queryTransferPage(TransferQueryDTO transfer);
}