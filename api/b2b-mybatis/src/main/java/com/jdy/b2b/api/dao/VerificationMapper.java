package com.jdy.b2b.api.dao;

import com.jdy.b2b.api.model.Verification;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface VerificationMapper {
    int deleteByPrimaryKey(Long id);

    int insert(Verification record);

    int insertSelective(Verification record);

    Verification selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(Verification record);

    int updateByPrimaryKey(Verification record);
}