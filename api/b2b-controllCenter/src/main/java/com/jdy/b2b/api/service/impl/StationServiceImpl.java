package com.jdy.b2b.api.service.impl;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;

import com.jdy.b2b.api.common.Constants;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.dao.station.StationMapper;
import com.jdy.b2b.api.dao.station.StationPriceMapper;
import com.jdy.b2b.api.model.station.Station;
import com.jdy.b2b.api.model.station.StationPrice;
import com.jdy.b2b.api.service.StationService;

/**
 * @Description 出发站业务接口实现层
 * @author 王斌
 * @date 2017年7月13日 上午10:21:40
 * @version V1.0
 */
public class StationServiceImpl implements StationService {
	@Autowired
	private StationMapper sdao;
	@Autowired
	private StationPriceMapper spdao;

	@Override
	public ResultBean<Map<String, Object>> stationPriceDataJson(
			StationPrice sp) {
		sp.calc();
		Map<String, Object> result = new HashMap<>();
		result.put(Constants.Result.RESULT_LIST, spdao.queryList(sp));
		result.put(Constants.Result.TOTAL_NUM, spdao.queryListCount(sp));
		return ResultBean.getSuccessResult(result);
	}

	@Override
	public ResultBean<Map<String, Object>> queryList(Station station) {
		Map<String, Object> result = new HashMap<>();
		station.calc();
		result.put(Constants.Result.RESULT_LIST, sdao.queryList(station));
		result.put(Constants.Result.TOTAL_NUM, sdao.queryListCount(station));
		return ResultBean.getSuccessResult(result);
	}

	@Override
	public ResultBean<Map<String, Object>> save(Station station) {
		Map<String, Object> result = new HashMap<>();
		Integer stId = station.getStId();
		if (stId == null) {
			station.setStTime((int) (System.currentTimeMillis() / 1000));
			sdao.insert(station);
			station.initForClearNull();
			result.put(Constants.Fields.STID, stId);
		} else {
			Station current = sdao.selectByPrimaryKey(stId);
			if (Optional.ofNullable(current).isPresent()
					&& Optional.ofNullable(current.getStOrgId()).isPresent()
					&& current.getStOrgId().equals(station.getStOrgId())) {
				sdao.updateByPrimaryKeySelective(station);
			} else {
				result.put(Constants.Error.COMMON_ERROR_CODE,
						Constants.Error.INSUFFICIENT_AUTHORITY);
			}
		}
		return ResultBean.getSuccessResult(result);
	}

	@Override
	public ResultBean<Map<String, Object>> del(Station station) {
		Map<String, Object> result = new HashMap<>();
		Integer stId = station.getStId();
		Station current = sdao.selectByPrimaryKey(stId);
		if (Optional.ofNullable(current).isPresent()
				&& Optional.ofNullable(current.getStOrgId()).isPresent()
				&& current.getStOrgId().equals(station.getStOrgId())) {
			current.setStStatus(Constants.Status.DEL);
			sdao.updateByPrimaryKeySelective(station);
		} else {
			result.put(Constants.Error.COMMON_ERROR_CODE,
					Constants.Error.INSUFFICIENT_AUTHORITY);
		}
		return ResultBean.getSuccessResult(result);
	}

	@Override
	public ResultBean<Map<String, Object>> stationPriceSave(StationPrice sp) {
		Map<String, Object> result = new HashMap<>();
		Integer stId = sp.getSpId();
		if (stId == null) {
			sp.setSpSaveTime((int) (System.currentTimeMillis() / 1000));
			spdao.insert(sp);
			sp.initForClearNull();
			result.put(Constants.Fields.STID, stId);
		} else {
			StationPrice current = spdao.selectByPrimaryKey(stId);
			if (Optional.ofNullable(current).isPresent()
					&& Optional.ofNullable(current.getSpOrgId()).isPresent()
					&& current.getSpOrgId().equals(sp.getSpOrgId())) {
				spdao.updateByPrimaryKeySelective(sp);
			} else {
				result.put(Constants.Error.COMMON_ERROR_CODE,
						Constants.Error.INSUFFICIENT_AUTHORITY);
			}
		}
		return ResultBean.getSuccessResult(result);
	}

	@Override
	public ResultBean<Map<String, Object>> stationPriceDel(StationPrice sp) {
		Map<String, Object> result = new HashMap<>();
		Integer stId = sp.getSpId();
		StationPrice current = spdao.selectByPrimaryKey(stId);
		if (Optional.ofNullable(current).isPresent()
				&& Optional.ofNullable(current.getSpOrgId()).isPresent()
				&& current.getSpOrgId().equals(sp.getSpOrgId())) {
			current.setSpStatus(Constants.Status.DEL);
			spdao.updateByPrimaryKeySelective(current);
		} else {
			result.put(Constants.Error.COMMON_ERROR_CODE,
					Constants.Error.INSUFFICIENT_AUTHORITY);
		}
		return ResultBean.getSuccessResult(result);
	}

}
