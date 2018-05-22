package com.jdy.b2b.api.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.jdy.b2b.api.common.*;
import com.jdy.b2b.api.common.constants.annotations.TripType;
import com.jdy.b2b.api.dao.CompanyMapper;
import com.jdy.b2b.api.dao.DepartmentMapper;
import com.jdy.b2b.api.dao.ProductCostingTitleMapper;
import com.jdy.b2b.api.dao.ScheduleMapper;
import com.jdy.b2b.api.dao.brand.BrandMapper;
import com.jdy.b2b.api.dao.pic.AttachMapper;
import com.jdy.b2b.api.dao.product.*;
import com.jdy.b2b.api.model.Company;
import com.jdy.b2b.api.model.ProductCostingTitle;
import com.jdy.b2b.api.model.ProductNotify;
import com.jdy.b2b.api.model.brand.Brand;
import com.jdy.b2b.api.model.company.CompanyVo;
import com.jdy.b2b.api.model.company.MobileCompanyConditionDO;
import com.jdy.b2b.api.model.pic.Attach;
import com.jdy.b2b.api.model.product.*;
import com.jdy.b2b.api.service.ProductAssembleCompanyService;
import com.jdy.b2b.api.service.ProductsService;
import com.jdy.b2b.api.util.MQAssembleService;
import com.jdy.b2b.api.util.MQTransformationUtils;
import com.jdy.b2b.api.vo.product.ProductDetailVO;
import com.jdy.b2b.api.vo.product.TripsVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.task.TaskExecutor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.math.BigDecimal;
import java.util.*;

/**
 * @Description 产品业务实现
 * @author 王斌
 * @date 2017年7月3日 上午10:38:33
 * @version V1.0
 */
@Service
public class ProductsServiceImpl extends BaseService implements ProductsService {
	private final static String PIC_TYPE = "img";
	@Value("${shp_card_web_interface_url}")
	String shpCardInterfaceUrl;
	@Value("${product_notify_url}")
	String productNotifyUrl;
	@Autowired
	private CompanyBrandMapper cbDao;
	@Autowired
	private ProductsDetailMapper pdDao;
	@Autowired
	private ProductMapper productDao;
	@Autowired
	private TripCalendarMapper tripCalendarDao;
	@Autowired
	private TripMapper tripDao;
	@Autowired
	private TripHotelMapper tripHotelDao;
	@Autowired
	private TripScenicMapper tripScenicDao;
	@Autowired
	private AttachMapper attachDao;
	@Autowired
	private KeysMapper keysDao;
	@Autowired
	private ProductExtendsMapper productExtDao;
	@Autowired
	private DepartmentMapper departmentMapper;
	@Autowired
	MQAssembleService mqAssembleService;
	@Autowired
	TaskExecutor taskExecutor;
	@Autowired
	BrandMapper brandMapper;
	@Autowired
	private ScheduleMapper scheduleMapper;
	@Autowired
	private CompanyMapper companyMapper;
	@Autowired
	private ProductAssembleCompanyService productAssembleCompanyService;
	@Autowired
	private ProductCostingTitleMapper productCostingTitleMapper;


	/**
	 * @Description: 重组trip-hotel
	 * @author 王斌
	 * @date 2017年7月21日 上午10:39:53
	 * @param vo
	 * @param tripHotels
	 * @param hotelIterator
	 * @param phTripId
	 * @param tripType
	 */
	private void assembleHotel(TripsVO vo, LinkedList<TripHotel> tripHotels,
			final Iterator<Long> hotelIterator, final Long phTripId,
			Integer tripType) {
		TripHotel tripHotel = new TripHotel();
		tripHotel.setPhHotelId(hotelIterator.next());
		tripHotel.setPhTripId(phTripId);
		tripHotel.setPhTripType(tripType);
		tripHotel.setPhPid(vo.gettProductId());
		// 初始化时间、操作人
		if (vo.getTrips().get(0).getId() == null) {
			initUpdateAndCreateUser(vo, tripHotel);
			tripHotel.initCreatetimeAndUpdateTime();
		} else {
			initUpdateUser(vo, tripHotel);
			tripHotel.initUpdateTime();
		}

		tripHotels.add(tripHotel);
	}

	/**
	 * @Description: 重组scenic-hotel
	 * @author 王斌
	 * @date 2017年7月21日 上午10:40:36
	 * @param vo
	 * @param tripScenics
	 * @param scenicIterator
	 * @param phTripId
	 * @param tripType
	 */
	private void assembleScenic(TripsVO vo, LinkedList<TripScenic> tripScenics,
			final Iterator<Long> scenicIterator, final Long phTripId,
			Integer tripType) {
		TripScenic tripScenic = new TripScenic();
		tripScenic.setPhScenicId(scenicIterator.next());
		tripScenic.setPhTripId(phTripId);
		tripScenic.setPhTripType(tripType);
		tripScenic.setPhPid(vo.gettProductId());
		// 初始化时间、操作人
		if (vo.getTrips().get(0).getId() == null) {
			initUpdateAndCreateUser(vo, tripScenic);
			tripScenic.initCreatetimeAndUpdateTime();
		} else {
			initUpdateUser(vo, tripScenic);
			tripScenic.initUpdateTime();
		}
		tripScenics.add(tripScenic);
	}

	/**
	 * @Description: 重组 attach
	 * @author 王斌
	 * @date 2017年7月21日 上午10:40:36
	 * @param vo
	 * @param tripScenics
	 * @param scenicIterator
	 * @param phTripId
	 * @param tripType
	 */
	private void assembleAttach(TripsVO vo, LinkedList<Attach> attachs,
			final Iterator<String> attachIterator, final Long phTripId) {
		Attach attach = new Attach();
		attach.setpPid(phTripId);
		attach.setpOssName(attachIterator.next());
		attach.setpType(Constants.AttachType.TRIP);
		attach.setpPicType(PIC_TYPE);
		// 初始化时间、操作人
		if (vo.getTrips().get(0).getId() == null) {
			initUpdateAndCreateUser(vo, attach);
			attach.initCreatetimeAndUpdateTime();
		} else {
			initUpdateUser(vo, attach);
			attach.initUpdateTime();
		}
		attach.initForClearNull();
		attachs.add(attach);
	}

	/**
	 * @Description: 组装trip
	 * @author 王斌
	 * @date 2017年7月21日 上午10:38:46
	 * @param vo
	 * @param trip
	 * @return
	 */
	private void assembleTrip(TripsVO vo, final Trip trip) {
		// 初始化时间、操作人
		initUpdateAndCreateUser(vo, trip);
		trip.initCreatetimeAndUpdateTime();
		// 初始化productId+tripType
		Integer gettType = vo.gettType();
		trip.settTitle(vo.gettTitle());
		trip.settProductId(vo.gettProductId());
		trip.settType(gettType);
		trip.setTcStartDay(vo.getTcStartDay());
		trip.setTcEndDay(vo.getTcEndDay());
		// 初始化非空参数
		trip.initForClearNull();
	}

	/**
	 * @Description: 组装主键
	 * @author 王斌
	 * @date 2017年7月21日 上午10:37:56
	 * @param trips
	 * @param tripIds
	 */
	private void assembleTripIds(ArrayList<Trip> trips,
			LinkedList<Long> tripIds) {
		for (Trip temp : trips) {
			tripIds.add(temp.getPhTripId());
		}
	}

	/**
	 * @Description: 修改产品状态
	 * @author 王斌
	 * @date 2017年7月19日 上午10:46:58
	 * @param product
	 * @param result
	 * @param current
	 */
	@Transactional
	private ResultBean<Map<String, Object>> changeStatus(Product product,
			int status) {
		// 查询当前数据
		Product current = productDao.selectByPrimaryKey(product.getId());
		Map<String, Object> result = new HashMap<>();
		if (Objects.isNull(current)) {
			return new ResultBean<>("-1","产品不存在");
		}
		//如果是区域产品，需要检查是否有设置成本
		List<ProductCostingTitle> list = productCostingTitleMapper.selectByProductId(current.getId());
		if (Constants.Status.EFFECTING==status&&( list == null || list.size() == 0) ){
			return new ResultBean<>("-1","请先为该产品设置成本");
		}
		// 检查权限
		if (hasPermission(product, current)) {
			// 操作时间处理
			current.initUpdateTime();
			current.setpStatus(status);
			// 入库
			productDao.updateByPrimaryKeySelective(current);
			Product temp = productDao.selectByPrimaryKey(current.getId());
			Brand brand =temp.getpBrand()==null?null:brandMapper.selectByPrimaryKey(temp.getpBrand());
			taskExecutor.execute(() -> mqAssembleService.getMQClinet().syncProduct(MQTransformationUtils.transProduct(temp,brand)));
		} else {
			result.put(Constants.Error.COMMON_ERROR_CODE,
					Constants.Error.INSUFFICIENT_AUTHORITY);
			ResultBean errorResult = new ResultBean<>("-1", Constants.Error.INSUFFICIENT_AUTHORITY);
			errorResult.setBody(result);
			return errorResult;
		}
		result.put(Constants.Fields.ID, product.getId());
		return ResultBean.getSuccessResult(result);
	}

	@Override
	@Transactional
	public int delete(Integer pId) {
		// Product entity = new Product();
		// entity.setpStatus("del");
		// entity.setpId(pId);
		// productDao.updateByPrimaryKeySelective(entity);
		// ProductsDetail detail = new ProductsDetail();
		// detail.setPdProductId(pId);
		// detail.setPdStatus("del");
		// pdDao.updateByProductId(detail);
		return 1;
	}

	@Override
	@Transactional
	public ResultBean<Object> delExtRoute(Integer pdId) {
		ProductsDetail record = new ProductsDetail();
		record.setPdId(pdId);
		record.setPdStatus("del");
		pdDao.updateByPrimaryKeySelective(record);
		return ResultBean.getSuccessResult(1);
	}

	@Override
	@Transactional
	public ResultBean<Map<String, Object>> effectRoute(Product product) {
		// 修改状态 并 返回
		ResultBean<Map<String, Object>> resultBean = changeStatus(product, Constants.Status.EFFECTING);
		if (resultBean.getCode().equals(ResultBean.getSuccessResult().getCode())){
			CompanyVo companyVo = companyMapper.selectByPrimaryKey(product.getCompanyId());
			taskExecutor.execute(()->productNotify(product.getId(),product.getPcompanyId(),companyVo.getcName(),Constants.Status.EFFECTING));
		}
		return resultBean;
	}

	@Override
	public Map<String, Object> getBrandList(CompanyBrand record) {
		record.calc();
		Map<String, Object> result = new HashMap<>();
		result.put(Constants.Result.RESULT_LIST, cbDao.getBrandList(record));
		result.put(Constants.Result.TOTAL_NUM, cbDao.countList(record));
		return result;
	}

	/**
	 * @Description: 判断是否有操作权限
	 * @author 王斌
	 * @date 2017年7月18日 下午5:20:46
	 * @param album
	 * @param current
	 * @return
	 */
	private boolean hasPermission(Product product, Product current) {
		return Constants.MANAGER_COMPANY_ID == product.getCompanyId()

				|| Optional.ofNullable(current).isPresent()
						&& Optional.ofNullable(current.getCompanyId())
								.isPresent()
						&& current.getCompanyId()
								.equals(product.getCompanyId());
	}

	// 处理操作人
	private void initUpdateAndCreateUser(BaseVO vo, BaseDO baseDO) {
		Long userId = vo.getPuserId();
		baseDO.setUpdateUser(userId);
		baseDO.setCreateUser(userId);
	}

	// 处理操作人
	private void initUpdateUser(BaseVO vo, BaseDO baseDO) {
		baseDO.setUpdateUser(vo.getPuserId());
	}

	@Override
	public Map<String, Object> queryDetailList(ProductsDetail productsDetail) {
		productsDetail.calc();
		Map<String, Object> result = new HashMap<>();
		result.put(Constants.Result.RESULT_LIST,
				pdDao.findDetailListByPidAndPdId(productsDetail));
		result.put(Constants.Result.TOTAL_NUM,
				pdDao.countDetailListByPidAndPdId(productsDetail));
		return result;
	}

	@Override
	@SuppressWarnings({ "unchecked", "rawtypes" })
	public Map<String, Object> queryList(Product t) {
		t.calc();
		Map<String, Object> result = new HashMap<>();
		String pName = t.getpName();
		if (Objects.nonNull(pName) && pName.matches("^[a-zA-Z]+$")) {
			t.setpPym(pName);
			t.setpName(null);
		}
		// 查出所有子部门编号
		Long puDepartmentId = t.getPuDepartmentId();
		if (puDepartmentId != null) {
			t.setPuDepartmentIds(getDepartIdsByPid(puDepartmentId));
		}
		final List<Product> routeList = productDao.queryList(t);
		List<Map> routeListMap = JSONUtil.transInSide(routeList, Map.class);
		Iterator<Map> iterator = routeListMap.iterator();
		while (iterator.hasNext()) {
			Map<String, Object> item = iterator.next();
			final Long productId = new Long(
					item.get(Constants.Fields.ID).toString());
			final List<LinkedHashMap<String, Object>> keys = keysDao
					.queryByproductIdAndStatus(productId, 0);
			item.put(Constants.Fields.PRODUCT_KEYS, keys);
			item.put(Constants.Fields.TRIP,
					tripDao.queryTripBaseInfo(productId, 1));
			CompanyVo company = companyMapper.selectByPrimaryKey(Long.valueOf(item.get("companyId").toString()));
			if(!Objects.isNull(company))
				item.put("companyName",company.getcName());
		}
		result.put(Constants.Result.RESULT_LIST, routeListMap);
		result.put(Constants.Result.TOTAL_NUM, productDao.countList(t));
		return result;
	}

	@Override
	@Transactional
	public int recovery(Integer pId) {
		// Product entity = new Product();
		// entity.setpStatus("发布");
		// entity.setpId(pId);
		// productDao.updateByPrimaryKeySelective(entity);
		// ProductsDetail detail = new ProductsDetail();
		// detail.setPdStatus("ok");
		// detail.setPdProductId(pId);
		// pdDao.updateByProductId(detail);
		return 1;
	}

	/**
	 * @Description: 重组行程参数
	 * @author 王斌
	 * @date 2017年7月20日 下午4:40:00
	 * @param tripHotels
	 * @param tripScenics
	 * @param iterator
	 * @param tripIds
	 */
	private void regroupTripParams(TripsVO vo, Iterator<Trip> iterator) {
		// 遍历trips
		while (iterator.hasNext()) {
			final Trip trip = iterator.next();
			assembleTrip(vo, trip);
		}
	}

	/**
	 * @Description: 重组酒店、景点、附件参数
	 * @author 王斌
	 * @date 2017年7月20日 下午4:40:00
	 * @param tripHotels
	 * @param tripScenics
	 * @param iterator
	 * @param tripIds
	 */
	private void regroupHotelAndScenicAndAttachParams(TripsVO vo,
			LinkedList<TripHotel> tripHotels,
			LinkedList<TripScenic> tripScenics, Iterator<Trip> iterator,
			LinkedList<Attach> attachs) {
		// 遍历trips
		while (iterator.hasNext()) {
			final Trip trip = iterator.next();
			final Iterator<Long> hotelIterator = trip.getPhHotelIds()
					.iterator();
			final Iterator<Long> scenicIterator = trip.getPhScenicIds()
					.iterator();
			final Iterator<String> attachIterator = trip.getAttachs()
					.iterator();
			final Long phTripId = trip.getPhTripId();

			final Integer tripType = vo.gettType();

			// 重组trip-hotel集合
			while (hotelIterator.hasNext()) {
				assembleHotel(vo, tripHotels, hotelIterator, phTripId,
						tripType);
			}
			// 重组tripScenics集合
			while (scenicIterator.hasNext()) {
				assembleScenic(vo, tripScenics, scenicIterator, phTripId,
						tripType);
			}
			// 重组attachs集合
			while (attachIterator.hasNext()) {
				assembleAttach(vo, attachs, attachIterator, phTripId);
			}
		}
	}

	/**
	 * 添加产品线路
	 */
	@Override
	@Transactional
	public ResultBean<Map<String, Object>> saveRoute(Product product,
			String cover) {
		//检查生命周期
		if(product.getLifeEndDate().compareTo(product.getLifeStartDate())<0){
			return new ResultBean<>(Constants.Error.COMMON_ERROR_CODE,
					Constants.Error.ERROR_LIFE_CYCLE);
		}
		// 操作时间处理
		product.initCreatetimeAndUpdateTime();
		String pingYin = PinyinUtil.getFirstSpell(product.getpName());
		if (pingYin != null && pingYin.length() < 50) {
			product.setpPym(pingYin);
		} else {
			product.setpPym(pingYin.substring(0, 50));
		}
		
//		product.setpStatus(2);
		//定型产品创建时状态位待提交
		product.setpStatus(4);
		product.setpDays(1);//默认一天
		// 其他字段处理
		product.initForClearNull();
		// 入库
		productDao.insert(product);
		Product temp = productDao.selectByPrimaryKey(product.getId());
		Brand brand =temp.getpBrand()==null?null:brandMapper.selectByPrimaryKey(temp.getpBrand());
		taskExecutor.execute(() -> mqAssembleService.getMQClinet().syncProduct(MQTransformationUtils.transProduct(temp,brand)));
		ProductExtendsWithBLOBs pext = JSONUtil.trans(product,
				ProductExtendsWithBLOBs.class);
		pext.settProductId(product.getId());
		if (Objects.equals(product.getLineType(), 0)) {
			pext.setTcStartDay(Constants.DEFAULT_START_DATE);
			pext.setTcEndDay(Constants.DEFAULT_END_DATE);
		} else if (Objects.isNull(product.getTcStartDay())
				|| Objects.isNull(product.getTcEndDay())) {
			return new ResultBean<>(Constants.Error.COMMON_ERROR_CODE,
					Constants.Error.ERROR_TRIP_DATE);
		}
		if(product.getpPayWay()==0){
			product.setpPayAmount(new BigDecimal(0));
		}
		productExtDao.insert(pext);
		// 保存封面
		Attach attach = JSONUtil.trans(product, Attach.class);
		attach.setCompanyId(product.getCompanyId());
		attach.setpOssName(cover);
		attach.setpPicType(PIC_TYPE);
		Long id = product.getId();
		attach.setpPid(id);
		attach.setpType(Constants.AttachType.PRODUCT);
		attach.initForClearNull();
		attachDao.insert(attach);
		// 返回
		Map<String, Object> result = new HashMap<>();
		result.put(Constants.Fields.ID, id);
		ResultBean<Map<String, Object>> successResult = ResultBean
				.getSuccessResult(result);
		successResult.setId(id);
		productAssembleCompanyService.batchInsert(id,product.getAssembleCompanyIds());
		return successResult;
	}

	private Object validateParams(TripsVO vo) {

		// 行程类型判断
		Integer tripType = vo.gettType();
		Long productId = vo.gettProductId();
		if (TripType.DEFAULT.getVal().equals(tripType)) {
			// 检查默认行程的个数
			if (tripDao.countByProductIdAndType(productId, tripType) > 0) {
				return new ResultBean<>(Constants.Error.COMMON_ERROR_CODE,
						Constants.Error.ERROR_DEFAULT_TRIP);
			}
		} else {
			// 检查时间和标题
			Object validDateAndTitle = validDateAndTitle(vo);
			if (Objects.nonNull(validDateAndTitle)) {
				return validDateAndTitle;
			}
		}
		return null;

	}

	/**
	 * @Description: 校验时间和标题
	 * @author 王斌
	 * @date 2017年7月21日 下午3:48:07
	 * @param vo
	 * @param effectDays
	 * @return
	 */
	private Object validDateAndTitle(TripsVO vo) {
		ArrayList<Trip> trips = (ArrayList<Trip>) JSONUtil
				.transInSide(vo.getTrips(), Trip.class);
		if (vo.getpDays() < trips.size()) {
			return new ResultBean<>(Constants.Error.COMMON_ERROR_CODE,
					Constants.Error.ERROR_TRIP_SIZE);
		}
		for (Trip tvo : trips) {
			// 检查行程是否有标题
			if (Objects.isNull(tvo.gettTitle())) {
				return new ResultBean<>(Constants.Error.COMMON_ERROR_CODE,
						Constants.Error.ERROR_TRIP_TITLE);
			}
		}
		if (Objects.isNull(trips.get(0).getId())) {
			trips = null;
		}
		// 检查时间是否交叉
		if (Objects.equals(TripType.EXTRA.getVal(), vo.gettType())) {
			if (tripCalendarDao.countByProductIdAndEffectDay(vo.gettProductId(),
					vo.getTcStartDay(), vo.getTcEndDay(), trips) > 0) {
				return new ResultBean<>(Constants.Error.COMMON_ERROR_CODE,
						Constants.Error.ERROR_TRIP_EXIST_DATE);
			}
		}
		return null;
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public ResultBean<Map<String, Object>> saveTrips(TripsVO vo) {
		ArrayList<Trip> trips = (ArrayList<Trip>) JSONUtil
				.transInSide(vo.getTrips(), Trip.class);

		LinkedList<TripHotel> tripHotels = new LinkedList<>();
		LinkedList<TripScenic> tripScenics = new LinkedList<>();
		LinkedList<Attach> attachs = new LinkedList<>();
		Iterator<Trip> iterator = trips.iterator();
		LinkedList<Long> tripIds = new LinkedList<>();

		// 校验入参
		Object validateParams = validateParams(vo);
		if (Objects.nonNull(validateParams)) {
			return (ResultBean<Map<String, Object>>) validateParams;
		}

		// 重组trip参数 时间复杂度O(n)
		regroupTripParams(vo, iterator);

		// 保存产品信息
		batchSaveProductInfo(vo, trips, tripHotels, tripScenics, attachs);

		// 返回
		Map<String, Object> result = new HashMap<>();

		// 组装主键
		assembleTripIds(trips, tripIds);

		result.put(Constants.Fields.TRIP_IDS, tripIds);
		ResultBean<Map<String, Object>> successResult = ResultBean
				.getSuccessResult(result);
		successResult.setId(tripIds.toArray(new Long[tripIds.size()]));
		return successResult;
	}

	/**
	 * @Description: 保存产品信息
	 * @author 王斌
	 * @date 2017年7月21日 下午1:40:24
	 * @param vo
	 * @param trips
	 * @param tripHotels
	 * @param tripScenics
	 */
	@Transactional
	private void batchSaveProductInfo(TripsVO vo, ArrayList<Trip> trips,
			LinkedList<TripHotel> tripHotels,
			LinkedList<TripScenic> tripScenics, LinkedList<Attach> attachs) {
		Iterator<Trip> iterator;
		// 批量保存行程
		tripDao.batchSave(trips);

		// 更新行程天数
		if (Objects.equals(vo.gettType(), TripType.DEFAULT.getVal())) {
			Product record = new Product();
			record.setId(vo.gettProductId());
			record.setpDays(vo.getpDays());
			productDao.updateByPrimaryKeySelective(record);
			Product temp = productDao.selectByPrimaryKey(record.getId());
			Brand brand =temp.getpBrand()==null?null:brandMapper.selectByPrimaryKey(temp.getpBrand());
			taskExecutor.execute(() -> mqAssembleService.getMQClinet().syncProduct(MQTransformationUtils.transProduct(temp,brand)));
		}

		// 迭代器只能用一次，需要重重新赋值
		iterator = trips.iterator();

		// 行程和酒店 1：m 、行程和景点1：n、行程和附件 1：k 批量数据需要重新组织
		// 重组HotelAndScenic参数 时间复杂度O(n2)+O(m2)+O(n)
		regroupHotelAndScenicAndAttachParams(vo, tripHotels, tripScenics,
				iterator, attachs);

		// 补充行程添加有效日期
		if (Objects.equals(vo.gettType(), TripType.EXTRA.getVal())) {
			// 对象转换
			ArrayList<TripCalendar> tripCalendars = (ArrayList<TripCalendar>) JSONUtil
					.transInSide(trips, TripCalendar.class);

			// 批量保存行程日期
			tripCalendarDao.batchSave(tripCalendars);
		}

		if (tripHotels.size() > 0) {
			// 批量保存酒店-行程信息
			tripHotelDao.batchSave(tripHotels);
		}

		if (tripScenics.size() > 0) {
			// 批量保存景点-行程信息
			tripScenicDao.batchSave(tripScenics);
		}
		if (attachs.size() > 0) {
			// 批量保存景点-行程信息
			attachDao.batchSave(attachs);
		}
	}

	@Override
	@Transactional
	public ResultBean<Map<String, Object>> uneffectRoute(Product product) {
		// 修改状态 并返回
		ResultBean<Map<String, Object>> resultBean = changeStatus(product, Constants.Status.UNEFFECT);
		if (resultBean.getCode().equals(ResultBean.getSuccessResult().getCode())){
			CompanyVo companyVo = companyMapper.selectByPrimaryKey(product.getCompanyId());
			taskExecutor.execute(()->productNotify(product.getId(),product.getPcompanyId(),companyVo.getcName(),Constants.Status.UNEFFECT));
		}
		return resultBean;

	}

	/**
	 * 入库 or 出库时通知分销
	 * @param productId
	 * @param companyId
	 * @param effectStatus  当前行为 2待入库  3入库  4线路保存 5行程保存 6班期保存
	 */
	private void productNotify(Long productId,Long companyId,String companyName, int effectStatus){
		ProductNotify notify = new ProductNotify();
		notify.setCompanyId(companyId);
		notify.setCompanyName(companyName);
		List<Long> ids = new ArrayList<>();
		ids.add(productId);
		notify.setProductIds(ids);
		notify.setAction(5);//1线路信息；2行程信息；3票价管理；4班期管理,5产品
		if (Constants.Status.UNEFFECT == effectStatus){//出库  转为 待入库 状态
			notify.setStatus(40);//10 新增; 20 更新; 30 票无效; 40 产品无效;
		}else if (Constants.Status.EFFECTING == effectStatus){//入库  转为 入库状态
			notify.setStatus(10);
		} else if (effectStatus == 4){//产品更新行为
			notify.setStatus(20);
		} else if (effectStatus == 5){
			notify.setStatus(20);
			notify.setAction(2);
		}else if (effectStatus == 6){
			notify.setAction(4);
			notify.setStatus(20);
		}

		JSONObject jsonObject = EncodingObjectWithMd5Utils.encoding(notify);
		String url = productNotifyUrl + "/channels/sp/product/getProductAlterNotice.do";
		logger.info("产品变化通知分销的信息:"+jsonObject.toString());
		JSONObject result = HttpClientUtils.httpPost(url, (Map) jsonObject);
		logger.info("通知分销后的结果:"+result.toString());
		Integer code = (Integer) result.get("code");
		if (200!=code) {
			String msg = (String) result.get("msg");
			logger.error(msg);
		}
	}


	@Override
	@Transactional
	public int updateConfirm(Product record) {
		productDao.updateByPrimaryKeySelective(record);
		Product temp = productDao.selectByPrimaryKey(record.getId());
		Brand brand =temp.getpBrand()==null?null:brandMapper.selectByPrimaryKey(temp.getpBrand());
		taskExecutor.execute(() -> mqAssembleService.getMQClinet().syncProduct(MQTransformationUtils.transProduct(temp,brand)));
		return 1;
	}

	@Override
	@Transactional
	public int updateRecommend(Product record) {
		productDao.updateByPrimaryKeySelective(record);
		Product temp = productDao.selectByPrimaryKey(record.getId());
		Brand brand =temp.getpBrand()==null?null:brandMapper.selectByPrimaryKey(temp.getpBrand());
		taskExecutor.execute(() -> mqAssembleService.getMQClinet().syncProduct(MQTransformationUtils.transProduct(temp,brand)));
		return 1;
	}

	@Override
	@Transactional
	public ResultBean<Map<String, Object>> updateRoute(Product product,
			String cover) {
		Map<String, Object> result = new HashMap<>();
		// 检查权限
		Product current = productDao.selectByPrimaryKey(product.getId());
		if (Objects.isNull(current)) {
			return ResultBean.getSuccessResult(result);
		}
		if (hasPermission(product, current)) {
			// 操作时间处理
			product.initUpdateTime();

			String pingYin = PinyinUtil.getFirstSpell(product.getpName());
			if (pingYin != null) {
				if (pingYin.length() < 50) {
					product.setpPym(pingYin);
				} else {
					product.setpPym(pingYin.substring(0, 50));
				}
			}
			// 入库
			if (product.getpQq() == null) {
				product.setpQq("");
			}
			if (product.getpPhone() == null) {
				product.setpPhone("");
			}
			if(product.getpPayWay()==0){
				product.setpPayAmount(new BigDecimal(0));
			}
			//判断更新的收付款金额是否过大,最大值是 最低票价的值
			if(product.getpFirstPayType().equals(Integer.valueOf(1))){
				BigDecimal minTicketPrice = productDao.selectMinTicketPrice(product.getId());
				if(minTicketPrice!=null){
					Boolean flag =  product.getpPayAmount().compareTo(minTicketPrice)>0;
					if(flag){
						return new ResultBean("-1","输入的固定金额过大,已大于最低票价"+minTicketPrice+"元!");
					}
				}
			}

			productDao.updateByPrimaryKeySelective(product);
			Product temp = productDao.selectByPrimaryKey(product.getId());
			Brand brand =temp.getpBrand()==null?null:brandMapper.selectByPrimaryKey(temp.getpBrand());
			taskExecutor.execute(() -> mqAssembleService.getMQClinet().syncProduct(MQTransformationUtils.transProduct(temp,brand)));
			ProductExtendsWithBLOBs pext = JSONUtil.trans(product,
					ProductExtendsWithBLOBs.class);
			pext.settProductId(product.getId());
			pext.setId(null);
			if (Objects.equals(product.getLineType(), 0)) {
				pext.setTcStartDay(Constants.DEFAULT_START_DATE);
				pext.setTcEndDay(Constants.DEFAULT_END_DATE);
			} else if (Objects.isNull(product.getTcStartDay())
					|| Objects.isNull(product.getTcEndDay())) {
				return new ResultBean<>(Constants.Error.COMMON_ERROR_CODE,
						Constants.Error.ERROR_TRIP_DATE);
			}
			int updateSize = productExtDao.updateByPrimaryKeyWithBLOBs(pext);
			if (updateSize < 1) {
				productExtDao.insert(pext);
			}
			// 更新封面
			if (cover != null) {
				Long id = product.getId();
				attachDao.updateAttachByPpIdAndType(id, 6, cover);
			}
			productAssembleCompanyService.deleteByProductId(product.getId(),product.getAssembleCompanyIds());
			productAssembleCompanyService.batchInsert(product.getId(),product.getAssembleCompanyIds());
			if (current.getpStatus() == 0 || current.getpStatus() == 3) {//发布 入库 状态的产品更新了才要通知分销
				Company company = companyMapper.selectByCompanyId(current.getCompanyId());
				taskExecutor.execute(()->productNotify(current.getId(), current.getCompanyId(), company.getcName(), 4));
			}

		} else {
			result.put(Constants.Error.COMMON_ERROR_CODE,
					Constants.Error.INSUFFICIENT_AUTHORITY);
		}

		// 返回
		result.put(Constants.Fields.ID, product.getId());
		return ResultBean.getSuccessResult(result);
	}


	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public ResultBean<Map<String, Object>> updateTrips(TripsVO vo) {

		// 检查时间和标题
		Object validDateAndTitle = validDateAndTitle(vo);
		if (Objects.nonNull(validDateAndTitle)) {
			return (ResultBean<Map<String, Object>>) validDateAndTitle;
		}

		ArrayList<Trip> trips = (ArrayList<Trip>) JSONUtil
				.transInSide(vo.getTrips(), Trip.class);
		// 重组trips + trip_calendars + trip_hotels + +trip_scenic
		LinkedList<TripHotel> tripHotels = new LinkedList<>();
		LinkedList<TripScenic> tripScenics = new LinkedList<>();
		LinkedList<TripCalendar> tripCalendars = new LinkedList<>();
		LinkedList<Attach> attachs = new LinkedList<>();
		Iterator<Trip> iterator = trips.iterator();
		ArrayList<Trip> needAddtrips = new ArrayList<>();
		regroupTripParamsForUpdate(iterator, tripHotels, tripScenics, vo,
				tripCalendars, attachs, needAddtrips);

		// 批量保存产品信息
		batchUpdateProductInfo(vo, trips, tripHotels, tripScenics,
				tripCalendars, attachs, needAddtrips);
		Product product = productDao.selectByPrimaryKey(vo.gettProductId());
		if (product.getpStatus() == 0 || product.getpStatus() == 3){
			Company company = companyMapper.selectByCompanyId(product.getCompanyId());
			taskExecutor.execute(()->productNotify(product.getId(),company.getId(),company.getcName(),5));
		}
		return ResultBean.getSuccessResult();
	}

	/**
	 * @Description: 批量保存产品信息
	 * @author 王斌
	 * @param attachs
	 * @date 2017年7月21日 下午4:49:11
	 */
	private void batchUpdateProductInfo(TripsVO vo, ArrayList<Trip> trips,
			LinkedList<TripHotel> tripHotels,
			LinkedList<TripScenic> tripScenics,
			LinkedList<TripCalendar> tripCalendars, LinkedList<Attach> attachs,
			ArrayList<Trip> needAddtrips) {

		// 更新产品天数
		Long productId = vo.gettProductId();
//		Product record=new Product();
//		record.setId(productId);
//		record.setpDays(vo.getpDays());
//		productDao.updateByPrimaryKeySelective(record);
		// 更新trips
		if (Objects.equals(vo.gettType(), TripType.EXTRA.getVal())) {
			tripDao.batchDelete(productId, vo.getTcStartDay(),
					vo.getTcEndDay());
		} else {
			tripDao.batchDeleteDefaultTrips(trips);
		}

//		tripDao.batchUpdateByPrimaryKeyAndCompanyId(trips);

		// 更新tripHotels
		if (tripHotels.size() > 0) {
			tripHotelDao.batchDelete(trips);
			// tripHotelDao.batchSave(tripHotels);
		}

		// 更新tripScenics
		if (tripScenics.size() > 0) {
			tripScenicDao.batchDelete(trips);
			// tripScenicDao.batchSave(tripScenics);
		}
		// 更新tripCalendars
		if (tripCalendars.size() > 0
				&& Objects.equals(vo.gettType(), TripType.EXTRA.getVal())) {
			tripCalendarDao.batchDelete(tripCalendars);
			// tripCalendarDao.batchSave(tripCalendars);
		}
		// 更新attachs
		if (attachs.size() > 0) {
			attachDao.batchDelete(attachs);
			// attachDao.batchSave(attachs);
		}
		saveTrips(vo);
		//更新回团时间
		scheduleMapper.updateByProductSelective(productId, vo.getpDays()-1);
	}

	/**
	 * @Description: 重组保存参数
	 * @author 王斌
	 * @date 2017年7月21日 下午4:47:35
	 * @param iterator
	 * @param tripHotels
	 * @param tripScenics
	 * @param vo
	 * @param tripCalendars
	 */
	private void regroupTripParamsForUpdate(Iterator<Trip> iterator,
			LinkedList<TripHotel> tripHotels,
			LinkedList<TripScenic> tripScenics, TripsVO vo,
			LinkedList<TripCalendar> tripCalendars, LinkedList<Attach> attachs,
			ArrayList<Trip> needAddtrips) {
		while (iterator.hasNext()) {
			final Trip trip = iterator.next();
			if (Objects.isNull(trip.getId())) {
				needAddtrips.add(trip);
				return;
			}
			final Iterator<Long> hotelIterator = trip.getPhHotelIds()
					.iterator();
			final Iterator<Long> scenicIterator = trip.getPhScenicIds()
					.iterator();
			final Iterator<String> attachIterator = trip.getAttachs()
					.iterator();
			final Long tripId = trip.getId();
			final Integer tripType = vo.gettType();

			// 重组trip
			Long gettProductId = vo.gettProductId();
			trip.settTitle(vo.gettTitle());
			trip.settProductId(gettProductId);
			trip.settType(vo.gettType());
			trip.setTcStartDay(vo.getTcStartDay());
			trip.setTcEndDay(vo.getTcEndDay());
			trip.initUpdateTime();
			initUpdateAndCreateUser(vo, trip);
			// 重组tripCalendar
			TripCalendar tripCalendar = JSONUtil.trans(trip,
					TripCalendar.class);
			tripCalendar.settProductId(gettProductId);
			tripCalendar.setPhTripId(tripId);
			tripCalendar.initCreatetimeAndUpdateTime();
			initUpdateAndCreateUser(vo, tripCalendar);
			tripCalendars.add(tripCalendar);

			// 重组trip-hotel集合
			while (hotelIterator.hasNext()) {
				assembleHotel(vo, tripHotels, hotelIterator, tripId, tripType);
			}
			// 重组scenic-scenic集合
			while (scenicIterator.hasNext()) {
				assembleScenic(vo, tripScenics, scenicIterator, tripId,
						tripType);
			}
			// 重组attach集合
			while (attachIterator.hasNext()) {
				assembleAttach(vo, attachs, attachIterator, tripId);
			}
		}
	}

	@Override
	public ResultBean<Map<String, Object>> batchDeleteTrips(TripsVO vo) {
		final Long gettProductId = vo.gettProductId();
		if (Objects.equals(vo.gettType(), TripType.DEFAULT.getVal())) {
			ArrayList<Trip> trips = (ArrayList<Trip>) JSONUtil
					.transInSide(vo.getTrips(), Trip.class);
			if (Objects.nonNull(trips) && trips.size() > 0) {
				tripDao.batchDeleteDefaultTrips(trips);
				tripHotelDao.batchDelete(trips);
				tripScenicDao.batchDelete(trips);
				attachDao.batchDeleteByTrips(trips);
				Product record = productDao.selectByPrimaryKey(gettProductId);
				Integer getpDays = trips.size();
				if (Objects.nonNull(record) && Objects.nonNull(getpDays)) {
					int days = record.getpDays() - getpDays;
					if (days > 0 && Objects.equals(vo.gettType(),
							TripType.DEFAULT)) {
						record.setpDays(days);
						productDao.updateByPrimaryKeySelective(record);
						Product temp = productDao.selectByPrimaryKey(record.getId());
						Brand brand =temp.getpBrand()==null?null:brandMapper.selectByPrimaryKey(temp.getpBrand());
						taskExecutor.execute(() -> mqAssembleService.getMQClinet().syncProduct(MQTransformationUtils.transProduct(temp,brand)));
					}
				}
			}
		} else {
			ProductExtendsWithBLOBs pext = JSONUtil.trans(vo,
					ProductExtendsWithBLOBs.class);
			productExtDao.deleteByTime(pext);
			tripDao.batchDelete(vo.gettProductId(), vo.getTcStartDay(),
					vo.getTcEndDay());
		}
		Map<String, Object> result = new HashMap<>();
		result.put(Constants.Fields.ID, gettProductId);
		return ResultBean.getSuccessResult(result);
	}

	@Override
	public ResultBean<Map<String, Object>> queryProductDetail(
			ProductDetailVO vo) {
		Map<String, Object> result = new HashMap<>();
		Long id = vo.getId();
		@SuppressWarnings("unchecked")
		Map<String, Object> current = JSONUtil
				.trans(productDao.selectByPrimaryKey(id), Map.class);
		if (Objects.nonNull(current)) {
			result.put(Constants.Fields.PRODUCT, current);// 基本信息

			ProductExtendsWithBLOBs pext = JSONUtil.trans(vo,
					ProductExtendsWithBLOBs.class);
			pext.settProductId(id);
			// 线路
			if (Objects.equals(vo.getLineType(), 0)) {
				pext.setTcStartDay(Constants.DEFAULT_START_DATE);
				pext.setTcEndDay(Constants.DEFAULT_END_DATE);
			} else if (Objects.isNull(vo.getTcStartDay())
					|| Objects.isNull(vo.getTcEndDay())) {
				return new ResultBean<>(Constants.Error.COMMON_ERROR_CODE,
						Constants.Error.ERROR_TRIP_DATE);
			}
			current.put(Constants.Fields.LINE,
					productExtDao.selectByTime(pext));
			List<String> attach = attachDao.queryAttachPpId(id,
					Constants.AttachType.PRODUCT);
			if (Objects.nonNull(attach) && attach.size() > 0) {

				current.put(Constants.Fields.ATTACH, attach.get(0));
			} else {
				current.put(Constants.Fields.ATTACH, null);
			}

		} else {
			return ResultBean.getSuccessResult(result);
		}
		return ResultBean.getSuccessResult(result);
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
			map.put(Constants.Fields.HAVE_MEALS, new ArrayList<>());
			// 组装酒店
			List<TripHotelDTO> queryHotelByTripId = tripHotelDao
					.queryHotelByTripId(tripId);
			map.put(Constants.Fields.HOTEL, queryHotelByTripId);
			List<Long> hotelIds = new ArrayList<>();
			for (TripHotelDTO hotel : queryHotelByTripId) {
				hotelIds.add(hotel.getId());
			}
			map.put(Constants.Fields.PH_HOTELI_DS, hotelIds);

			// 组装景点
			List<TripScenicDTO> queryScenicByTripId = tripScenicDao
					.queryScenicByTripId(tripId);
			map.put(Constants.Fields.SCENIC, queryScenicByTripId);
			List<Long> scenicIds = new ArrayList<>();
			for (TripScenicDTO scenic : queryScenicByTripId) {
				scenicIds.add(scenic.getId());
			}
			map.put(Constants.Fields.PH_SCENICI_DS, scenicIds);

			// 组装附件
			map.put(Constants.Fields.ATTACHS,
					attachDao.queryAttachPpId(tripId, 1));
		}
	}

	@Override
	public ResultBean<Map<String, Object>> queryTripList(TripsVO vo) {
		Map<String, Object> result = new HashMap<>();
		Long productId = vo.gettProductId();
		List<Map<String, Object>> trips = null;
		if (Objects.equals(vo.gettType(), TripType.EXTRA.getVal())) {

			trips = tripDao.queryByProductIdAndStartAndEndDate(productId,
					vo.getTcStartDay(), vo.getTcEndDay());
		} else {
			trips = tripDao.queryByProductIdAndType(productId, 0);
		}
		if (Objects.nonNull(trips) && trips.size() > 0) {
			result.put(Constants.Fields.T_TITLE,
					trips.get(0).get(Constants.Fields.T_TITLE));
			result.put(Constants.Fields.TRIPS, trips);
		} else {
			result.put(Constants.Fields.TRIPS, new HashMap<>());
		}
		// 组装关联信息
		assembleTripDetail(trips);
		return ResultBean.getSuccessResult(result);
	}

	public ProductExtendsWithBLOBs queryLineInfo(ProductExtends lineInfo) {
		return productExtDao.selectByTime(lineInfo);
	}

	/* 查询条件查询 */
	@Override
	public Map mobileListCondition(String city_code, Integer type) {
		Map map = new HashMap();
		List<MobileProductProvince> productIds = productDao
				.selectListConditionProductIds(city_code, type);
		if (CollectionUtils.isEmpty(productIds)) {
			return map;
		}
		List<MobileListConditionDO> result = productDao
				.listCondition(productIds);
		// 定义集合
		Set<String> province = new HashSet<String>();
		Set<String> city = new HashSet<String>();
		Set<Integer> days = new HashSet<>();
		Set<String> attribute = new HashSet<String>();
		Set<String> scenic = new HashSet<>();
		Set<MobileCompanyConditionDO> business = new HashSet<>();
		Set<String> destination = new HashSet<>();
		Map<String, Set<String>> des_by_province = new HashMap();

		map.put("province", province);
		map.put("city", city);
		map.put("days", days);
		map.put("attribute", attribute);
		map.put("scenic", scenic);
		map.put("business", business);
		map.put("destination", destination);
		map.put("des_by_province", des_by_province);

		result.stream().forEach(singleResult -> {
			days.add(singleResult.getpDays());

			MobileCompanyConditionDO company = new MobileCompanyConditionDO();
			company.setId(singleResult.getCompany().getId());
			company.setName(singleResult.getCompany().getName());
			company.setSname(singleResult.getCompany().getSname());
			business.add(company);

			singleResult.getSpots().stream().forEach(spot -> {
				province.add(spot.getProvince());
				destination.add(spot.getCity());
				attribute.add(spot.getAttribute());
				scenic.add(spot.getScenic());
			});
		});

		return map;
	}

	@Override
	@Transactional
	public ResultBean<Map<String, Object>> delete(Long pid, Long userId) {
		Product record = new Product();
		record.setId(pid);
		record.setpStatus(1);
		record.setUpdateUser(userId);
		record.setUpdateTime(new Date());
		productDao.updateByPrimaryKeySelective(record);
		Product temp = productDao.selectByPrimaryKey(record.getId());
		Brand brand =temp.getpBrand()==null?null:brandMapper.selectByPrimaryKey(temp.getpBrand());
		taskExecutor.execute(() -> mqAssembleService.getMQClinet().syncProduct(MQTransformationUtils.transProduct(temp,brand)));
		return ResultBean.getSuccessResultForLog(pid);
	}

	/**
	 * @Description:查出所有子部门编号
	 * @author 王斌
	 * @date 2017年11月24日 下午3:59:38
	 * @param departPid
	 * @return
	 */
	private List<Long> getDepartIdsByPid(Long departPid) {
		List<Long> departIds = new ArrayList<>();
		departIds.add(departPid);
		List<Long> allIds = new ArrayList<>();
		allIds.add(departPid);
		while (true) {
			List<Long> ids = new ArrayList<>();
			ids = departmentMapper
					.queryChildDepartmentIdsByDepartmentIds(departIds);
			if (ids != null && ids.size() > 0) {
				departIds = ids;
				allIds.addAll(ids);
				continue;
			}
			return allIds;
		}
	}
}
