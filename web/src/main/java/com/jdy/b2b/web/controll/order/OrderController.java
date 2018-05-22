package com.jdy.b2b.web.controll.order;

import com.jdy.b2b.web.pojo.electroniccontract.SignContract;
import com.jdy.b2b.web.pojo.log.MyLog;
import com.jdy.b2b.web.pojo.order.*;
import com.jdy.b2b.web.pojo.orderOffline.OrderOffline;
import com.jdy.b2b.web.service.PosterSettingsService;
import com.jdy.b2b.web.service.impl.ElectronicContractForPcServiceImpl;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ExcelUtil;
import com.jdy.b2b.web.util.ResultBean;
import com.jdy.b2b.web.util.annotations.Update;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.task.TaskExecutor;
import org.springframework.util.CollectionUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpServletResponse;
import java.net.URLEncoder;
import java.util.*;

import static com.jdy.b2b.web.controll.order.OrderControllerHelper.validateUserAndCompany;
import static org.apache.commons.lang.time.DateFormatUtils.format;
import static org.springframework.util.CollectionUtils.isEmpty;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/9/14 16:34
 */
@SuppressWarnings({"unchecked","rawtypes"})
@Api(value = "Order", description = "订单")
@RestController
@RequestMapping("/Order")
public class OrderController extends BaseController {

    @Value("${salesCenterUrl}Order")
    String MODULE_URL;

    @Autowired
    ElectronicContractForPcServiceImpl ecfpc;

    @Autowired
    TaskExecutor taskExecutor;

    @Autowired
    PosterSettingsService posterSettingsService;

    private List<String> touristExcelTitle = new ArrayList<>();

    private List<String> touristExcelFieldList = new ArrayList<>();

    private final static String BLANK_STR = "";


    @ApiOperation("订单列表（包括精确搜索）")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "订单列表信息", response = OrderListDTO.class)})
    @PostMapping("/searchOrders")
    public ResultBean searchOrders(@Validated @RequestBody OrderSearchVO vo) {
        ResultBean bean = validateUserAndCompany(vo);
        if (bean.isFail()) {
            return bean;
        }
        String url = MODULE_URL + "/searchOrders";
        return restTemplate.postForObject(url, vo, ResultBean.class);
    }

    @ApiOperation("订单详情")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "订单详情", response = OrderDetailDTO.class)})
    @PostMapping("/detail")
    public ResultBean orderDetail(@Validated @RequestBody OrderBaseVO order) {
        String url = MODULE_URL + "/detail";
        return restTemplate.postForObject(url, order, ResultBean.class);
    }

    @ApiOperation("组团社确认单，出团通知书")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "组团社确认单，出团通知书", response = OrderGroupConfirmation.class)})
    @PostMapping("/groupConfirmationForm")
    public ResultBean groupConfirmationForm(@Validated @RequestBody OrderBaseVO order) {
        String url = MODULE_URL + "/groupConfirmationForm";
        return restTemplate.postForObject(url, order, ResultBean.class);
    }

    @ApiOperation("支付记录")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "支付记录", response = OrderPayDTO.class)})
    @PostMapping("/orderPayRecords")
    public ResultBean orderPayRecords(@Validated @RequestBody OrderBaseVO order) {
        String url = MODULE_URL + "/orderPayRecords";
        return restTemplate.postForObject(url, order, ResultBean.class);
    }

    @ApiOperation("计划详情")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "计划详情", response = OrderTouristDTO.class)})
    @PostMapping("/planDetails")
    public ResultBean planDetails(@Validated @RequestBody OrderBaseVO order) {
        String url = MODULE_URL + "/planDetails";
        return restTemplate.postForObject(url, order, ResultBean.class);
    }

    @ApiOperation("操作日志")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "操作日志", response = OrderLogs.class)})
    @PostMapping("/operLogs")
    public ResultBean operLogs(@Validated @RequestBody OrderBaseVO order) {
        String url = MODULE_URL + "/operLogs";
        return restTemplate.postForObject(url, order, ResultBean.class);
    }

    @ApiOperation("近期订单信息")
    @PostMapping("/recentOrderInfo")
    public ResultBean recentOrderInfo(@RequestBody OrderStaticsVO vo) {
        String url = MODULE_URL + "/recentOrderInfo";
        return restTemplate.postForObject(url, vo, ResultBean.class);
    }

    /*根据订单id查订单合同约定信息*/
    @ApiOperation("合同约定信息")
    @GetMapping("/selectContract/{orderId}")
    public ResultBean selectContract(@PathVariable("orderId") Integer orderId) {
        String url = MODULE_URL + "/selectContract/"+orderId;
        return restTemplate.getForObject(url, ResultBean.class);
    }

    @ApiOperation("订单审核合同列表（包括精确搜索）")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "订单列表信息", response = OrderListDTO.class)})
    @PostMapping("/searchContractOrders")
    public ResultBean searchContractOrders(@Validated @RequestBody OrderSearchVO vo) {
        ResultBean bean = validateUserAndCompany(vo);
        if (bean.isFail()) {
            return bean;
        }
        Integer dataLimit = getUser().getuDataLimit();
        if(dataLimit<3){
            vo.setPuDataLimit(2);
        }
        vo.setWithOutContract(true);
        String url = MODULE_URL + "/searchContractOrders";
        return restTemplate.postForObject(url, vo, ResultBean.class);
    }

    @ApiOperation("订单游客列表")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "订单游客列表", response = OrderListDTO.class)})
    @GetMapping("/getTourists")
    public ResultBean getTourists(@RequestParam("orderId") Long orderId,@RequestParam("pageNo") int pageNo,@RequestParam("pageSize") int pageSize) {
    	return restTemplate.getForObject(new StringBuilder(MODULE_URL).append("/getTourists?orderId=").append(orderId)
    			.append("&pageNo=").append(pageNo).append("&pageSize=").append(pageSize).toString(),  ResultBean.class);}


    @ApiOperation("下载订单游客列表")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "订单游客列表", response = OrderListDTO.class)})
    @GetMapping("/downloadTourists")
    public void downloadTourists(@RequestParam("orderId") Long orderId,@RequestParam("pageNo") int pageNo,@RequestParam("pageSize") int pageSize) throws Exception {
        ResultBean result = restTemplate.getForObject(new StringBuilder(MODULE_URL).append("/getTourists?orderId=").append(orderId)
                .append("&pageNo=").append(pageNo).append("&pageSize=").append(pageSize).toString(), ResultBean.class);
        Object body = ((Map)result.getBody()).get("body");
        List<List> content = new LinkedList();
        if(Objects.nonNull(body)){
            Map map = (Map)body;
            if(!CollectionUtils.isEmpty(map)){
                List<Map> rowsData = (List<Map>) map.get("resultList");
                for (Map rowDate : rowsData){
                    List<String> row = new ArrayList<>();
                    for(String filed : touristExcelFieldList){
                        Optional<Object> rowOptional = Optional.ofNullable(rowDate.get(filed));
                        row.add(rowOptional.orElse(BLANK_STR).toString());
                    }
                    content.add(row);
                }
            }
        }
       ExcelUtil.export(URLEncoder.encode("游客列表", "UTF8"),"游客列表", touristExcelTitle,content,getResponse());
    }



    @ApiOperation("获取部取消客人的团期的数量")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "获取部取消客人的团期的数量", response = Integer.class)})
    @GetMapping("/getNeedToDealCount")
    public ResultBean getNeedToDealCount() {
    	return restTemplate.getForObject(new StringBuilder(MODULE_URL).append("/getNeedToDealCount").toString(),  ResultBean.class);}
    @MyLog
    @ApiOperation("保存订单游客")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "保存订单游客")})
    @PostMapping("/saveTourist")
    public ResultBean saveTourist(@RequestBody OrderTourist touristInfo) {
    	return restTemplate.postForObject(new StringBuilder(MODULE_URL).append("/saveTourist").toString(),touristInfo,  ResultBean.class);}

    @MyLog
    @ApiOperation("批量保存订单游客")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "批量保存订单游客")})
    @PostMapping("/batchSaveTourist")
    public ResultBean batchSaveTourist(@RequestBody OrderTouristForBatch vo){
        return restTemplate.postForObject(new StringBuilder(MODULE_URL).append("/batchSaveTourist").toString(),vo,  ResultBean.class);
    }



    @MyLog
    @ApiOperation("审核支付凭证")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "审核支付凭证", response = OrderListDTO.class)})
    @PostMapping("/reviewVoucher")
    public ResultBean reviewVoucher(@Validated(value=Update.class) @RequestBody List<OrderOffline> orderOffline) {
        if(orderOffline.get(0)!=null){
            orderOffline.get(0).setUpdateUser(getUser().getUserId());
        }

    	//审核
    	ResultBean postForObject = restTemplate.postForObject(new StringBuilder(MODULE_URL).append("/reviewVoucher").toString()
    			,orderOffline,  ResultBean.class);

//        boolean sendFlag = false;
        //如果是操作成功，且是首付款或全额付款，且已确认，设置发送喜报标识
//        if ("0".equals(postForObject.getCode())
//                && orderOffline.get(0).getfStatus().equals(2)
//                && (orderOffline.get(0).getType().equals(Integer.valueOf(1)) || orderOffline.get(0).getType().equals(Integer.valueOf(0)))){
//            sendFlag = true;
//        }
//        if (sendFlag){
            //add by dengbo 2018/1/31;线下付款，财务确认支付后发送喜报
//            logger.info("=====reviewVoucher====异步发送喜报以及实时推送个人喜报");
//            taskExecutor.execute(() -> sendPoster((String)postForObject.getBody()));
//        }

    	//操作失败、不是确认、首付款返回
    	if(!"0".equals(postForObject.getCode())||!orderOffline.get(0).getfStatus().equals(2)
    			||orderOffline.get(0).getType().equals(Integer.valueOf(1))){
    		return postForObject;
    	}else{
            //查询订单详情并签署合同
            OrderBaseVO order=new OrderBaseVO();
            order.setId(orderOffline.get(0).getOrderId());
            SignContract signContract=new SignContract();
            signContract.setOrderNo((String)postForObject.getBody());
            ecfpc.companyAndCustomerSignContract(signContract);

            return postForObject;
	    }
    }
    @ApiOperation("查询支付凭证")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "审核支付凭证", response = OrderListDTO.class)})
    @PostMapping("/getVouchers")
    public ResultBean getVouchers(@RequestBody OrderOffline orderOffline) {
    	return restTemplate.postForObject(new StringBuilder(MODULE_URL).append("/getVouchers").toString(),orderOffline,  ResultBean.class);}
    @ApiOperation("导出取消的游客")
    @GetMapping("/exportCancelTourists")
    public void exportCancelTourists(@RequestParam(value="scheduleId",required=true)Long scheduleId,
            HttpServletResponse response ) {
    	List<Map<String, Object>> tourists = (List<Map<String, Object>>) restTemplate.getForObject(new StringBuilder(MODULE_URL).append("/exportCancelTourists?")
    			.append("scheduleId=").append(scheduleId).toString(),  ResultBean.class).getData();
    	 List<String> titles = new ArrayList<>();
         List<List> bodyList = new ArrayList<>();

         titles.add("序号");
         titles.add("状态");
         titles.add("票价类目");
         titles.add("票种");
         titles.add("游客姓名");
         titles.add("游客电话");
         titles.add("证件类型");
         titles.add("证件号");
         titles.add("票价");
         titles.add("去程");
         titles.add("返程");
         titles.add("订单号");
         titles.add("支付时间");
         titles.add("取消原因");

         if (!isEmpty(tourists)) {
        	 int i=1;
        	 for(Map item:tourists){
        		 List body = new ArrayList<>();

        		 body.add(i++);
        		 body.add("已取消");
        		 body.add(item.get("category"));
        		 body.add(item.get("type"));
        		 body.add(item.get("otName"));
        		 body.add(item.get("otPhone"));
        		 body.add(item.get("licenceType"));
        		 body.add(item.get("licence"));
        		 body.add(item.get("price"));
        		 body.add(item.get("leaveStation"));
        		 body.add(item.get("returnStation"));
        		 body.add(item.get("orderNo"));
        		 body.add(item.get("payTime"));
        		 body.add(item.get("reason"));

        		 bodyList.add(body);
        	 }
         }
       //生成模板并下载
         try {
             ExcelUtil.export(URLEncoder.encode("游客导出", "UTF8") + format(new Date(), "yyyy-MM-dd"), "游客导出", titles, bodyList, response);
         } catch (Exception e) {
             logger.error("游客导出失败", e);
         }
    }


    @PostConstruct
    public void init(){
        touristExcelTitle.add("姓名");
        touristExcelTitle.add("证件号码");
        touristExcelTitle.add("手机号");
        touristExcelTitle.add("类目");
        touristExcelTitle.add("类型");
        touristExcelTitle.add("票名");


        touristExcelFieldList.add("otName");
        touristExcelFieldList.add("otLincese");
        touristExcelFieldList.add("otPhone");
        touristExcelFieldList.add("categoryName");
        touristExcelFieldList.add("ticketTypeName");
        touristExcelFieldList.add("otTicketName");
    }

//    @Async
//    private void sendPoster(String orderNo) {
//        logger.info("进入推送喜报");
//        logger.info("订单编号："+orderNo);
//        posterSettingsService.sendPoster(orderNo, 0);
//        logger.info("推送喜报完成：");
//    }
}
