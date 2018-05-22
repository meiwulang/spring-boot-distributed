package com.jdy.b2b.api.service.impl;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.jdy.b2b.api.common.Constants.Result.RESULT_LIST;
import static com.jdy.b2b.api.common.Constants.Result.TOTAL_NUM;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.dao.admission.AdmissionContractTemplateMapper;
import com.jdy.b2b.api.dao.admission.AdmissionPriceMapper;
import com.jdy.b2b.api.dao.admission.AdmissionSalePriceMapper;
import com.jdy.b2b.api.model.admission.AdmissionContractTemplate;
import com.jdy.b2b.api.model.admission.AdmissionPrice;
import com.jdy.b2b.api.model.admission.AdmissionSalePrice;
import com.jdy.b2b.api.service.AdmissionExtendsService;


/**
 * @Description 门票拓展信息业务实现层
 * @author 王斌
 * @date 2018年4月17日 下午2:38:08
 * @version V1.0
 */
@Service
public class AdmissionExtendsServiceImpl implements AdmissionExtendsService {
	@Autowired
	private AdmissionContractTemplateMapper actmapper;
	@Autowired
	private AdmissionPriceMapper apmapper;
	@Autowired
	private AdmissionSalePriceMapper aspmapper;

	@Override
	@Transactional
	public ResultBean<Object> bindContract(AdmissionContractTemplate dto) {
		AdmissionContractTemplate existRecord = actmapper.getContractInfoByPid(dto.getPid());
		dto.setCreateTime(null);
		dto.setCreateUser(null);
		if (existRecord != null) {
			dto.setId(existRecord.getId());
			actmapper.updateByPrimaryKeySelective(dto);
		} else {
			actmapper.insertSelective(dto);
		}
		return ResultBean.getSuccessResultForLog(dto.getId());
	}

	@Override
	@Transactional
	public ResultBean<Object> saveCost(AdmissionPrice dto) {
		AdmissionPrice existRecord = apmapper.getCostInfoByPid(dto.getPid());
		dto.setCreateTime(null);
		dto.setCreateUser(null);
		dto.setUpdateTime(null);
		dto.setUpdateUser(null);
		if (existRecord != null) {
			dto.setId(existRecord.getId());

			apmapper.updateByPrimaryKeySelective(dto);
		} else {
			apmapper.insertSelective(dto);
		}
		return ResultBean.getSuccessResultForLog(dto.getId());
	}

	@Override
	@Transactional
	public ResultBean<Object> savePrice(AdmissionSalePrice dto) {
		if(dto.getId()!=null){
			dto.setUpdateTime(new Date());
			dto.setCreateUser(null);
			dto.setUpdateUser(dto.getCreateUser());
			aspmapper.updateByPrimaryKeySelective(dto);
		}else{
			dto.setUpdateTime(new Date());
			aspmapper.insertSelective(dto);
		}
		return ResultBean.getSuccessResultForLog(dto.getId());
	}

	@Override
	public ResultBean<Object> contractInfo(Long pid) {
		return ResultBean.getSuccessResult(actmapper.getContractInfoByPid(pid));
	}

	@Override
	public ResultBean<Object> costInfo(Long pid) {
		return ResultBean.getSuccessResult(apmapper.getCostInfoByPid(pid));
	}

	@Override
	public ResultBean<Object> priceInfo(Long id) {
		return ResultBean.getSuccessResult(aspmapper.selectByPrimaryKey(id));
	}

	@Override
	public ResultBean<Object> priceList(Map<String, Object> map) {
		Map<String, Object>resultMap=new HashMap<>();
		resultMap.put(RESULT_LIST, aspmapper.getPriceInfoByPid(map));
		resultMap.put(TOTAL_NUM, aspmapper.getPriceInfoCountByPid(map));
		return ResultBean.getSuccessResult(resultMap);
	}

	@Override
	public ResultBean<Object> deletePrice(AdmissionSalePrice asp) {
		aspmapper.updateByPrimaryKeySelective(asp);
		return ResultBean.getSuccessResult(asp.getId());
	}

}
