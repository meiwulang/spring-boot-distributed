package com.jdy.b2b.api.service.impl;

import com.jdy.b2b.api.common.Constants;
import com.jdy.b2b.api.common.JSONUtil;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.dao.pic.AttachMapper;
import com.jdy.b2b.api.dao.product.FrontProductMapper;
import com.jdy.b2b.api.dao.product.TripHotelMapper;
import com.jdy.b2b.api.dao.product.TripMapper;
import com.jdy.b2b.api.dao.product.TripScenicMapper;
import com.jdy.b2b.api.model.product.*;
import com.jdy.b2b.api.model.station.AppStation;
import com.jdy.b2b.api.service.FrontProductsService;
import com.jdy.b2b.api.vo.product.FrontProductVO;
import com.jdy.b2b.api.vo.product.FrontStationVO;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.Map.Entry;

/**
 * @Description 门户+app接口
 * @author 王斌
 * @date 2017年9月22日 下午8:48:31
 * @version V1.0
 */
@Service
@SuppressWarnings("unchecked")
public class FrontProductsServiceImpl implements FrontProductsService {
	@Autowired
	private FrontProductMapper frontProductMapper;
	@Autowired
	private TripMapper tripDao;
	@Autowired
	private TripHotelMapper tripHotelDao;
	@Autowired
	private AttachMapper attachDao;
	@Value("${GNO}")
	private String GNO;
	@Autowired
	private TripScenicMapper tripScenicDao;
	private static final String PRICE = "price";
	private static final String ID_STRING = "id";
	private static final String BL_ID = "bl_id";
	private static final String T_TYPE = "t_type";
	private static final String P_FROM = "pFrom";
	private static final String TITLE_STR = "title";
	private static final String SELF_MANAGER = "【自营研发】";
	private static final String NOT_SELF_MANAGER = "【散拼】";
	private static final String SELF_MANAGER_CUSTOM = "【自营定制】";
	private static final String DP_RESOURCE = "【单项资源】";
	private static final String TRAVEL_PHOTO = "【途忆旅拍】";
	private static final String UN_KNOW = "【未知】";

	@Override
	public ResultBean<?> buslist(String type, int start, String city_code) {
		return null;
	}

	@Override
	public ResultBean<?> detail(Long p_id, String start_date, String city_code,
			String from, String openId, Long companyId) {
		FrontProduct frontProduct = frontProductMapper.detail(p_id, start_date,
				city_code);
		frontProduct.setStart_place_detail(new ArrayList<>());
		frontProduct.getSlide_img().add(frontProduct.getP_cover());
		Map<String, Object> bus_list = frontProduct.getBus_list();
		// 非区域产品 无需companyId 作为查询条件
		if (!Integer.valueOf(1).equals(frontProduct.getpAscription())) {
			companyId = null;
		}else if(frontProductMapper.countGroupInfo(openId)>0){
			companyId = null;
		}
		/**
		 * 关于H5端班期上显示票的价格，是不是可见类目下，成人票最低价，如果没有成人票，则是可见类目下，儿童票最低价
		 * 处理方案：取可见范围内最近的8个班期
		 * 并分组查询出各个班期的成人、儿童最低票价，如果某班期只存在成人票或儿童票，将其作为最终展示信息，否则取成人最低票那一组作为最终展示信息
		 */
		List<Map<String, Object>> busList = frontProductMapper.getBusList(p_id,
				from, openId, companyId);
		List<Map<String, Object>> finalBusList = new ArrayList<>(8);
		int size = busList.size();
		if (busList != null && size > 0 && busList.get(0) != null) {
			for (int i = 0; i < size;) {
				if (i >= size) {
					break;
				}
				Map<String, Object> mapI = busList.get(i);
				Map<String, Object> mapJ = new HashMap<>();
				int index = i + 1;
				if (index < size) {
					mapJ = busList.get(index);
				}
				if (mapI.get(BL_ID).equals(mapJ.get(BL_ID))) {
					if (Integer.valueOf(0).equals((mapI.get(T_TYPE)))) {
						finalBusList.add(mapI);
					} else {
						finalBusList.add(mapJ);
					}
					i = i + 2;
				} else {
					finalBusList.add(mapI);
					i++;
				}
			}
		}
		bus_list.put("list", finalBusList);

		getTicketMin(p_id, frontProduct, from, openId, companyId);

		Map<java.lang.String, java.lang.Object> productDetail = new LinkedHashMap<>();
		getRoute(p_id, productDetail);

		Map<String, Object> detail = JSONUtil.trans(frontProduct, Map.class);
		getTrips(p_id, start_date, productDetail);
		detail.put("detail", productDetail);
		detail.put("p_type_name",
				Constants.ProduceType.POOL.get(frontProduct.getP_type()));
		return ResultBean.getSuccessResult(detail);
	}

	/**
	 * @Description: TODO
	 * @author 王斌
	 * @date 2017年9月28日 下午7:07:25
	 * @param p_id
	 * @param productDetail
	 */
	private void getRoute(Long p_id,
			Map<java.lang.String, java.lang.Object> productDetail) {
		Iterator<Entry<String, Object>> routeIterator = frontProductMapper
				.getProdudtRoute(p_id).entrySet().iterator();
		while (routeIterator.hasNext()) {
			Map.Entry<java.lang.String, java.lang.Object> entry = routeIterator
					.next();
			HashMap<String, Object> teMap = new HashMap<>();
			Object value = entry.getValue();
			if (value != null) {
				if ("feature".equals(entry.getKey())) {
					teMap.put("title", "线路特色");
					teMap.put("detail", value);
					productDetail.put("feature", teMap);
				}
				if ("cost_in".equals(entry.getKey())) {
					teMap.put("title", "费用包含");
					teMap.put("detail", value);
					productDetail.put("cost_in", teMap);
				}
				if ("cost_noin".equals(entry.getKey())) {
					teMap.put("title", "费用不包含");
					teMap.put("detail", value);
					productDetail.put("cost_noin", teMap);
				}
				if ("notice".equals(entry.getKey())) {
					teMap.put("title", "预订须知");
					teMap.put("detail", value);
					productDetail.put("notice", teMap);
				}
				if ("visa".equals(entry.getKey())) {
					teMap.put("title", "签证信息");
					teMap.put("detail", value);
					productDetail.put("visa", teMap);
				}
				if ("cost_remark".equals(entry.getKey())) {
					teMap.put("title", "费用说明");
					teMap.put("detail", value);
					productDetail.put("cost_remark", teMap);
				}
				if ("staff".equals(entry.getKey())) {
					teMap.put("title", "在职员工");
					teMap.put("detail", value);
					productDetail.put("staff", teMap);
				}
				if ("retiree".equals(entry.getKey())) {
					teMap.put("title", "退休人员");
					teMap.put("detail", value);
					productDetail.put("retiree", teMap);
				}
				if ("professional".equals(entry.getKey())) {
					teMap.put("title", "自由职业者");
					teMap.put("detail", value);
					productDetail.put("professional", teMap);
				}
				if ("preschool".equals(entry.getKey())) {
					teMap.put("title", "学龄前儿童");
					teMap.put("detail", value);
					productDetail.put("preschool", teMap);
				}
				if ("student".equals(entry.getKey())) {
					teMap.put("title", "在校学生");
					teMap.put("detail", value);
					productDetail.put("student", teMap);
				}
				if ("jobless".equals(entry.getKey())) {
					teMap.put("title", "无业人员");
					teMap.put("detail", value);
					productDetail.put("jobless", teMap);
				}
			}
		}
	}

	private void getTrips(Long p_id, String start_date,
			Map<java.lang.String, java.lang.Object> productDetail) {
		List<Map<String, Object>> trips;
		if (start_date != null && StringUtils.isNotBlank(start_date)) {
			String endDate = start_date.contains(",") ? start_date.split(",")[1]
					: null;
			start_date = start_date.split(",")[0];
			trips = tripDao.queryByProductIdAndStartAndEndDate(p_id, start_date,
					endDate);
		} else {
			trips = tripDao.queryByProductIdAndType(p_id, 0);
		}
		if (trips.size() > 0) {
			// 组装关联信息
			assembleTripDetail(trips);
			HashMap<String, Object> teMap = new HashMap<>();
			teMap.put("title", "行程说明");
			teMap.put("detail", trips);
			productDetail.put("stroke", teMap);
		}
	}

	/**
	 * @Description: 产品组装详细信息
	 * @author 王斌
	 * @date 2017年7月24日 下午4:08:59
	 * @param trips
	 */
	private void assembleTripDetail(List<Map<String, Object>> trips) {
		Iterator<Map<String, Object>> iterator = trips.iterator();
		while (iterator.hasNext()) {
			Map<String, Object> map = iterator.next();
			Long tripId = (Long) map.get(Constants.Fields.ID);
			String meal = (String) map.get("tMeals");
			String[] meals = null;
			switch (meal) {
			case "000":
				meals = null;
				break;
			case "001":
				meals = new String[] { "晚餐" };
				break;
			case "010":
				meals = new String[] { "午餐" };
				break;
			case "100":
				meals = new String[] { "早餐" };
				break;
			case "011":
				meals = new String[] { "午餐", "晚餐" };
				break;
			case "101":
				meals = new String[] { "早餐", "晚餐" };
				break;
			case "110":
				meals = new String[] { "早餐", "午餐" };
				break;
			case "111":
				meals = new String[] { "早餐", "午餐", "晚餐" };
				break;
			default:
				meals = new String[] {};
				break;

			}
			map.put("food", meals);
			ArrayList<String> hotels = new ArrayList<>();
			// 组装酒店
			List<TripHotelDTO> queryHotelByTripId = tripHotelDao
					.queryHotelByTripId(tripId);
			Iterator<TripHotelDTO> iterator2 = queryHotelByTripId.iterator();
			while (iterator2.hasNext()) {
				TripHotelDTO map2 = iterator2.next();
				hotels.add(map2.gethName());

			}
			map.put(Constants.Fields.HOTEL, hotels);
			map.put("food_remark", map.get("tMealsRemark"));
			// 组装景点
			List<TripScenicDTO> queryScenicByTripId2 = tripScenicDao
					.queryScenicByTripId(tripId);
			@SuppressWarnings("rawtypes")
			List<Map> queryScenicByTripId = JSONUtil
					.transInSide(queryScenicByTripId2, Map.class);
			List<Object> scenicIds = new ArrayList<>();
			for (Map<java.lang.String, java.lang.Object> scenic : queryScenicByTripId) {
				scenicIds.add(scenic.get("sName"));
			}
			map.put("source", scenicIds);
			map.put("detail", map.get("tDetailTrip"));
			map.put("hotel_remark", "");
			map.remove("tDetailTrip");

			// 组装附件
			map.put("pic_img", attachDao.queryAttachPpId(tripId, 1));
		}
	}

	/**
	 * @Description: TODO
	 * @author 王斌
	 * @date 2017年9月28日 下午6:48:45
	 * @param p_id
	 * @param frontProduct
	 * @param from
	 * @param openId
	 * @param companyId
	 */
	private void getTicketMin(Long p_id, FrontProduct frontProduct, String from,
			String openId, Long companyId) {
		TicketObject ticket_detail_min = new TicketObject();
		// ticket_detail_min.set儿童票(frontProductMapper.getChildrenTicket(p_id));

		// Map<String, Object> adultMinTicket =
		// frontProductMapper.getAdultZhiKeMinTicket(p_id);
		// if(adultMinTicket==null||adultMinTicket.size()<1){
		// adultMinTicket = frontProductMapper.getAdultMinTicket(p_id);
		// }
		// if(adultMinTicket==null||adultMinTicket.size()<1){
		// adultMinTicket = frontProductMapper.getChildMinTicket(p_id);
		// }
		// ticket_detail_min
		// .set成人票(adultMinTicket);
		ticket_detail_min
				.set成人票(frontProductMapper.getMinTicket(p_id, companyId));
		// ticket_detail_min.set套票(frontProductMapper.getPackageTicket(p_id));
		frontProduct.setTicket_detail_min(ticket_detail_min);
	}

	@Override
	public ResultBean<?> info(Integer p_id, Integer bl_id, String sign,
			String time_stamp, String city_code) {
		return null;
	}

	@Override
	public ResultBean<?> lists(Integer start, String city_code, Integer limit,
			String type) {
		// TODO Auto-generated method stub
		return null;
	}

	/**
	 * 1、产品根据虚拟组的规则来展示。 2、展示的产品中，将同在虚拟组的人，有配置直客类目的成人票最低票价显示。
	 * 3、如果没有直客类目成人票，则显示其余类目中，成人票的最低价。 4、如果其余类目中，也没有成人票，则显示儿童票最低价
	 */
	@Override
	@Transactional(readOnly = true) // 加事务可以减少创建sqlsession和jdbc连接的开销
	public ResultBean<?> wap_buslist(String source, String city_code,
			String openid, Integer dataLimit, Long companyId) {
		// 查出所有该用户绑定的产品
		List<Map<String, Object>> productBasicInfos = frontProductMapper
				.getProductBasicInfoByOpenId(openid, GNO);
		// 如果productBasicInfos 为空集合直接返回
		Integer pidsSize1 = productBasicInfos.size();
		boolean pidsIsNull1 = productBasicInfos == null
				|| Integer.valueOf(0).equals(pidsSize1)
				|| (Integer.valueOf(1).equals(pidsSize1)
						&& productBasicInfos.get(0) == null);
		if (pidsIsNull1) {
			return ResultBean.getSuccessResult(new ArrayList<>(0));
		}
		// 循环 pids集合 查询所有产品的基本信息+票价信息
		for (Map<String, Object> pruduct : productBasicInfos) {
			Object title = pruduct.get(TITLE_STR);
			if (((Integer) pruduct.get(P_FROM)).equals(Integer.valueOf(0))) {//自营研发
				pruduct.put(TITLE_STR,
						new StringBuilder(SELF_MANAGER).append(title));
			} else if (((Integer) pruduct.get(P_FROM)).equals(Integer.valueOf(1))) {//散拼
				pruduct.put(TITLE_STR,
						new StringBuilder(NOT_SELF_MANAGER).append(title));
			}else if (((Integer) pruduct.get(P_FROM)).equals(Integer.valueOf(2))) {//自营定制
				pruduct.put(TITLE_STR,
						new StringBuilder(SELF_MANAGER_CUSTOM).append(title));
			}else if (((Integer) pruduct.get(P_FROM)).equals(Integer.valueOf(3))) {//单一资源
				pruduct.put(TITLE_STR,
						new StringBuilder(DP_RESOURCE).append(title));
			}else if (((Integer) pruduct.get(P_FROM)).equals(Integer.valueOf(4))) {//途忆旅拍
				pruduct.put(TITLE_STR,
						new StringBuilder(TRAVEL_PHOTO).append(title));
			} else{//未知
				pruduct.put(TITLE_STR,
						new StringBuilder(UN_KNOW).append(title));
			}
			Object productId = pruduct.get(ID_STRING);
			pruduct.put(PRICE,
					frontProductMapper.getProductsMinTicket((Long) productId));
		}
		return ResultBean.getSuccessResult(productBasicInfos);
	}
	// /**
	// *此版本 按照绑定得产品、票展示
	// */
	// @Override
	// public ResultBean<?> wap_buslist(String source, String city_code,
	// String openid,Integer dataLimit,Long companyId) {
	// // 查询用户所在虚拟分组的所有产品编号
	// List<Long> pids = frontProductMapper.getProductIdsByOpenId(openid);
	// List<Long> tIds = frontProductMapper.getTicketsByOpenId(openid);
	// Integer pidsSize1=pids.size();
	// boolean pidsIsNull1 = pids == null
	// ||Integer.valueOf(0).equals(pidsSize1)||
	// (Integer.valueOf(1).equals(pidsSize1) && pids.get(0) == null);
	// if (pidsIsNull1
	// || (tIds == null
	// || (tIds.size() == 1 && tIds.get(0) == null))) {
	// // pids = null;
	// return ResultBean.getSuccessResult(new ArrayList<>(0));
	// }
	// //查询用户直接关联的票并组装
	// tIds=getExtTicketIds(openid, tIds);
	//
	// //添加用户权限 系统级用户查看全部可视产品，其他人员展示自己公司产品+总公司产品
	//// if(!Integer.valueOf(3).equals(dataLimit)){
	//// pids=frontProductMapper.getProductIdsByIdsAndCompany(pids, companyId);
	//// }
	// Integer pidsSize2=pids.size();
	// boolean pidsIsNull2 = pids == null ||
	// Integer.valueOf(0).equals(pidsSize2)||
	// (Integer.valueOf(1).equals(pidsSize2) && pids.get(0) == null);
	// if(pidsIsNull2){return ResultBean.getSuccessResult(new ArrayList<>(0));}
	// List<Map<String, Object>> appPdtlists = frontProductMapper
	// .wapBuslist(source, city_code, pids, tIds);
	// return ResultBean.getSuccessResult(appPdtlists);
	// }

	/**
	 * @Description: 查询用户直接关联的票并组装
	 * @author 王斌
	 * @date 2018年1月4日 上午9:30:20
	 * @param openid
	 * @param tIds
	 */
	private List<Long> getExtTicketIds(String openid, List<Long> tIds) {
		List<Long> tIds1 = frontProductMapper
				.getTicketsByOpenIdInProductUserTable(openid);
		Set<Long> tIdSet = new HashSet<>(tIds);
		tIdSet.addAll(tIds1);
		tIds.clear();
		tIds.addAll(tIdSet);
		return tIds;
	}

	@Override
	public ResultBean<?> appPdtlists(FrontProductVO vo) {
		FrontAppProduct param = JSONUtil.trans(vo, FrontAppProduct.class);
		Integer start = param.getStart();
		if (start > 0) {
			param.setStart(start - 1);
		} else {
			start = 0;
		}
		String start_date = param.getStartDate();
		if (Objects.equals(param.getProvince(), "全部")) {
			param.setProvince(null);
		}
		if (Objects.equals(param.getBusiness(), "")) {
			param.setBusiness(null);
		}
		if (Objects.equals(param.getDestination(), "")) {
			param.setDestination(null);
		}
		if (Objects.equals(param.getScenic(), "")) {
			param.setScenic(null);
		}
		if (Objects.equals(start_date, "undefined")) {
			param.setStartDate(null);
		}
		if (start_date != null && start_date.contains(",")
				&& start_date.length() == 17) {
			String[] split = start_date.split(",");
			param.setStartDate(split[0]);
			param.setEndDate(split[1]);
		}
		List<Map<String, Object>> appPdtlists = frontProductMapper
				.appPdtlists(param);
		recombineAPPPdtlists(appPdtlists, null);
		HashMap<String, Object> rootData = new HashMap<>();
		rootData.put("list", appPdtlists);
		rootData.put("start", vo.getStart());
		rootData.put("limit", vo.getLimit());
		rootData.put("total", appPdtlists.size());
		return ResultBean.getSuccessResult(rootData);
	}

	private void recombineAPPPdtlists(List<Map<String, Object>> appPdtlists,
			Map<String, Object> rootData) {
		Iterator<Map<String, Object>> iterator = appPdtlists.iterator();
		while (iterator.hasNext()) {
			Map<java.lang.String, java.lang.Object> map = iterator.next();
			if (map.get("p_confirm").equals(true)) {
				HashMap<String, String> key = new HashMap<>();
				key.put("pk_bgcolor", "#ff5e12");
				key.put("pk_color", "#f9ff05");
				key.put("pk_name", "无需确认");
				ArrayList<HashMap<String, String>> keys = new ArrayList<>();
				keys.add(key);
				map.put("p_key", keys);
			}
			String key = "p_type_name";
			map.put(key, Constants.ProduceType.POOL.get(map.get("p_type")));
			String selectBusList = frontProductMapper
					.selectBusList((Long) map.get("p_id"));
			if (selectBusList != null) {
				selectBusList = selectBusList.replaceAll(",", "");
				selectBusList = selectBusList.substring(0,
						selectBusList.length() - 1);
			}
			map.put("bus_lists", selectBusList);
		}
	}

	@Override
	public ResultBean<?> station(FrontStationVO vo) {
		AppStation param = JSONUtil.trans(vo, AppStation.class);
		param.setT_ids(java.util.Arrays.asList(vo.getT_id().split(",")));
		// List<String> tickets = param.getT_ids();
		// 查询产品的单票
		// if (tickets != null && tickets.size() > 0) {
		// param.setT_ids(frontProductMapper.getAllSingleTickets(tickets));
		// }
		String start_date = param.getStart_date();
		if (start_date != null && start_date.contains(",")
				&& start_date.length() == 17) {
			String[] split = start_date.split(",");
			param.setStart_date(split[0]);
			param.setEnd_date(split[1]);
		}
		List<Map<String, Object>> stations = frontProductMapper
				.startStations(param);
		HashMap<String, Object> data = new HashMap<>();
		HashMap<String, Object> rootData = new HashMap<>();
		rootData.put("data", data);
		rootData.put("page", 0);
		recombineResult(stations, data, param);
		rootData.put("total", stations.size());
		return ResultBean.getSuccessResult(rootData);
	}

	private void recombineResult(List<Map<String, Object>> stations,
			HashMap<String, Object> data, AppStation vo) {
		Iterator<Map<String, Object>> iterator = stations.iterator();
		ArrayList<Map<String, Object>> goStationList = new ArrayList<>();
		ArrayList<Map<String, Object>> backStationList = new ArrayList<>();
		ArrayList<Long> pids = new ArrayList<>();
		String end_sid = "end_sid";
		Long stationId = null;
		while (iterator.hasNext()) {
			Map<String, Object> item = iterator.next();
			stationId = Long.valueOf((Long) item.get(end_sid));
			pids.add(stationId);
			goStationList.add(item);
			backStationList.add(item);
		}
		if (pids.size() > 0) {
			String start_date = vo.getStart_date();
			// 获取班期时间
			String goDateTime = null;
			Long sc_id = vo.getBl_id();
			if (sc_id != null) {
				goDateTime = frontProductMapper.getLeaveTime(sc_id);
			}
			List<Map<String, Object>> stationAndTickets = frontProductMapper
					.stationAndTickets(pids, start_date, start_date,
							goDateTime);
			Iterator<Map<String, Object>> iterator2 = stationAndTickets
					.iterator();
			if (stationAndTickets != null && stationAndTickets.size() > 0) {
				while (iterator2.hasNext()) {
					Map<java.lang.String, java.lang.Object> item = iterator2
							.next();
					String key2 = "go_back";
					boolean isback = item.get(key2).equals(true);
					item.put(key2, isback ? "返程" : "去程");
					String key3 = "go_time";
					Object object2 = item.get(key3);
					String object = object2 == null ? "另行通知"
							: object2.toString();
					item.put(key3, object.length() > 4 ? object.substring(0, 5)
							: object);
					// String key = !isback ? "st_type" : "st_end_type";
					String key = "st_end_type";
					String key1 = !isback ? "station_type" : "station_end_type";
					item.put("st_type", Constants.StationType.STATION_MAP
							.get(item.get(key)));
					item.put("station_type", Constants.StationType.STATION_MAP
							.get(item.get(key1)));

					if (isback) {
						Object site_id = item.get("sp_site_id");
						Object value = item.get("sp_site_end_id");
						item.put("sp_site_id", value);
						item.put("station_name", item.get("site_end_name"));
						item.put("start_sid", site_id);
						item.put("end_sid", value);
						item.put("id", value);
						backStationList.add(item);
					} else {
						item.put("station_name", item.get("site_end_name"));
						item.put("start_sid", item.get("sp_site_id"));
						item.put("end_sid", item.get("sp_site_end_id"));
						item.put("id", item.get("sp_site_id"));
						goStationList.add(item);
					}

				}

			} else {
				// 没有上车站点时将事发站设置为上车站点
				Iterator<Map<String, Object>> stationsIterator = stations
						.iterator();
				while (stationsIterator.hasNext()) {
					Map<String, Object> map = stationsIterator.next();
					map.put("start_sid", map.get(end_sid));
					map.put("id", map.get(end_sid));
				}
			}

		}
		HashMap<String, Object> backdata = new HashMap<>();
		backdata.put("data", backStationList);
		HashMap<String, Object> godata = new HashMap<>();
		godata.put("data", goStationList);
		ArrayList<HashMap<String, Object>> backMapList = new ArrayList<>();
		backMapList.add(backdata);
		ArrayList<HashMap<String, Object>> goMapList = new ArrayList<>();
		goMapList.add(godata);
		data.put("返程", backMapList);
		data.put("去程", goMapList);
		// if (backStationList.size() < 1) {
		// geneDefaultBackStation(backStationList, stationId);
		// }
		data.put("stop_status", 0);
		data.put("go_start_num", goStationList.size());
		data.put("bk_start_num", backStationList.size());
		data.put("buslist_go_num", goStationList.size());
		data.put("buslist_back_num", backStationList.size());
		data.put("bystation_num", 0);
	}

	// private void geneDefaultBackStation(
	// ArrayList<Map<String, Object>> backStationList, Long stationId) {
	// HashMap<String, Object> backdata = new HashMap<>();
	// backdata.put("id", stationId);
	// backdata.put("go_back", "");
	// backdata.put("st_type", "始发站");
	// backdata.put("station_type", "汽车站");
	// backdata.put("site_name", "");
	// backdata.put("go_time", "--");
	// backdata.put("price", "0");
	// backdata.put("station_name", "无需接送");
	// backdata.put("start_sid", stationId);
	// backdata.put("end_sid", stationId);
	// backStationList.add(backdata);
	// }

	@Override
	public ResultBean<?> getCalendarMonths(Long p_id, String city_code) {
		ResultBean<List<Map<String, Object>>> resultBean = new ResultBean<>();
		resultBean
				.setData(frontProductMapper.getCalendarMonth(p_id, city_code));
		return resultBean;
	}
}
