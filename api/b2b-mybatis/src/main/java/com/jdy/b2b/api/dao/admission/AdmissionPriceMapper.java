package com.jdy.b2b.api.dao.admission;

import org.apache.ibatis.annotations.Mapper;

import com.jdy.b2b.api.model.admission.AdmissionPrice;

@Mapper
public interface AdmissionPriceMapper {
	int deleteByPrimaryKey(Long id);

	int insert(AdmissionPrice record);

	int insertSelective(AdmissionPrice record);

	AdmissionPrice selectByPrimaryKey(Long id);

	int updateByPrimaryKeySelective(AdmissionPrice record);

	int updateByPrimaryKey(AdmissionPrice record);

	/**
	 * @Description: 根据门票获取成本信息
	 * @author 王斌
	 * @date 2018年4月17日 下午3:01:55
	 * @param pid
	 */
	AdmissionPrice getCostInfoByPid(Long pid);
}