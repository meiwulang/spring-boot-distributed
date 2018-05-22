package com.jdy.b2b.api.controller;

import java.util.Map;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.jdy.b2b.api.common.Constants;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.common.constants.annotations.Delete;
import com.jdy.b2b.api.common.constants.annotations.Query;
import com.jdy.b2b.api.common.constants.annotations.Save;
import com.jdy.b2b.api.common.constants.annotations.TripType;
import com.jdy.b2b.api.common.constants.annotations.Update;
import com.jdy.b2b.api.service.ProductsService;
import com.jdy.b2b.api.vo.product.TripsVO;

/**
 * @Description 产品控制层
 * @author 王斌
 * @date 2017年7月3日 下午5:44:11
 * @version V1.0
 */
@RestController
@RequestMapping("trip")
public class TripController {

	@Autowired
	ProductsService productsImpl;

	// 产品行程列表
	@RequestMapping(value = "/list", method = RequestMethod.POST)
	public ResultBean<Map<String, Object>> queryList(
			@Validated(Query.class) @RequestBody TripsVO vo) {
		// 补充行程开始时间结束时间不能为空
		if (Objects.nonNull(validateDate(vo))) {
			return validateDate(vo);
		}
		return (productsImpl.queryTripList(vo));
	}

	/**
	 * @Description: 补充行程时间校验
	 * @author 王斌
	 * @date 2017年8月18日 下午1:59:39
	 * @param vo
	 */
	private ResultBean<Map<String, Object>> validateDate(TripsVO vo) {
		String tcStartDay = vo.getTcStartDay();
		String tcEndDay = vo.getTcEndDay();
		if (Objects.equals(vo.gettType(), TripType.EXTRA.getVal())) {
			if (Objects.isNull(tcStartDay) || Objects.isNull(tcEndDay)) {
				return new ResultBean<>(Constants.Error.COMMON_ERROR_CODE,
						Constants.Error.EFFECT_DATE_CANNOT_NULL);
			}
			if (tcStartDay.compareTo(tcEndDay) > 0) {
				return new ResultBean<>(Constants.Error.COMMON_ERROR_CODE,
						Constants.Error.ERROR_EFFECT_DATE);
			}
		}
		return null;
	}

	// 产品添加行程
	@RequestMapping(value = "/save", method = RequestMethod.POST)
	public ResultBean<Map<String, Object>> save(
			@Validated(Save.class) @RequestBody TripsVO vo) {

		// 参数数组长度校验
		if (!Objects.equals(vo.getpDays(), vo.getTrips().size())) {
			return new ResultBean<>(Constants.Error.COMMON_ERROR_CODE,
					Constants.Error.ERROR_TRIP_SIZE);
		}
		// 补充行程开始时间结束时间不能为空
		if (Objects.nonNull(validateDate(vo))) {
			return validateDate(vo);
		}
		return productsImpl.saveTrips(vo);
	}

	// 产品修改行程
	@RequestMapping(value = "/update", method = RequestMethod.POST)
	public ResultBean<Map<String, Object>> update(
			@RequestBody @Validated(Update.class) TripsVO vo) {
		// 参数数组长度校验
		if (!Objects.equals(vo.getpDays(), vo.getTrips().size())) {
			return new ResultBean<>(Constants.Error.COMMON_ERROR_CODE,
					Constants.Error.ERROR_TRIP_SIZE);
		}
		// 补充行程开始时间结束时间不能为空
		if (Objects.nonNull(validateDate(vo))) {
			return validateDate(vo);
		}
		return productsImpl.updateTrips(vo);
	}

	// 产品批量删除行程
	@RequestMapping(value = "/batchDelete", method = RequestMethod.POST)
	public ResultBean<Map<String, Object>> batchDelete(
			@RequestBody @Validated(Delete.class) TripsVO vo) {
		// 补充行程开始时间结束时间不能为空
		if (Objects.nonNull(validateDate(vo))) {
			return validateDate(vo);
		}
		return productsImpl.batchDeleteTrips(vo);
	}
}
