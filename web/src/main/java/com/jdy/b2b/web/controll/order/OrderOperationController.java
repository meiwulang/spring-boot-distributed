package com.jdy.b2b.web.controll.order;

import com.alibaba.fastjson.JSON;
import com.jdy.b2b.web.aop.MyLogAop;
import com.jdy.b2b.web.controll.electroniccontract.ElectronicContractController;
import com.jdy.b2b.web.pojo.log.MyLog;
import com.jdy.b2b.web.pojo.order.*;
import com.jdy.b2b.web.pojo.orderRefund.OrderConfirm;
import com.jdy.b2b.web.service.CloseOrderService;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ResultBean;
import com.jdy.b2b.web.util.exception.ParamUnExpectException;
import io.jsonwebtoken.lang.Assert;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static com.jdy.b2b.web.enums.OrderStatusEnum.TO_CONFIRM;
import static java.util.Objects.isNull;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.apache.commons.lang3.StringUtils.isNotBlank;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/9/19 11:30
 */
@Api(value = "Order", description = "订单操作")
@RestController
@RequestMapping("/Order")
public class OrderOperationController extends BaseController {

    protected static final org.slf4j.Logger logger = LoggerFactory
            .getLogger(MyLogAop.class);

    @Value("${salesCenterUrl}Order")
    String MODULE_URL;

    @Autowired
    ElectronicContractController electronicContractController;
    @Autowired
    private CloseOrderService closeOrderService;

    @MyLog(Operation = "save")
    @ApiOperation("新增订单")
    @PostMapping("/addOrder")
    public ResultBean addOrder(@Validated @RequestBody OrderAddVO order) {
        if(isNull(order.getoType())) order.setoType(1);//默认个人订单
        ResultBean bean = validateAddDTO(order);
        if (bean.isFail()) {
            return bean;
        }
        String url = MODULE_URL + "/addOrder";
        ResultBean res = restTemplate.postForObject(url, order, ResultBean.class);
        if (res.isSuccess()) {
            Map data = (Map) res.getData();
            String orderNo = (String) data.get("number");
            Integer status = (Integer) data.get("statusValue");
            logger.info("【" + orderNo + "】下单成功！");
            logger.info("订单状态："+status);
            if (TO_CONFIRM.equals(status)) {
                logger.error("开始调用生成合同接口");
                ResultBean resultBean = electronicContractController.generateContract(orderNo);
                logger.error("生成合同接口返回参数："+resultBean.getMessage());
            }
        } else {
            logger.info("下单失败！");
        }
        return res;
    }

    @MyLog(Operation = "update", SuccessInfo = "确认订单", ErrorInfo = "确认订单")
    @ApiOperation("审核订单")
    @PostMapping("/confirm")
    public ResultBean confirm(@Validated @RequestBody OrderConfirm order) {
        String url = MODULE_URL + "/confirm";
        if(Objects.equals(order.getStatus().intValue(),0)){
            order.setStatus((byte) 2);
        }else if(Objects.equals(order.getStatus().intValue(),1)){
            order.setStatus((byte) 1);
        }else{
            throw new ParamUnExpectException("参数错误~");
        }
        ResultBean resultBean = restTemplate.postForObject(url, order, ResultBean.class);
        logger.error(JSON.toJSONString(resultBean));
        return resultBean;
    }

    @MyLog(Operation = "delete", SuccessInfo = "订单取消", ErrorInfo = "订单取消", Obj = "OrderCancelVO.orderId")
    @ApiOperation("订单取消")
    @PostMapping("/cancel")
    public ResultBean cancel(@Validated @RequestBody OrderCancelVO cancelVO) {
        String url = MODULE_URL + "/cancel";
        ResultBean resultBean = restTemplate.postForObject(url, cancelVO, ResultBean.class);
        try {
            closeOrder(cancelVO.getoOrderNo());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return resultBean;
    }

    @MyLog(Operation = "update", SuccessInfo = "订单发送短信", ErrorInfo = "订单发送短信")
    @ApiOperation("订单发送短信")
    @PostMapping("/sendSMS")
    public ResultBean sendSMS(@Validated @RequestBody OrderBaseVO order) {
        String url = MODULE_URL + "/sendSMS";
        return restTemplate.postForObject(url, order, ResultBean.class);
    }

    @ApiOperation("礼品卡校验")
    @PostMapping("/validateCard")
    public ResultBean validateCard(@Validated @RequestBody CardValidateVO vo) {
        String url = MODULE_URL + "/validateCard";
        return restTemplate.postForObject(url, vo, ResultBean.class);
    }

    private ResultBean validateAddDTO(OrderAddVO order) {
        if (order.getAgent()) {
            if (order.getoBuyerCompanyId() == null) return new ResultBean("-1", "买家公司id不能为空！");
            if (isBlank(order.getoBuyerCompanyName())) return new ResultBean("-1", "买家公司名称不能为空！");
            if (order.getoBuyerId() == null) return new ResultBean("-1", "买家id不能为空！");
            if (isBlank(order.getoBuyerName())) return new ResultBean("-1", "买家姓名不能为空！");
        } else {
            logger.error("下单参数： ==  " + JSON.toJSONString(order));
            order.setoBuyerCompanyId(order.getPcompanyId());
            order.setoBuyerCompanyName(order.getPcName());
            order.setoBuyerId(order.getPuserId());
            order.setoBuyerName(order.getpURealName());
            order.setoSettlementReferences(null);//不是代报名，没有结算优惠
            Assert.isTrue(order.getoBuyerCompanyId()!=null && order.getoBuyerId() != null && isNotBlank(order.getoBuyerCompanyName()) && isNotBlank(order.getoBuyerName()), "下单用户的公司和个人信息不正确！");
        }
        OrderAddTouristDTO ot = order.getTourists().stream().filter(t -> isNotBlank(t.getOtPhone())).findFirst().orElse(null);
        if (ot == null) return new ResultBean("-1", "请至少输入一个游客手机号！");

        boolean hasRep = order.getTourists().stream().anyMatch(t -> t.getOtRep() == 1 && (t.getOtLicenceType() == 0 || t.getOtLicenceType() == 1) && isNotBlank(t.getOtLincese()) && verifyIdNumber(t.getOtLicenceType(), t.getOtLincese()));
        if (!hasRep) return new ResultBean("-1", "请指定一个游客代表，并填写正确的证件类型和号码");

        return ResultBean.getSuccessResult();
    }

    @Async
    private void closeOrder(String orderNo) throws Exception {
        closeOrderService.closeOrder(orderNo);
    }

    //证件号码正则验证
    private boolean verifyIdNumber(Integer type, String number) {
        String regEx;
        if(type.intValue() == 0) {
            regEx = "^\\d{15}$|^\\d{17}[0-9X]$";
            Pattern pattern = Pattern.compile(regEx);
            Matcher matcher = pattern.matcher(number);
            boolean rs = matcher.matches();
            if(rs) {
                return verifyLastIdentityCardNumber(number.toCharArray());
            }
            return rs;
        } else if (type.intValue() == 1) {
            //regEx = "^1[45][0-9]{7}|([P|S]\\d{7})|([S|G]\\d{8})|([G|T|S|L|Q|D|A|F|E]\\d{8})|([G|T|S|L|Q|D|A|F|E][\\w]\\d{7})|([H|M]\\d{8,10})$";
            //Pattern pattern = Pattern.compile(regEx);
            //Matcher matcher = pattern.matcher(number);
            //boolean rs = matcher.matches();
            return true;
        }
        return false;
    }

    //<------------------身份证最后一位的校验算法----------------->
    public static boolean verifyLastIdentityCardNumber(char[] id) {
        int sum = 0;
        int w[] = { 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 };
        char[] ch = { '1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2' };
        for (int i = 0; i < id.length - 1; i++) {
            sum += (id[i] - '0') * w[i];
        }
        int c = sum % 11;
        char code = ch[c];
        char last = id[id.length-1];
        last = last == 'x' ? 'X' : last;
        return last == code;
    }

}