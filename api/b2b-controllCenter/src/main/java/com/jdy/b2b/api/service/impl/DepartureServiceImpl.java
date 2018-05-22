package com.jdy.b2b.api.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jdy.b2b.api.common.Constants;
import com.jdy.b2b.api.common.JSONUtil;
import com.jdy.b2b.api.common.PinyinUtil;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.common.StringUtils;
import com.jdy.b2b.api.dao.station.DepartureMapper;
import com.jdy.b2b.api.dao.station.ShuttleBusMapper;
import com.jdy.b2b.api.model.station.Departure;
import com.jdy.b2b.api.model.station.ShuttleBus;
import com.jdy.b2b.api.service.DepartureService;
import com.jdy.b2b.api.vo.station.QueryListForTicketVO;

/**
 * @Description 出发站业务接口实现层
 * @author 王斌
 * @date 2017年7月13日 上午10:21:40
 * @version V1.0
 */
@Service
public class DepartureServiceImpl implements DepartureService {

	@Autowired
	private ShuttleBusMapper sbdao;
	@Autowired
	private DepartureMapper dDao;

	@Override
	public ResultBean<Map<String, Object>> getShuttleBus(ShuttleBus sb) {
		// 分页处理
		sb.calc();

		// 查询并返回
		Map<String, Object> result = new HashMap<>();
		result.put(Constants.Result.RESULT_LIST, sbdao.queryList(sb));
		result.put(Constants.Result.TOTAL_NUM, sbdao.queryListCount(sb));
		return ResultBean.getSuccessResult(result);
	}

	@Override
	public ResultBean<Map<String, Object>> queryList(Departure departure) {
		// 快速搜索字段处理
		dealNameField(departure);

		// 分页处理
		departure.calc();
		// List<Long> companyIds = dDao.queryManagerConpanyIds();
		List<Long> companyIds = new ArrayList<>();
		// 查询并返回
		Map<String, Object> result = new HashMap<>();
		boolean needAll = Objects.equals(departure.getdType(),
				Constants.StationType.ALL_VALUE);
		if (Objects.equals(departure.getdType(),
				Constants.StationType.START_STATION_VALUE) || needAll) {
			if (needAll) {
				departure.setdType(null);
			}
			result.put(Constants.Result.RESULT_LIST,
					dDao.queryListForBegin(companyIds, departure));
		} else {
			result.put(Constants.Result.RESULT_LIST,
					dDao.queryList(departure, new ArrayList<>()));
		}
		result.put(Constants.Result.TOTAL_NUM,
				dDao.queryListCount(companyIds, departure));
		return ResultBean.getSuccessResult(result);
	}

	/**
	 * @Description: 快速搜索字段处理
	 * @author 王斌
	 * @date 2017年7月17日 上午10:06:14
	 * @param departure
	 */
	private void dealNameField(Departure departure) {
		String dname = departure.getdName();
		if (Optional.ofNullable(dname).isPresent()) {

			// 如果是拼音就替换为拼音字段
			if (StringUtils.isEnglish(dname)) {
				departure.setPym(dname);
				departure.setdName(null);
			}

			// 如果是类型就替换为类型字段
			if (Constants.StationType.TYPE_MAP.containsKey(dname)) {
				departure.setdType(Constants.StationType.TYPE_MAP.get(dname));
				departure.setdName(null);
			}
		}
	}

	@Override
	@Transactional
	public ResultBean<Map<String, Object>> saveDeparture(Departure departure) {

		List<Departure> departures = getDepartruesByName(departure);
		if (departures.size() > 0) {
			return new ResultBean<>(Constants.Error.COMMON_ERROR_CODE,
					Constants.Error.EXITS_NAME);
		}
		// 处理初始时间
		departure.initCreatetimeAndUpdateTime();
		// 处理拼音
		String pym = PinyinUtil.getFirstSpell(departure.getdName());
		if (Optional.ofNullable(pym).isPresent() && pym.length() > 50) {
			departure.setPym(pym.substring(0, 50));
		} else {
			departure.setPym(pym);
		}
		// 其他字段给默认设置
		departure.initForClearNull();
		// 保存
		dDao.insert(departure);
		Map<String, Object> result = new HashMap<>();
		Long id = departure.getId();
		result.put(Constants.Fields.ID, id);
		ResultBean<Map<String, Object>> successResult = ResultBean
				.getSuccessResult(result);
		successResult.setId(id);
		return successResult;
	}

	/**
	 * @Description: 查找相同名称departure列表
	 * @author 王斌
	 * @date 2017年7月17日 下午2:46:37
	 * @param departure
	 * @return
	 */
	private List<Departure> getDepartruesByName(Departure departure) {
		// 检查站点名称是否存在
		Departure param = new Departure();
		param.setdName(departure.getdName());
		param.setdStatus(departure.getdStatus());
		param.setdType(departure.getdType());
		param.setCompanyId(departure.getCompanyId());
		List<Departure> departures = dDao.queryDeparture(param);
		return departures;
	}

	@Override
	@Transactional
	public ResultBean<Map<String, Object>> updateDeparture(
			Departure departure) {
		// 检查权限
		Departure current = dDao.selectByPrimaryKey(departure.getId());
		if (Constants.MANAGER_COMPANY_ID == departure.getCompanyId() || Optional
				.ofNullable(current).isPresent()
				&& Optional.ofNullable(current.getCompanyId()).isPresent()
				&& current.getCompanyId().equals(departure.getCompanyId())) {
			// 检查名称唯一性
			List<Departure> currentList = getDepartruesByName(departure);
			int size = currentList.size();
			if (size > 1 || (size > 0
					&& !currentList.get(0).getId().equals(departure.getId()))) {
				return new ResultBean<>(Constants.Error.COMMON_ERROR_CODE,
						Constants.Error.EXITS_NAME);
			}
			// 处理初始时间
			departure.initUpdateTime();
			// 处理拼音
			String pym = PinyinUtil.getFirstSpell(departure.getdName());
			if (Optional.ofNullable(pym).isPresent() && pym.length() > 50) {
				departure.setPym(pym.substring(0, 50));
			} else {
				departure.setPym(pym);
			}
			// 修改
			dDao.updateByPrimaryKeySelective(departure);
		}

		Map<String, Object> result = new HashMap<>();
		result.put(Constants.Fields.ID, departure.getId());
		return ResultBean.getSuccessResult(result);
	}

	@Override
	@Transactional
	public ResultBean<Map<String, Object>> delDeparture(Departure departure) {

		// 数据存在就修改
		Departure current = dDao.selectByPrimaryKey(departure.getId());
		if (Optional.ofNullable(current).isPresent()) {
			current.setdStatus(1);

			// 处理修改时间
			current.initUpdateTime();
			current.setUpdateUser(departure.getUpdateUser());
			dDao.updateByPrimaryKeySelective(current);
		}
		Map<String, Object> result = new HashMap<>();
		result.put(Constants.Fields.ID, departure.getId());
		return ResultBean.getSuccessResult(result);
	}

	@Override
	@Transactional
	public ResultBean<Map<String, Object>> saveShuttleBus(ShuttleBus sb,
			int useForBack) {
		Map<String, Object> result = new HashMap<>();
		// 判断开始时间和结束时间大小
		if (sb.getSbStartTime().compareTo(sb.getSbEndTime()) > 0) {
			return new ResultBean<>(Constants.Error.COMMON_ERROR_CODE,
					Constants.Error.ERROR_DATE);
		}
		// 判断时间是否交叉
		List<Long> ids = sbdao.getShuttleBusCountByTimeAndStatus(sb);
		if (ids.size() > 0) {
			return new ResultBean<>(Constants.Error.COMMON_ERROR_CODE,
					Constants.Error.EXITS_DATE);
		}
		// 处理初始时间
		sb.initCreatetimeAndUpdateTime();
		// 其他字段给默认设置
		sb.initForClearNull();

		if (useForBack == 1 && sb.getSbReturn() == (byte) 0) {
			ShuttleBus backBus = JSONUtil.trans(sb, ShuttleBus.class);
			// backBus.setSbTime(null);
			// backBus.setSbPrice(null);
			backBus.setSbReturn((byte) 1);
			backBus.setSbTime(null);
			List<ShuttleBus> sbList = new ArrayList<>();
			sbList.add(sb);
			sbList.add(backBus);
			sbdao.batchSave(sbList);
			Long id = backBus.getId();
			result.put(Constants.Fields.ID, id);
			ResultBean<Map<String, Object>> successResult = ResultBean
					.getSuccessResult(result);
			return successResult;
		} else {
			sbdao.insert(sb);
			Long id = sb.getId();
			result.put(Constants.Fields.ID, id);
			ResultBean<Map<String, Object>> successResult = ResultBean
					.getSuccessResult(result);
			successResult.setId(id);
			return successResult;
		}
	}

	@Override
	@Transactional
	public ResultBean<Map<String, Object>> delShuttleBus(ShuttleBus sb) {
		ShuttleBus param = new ShuttleBus();
		Long id = sb.getId();
		param.setId(id);
		param.setSbStatus(Constants.Status.DISABLE);
		param.initUpdateTime();
		param.setUpdateUser(sb.getUpdateUser());

		sbdao.updateByPrimaryKeySelective(param);
		Map<String, Object> result = new HashMap<>();
		result.put(Constants.Fields.ID, id);
		return ResultBean.getSuccessResult(result);
	}

	@Override
	public Map<String, Object> queryListForTicket(QueryListForTicketVO vo) {
		// 查询并返回
		Map<String, Object> result = new HashMap<>();
		Departure param = JSONUtil.trans(vo, Departure.class);
		param.setdType(0);
		List<String> citys = vo.getCitys();
		List<Long> companyIds = dDao.queryManagerConpanyIds();
		result.put(Constants.Result.RESULT_LIST,
				dDao.queryListForTicket(param, citys, companyIds));
		result.put(Constants.Result.TOTAL_NUM,
				dDao.queryListForTicketCount(param, citys, companyIds));
		return result;
	}

	@Override
	public ResultBean<Map<String, Object>> updateShuttleBus(ShuttleBus sb) {
		// 判断开始时间和结束时间大小
		if (sb.getSbStartTime().compareTo(sb.getSbEndTime()) > 0) {
			return new ResultBean<>(Constants.Error.COMMON_ERROR_CODE,
					Constants.Error.ERROR_DATE);
		}
		// 判断时间是否交叉
		List<Long> ids = sbdao.getShuttleBusCountByTimeAndStatus(sb);
		if (ids.size() > 1
				|| (ids.size() == 1 && !ids.get(0).equals(sb.getId()))) {
			return new ResultBean<>(Constants.Error.COMMON_ERROR_CODE,
					Constants.Error.EXITS_DATE);
		}
		sb.initUpdateTime();
		sbdao.updateByPrimaryKeySelective(sb);
		Map<String, Object> result = new HashMap<>();
		result.put(Constants.Fields.ID, sb.getId());
		return ResultBean.getSuccessResult(result);
	}
}
