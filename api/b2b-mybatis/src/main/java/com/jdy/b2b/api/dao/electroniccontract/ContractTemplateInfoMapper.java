package com.jdy.b2b.api.dao.electroniccontract;

import com.jdy.b2b.api.model.electroniccontract.ContractTemplateInfo;
import com.jdy.b2b.api.model.electroniccontract.ContractTemplateInfoExt;
import com.jdy.b2b.api.model.electroniccontract.ContractTemplateListDO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ContractTemplateInfoMapper {
    int deleteByPrimaryKey(Long id);

    int insert(ContractTemplateInfo record);

    int insertSelective(ContractTemplateInfo record);

    ContractTemplateInfo selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(ContractTemplateInfo record);

    int updateByPrimaryKey(ContractTemplateInfo record);

    List<ContractTemplateInfoExt> searchTmpList(ContractTemplateListDO vo);

    List<ContractTemplateInfoExt> prodTmpList(ContractTemplateListDO vo);
}