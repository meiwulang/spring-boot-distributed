package com.jdy.b2b.api.dao.admission;

import org.apache.ibatis.annotations.Mapper;

import com.jdy.b2b.api.model.admission.AdmissionContractTemplate;

@Mapper
public interface AdmissionContractTemplateMapper {
	int deleteByPrimaryKey(Long id);

	int insert(AdmissionContractTemplate record);

	int insertSelective(AdmissionContractTemplate record);

	AdmissionContractTemplate selectByPrimaryKey(Long id);

	int updateByPrimaryKeySelective(AdmissionContractTemplate record);

	int updateByPrimaryKey(AdmissionContractTemplate record);

	/**
	 * @Description: 根据门票获取合同绑定关系
	 * @author 王斌
	 * @date 2018年4月17日 下午3:00:37
	 * @param pid
	 */
	AdmissionContractTemplate getContractInfoByPid(Long pid);
}