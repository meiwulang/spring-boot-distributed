package com.jdy.b2b.api.dao.slsms;

import org.apache.ibatis.annotations.Mapper;

import com.jdy.b2b.api.model.slsms.SLsms;

@Mapper
public interface SLsmsMapper {
	int deleteByPrimaryKey(Long id);

	int insert(SLsms record);

	int insertSelective(SLsms record);

	SLsms selectByPrimaryKey(Long id);

	int updateByPrimaryKeySelective(SLsms record);

	int updateByPrimaryKey(SLsms record);

	/**
	 * @Description: TODO
	 * @author 王斌
	 * @date 2017年9月22日 上午11:46:47
	 * @param trans
	 */
	SLsms query(SLsms trans);
}