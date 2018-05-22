package com.jdy.b2b.api.dao.admission;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.jdy.b2b.api.model.admission.AdmissionSalePrice;

@Mapper
public interface AdmissionSalePriceMapper {
	int deleteByPrimaryKey(Long id);

	int insert(AdmissionSalePrice record);

	int insertSelective(AdmissionSalePrice record);

	AdmissionSalePrice selectByPrimaryKey(Long id);

	int updateByPrimaryKeySelective(AdmissionSalePrice record);

	int updateByPrimaryKey(AdmissionSalePrice record);

	/**
	 * @Description: 根据门票获取票价信息
	 * @author 王斌
	 * @date 2018年4月17日 下午3:02:45
	 * @param pid
	 * @return
	 */
	List<AdmissionSalePrice> getPriceInfoByPid(Map<String, Object> map);
	int getPriceInfoCountByPid(Map<String, Object> map);
}