package com.jdy.b2b.web.controll.frontAPIs;

import com.alibaba.fastjson.JSON;
import com.fadada.sdk.client.FddClientBase;
import com.jdy.b2b.web.aop.MyLogAop;
import com.jdy.b2b.web.config.wechat.WechatConfiguration;
import com.jdy.b2b.web.config.wechat.WechatConfiguration2;
import com.jdy.b2b.web.controll.order.OrderOperationController;
import com.jdy.b2b.web.pojo.electroniccontract.FddParamer;
import com.jdy.b2b.web.pojo.electroniccontract.SignContract;
import com.jdy.b2b.web.pojo.electroniccontract.SignContractInfo;
import com.jdy.b2b.web.pojo.order.*;
import com.jdy.b2b.web.service.PosterSettingsService;
import com.jdy.b2b.web.util.*;
import com.jdy.b2b.web.util.QRCode.TwoDimensionCode;
import com.jdy.b2b.web.util.wechat.wxpay.sdk.WXPay;
import com.jdy.b2b.web.util.wechat.wxpay.sdk.WXPayConfigImpl;
import com.jdy.b2b.web.util.wechat.wxpay.sdk.WXPayUtil;
import io.swagger.annotations.ApiOperation;
import net.sf.json.JSONObject;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.task.TaskExecutor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Controller;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.math.BigDecimal;
import java.util.*;

import static com.jdy.b2b.web.enums.OrderSourceEnum.CS;
import static com.jdy.b2b.web.enums.OrderSourceEnum.H5;

/**
 * Created by zhangfofa on 2017/10/9.
 */
@Controller
@RequestMapping("wechat")
public class WechatPayController extends BaseController{

    protected static final org.slf4j.Logger logger = LoggerFactory
            .getLogger(MyLogAop.class);

    @Autowired
    private FddParamer fddParamer;

    @Autowired
    private WechatConfiguration wechatConfiguration;

    @Autowired
    private WechatConfiguration2 wechatConfiguration2;

    @Autowired
    private TwoDimensionCode td;

    @Autowired
    TaskExecutor taskExecutor;

    @Value("${salesCenterUrl}")
    String salesCenterUrl;

    @Value("${salesCenterUrl}orderPrePay")
    String ORDER_PREPAY_URL;
    private static WXPay wxpay;

    private static WXPay wxpay2;

    @Autowired
    OrderOperationController orderOperationController;

    @Autowired
    PosterSettingsService posterSettingsService;

    /**
     * 统一下单
     */
    @RequestMapping("doUnifiedOrder")
    @ResponseBody
    @ApiOperation(value = "微信支付统一下单接口")
    public ResultBean doUnifiedOrder(@RequestParam Byte type,
                                     @RequestParam String outTradeNo,
                                     @RequestParam(required = false) String openId,
                                     @RequestParam(required = false) String appletId,
                                     @RequestParam(required = false) String newOutTradeNo,
                                     @RequestParam(required = false) BigDecimal paymentAmount,
                                     HttpServletRequest httpServletRequest) throws Exception {
        logger.error("入参: "+"outTradeNo: "+outTradeNo+" newOutTradeNo: "+newOutTradeNo+" openId: "+openId+" type: "+type+" appletId: "+appletId);

        //查询微信支付所需信息
        String queryPayNeedInfoUrl = salesCenterUrl + "Order/queryPayNeedInfoByOrderNo";
        ResultBean payNeedInfoResultBean = restTemplate.postForEntity(queryPayNeedInfoUrl, outTradeNo, ResultBean.class).getBody();
        logger.info("payNeedInfoResultBean:"+ JSON.toJSONString(payNeedInfoResultBean));
        PayNeedInfo payNeedInfo = (PayNeedInfo) payNeedInfoResultBean.getParsedData(PayNeedInfo.class);
        logger.error(outTradeNo + "订单信息：" +JSON.toJSONString(payNeedInfo));

        if(Objects.equals(payNeedInfo, null)) {
            logger.error("订单相关信息【"+outTradeNo+"】有误！");
            return ResultBean.getIndexFailResult("订单相关信息有误！");
        }

        HashMap<String, String> data = new HashMap<>();
        String totalFee = null;
        if(H5.equals(payNeedInfo.getOrderSource())) {
            if(payNeedInfo.getOrderStatus().intValue() != 1) {
                return ResultBean.getFailResult("该订单未处于待支付状态！");
            }
            totalFee = payNeedInfo.getRealPay().multiply(new BigDecimal("100")).intValue()+"";
        } else if (CS.equals(payNeedInfo.getOrderSource())) {
            if(payNeedInfo.getOrderStatus().intValue() != 1) {
                return ResultBean.getFailResult("该订单未处于待支付状态！");
            }
            //验证礼品卡是否有效
            List<OrderCard> orderCardList = payNeedInfo.getOrderCardList();
            List<CardDO> cardDOList = new ArrayList<>();
            if(!Objects.equals(orderCardList, null) && orderCardList.size() > 0) {
                for(OrderCard orderCard : payNeedInfo.getOrderCardList()) {
                    CardDO cardDO = new CardDO();
                    cardDO.setCardNo(orderCard.getCardNo());
                    cardDO.setPass(orderCard.getCardPass());
                    cardDOList.add(cardDO);
                }
                CardValidateVO cardValidateVO = new CardValidateVO(cardDOList, payNeedInfo.getProductId());
                cardValidateVO.setAppletId(appletId);
                ResultBean validateCardResultBean = orderOperationController.validateCard(cardValidateVO);
                if(validateCardResultBean.isFail()) {
                    logger.error("礼品卡已失效！");
                    ValidateFailDO validateFailDO = new ValidateFailDO();
                    validateFailDO.setOrderId(payNeedInfo.getOrderId());
                    String giftCardLoseEfficacyUrl = salesCenterUrl + "Order/validateFailBeforPay";
                    return restTemplate.postForEntity(giftCardLoseEfficacyUrl, validateFailDO, ResultBean.class).getBody();
                }
                orderCardList.sort((OrderCard h1, OrderCard h2) -> h1.getValidTime().compareTo(h2.getValidTime()));
                if(payNeedInfo.getToPay().compareTo(new BigDecimal(0)) == 0) {
                    //回调
                    OrderWxPayVO pay = new OrderWxPayVO();
                    pay.setOrderNo(outTradeNo);
                    pay.setToPay(new BigDecimal(0));
                    pay.setFlag(true);
                    pay.setRemark(outTradeNo);

                    String url = salesCenterUrl + "Order/wxPay";
                    ResultBean callBackResultBean = restTemplate.postForObject(url, pay, ResultBean.class);
                    if(callBackResultBean.isFail()) {
                        return ResultBean.getFailResult("更新失败！");
                    }
                    //公司签署合同
                    companySignContract(outTradeNo);
                    return new ResultBean("200","礼品卡抵扣成功！");
                }
                String timeExpire = orderCardList.get(0).getValidTime()+"235959";
                totalFee = payNeedInfo.getToPay().multiply(new BigDecimal("100")).intValue()+"";
                data.put("time_expire", timeExpire);
            } else {
                if(!(payNeedInfo.getToPay().compareTo(new BigDecimal(0))>0)) {
                    return ResultBean.getFailResult("订单金额异常！");
                }
                totalFee = payNeedInfo.getToPay().multiply(new BigDecimal("100")).intValue()+"";
            }

        } else if (payNeedInfo.getOrderSource().intValue() == 4) {
            if(payNeedInfo.getOrderStatus().intValue() == 1) {
                totalFee = payNeedInfo.getFirstPay().multiply(new BigDecimal("100")).intValue()+"";
            } else if (payNeedInfo.getOrderStatus().intValue() == 3) {
                if(payNeedInfo.getSecondPay().compareTo(new BigDecimal(0)) <= 0) {
                    return ResultBean.getFailResult("已无剩余所需支付金额！");
                }
                if(paymentAmount.compareTo(new BigDecimal(0)) <= 0) {
                    return ResultBean.getFailResult("支付金额须大于0元");
                }
                if(paymentAmount.compareTo(payNeedInfo.getSecondPay()) > 0) {
                    return ResultBean.getFailResult("您输入的金额超出剩余所需支付最大额度");
                }
                totalFee = paymentAmount.multiply(new BigDecimal("100")).intValue()+"";
            }
        } else {
            return ResultBean.getFailResult("订单异常！");
        }

        String productId = String.valueOf(payNeedInfo.getProductId());
        String ip = IpAddressUtil.getIpAdrress(httpServletRequest);
        outTradeNo = outTradeNo+"-"+RandomStringUtil.getString(Constants.JOINT_ORDER_NO_LENGTH);
        String tradeType = type.byteValue() == 1 ? "JSAPI" : "NATIVE";
        String spbillCreateIp = type.byteValue() == 1 ? ip : wechatConfiguration.getSpbillCreateIp();
        data.put("out_trade_no", outTradeNo);
        data.put("total_fee", totalFee);
        data.put("product_id", productId);
        data.put("spbill_create_ip", spbillCreateIp);
        data.put("trade_type", tradeType);
        data.put("body", wechatConfiguration.getBody());
        data.put("fee_type", wechatConfiguration.getFeeType());
        data.put("notify_url", wechatConfiguration.getNotifyUrl());
        if(type.byteValue() == 1) {
            if(CS.equals(payNeedInfo.getOrderSource())) {
                data.put("openid", appletId);
            } else {
                data.put("openid", openId);
            }
        }
        logger.error("统一下单参数："+data.toString());

        if(null==wxpay){
            WXPayConfigImpl wxPayConfig = WXPayConfigImpl.getInstance(wechatConfiguration);
            wxpay = wxPayConfig.wxpay;
        }

        if(null==wxpay2){
            WXPayConfigImpl wxPayConfig2 = WXPayConfigImpl.getInstance(wechatConfiguration2);
            wxpay2 = wxPayConfig2.wxpay2;
        }

        //关闭订单
        if(!(Objects.equals(newOutTradeNo, null) || Objects.equals(newOutTradeNo, ""))) {
            ResultBean closeOrderResultBean = doUnifiedCloseOrder(newOutTradeNo, payNeedInfo.getOrderSource());
            if(closeOrderResultBean.isFail()) {
                return closeOrderResultBean;
            }
        }

        Map<String, String> unifiedOrderResult;
        if(!CS.equals(payNeedInfo.getOrderSource())) {
            unifiedOrderResult = wxpay.unifiedOrder(data);
        } else {
            unifiedOrderResult = wxpay2.unifiedOrder(data);
        }
        ResultBean unifiedOrderHandlerResult = wechatResultErrorHandler(unifiedOrderResult);
        if(unifiedOrderHandlerResult.isFail()) {
            return unifiedOrderHandlerResult;
        }

        OrderPrePayDO orderPrePayDO = new OrderPrePayDO();
        orderPrePayDO.setPpOrderNo(outTradeNo.split("-")[0]);
        orderPrePayDO.setPpOrderRandom(outTradeNo);
        String orderPrePayAdd = ORDER_PREPAY_URL + "/add";
        ResultBean addOrderPrePayRecord = restTemplate.postForObject(orderPrePayAdd, orderPrePayDO, ResultBean.class);
        if(addOrderPrePayRecord.isFail()) {
            logger.error("生成预支付记录失败!");
            return ResultBean.getIndexFailResult("生成预支付记录失败!");
        }

        Map<String, String> map = new HashMap<>();
        if(type.byteValue() == 1) {
            String nonceStr = WXPayUtil.generateUUID();
            String timeStamp = String.valueOf(System.currentTimeMillis() / 1000);
            map.put("timeStamp",timeStamp);
            map.put("nonceStr", nonceStr);
            map.put("package","prepay_id="+unifiedOrderResult.get("prepay_id"));
            map.put("signType","HMAC-SHA256");
            String sign;
            if(!CS.equals(payNeedInfo.getOrderSource())) {
                sign = wxpay.generateSignature(map, "HMACSHA256");
            } else {
                sign = wxpay2.generateSignature(map, "HMACSHA256");
            }
            map.put("paySign", sign);
            map.put("newOutTradeNo", outTradeNo);
            logger.error("JSAPI下单返回参数："+map.toString());
            return ResultBean.getIndexSuccessResult(map);
        }

        String url = td.encoderQRCode(unifiedOrderResult.get("code_url"),wechatConfiguration.getSavePath(), RandomStringUtil.generateNameAccordingDateAndRandomString(6)+".jpg","jpg",12);
        map.put("url", url);
        map.put("newOutTradeNo", outTradeNo);
        return ResultBean.getIndexSuccessResult(map);
    }

    @RequestMapping("/callback")
    public void callback(HttpServletRequest request, HttpServletResponse response) throws Exception {
        StringBuffer xmlSb = new StringBuffer();
        BufferedReader reader = request.getReader();
        String line;
        while ((line = reader.readLine()) != null) {
            xmlSb.append(line);
        }
        String xmlStr = xmlSb.toString();
        logger.error("回调信息"+xmlStr);
        if(null == xmlStr || "".equals(xmlStr)) {
            logger.error("微信回调接口未返回信息！");
        }
        Map<String, String> rceciveMap = WXPayUtil.xmlToMap(xmlStr);

        if(!wxpay.isPayResultNotifySignatureValid(rceciveMap)) {
            logger.error("签名验证失败!");
        }

        if (Objects.equals(rceciveMap.get("return_code"), "SUCCESS") && Objects.equals(rceciveMap.get("result_code"), "FAIL")) {
            logger.error(rceciveMap.get("err_code_des"));
        }

        OrderWxPayVO pay = new OrderWxPayVO();
        String outTradeNo = rceciveMap.get("out_trade_no");
        pay.setOrderNo(outTradeNo.split("-")[0]);
        pay.setToPay(new BigDecimal(rceciveMap.get("total_fee")).divide(new BigDecimal(100)));
        pay.setTransactionId(rceciveMap.get("transaction_id"));
        pay.setFlag(true);
        pay.setRemark(outTradeNo);

        String url = salesCenterUrl + "Order/wxPay";
        ResultBean resultBean = restTemplate.postForObject(url, pay, ResultBean.class);
        Boolean updateResult = resultBean.isSuccess();
        if(updateResult) {
            //删除预支付记录
            String deleteOrderPrePayRecord = ORDER_PREPAY_URL+"/delete";
            restTemplate.postForObject(deleteOrderPrePayRecord, outTradeNo.split("-")[0], ResultBean.class);
            Map<String, String> sendMap = new HashMap<>();
            sendMap.put("return_code", "SUCCESS");
            sendMap.put("return_msg", "OK");
            String sendStr = WXPayUtil.mapToXml(sendMap);
            response.getWriter().write(sendStr);
            //公司自动签署合同
            long dateBegin = System.currentTimeMillis();
            taskExecutor.execute(() -> companySignContract(pay.getOrderNo()));
            long dateEnd = System.currentTimeMillis();
            logger.error("异步调用公司自动签署合同："+(dateEnd - dateBegin));
            //add by dengbo 2018/1/5;微信支付回调成功后，发送喜报
//            logger.error("异步计算销售组分公司是否发送喜报以及实时推送个人喜报");
//            taskExecutor.execute(() -> sendPoster(pay.getOrderNo()));
        } else {
            logger.error("更新失败！");
        }
    }

    private ResultBean doUnifiedCloseOrder(String newOutTradeNo, Integer type) throws Exception {
        Map<String, String> closeOrderData = new HashMap<>();
        closeOrderData.put("out_trade_no", newOutTradeNo);
        Map<String, String> closeOrderResult;
        if(!CS.equals(type)) {
            closeOrderResult = wxpay.closeOrder(closeOrderData);
        } else {
            closeOrderResult = wxpay2.closeOrder(closeOrderData);
        }
        ResultBean resultBean = wechatResultErrorHandler(closeOrderResult);
        //删除预支付记录
        if(resultBean.isSuccess()) {
            String deleteOrderPrePayRecord = ORDER_PREPAY_URL+"/delete";
            String orderNo = newOutTradeNo.split("-")[0];
            restTemplate.postForObject(deleteOrderPrePayRecord, orderNo, ResultBean.class);
        }
        return resultBean;
    }

    private ResultBean wechatResultErrorHandler(Map<String, String> map) {
        String returnCode = map.get("return_code");
        String resultCode = map.get("result_code");
        if(Objects.equals(returnCode, "FAIL")) {
            logger.error(map.get("return_msg"));
            return ResultBean.getFailResult(map.get("return_msg"));
        }
        if(Objects.equals(returnCode,"SUCCESS") && Objects.equals(resultCode, "FAIL")) {
            logger.error(map.get("err_code_des"));
            return ResultBean.getFailResult(map.get("err_code_des"));
        }
        return ResultBean.getSuccessResult();
    }

    @Async
    private void companySignContract(String orderNo) {
        long dateBegin = System.currentTimeMillis();
        logger.error("进入公司自动签署合同流程");
        logger.error("订单编号："+orderNo);
        String queryPayNeedInfoUrl = salesCenterUrl + "Order/queryPayNeedInfoByOrderNo";
        ResultBean payNeedInfoResultBean = restTemplate.postForEntity(queryPayNeedInfoUrl, orderNo, ResultBean.class).getBody();
        PayNeedInfo payNeedInfo = (PayNeedInfo) payNeedInfoResultBean.getParsedData(PayNeedInfo.class);
        if(payNeedInfo.getOrderSource().intValue()==4 && payNeedInfo.getOrderStatus().intValue() == 3 && payNeedInfo.getSecondPay().compareTo(new BigDecimal(0)) != 0) {
            logger.error("二次支付完成后才允许签署合同！");
            return;
        }

        //判断该订单是否已生成合同
        String querySignContractInfoUrl = salesCenterUrl + "electronicContract/querySignContractInfoByOrderNo";
        MultiValueMap querySignContractInfoParameters = OrganizeRequestParamsUtil.buildMultiValueMap(new String[]{"orderNo", "status"}, new String[]{orderNo, "2"});
        ResultBean signContractInfoResultBean = restTemplate.postForEntity(querySignContractInfoUrl, querySignContractInfoParameters, ResultBean.class).getBody();
        if(signContractInfoResultBean.isFail()) {
            logger.error("该订单尚未生成合同！");
            return;
        }

        //判断该合同公司是否已签署
        SignContractInfo signContractInfoQueryResult = (SignContractInfo)signContractInfoResultBean.getParsedData(SignContractInfo.class);
        if(signContractInfoQueryResult.getIsCompanySigin().intValue() == 1) {
            logger.error("公司已签署合同不允许重复签署！");
            return;
        }

        //公司自动签署
        FddClientBase clientBase = new FddClientBase(fddParamer.getAppId(), fddParamer.getAppSecret(), fddParamer.getVersion(), fddParamer.getUrl());
        String querySignContractSimplenessInfoUrl = salesCenterUrl + "electronicContract/querySignContractSimplenessInfoByOrderNo";
        ResultBean signContractSimplenessInfoResultBean = restTemplate.postForEntity(querySignContractSimplenessInfoUrl, orderNo, ResultBean.class).getBody();
        SignContract signContractSimplenessInfoResult = (SignContract) signContractSimplenessInfoResultBean.getParsedData(SignContract.class);
        String companyAutoSignContractTransitionNo = RandomStringUtil.getString(30);
        String companyAutoSignContractResponse = clientBase.invokeExtSignAuto(companyAutoSignContractTransitionNo, fddParamer.getCustomerId(), "1", signContractSimplenessInfoResult.getContractNo(),
                signContractSimplenessInfoResult.getDocTitle(), "社盖章", "2", null);
        logger.error("公司自动签署响应参数："+companyAutoSignContractResponse);
        JSONObject companyAutoSignContractResult = JSONObject.fromObject(companyAutoSignContractResponse);
        if(!Objects.equals(companyAutoSignContractResult.get("result").toString().toLowerCase(), "success")) {
            return;
        }

        //保存公司签署合同信息
        SignContractInfo signContractInfo = new SignContractInfo();
        signContractInfo.setContractNo(signContractSimplenessInfoResult.getContractNo());
        signContractInfo.setViewPdfUrl(companyAutoSignContractResult.get("viewpdf_url").toString());
        signContractInfo.setDownloadUrl(companyAutoSignContractResult.get("download_url").toString());
        signContractInfo.setIsCompanySigin((byte)1);
        signContractInfo.setCompanySignContractTime(new Date());
        signContractInfo.setCompanySignContractTransitionNo(companyAutoSignContractTransitionNo);
        String updateSignContractInfoUrl = salesCenterUrl + "electronicContract/updateSignContractInfoByContractNo";
        restTemplate.postForEntity(updateSignContractInfoUrl, signContractInfo, ResultBean.class).getBody();
        long dateEnd = System.currentTimeMillis();
        logger.error("公司自动签署合同执行时间："+(dateEnd - dateBegin));
    }

//    @Async
//    private void sendPoster(String orderNo) {
//        logger.error("进入推送喜报");
//        logger.error("订单编号："+orderNo);
//        posterSettingsService.sendPoster(orderNo, 0);
//        logger.error("推送喜报完成：");
//    }
}
