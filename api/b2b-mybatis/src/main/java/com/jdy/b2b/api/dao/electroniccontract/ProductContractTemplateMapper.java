package com.jdy.b2b.api.dao.electroniccontract;

import com.jdy.b2b.api.model.electroniccontract.BindProAndTmpDO;
import com.jdy.b2b.api.model.electroniccontract.ProductContractTemplate;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ProductContractTemplateMapper {
    int deleteByPrimaryKey(Long id);

    int insert(ProductContractTemplate record);

    int insertSelective(ProductContractTemplate record);

    ProductContractTemplate selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(ProductContractTemplate record);

    int updateByPrimaryKey(ProductContractTemplate record);

    void deleteByPid(BindProAndTmpDO vo);

    ProductContractTemplate selectByPid(@Param(value = "pid") Long pid, @Param(value = "ticketId") Long ticketId);

    ProductContractTemplate selectByPidAndCompanyId(@Param(value = "pid") Long pid,
                                                    @Param(value = "companyId") Long companyId);
}