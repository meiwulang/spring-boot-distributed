package com.jdy.b2b.api.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.jdy.b2b.api.common.Constants;
import com.jdy.b2b.api.common.PinyinUtil;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.dao.station.StationStartMapper;
import com.jdy.b2b.api.model.station.StationStart;
import com.jdy.b2b.api.service.StationStartService;

/**
 * @Description 始发站业务层
 * @author 王斌
 * @date 2017年7月10日 上午9:58:31
 * @version V1.0
 */
@Service
public class StationStartServiceImpl implements StationStartService {
	@Autowired
	private StationStartMapper ssdao;

	@Override
	public Map<String, Object> queryList(StationStart t) {
		Map<String, Object> result = new HashMap<>();

		List<Map<String, String>> orderFields = new ArrayList<>();// 排序字段集合
		Map<String, String> orderField1 = new HashMap<>();
		orderField1.put(Constants.Query.FIELD, "sd_city");
		orderField1.put(Constants.Query.DRCT, Constants.Query.DESC);
		Map<String, String> orderField2 = new HashMap<>();
		orderField2.put(Constants.Query.FIELD, "sd_id");
		orderField2.put(Constants.Query.DRCT, Constants.Query.DESC);

		orderFields.add(orderField2);
		orderFields.add(orderField1);
		t.setOrderFields(orderFields);// 添加排序字段
		t.calc();

		result.put(Constants.Result.RESULT_LIST, ssdao.queryList(t));// 列表
		result.put(Constants.Result.TOTAL_NUM, ssdao.queryListCount(t));// 总数
		return result;
	}

	@Override
	public ResultBean<Map<String, Object>> saveOrUpdate(StationStart t) {

		t.setSdTime((int) (System.currentTimeMillis() / 1000));
		HashMap<String, Object> result = new HashMap<>();
		if (Optional.ofNullable(t.getSdId()).isPresent()) {
			return updateStationStart(t, result);// 更新
		} else {
			return saveStationStart(t, result);// 保存
		}
	}

	@Override
	public Map<String, Object> queryListForTicket(StationStart t) {
		Map<String, Object> result = new HashMap<>();

		List<Map<String, String>> orderFields = new ArrayList<>();// 排序字段集合
		Map<String, String> orderField1 = new HashMap<>();
		orderField1.put(Constants.Query.FIELD, "sd_name");
		orderField1.put(Constants.Query.DRCT, Constants.Query.DESC);

		orderFields.add(orderField1);
		t.setOrderFields(orderFields);// 添加排序字段
		t.calc();

		result.put(Constants.Result.RESULT_LIST, ssdao.queryList(t));// 列表
		result.put(Constants.Result.TOTAL_NUM, ssdao.queryListCount(t));// 总数
		return result;
	}

	/**
	 * @Description: 更新始发站
	 * @author 王斌
	 * @date 2017年7月10日 下午3:39:17
	 * @param t
	 * @param result
	 * @return
	 */
	@SuppressWarnings("unchecked")
	private ResultBean<Map<String, Object>> updateStationStart(StationStart t,
			Map<String, Object> result) {
		// 权限判断
		Integer sdId = t.getSdId();
		StationStart current = ssdao.selectByPrimaryKey(sdId);
		if (current == null) {
			return new ResultBean<>("-1", "该数据不存在");
		} else if (!current.getSdId().equals(sdId) && !sdId.equals(1)) {
			return new ResultBean<>("-1", "权限不足");
		}
		if (Optional.ofNullable(t.getSdName()).isPresent()) {
			List<StationStart> ssList = ssdao.queryBysdName(t);
			if (ssList.size() > 1 || (ssList.size() == 1
					&& !ssList.get(0).getSdId().equals(t.getSdId()))) {
				return new ResultBean<>("-1", "该始发站名称已存在!");
			}
			// 名称修改时修改拼音
			t.setSdPym(PinyinUtil.getFirstSpell(t.getSdName()));
		}
		ssdao.updateByPrimaryKeySelective(t);
		return ResultBean.getSuccessResult();
	}

	/**
	 * @Description: 保存始发站
	 * @author 王斌
	 * @date 2017年7月10日 下午3:39:49
	 * @param t
	 * @param result
	 * @return
	 */
	private ResultBean<Map<String, Object>> saveStationStart(StationStart t,
			Map<String, Object> result) {
		if (!Optional.ofNullable(t.getSdName()).isPresent()) {
			return new ResultBean<>("-1", "字段 sdName 不能为空");
		}
		if (ssdao.countBysdName(t) > 0) {
			return new ResultBean<>("-1", "该始发站名称已存在!");
		}
		if (!Optional.ofNullable(t.getSdStartType()).isPresent()) {
			return new ResultBean<>("-1", "字段 sdStartType 不能为空");
		}
		if (!Optional.ofNullable(t.getSdProvince()).isPresent()) {
			return new ResultBean<>("-1", "字段 sdProvince 不能为空");
		}
		if (!Optional.ofNullable(t.getSdCity()).isPresent()) {
			return new ResultBean<>("-1", "字段 sdCity 不能为空");
		}
		if (!Optional.ofNullable(t.getSdCounty()).isPresent()) {
			return new ResultBean<>("-1", "字段 sdCounty 不能为空");
		}
		t.setSdStatus("ok");
		t.setSdPym(PinyinUtil.getFirstSpell(t.getSdName()));
		ssdao.insertSelective(t);
		result.put("sdId", t.getSdId());
		return ResultBean.getSuccessResult(result);
	}

	@Override
	public ResultBean<Integer> delStationStart(StationStart t) {
		// 权限判断
		Integer sdId = t.getSdId();
		StationStart current = ssdao.selectByPrimaryKey(sdId);
		if (current == null) {
			return new ResultBean<>("-1", "该数据不存在");
		} else if (!current.getSdId().equals(sdId) && !sdId.equals(1)) {
			return new ResultBean<>("-1", "权限不足");
		}
		t.setSdStatus("del");
		return ResultBean
				.getSuccessResult(ssdao.updateByPrimaryKeySelective(t));
	}
}
