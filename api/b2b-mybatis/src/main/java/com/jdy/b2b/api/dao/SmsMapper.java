package com.jdy.b2b.api.dao;

import org.apache.ibatis.annotations.Mapper;

import com.jdy.b2b.api.model.Sms;

@Mapper
public interface SmsMapper {
	int deleteByPrimaryKey(Long id);

	int insert(Sms record);

	int insertSelective(Sms record);

	Sms selectByPrimaryKey(Long id);

	int updateByPrimaryKeySelective(Sms record);

	int updateByPrimaryKey(Sms record);
}