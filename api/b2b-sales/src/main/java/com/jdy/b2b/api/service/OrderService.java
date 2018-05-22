package com.jdy.b2b.api.service;

import java.util.List;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.*;
import com.jdy.b2b.api.model.diy.*;
import com.jdy.b2b.api.model.orderOffline.OrderOffline;
import com.jdy.b2b.api.model.orderRefund.ContractOrder;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/8/30 11:08
 */
public interface OrderService {

    ResultBean searchOrders(OrderSearchVo vo, boolean fromContract);

    OrderDetailDTO getOrderDetail(Order order);

    OrderGroupConfirmation groupConfirmationForm(Order order);

    OrderPayRecordsDTO orderPayRecords(Order order);

    OrderPlanDetailDTO planDetails(Order order);

    List<OrderLogs> operLogs(Order order);

    OrderStaticsDTO recentOrderInfo(OrderStaticsVO vo);

    List<OrderStatusNumberDTO> selectOrderNumofStatuses(OrderSearchVo vo);

    Order selectOrderByOrderNo(String orderNo);

    List<Long> selectSubCompanyIdsWithOwn(Long id);

    List<Long> selectSubDepartmentIdsWithOwn(Long id);

    ContractOrder selectContractByOrderId(Integer orderId);

    PayNeedInfo queryPayNeedInfoByOrderNo(String orderNo);

	/** 
	 * @Description: 订单游客列表
	 * @author 王斌
	 * @date 2018年1月22日 下午2:22:13
	 * @param orderId
	 * @param pageSize 
	 * @param pageNo 
	 * @return
	 */
    ResultBean<Object> getTourists(Long orderId, int pageNo, int pageSize);

	/** 
	 * @Description: 订单追加游客信息
	 * @author 王斌
	 * @date 2018年1月22日 下午2:58:45
	 * @param touristInfo
	 * @return
	 */
	ResultBean<Object> saveTourist(OrderTourist touristInfo);

	/** 
	 * @Description: 审核支付凭证
	 * @author 王斌
	 * @date 2018年1月23日 下午1:54:01
	 * @param orderOffline
	 * @return
	 */
	ResultBean<Object> reviewVoucher(List<OrderOffline> orderOffline);

	/** 
	 * @Description:获取支付凭证列表
	 * @author 王斌
	 * @date 2018年1月23日 下午1:54:43
	 * @param orderOffline
	 * @return
	 */
	ResultBean<Object> getVouchers(OrderOffline orderOffline);

	/** 
	 * @Description: 导出取消游客列表
	 * @author 王斌
	 * @date 2018年1月31日 上午9:49:48
	 * @param scheduleId
	 * @return
	 */
	ResultBean<Object> exportCancelTourists(Long scheduleId);
	/** 
	 * @Description: 查询未全部取消客人的团期数量
	 * @author 王斌
	 * @date 2018年1月31日 上午9:49:48
	 * @param scheduleId
	 * @return
	 */
	ResultBean<Object> getNeedToDealCount();

    ResultBean batchSaveTourist(OrderTouristForBatch vo);
}
