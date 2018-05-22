package com.jdy.b2b.api.controller.frontController;

import com.github.pagehelper.PageHelper;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.dao.product.FrontProductMapper;
import com.jdy.b2b.api.dao.user.UserMapper;
import com.jdy.b2b.api.model.front.ProductScheduleDto;
import com.jdy.b2b.api.model.front.ScheduleCalendarRequestParam;
import com.jdy.b2b.api.model.front.ScheduleListRequestParam;
import com.jdy.b2b.api.model.user.User;
import com.jdy.b2b.api.model.user.UserExtendDTO;
import com.jdy.b2b.api.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.oauth2.resource.UserInfoTokenServices;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.*;

/**
 * Created by dugq on 2017/9/19.
 */
@RestController
@RequestMapping("product")
public class ScheduleListController {
    @Autowired
    private ScheduleService scheduleService;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private FrontProductMapper frontProductMapper;

    @RequestMapping("buslist")
    @ResponseBody
    public ResultBean buslist(@RequestBody ScheduleListRequestParam param){
        PageHelper.startPage(param.getStart(),20);
        List<ProductScheduleDto> productScheduleDtos = scheduleService.selectProductScheduleList(param);
        return ResultBean.getSuccessResult( productScheduleDtos);
    }
    @RequestMapping("calendar")
    @ResponseBody
    public ResultBean scheduleCalendarList(@RequestBody ScheduleCalendarRequestParam param){
//        if(!Objects.isNull(param.getUserId())){
//            User user = userMapper.selectSimpleById(param.getUserId());
//            param.setCompanyId(user.getuCompanyId());
//            int i = frontProductMapper.countGroupInfo(user.getuWxOpenId());
//            if(i>0){
//            }
//        }
        param.setCompanyId(null);
       List<ProductScheduleDto> productScheduleDtos = scheduleService.selectScheduleCalendarList(param);
         Map<String,List<ProductScheduleDto>> map = new HashMap();
        LocalDateTime now = LocalDateTime.now();
       productScheduleDtos.forEach(dto -> {
           Date date = dto.getBl_start_date();
           Date time = dto.getsLeaveTime();
           if(Objects.isNull(date) || Objects.isNull(time)){
               return;
           }
           LocalDateTime dateTime =LocalDateTime.of(date.getYear()+1900,date.getMonth()+1,date.getDate(),time.getHours(),time.getMinutes());
           if(Objects.isNull(dto.getStopType())){
               if(now.isAfter(dateTime)){
                   return;
               }
           }else if(dto.getStopType()==0){
               dateTime = dateTime.minusMinutes(dto.getStopSale());
               if(now.isAfter(dateTime)){
                   return;
               }
           }else if(dto.getStopType() == 1){
               dateTime = dateTime.minusHours(dto.getStopSale());
               if(now.isAfter(dateTime)){
                   return;
               }
           }else if(dto.getStopType() == 2){
               dateTime = dateTime.minusDays(dto.getStopSale());
               if(now.isAfter(dateTime)){
                   return;
               }
           }
           int selled = 0;
           if(dto.getHold() !=null )
               selled+=dto.getHold();
           if( dto.getLock() != null){
               selled+=dto.getLock();
           }
           if( dto.getSold() != null){
               selled+=dto.getSold();
           }
           if(dto.getSham() != null && dto.getSham() >=  selled){ //虚占>预留+锁定+已售的时候  已定显示虚占的数字  剩余=计划-虚占
               dto.setBl_saled(dto.getSham());
           }else{               //虚占＜（预留+锁定+已售）的时候  已定显示9预留+锁定+已售）的数字  剩余=计划-（预留+锁定+已售）
               dto.setBl_saled(selled);
           }
           List<ProductScheduleDto> listDto = map.get(dto.getCalendar());
           if(Objects.isNull(listDto)){
               listDto = new LinkedList();
               map.put(dto.getCalendar(),listDto);
           }
           listDto.add(dto);
        });
        return ResultBean.getSuccessResult(map);
    }

    @RequestMapping("scheduleList")
    @ResponseBody
    public ResultBean productScheduleList(@RequestBody ScheduleListRequestParam param){
        PageHelper.startPage(param.getPage(),param.getLimit());
        List<ProductScheduleDto> productScheduleDtos = scheduleService.selectProductScheduleList(param);
        return ResultBean.getSuccessResult( productScheduleDtos);
    }
}
