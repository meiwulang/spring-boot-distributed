package com.jdy.b2b.web.controll.order;

import com.jdy.b2b.web.enums.*;
import com.jdy.b2b.web.pojo.order.*;
import com.jdy.b2b.web.util.*;
import com.jdy.b2b.web.util.exception.ParamUnExpectException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.time.DateUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletResponse;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.text.ParseException;
import java.util.*;
import java.util.stream.Collectors;

import static com.jdy.b2b.web.controll.order.OrderControllerHelper.validateExportDate;
import static com.jdy.b2b.web.controll.order.OrderControllerHelper.validateUserAndCompany;
import static com.jdy.b2b.web.util.HtmlUtil.getTextFromHtml;
import static org.apache.commons.lang.time.DateFormatUtils.format;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.apache.commons.lang3.time.DateUtils.addDays;
import static org.springframework.util.CollectionUtils.isEmpty;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/9/14 16:24
 */
@Api(value = "Order", description = "订单导出")
@Controller
@RequestMapping("Order")
public class OrderExportController extends BaseController {

	@Value("${salesCenterUrl}Order")
	String MODULE_URL;

	@Autowired
	FreeMarkerHandler freeMarkerHandler;

	@ApiOperation("订单导出")
	@RequestMapping(value = "/export", method = RequestMethod.GET)
	public void exportOrders(@RequestParam("orderType") String orderType,
			@RequestParam("dateType") String dateType,
			@RequestParam("dateStart") String dateStart,
			@RequestParam("dateEnd") String dateEnd,
			@RequestParam(value = "oStatus", required = false) Integer oStatus,
			@RequestParam(value = "searchKey", required = false) String searchKey,
			@RequestParam(value = "pBrand", required = false) String pBrand,
			@RequestParam(value = "oProductId", required = false) String oProductId,
			@RequestParam(value = "pTypes", required = false) String pTypes,
			@RequestParam(value = "oBuyerId", required = false) String oBuyerId,
			@RequestParam(value = "oBuyerCompanyId", required = false) String oBuyerCompanyId,
			@RequestParam(value = "oSalerId", required = false) String oSalerId,
			@RequestParam(value = "oSalerCompanyId", required = false) String oSalerCompanyId,
			@RequestParam(value = "oPayMethod", required = false) String oPayMethod,
			BaseVO base, HttpServletResponse response) throws ParseException {
		OrderSearchVO vo = new OrderSearchVO();
		BeanUtils.copyProperties(base, vo);
		vo.setExport(true);
		vo.setOrderType(Integer.valueOf(orderType));
		vo.setoStatus(oStatus);
		vo.setDateType(Integer.valueOf(dateType));
		if(StringUtils.isNotBlank(dateStart)){
			vo.setDateStart(DateUtils.parseDate(dateStart, "yyyy-MM-dd"));
		}
		if(StringUtils.isNotBlank(dateEnd)){
			vo.setDateEnd(DateUtils.parseDate(dateEnd, "yyyy-MM-dd"));
		}
		vo.setSearchKey(searchKey);
		vo.setpBrand(isBlank(pBrand) ? null : Integer.valueOf(pBrand));
		vo.setoProductId(
				isBlank(oProductId) ? null : Long.parseLong(oProductId));
		vo.setpTypes(isBlank(pTypes) ? null
				: Arrays.stream(StringUtils.split(pTypes, ","))
						.mapToInt(Integer::valueOf).boxed()
						.collect(Collectors.toList()));
		vo.setoBuyerId(isBlank(oBuyerId) ? null : Long.parseLong(oBuyerId));
		vo.setoBuyerCompanyId(isBlank(oBuyerCompanyId) ? null
				: Long.parseLong(oBuyerCompanyId));
		vo.setoSalerId(isBlank(oSalerId) ? null : Long.parseLong(oSalerId));
		vo.setoSalerCompanyId(isBlank(oSalerCompanyId) ? null
				: Long.parseLong(oSalerCompanyId));
		vo.setoPayMethod(
				isBlank(oPayMethod) ? null : Integer.valueOf(oPayMethod));

//		ResultBean res = validateUserAndCompany(vo);
//		if (res.isFail())
//			throw new ParamUnExpectException(res.getMessage());
//		res = validateExportDate(vo);
//		if (res.isFail())
//			throw new ParamUnExpectException(res.getMessage());
		String url = MODULE_URL + "/searchOrders";
		ResultBean<OrderSearchDTO> bean = restTemplate.postForObject(url, vo,
				ResultBean.class);
		List<OrderListDTO> orders=new ArrayList<>(1);
		OrderSearchDTO reustltBody = bean.getParsedEnitity(OrderSearchDTO.class);
		if(reustltBody!=null){
			orders=reustltBody.getOrders();
		}
		List<String> titles = new ArrayList<>();
		List<List> bodyList = new ArrayList<>();

		titles.add("订单编号");
		titles.add("游客联系人姓名");
		titles.add("游客联系人电话");
		titles.add("产品类型");
		titles.add("产品编号");
		titles.add("产品名称");
		titles.add("团号");
		titles.add("团状态");
		titles.add("行程天数");
		titles.add("出发时间");
		titles.add("回团日期");
		titles.add("报名时间");
		titles.add("客服姓名");
		titles.add("客服手机号");
		titles.add("用户姓名");
		titles.add("操作人姓名");
		titles.add("人数");
		titles.add("床位数");// 16
		titles.add("销售总金额");
		titles.add("结算总金额");
		titles.add("实际结算金额");
		titles.add("实收金额");
		titles.add("退款金额");
		titles.add("订单状态");
		titles.add("支付方式");
		titles.add("订单备注");
		titles.add("买家姓名");
		titles.add("买家公司");
		titles.add("买家部门");
		titles.add("卖家姓名");
		titles.add("卖家公司");
		titles.add("卖家部门");
		titles.add("首付款");
		titles.add("尾款");
		titles.add("全额支付款金额");
		titles.add("微信交易号");
		titles.add("订单类型");

		if (!isEmpty(orders)) {
			for (OrderListDTO order : orders) {
				List body = new ArrayList<>();
				body.add(order.getoOrderNo());
				String[] tourInfo = order.getTouristContactInfo().split(",");
				if(tourInfo != null && tourInfo.length == 2) {
					body.add(tourInfo[0]);
					body.add(tourInfo[1]);
				} else {
					body.add(null);
					body.add(null);
				}

				body.add(ProductTypeEnum.getDescByValue(order.getpType()));
				body.add(order.getpNo());
				body.add(order.getpName());
				body.add(order.getsGroupOrderNo());
				body.add(ScheduleSettingStatusEnum
						.getDescByValue(order.getGroupStatus()));// 团期状态
				body.add(order.getpDays());
				body.add(format(order.getsCalendar(), "yyyy/MM/dd ")
						+ format(order.getsLeaveTime(), "HH:mm"));
				body.add(format(
						addDays(order.getsCalendar(), order.getpDays() - 1),
						"yyyy/MM/dd"));
				body.add(format(order.getCreateTime(), "yyyy/MM/dd HH:mm:ss"));
				body.add(order.getoServicer());
				body.add(order.getoServicerPhone());
				body.add(order.getoBuyerName());
				body.add(order.getCreaterURealName());
				body.add(order.getoPeopleNum());
				body.add(order.getoBedNum());
				body.add(order.getoMarketPrice().toString());
				body.add(order.getoTotalPrice().toString());
				body.add(order.getoRealPrice() != null
						? order.getoRealPrice().toString() : "");
				String firstPay = order.getFirstPay();
				Byte oSource = order.getoSource();
				BigDecimal getoRealPay = order.getoRealPay();
				if (Integer.valueOf(3).equals(order.getoStatus())) {
					String unPay = order.getUnPay();
					BigDecimal subtract = null;
					if (oSource.equals((byte) 4)) {// 首付款
						subtract = getoRealPay.subtract(new BigDecimal(unPay));
					} else {
						subtract = getoRealPay;
					}
					body.add((Objects.nonNull(order.getRefundAmount())?subtract.subtract(order.getRefundAmount()).toString():subtract));

				} else {
					body.add(0.00);
				}

				body.add(order.getRefundAmount());
				String unPay = order.getUnPay();
				body.add(order.getoStatus() == 3 && oSource.equals((byte) 4)
						&& Double.valueOf(unPay) > 0.00 ? "已首款"
								: OrderStatusEnum
										.getDescByValue(order.getoStatus()));
				body.add(OrderPayMethodEnum
						.getDescByValue(order.getoPayMethod()));
				body.add(order.getoRemark());

				// 增加买家、卖家姓名及分公司部门名称 增加首付款、尾款、全额支付款金额及微信交易号 start 2018/1/18 王斌
				body.add(order.getBuyerName());
				body.add(order.getoBuyerCompanyName());
				body.add(order.getBuyerDepartName());
				body.add(order.getSalerName());
				body.add(order.getoSalerCompanyName());
				body.add(order.getSalerDepartName());

				if (Integer.valueOf(3).equals(order.getoStatus())) {

					if (oSource.equals((byte) 4)) {// 首付款
						body.add(firstPay);
						body.add(unPay);
						body.add(0.00);
					} else {
						body.add(0.00);
						body.add(0.00);
						body.add(getoRealPay);

					}

				} else {
					body.add(0.00);
					body.add(0.00);
					body.add(0.00);
				}
				body.add(order.getWxPayNum());

				// 增加买家、卖家姓名及分公司部门名称 增加首付款、尾款、全额支付款金额及微信交易号 end

				body.add(OrderSourceEnum.getDescByValue(oSource));

				body = (List) body.stream().map(o -> {
					if (o == null) {
						return "";
					} else {
						return o;
					}
				}).collect(Collectors.toList());
				bodyList.add(body);
			}
		}
		DataContext.set("isOrderReport", true);
		// 生成模板并下载
		try {
			ExcelUtil.export(
					URLEncoder.encode("订单导出", "UTF8")
							+ format(new Date(), "yyyy-MM-dd"),
					"订单导出", titles, bodyList, response);
		} catch (Exception e) {
			logger.error("订单导出失败", e);
		}
	}

	@ApiOperation("组团社确认单")
	@RequestMapping(value = "/exportGroupConfirmationForm/{id}", method = RequestMethod.GET)
	public void exportGroupConfirmationForm(@PathVariable Long id,
			HttpServletResponse response) throws UnsupportedEncodingException {
		String url = MODULE_URL + "/groupConfirmationForm";
		Order order = new Order(id);
		OrderGroupConfirmation res = (OrderGroupConfirmation) restTemplate
				.postForObject(url, order, ResultBean.class)
				.getParsedEnitity(OrderGroupConfirmation.class);
		setCleanText(res);
		if (Objects.isNull(res)) {
			return;
		}
		Map<String, Object> map = new HashMap<>();
		map.put("od", res);
		freeMarkerHandler.createDoc(map, "组团社确认单模板.ftl", "组团社确认单.docx",
				response);
	}

	@ApiOperation("出团通知书")
	@RequestMapping(value = "/exportGroupNotice/{id}", method = RequestMethod.GET)
	public void exportGroupNotice(@PathVariable Long id,
			HttpServletResponse response) throws UnsupportedEncodingException {
		String url = MODULE_URL + "/groupConfirmationForm";
		Order order = new Order(id);
		OrderGroupConfirmation res = (OrderGroupConfirmation) restTemplate
				.postForObject(url, order, ResultBean.class)
				.getParsedEnitity(OrderGroupConfirmation.class);
		setCleanText(res);
		if (Objects.isNull(res)) {
			return;
		}
		Map<String, Object> map = new HashMap<>();
		map.put("od", res);
		freeMarkerHandler.createDoc(map, "出团通知书模板.ftl", "出团通知书.docx", response);
	}

	private void setCleanText(OrderGroupConfirmation res) {
		res.setpSpecial(getTextFromHtml(res.getpSpecial()));
		res.setpNotes(getTextFromHtml(res.getpNotes()));
		res.setpCostExclude(getTextFromHtml(res.getpCostExclude()));
		res.setpCostInclude(getTextFromHtml(res.getpCostInclude()));
		if (!isEmpty(res.getTrips())) {
			res.getTrips().stream().forEach(t -> {
				t.settSimpleTrip(getTextFromHtml(t.gettSimpleTrip()));
				t.settDetailTrip(getTextFromHtml(t.gettDetailTrip()));
			});
		}
	}

}
