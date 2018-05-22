package com.jdy.b2b.web.controll.frontAPIs;

import com.jdy.b2b.web.pojo.order.Order;
import com.jdy.b2b.web.pojo.order.OrderBaseVO;
import com.jdy.b2b.web.pojo.order.OrderGroupConfirmation;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.DesUtil;
import com.jdy.b2b.web.util.ResultBean;
import com.jdy.b2b.web.util.UrlUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.Calendar;
import java.util.Objects;

/**
 * Created by zhangfofa on 2017/10/24.
 */
@Controller
@RequestMapping("notify")
public class NotifyController extends BaseController{

    @Value("${spring.groupAdviceNoteForMessageKey}")
    private String key;

    @Value("${salesCenterUrl}Order")
    String MODULE_URL;

    @RequestMapping("/groupAdviceNote")
    public ModelAndView groupAdviceNote(@ModelAttribute Order order) {
        ModelAndView mav = new ModelAndView("groupNotice");
        String urlFirst = MODULE_URL + "/selectOrderByOrderNo";
        ResultBean<Order> firstResult = restTemplate.postForObject(urlFirst, order, ResultBean.class);
        Order orderResult = firstResult.getParsedEnitity(Order.class);

        OrderBaseVO orderBaseVO = new OrderBaseVO();
        orderBaseVO.setId(orderResult.getId());
        String url = MODULE_URL + "/groupConfirmationForm";
        ResultBean<OrderGroupConfirmation> resultBean = restTemplate.postForObject(url, orderBaseVO, ResultBean.class);
        OrderGroupConfirmation orderGroupConfirmation = resultBean.getParsedEnitity(OrderGroupConfirmation.class);
        if(Objects.equals(orderGroupConfirmation, null)) {
            return null;
        }
        if(!Objects.equals(orderGroupConfirmation.getTrips(), null) && orderGroupConfirmation.getTrips().size()>0) {
            for(int i=0; i<orderGroupConfirmation.getTrips().size(); i++) {
                Calendar c = Calendar.getInstance();
                c.setTime(orderGroupConfirmation.getsCalendar());
                c.add(Calendar.DAY_OF_MONTH, i);
                orderGroupConfirmation.getTrips().get(i).setTcEffectDay(c.getTime());
            }
        }
        mav.addObject("resultBean",orderGroupConfirmation);
        return mav;
    }

    @RequestMapping(value = "/groupAdviceNoteForMessage", method = RequestMethod.GET)
    @ResponseBody
    public ModelAndView groupAdviceNoteForMessage(@RequestParam String orderNoCode) throws Exception {
        Order order = new Order();
        order.setoOrderNo(DesUtil.decrypt(UrlUtil.getURLDecoderString(orderNoCode), key));
        ModelAndView mav = new ModelAndView("groupNotice");
        String urlFirst = MODULE_URL + "/selectOrderByOrderNo";
        ResultBean<Order> firstResult = restTemplate.postForObject(urlFirst, order, ResultBean.class);
        Order orderResult = firstResult.getParsedEnitity(Order.class);

        OrderBaseVO orderBaseVO = new OrderBaseVO();
        orderBaseVO.setId(orderResult.getId());
        String url = MODULE_URL + "/groupConfirmationForm";
        ResultBean<OrderGroupConfirmation> resultBean = restTemplate.postForObject(url, orderBaseVO, ResultBean.class);
        OrderGroupConfirmation orderGroupConfirmation = resultBean.getParsedEnitity(OrderGroupConfirmation.class);
        if(Objects.equals(orderGroupConfirmation, null)) {
            return null;
        }
        if(!Objects.equals(orderGroupConfirmation.getTrips(), null) && orderGroupConfirmation.getTrips().size()>0) {
            for(int i=0; i<orderGroupConfirmation.getTrips().size(); i++) {
                Calendar c = Calendar.getInstance();
                c.setTime(orderGroupConfirmation.getsCalendar());
                c.add(Calendar.DAY_OF_MONTH, i);
                orderGroupConfirmation.getTrips().get(i).setTcEffectDay(c.getTime());
            }
        }
        mav.addObject("resultBean",orderGroupConfirmation);
        return mav;
    }
}
