package com.jdy.b2b.web.controll.order;

import com.alibaba.fastjson.JSON;
import com.jdy.b2b.web.enums.DepartureTypeEnum;
import com.jdy.b2b.web.enums.LicenseTypeEnum;
import com.jdy.b2b.web.enums.OrderSourceEnum;
import com.jdy.b2b.web.pojo.order.Order;
import com.jdy.b2b.web.pojo.order.OrderAddPriceDetailDTO;
import com.jdy.b2b.web.pojo.order.OrderAddTouristDTO;
import com.jdy.b2b.web.pojo.order.OrderAddVO;
import com.jdy.b2b.web.pojo.order.h5.BusSeatH5;
import com.jdy.b2b.web.pojo.order.h5.OrderAddVOH5;
import com.jdy.b2b.web.pojo.order.h5.TicketH5;
import com.jdy.b2b.web.pojo.order.h5.TouristDepartsH5;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ResultBean;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.apache.commons.lang3.StringUtils.join;
import static org.springframework.util.CollectionUtils.isEmpty;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/9/26 19:42
 */
@Api(value = "Order H5", description = "H5订单操作")
@RestController
@RequestMapping("/b2b/shop")
public class OrderControllerH5 extends BaseController {
    @Value("${salesCenterUrl}Order")
    String MODULE_URL;
    @Autowired
    OrderOperationController operationController;

    @ApiOperation("新增订单")
    @PostMapping("/place")
    public ResultBean addOrder(@Validated @RequestBody OrderAddVOH5 h5) {
        ResultBean bean = new ResultBean();
        OrderAddVO vo = new OrderAddVO();
        vo.setoScheduleId(h5.getBl_id());
        vo.setoExternalNo(h5.getO_out_num());
        vo.setoContractNo(h5.getO_deal_num());
        vo.setoRemark(h5.getO_remark());
        vo.setAgent(false);
        vo.setoPreferentialAmount(h5.getSell_favourable());
        vo.setoBusSeat(getBusSeat(h5));
        vo.setoSource(OrderSourceEnum.H5.getValue());
        vo.setoContractAgreement(h5.getoContractAgreement());
        vo.setCardDOS(h5.getCardDOS());
        vo.setAppletId(h5.getAppletId());
        vo.setBookType(h5.getBookType());
        vo.setoType(h5.getoType());

        bean = setTouristAndPriceDetail(vo, h5, bean);
        if (bean.isFail()) return bean;

        ResultBean res = operationController.addOrder(vo);
        if (res.isSuccess()) {
            res.setCode("200");
        }
        return res;
    }

    private ResultBean setTouristAndPriceDetail(OrderAddVO vo, OrderAddVOH5 h5, ResultBean bean) {
        List<TicketH5> ticketH5s = h5.getTicket();
        if (isEmpty(ticketH5s)) {
            bean.setCode("-1");
            bean.setMessage("票信息异常！");
            return bean;
        }
        List<OrderAddPriceDetailDTO> priceDetails = new ArrayList<>();
        List<OrderAddTouristDTO> tourists = new ArrayList<>();
        for (TicketH5 t : ticketH5s) {

            priceDetails.add(getRoomDiff(t));//房差，数量为负数

            if (!isEmpty(t.getSeat())) {//单票
                priceDetails.add(getPriceDetail(t));
                t.getSeat().forEach(t2 -> tourists.add(getTourist(t, t2, 0, null)));
            } else if (!isEmpty(t.getList())) {//套票
                t.getList().forEach((id, tk) -> tk.getSeat().forEach(t2 -> tourists.add(getTourist(t, t2, 1, id))));
                priceDetails.add(getPriceDetail(t));//套票数量计算：总人数/单票种类数量
            }
        }
        vo.setPriceDetails(priceDetails);
        vo.setTourists(tourists);
        return bean;
    }

    private OrderAddPriceDetailDTO getRoomDiff(TicketH5 t) {
        OrderAddPriceDetailDTO pd = new OrderAddPriceDetailDTO();
        pd.setOpTicketId(t.getId());
        pd.setOpPriceName("房差");
        pd.setOpNum(t.getNum());
        pd.setRoomNum(t.getRoomNum());
        pd.setOpType(1);//房差
        return pd;
    }

    private OrderAddTouristDTO getTourist(TicketH5 t, TouristDepartsH5 t2, Integer ticketType, Long subTicketId) {
        OrderAddTouristDTO td = new OrderAddTouristDTO();
        td.setOtTicketId(t.getId());
        td.setOtTicketType(ticketType);
        td.setSubTicketId(subTicketId);
        td.setOtName(t2.getVip_name());
        td.setOtPhone(t2.getVip_mob());
        td.setOtLicenceType(LicenseTypeEnum.getValueByDesc(t2.getVip_card_type()));
        td.setOtLincese(t2.getVip_card());
        td.setOtRep(t2.getIs_rep());
        td.setOtLeaveId(t2.getStart_bus_id() != null && t2.getStart_bus_id() != 0 ? t2.getStart_bus_id() : t2.getStart_sid());
        td.setOtLeaveType(DepartureTypeEnum.getValueByDesc(t2.getStart_site_type()).byteValue());
        td.setOtLeavePrice(t2.getStart_price());
        td.setOtReturnId(t2.getEnd_bus_id() != null && t2.getEnd_bus_id() != 0 ? t2.getEnd_bus_id() : t2.getEnd_sid());
        td.setOtReturnType(DepartureTypeEnum.getValueByDesc(t2.getEnd_site_type()).byteValue());
        td.setOtReturnPrice(t2.getEnd_price());
        return td;
    }

    private OrderAddPriceDetailDTO getPriceDetail(TicketH5 t) {
        OrderAddPriceDetailDTO pd = new OrderAddPriceDetailDTO();
        pd.setOpTicketId(t.getId());
        pd.setOpPriceName(t.getName());
        pd.setOpType(0);
        pd.setOpNum(t.getNum());
        pd.setOpPrice(BigDecimal.ZERO);
        pd.setOpTotalPrice(BigDecimal.ZERO);
        return pd;
    }

    private String getBusSeat(OrderAddVOH5 h5) {
        if (isEmpty(h5.getSeat_spread())) {
            return "";
        }
        List<BusSeatH5> seats = h5.getSeat_spread();
        return JSON.toJSONString(seats.stream().map(b -> {
            Map bus = new HashMap();
            bus.put("busId", b.getBusId());
            bus.put("busNo", b.getBus());
            bus.put("seat", join(b.getNum(), ','));
            return bus;
        }).collect(Collectors.toList()));
    }

    @PostMapping("orderPayList")
    public ResultBean orderPayList(@RequestBody Order order){
        String url = MODULE_URL + "/m/orderPayList";
        return restTemplate.postForObject(url, order, ResultBean.class);
    }
}
