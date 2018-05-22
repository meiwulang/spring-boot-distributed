package com.jdy.b2b.web.controll.frontAPIs;

import com.alibaba.fastjson.JSON;
import com.jdy.b2b.web.pojo.front.*;
import com.jdy.b2b.web.pojo.user.UserResultDTO;
import com.jdy.b2b.web.service.frontService.ScheduleListService;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ResultBean;
import org.apache.commons.collections.MapUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Created by dugq on 2017/9/19.
 */
@RestController
@RequestMapping("front/product")
public class ScheduleListController extends BaseController{
   @Autowired
   private ScheduleListService scheduleListService;

    /**
     * 班期列表接口
     * @param param
     * @return
     */
   @RequestMapping(value = "buslist")
    public ResultBean scheduleList(ScheduleListRequstParam param){
        ResultBean resultBean = scheduleListService.busList(param);
        List body = (List) resultBean.getBody();
        body.forEach((schedule) -> {
            Map schedule1 = (Map) schedule;
            if((int) schedule1.get("p_confirm") == 0){
                schedule1.put("p_key",new FrontKeys[]{ new FrontKeys("#ff5e12","#f9ff05","无需确认")});
            }
            if((int)schedule1.get("bl_saled") >= (int)schedule1.get("s_group_num")){          //成团人数<已定  显示已成团
                schedule1.put("is_cluster",1);
            }else{
                schedule1.put("is_cluster",0);
            }
            int sham = Objects.isNull(schedule1.get("sham")) ? 0 : (int)schedule1.get("sham");
            int hold = Objects.isNull(schedule1.get("hold")) ? 0 : (int)schedule1.get("hold");
            int sold = Objects.isNull(schedule1.get("sold")) ? 0 : (int) schedule1.get("sold");
            int lock = Objects.isNull(schedule1.get("lock")) ? 0 : (int) schedule1.get("lock");
            int selled = hold + sold + lock;
            if(sham >=  selled){ //虚占>预留+锁定+已售的时候  已定显示虚占的数字  剩余=计划-虚占
                schedule1.put("bl_saled",sham);
            }else{               //虚占＜（预留+锁定+已售）的时候  已定显示9预留+锁定+已售）的数字  剩余=计划-（预留+锁定+已售）
                schedule1.put("bl_saled",selled);
            }
            schedule1.remove("sham");
            schedule1.remove("hold");
            schedule1.remove("sold");
            schedule1.remove("lock");
            schedule1.remove("s_group_num");
        });
        return resultBean;
    }
    @RequestMapping(value = "calendar1")
    public HashMap testCalendar(ScheduleCalendarRequestParam param){
        return calendar(param);
    }
    /**
     * 获取产品日历列表
     * @param param 前台参数，根据原门户请求格式生成
     * @return   取班期和票价数据以原门户日历列表请求格式为基础 组装的数据
     */
    @RequestMapping(value = "calendar")
    public HashMap calendar(@RequestBody ScheduleCalendarRequestParam param){
        countParamStartAndEndDateByFrontParam(param);
        ResultBean resultBean = scheduleListService.selectScheduleCalenderList(param);
        Map body = (Map)resultBean.getBody();
        LocalDate startDate = LocalDate.parse(param.getStartDate());
        List<Map> calendarDtos =   new LinkedList<>();
        for(int i = 0 ; i < 42; i++){
            LocalDate date = startDate.plusDays(i);
            Map calendarDto = buildCalendarDay4Front(param, body, date);
            calendarDtos.add(calendarDto);
        }
        HashMap map = new HashMap();
        map.put("code",200);
        map.put("data",calendarDtos);
        return map;
    }

    /**
     * 构建日历列表中的单天的数据结构
     * @param param 请求参数
     * @param body  api接口返回的主体数据
     * @param date 具体构建的日期
     * @return  需要构建的当前的数据
     */
    private Map buildCalendarDay4Front(ScheduleCalendarRequestParam param, Map body, LocalDate date) {

        Map<String,Object> calendarDto = new LinkedHashMap<>();
        calendarDto.put("Y_m_d",date.format(DateTimeFormatter.ISO_LOCAL_DATE));
        calendarDto.put("Ymd",date.format(DateTimeFormatter.ofPattern("yyyyMMdd")));
        calendarDto.put("Y",date.getYear());
        calendarDto.put("m",date.getMonthValue());
        calendarDto.put("d",date.getDayOfMonth());
        calendarDto.put("css",FrontCalendarCssEnum.ofValue(date,Objects.isNull(param.getMonth())? LocalDate.now().getMonthValue() :param.getMonth()).getValue());
        if(MapUtils.isEmpty(body)){
            calendarDto.put("info", "");
            return calendarDto;
        }
        Object obj = body.get(date.format(DateTimeFormatter.ISO_LOCAL_DATE));
        if(!Objects.isNull(obj) && ((List)obj).size()>0){
           List schedules = (List) obj;
           Map info = buildInfoByScheduleAndTicket4Front(schedules);
            calendarDto.put("info", CollectionUtils.isEmpty(info)?"":info);
        }else{
            calendarDto.put("info", "");
        }
        return calendarDto;
    }

    /**
     * 通过班期和票价列表构建单天数据结构中的info属性
     * @param schedule  班期
     * @return info属性
     */
    private Map buildInfoByScheduleAndTicket4Front(List<Map> schedule) {
        Map info = new HashMap();
        String pricePrefix = "￥";
        info.put("bl_num", schedule.get(0).get("bl_num"));
        info.put("bl_id", schedule.get(0).get("s_id"));
        List<Map> tempTicket = new LinkedList<>();
        final int[] ticketNum = {0};
        schedule.forEach(s ->{
            List backTicket = (List) s.get("backTicket");
            List<Map<String, Object>> new_ticket = changeWebTicket2FrontTicketAndCountRemainingSeats(s,backTicket, ticketNum);
            Map<String, List<Map>> ticketMap = new_ticket.stream().collect(Collectors.groupingBy(map -> (String)map.get("category_name")));
            tempTicket.addAll(new_ticket);
            s.put("ticket",ticketMap);
            s.put("bl_id", s.get("s_id"));
            s.remove("backTicket");
        });
        List<Map> ticketList = tempTicket.stream().distinct().collect(Collectors.toList());
        Map<String, List<Map>> ticketMap = ticketList.stream().collect(Collectors.groupingBy(map -> (String)map.get("category_name")));

        info.put("bl_data",schedule);
        info.put("is_cluster",1);
        if(ticketList.size()>0){
            ticketList.sort(Comparator.comparingDouble(t-> (double) t.get("t_price")));
            info.put("price", pricePrefix+ticketList.get(0).get("t_price"));
            info.put("price_new",getMinPrice(ticketList) );
            Object seatNum = getMinNumOfSeatAndTicket(schedule, ticketNum);
            info.put("seat_num",seatNum);
            info.put("ticket", JSON.parse(JSON.toJSONString(ticketMap)));
        }else{
            info.put("price", "￥0");
            info.put("price_new", "￥0");
            info.put("ticket",ticketMap);
            info.put("seat_num","售罄");
        }
        return info;
    }

    private Object getMinPrice(List<Map> ticketList){
        Map<String, List<Map>> collect = ticketList.stream().collect(Collectors.groupingBy(map -> (String)map.get("t_preset_type")));
        List<Map> t1 = collect.get("成人票");
        List<Map> t2 = collect.get("儿童票");
        if(CollectionUtils.isEmpty(t1)){
            if(CollectionUtils.isEmpty(t2)){
                return ticketList.get(0).get("t_price");
            }else{
                return t2.get(0).get("t_price");
            }
        }else{
            return t1.get(0).get("t_price");
        }
    }

    /**
     * 获取余票信息。 如果票价为无限制，则根据班期座位判断
     * 如果票有限制，则取余票和余座的最小值
     *  如果值》20 则显示充足
     *  值为0 则显示售罄
     *  否则显示具体数字
     * @param schedule  班期
     * @param ticketNum 余票
     * @return
     */
    private Object getMinNumOfSeatAndTicket(List<Map> schedule, int[] ticketNum) {
        Object seatNum;

        final int[] scheduleSeatNum = new int[]{0};
//        schedule.forEach(s-> scheduleSeatNum[0] += (int)s.get("bl_seat_count")-(int)s.get("bl_saled"));
        schedule.forEach(s-> scheduleSeatNum[0] -= (int)s.get("bl_saled"));
//        int min = 0;
//        if(ticketNum[0] ==-1){
//            min = scheduleSeatNum[0];
//        }else {
//            min = Math.min(scheduleSeatNum[0], ticketNum[0]);
//        }
        int min = ticketNum[0];
        if(min >= 20 || min < 0){
            seatNum = "充足";
        }else if(min<=0){
            seatNum = "售罄";
        }else{
            seatNum = min;
        }
        return seatNum;
    }

    private int getMinNumOfSeatAndTicket(Map schedule,int ticketNum){
        int num = (int)schedule.get("bl_seat_count")-(int)schedule.get("bl_saled");
        if(num == -1 || ticketNum == -1){
            return  Math.max(num,ticketNum);
        }else{
            return Math.min(num,ticketNum);
        }
    }

    /**
     * 根据原门户请求返回的数据格式重新封装web端的票价信息。 并且顺便计算出余票
     * @param ticket
     * @param ticketNum
     * @return
     */
    private List<Map<String, Object>> changeWebTicket2FrontTicketAndCountRemainingSeats(Map schedule,List<Map> ticket, int[] ticketNum) {
        List<Map<String,Object>> new_ticket = new LinkedList<>();
        ticket.forEach(t ->{
            int tStock = (int)t.get("tStock");
            if(ticketNum[0] >= 0 && tStock >0){
                ticketNum[0] += tStock;
            }else if(ticketNum[0] >= 0 && tStock == -1){
                ticketNum[0] = -1;
            }
            HashMap map = new HashMap();
            map.put("t_id",t.get("id"));
//            map.put("t_store",getMinNumOfSeatAndTicket(schedule, (int) t.get("tStock")));
            map.put("t_store",t.get("tStock"));
            map.put("t_standards_name",t.get("tName"));
            map.put("t_price",t.get("tMarketPrice"));
            map.put("t_limit_type",t.get("tLimitType"));
            map.put("t_limit_condition",t.get("tLimitCondition"));
            map.put("t_remark",t.get("tIntroduction"));
            map.put("category_name",t.get("categoryName"));
            map.put("category_id",t.get("categoryId"));
            map.put("t_adult_num",t.get("tAdultNum"));
            map.put("t_child_num",t.get("tChildNum"));
            Integer tType = (Integer) t.get("tType");
            Integer tTicketType = (Integer) t.get("tTicketType");
            map.put("t_preset_type", tTicketType == 1? "套票" : tType != null && tType > 0 ? "儿童票" : "成人票" );
            new_ticket.add(map);
        });
        return new_ticket;
    }

    /**
     * 根据前段请求的参数计算班班期列表的开始时间和结束时间
     * ！！！！这是个有副作用的方法，改变开始时间和结束时间
     * @param param   传入参数
     */
    private void countParamStartAndEndDateByFrontParam(ScheduleCalendarRequestParam param) {
        LocalDate startDay = null;
        LocalDate endDay = null;
        LocalDate date = null;
        if(Objects.isNull(param.getYear()) || Objects.isNull(param.getMonth())){
            LocalDate today = LocalDate.now();
            date = today.with(TemporalAdjusters.firstDayOfMonth());
        }else{
            date = LocalDate.of(param.getYear(),param.getMonth(),1);
        }
        int temp = date.getDayOfWeek().getValue() - 1;
        startDay = date.minusDays(temp);
        endDay = startDay.plusDays(42);
        param.setStartDate(startDay.format(DateTimeFormatter.ISO_LOCAL_DATE));
        param.setEndDate(endDay.format(DateTimeFormatter.ISO_LOCAL_DATE));
        if(!"preview".equals(param.getFrom())){
            if(Objects.isNull(param.getUserId())){
                UserResultDTO user = getUser();
                if(Objects.isNull(user)) {
                    throw new RuntimeException("no param named userId");
                }
                Long userId = user.getUserId();
                param.setUserId(userId);
            }
        }
    }

    /**
     * 获取产品的班期详情
     * @return
     */
    @ResponseBody
    @RequestMapping("list_details")
    public ResultBean ScheduleListOfProduct(ScheduleListDetailRequestParam param){
        return scheduleListService.selectScheduleListOfProduct(param);
    }
}
