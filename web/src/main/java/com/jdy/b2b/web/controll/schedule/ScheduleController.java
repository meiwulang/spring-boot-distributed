package com.jdy.b2b.web.controll.schedule;

import com.alibaba.fastjson.JSONObject;
import com.github.pagehelper.PageInfo;
import com.jdy.b2b.web.enums.LicenseTypeEnum;
import com.jdy.b2b.web.pojo.log.MyLog;
import com.jdy.b2b.web.pojo.order.OrderTripDTO;
import com.jdy.b2b.web.pojo.schedule.*;
import com.jdy.b2b.web.pojo.user.UserResultDTO;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ExcelUtil;
import com.jdy.b2b.web.util.FreeMarkerHandler;
import com.jdy.b2b.web.util.ResultBean;
import com.jdy.b2b.web.util.exception.ParamUnExpectException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.CollectionUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import javax.validation.constraints.NotNull;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.text.ParseException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

import static com.jdy.b2b.web.util.HtmlUtil.getTextFromHtml;
import static org.apache.commons.lang.time.DateFormatUtils.format;
import static org.apache.commons.lang3.time.DateUtils.addDays;
import static org.springframework.util.CollectionUtils.isEmpty;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/8/1 11:23
 */
@Api(value = "Schedule", description = "班期")
@RestController
@RequestMapping("Schedule")
public class ScheduleController extends BaseController {

    @Value("${controllCenterUrl}Schedule")
    String MODULE_URL;

    @Autowired
    FreeMarkerHandler freeMarkerHandler;

    @ApiOperation("班期列表搜索")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "班期信息", response = ScheduleDTO.class)})
    @PostMapping("/list")
    public ResultBean selectScheduleList(@Validated @RequestBody ScheduleListQO dto) {
        return restTemplate.postForObject(MODULE_URL + "/list", dto, ResultBean.class);
    }

    @ApiOperation("查询指定班期，并返回相关票信息")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "班期信息", response = ScheduleWithTicketsDTO.class)})
    @GetMapping("/scheduleWithTickets/{id}/{flag}")
    public ResultBean selectScheduleWithTickets(@NotNull @PathVariable("id") Long id,@NotNull @PathVariable("flag") Integer flag) {
        ScheduleUpdateDTO dto = new ScheduleUpdateDTO();
        dto.setId(id);
        dto.setFlag(flag);
        UserResultDTO user = getUser();
        dto.setPuserId(user.getUserId());
        dto.setPcompanyId(user.getuCompanyId());
        return restTemplate.postForObject(MODULE_URL + "/scheduleWithTickets",dto, ResultBean.class);

    }

    @ApiOperation("班期批量插入")
    @PostMapping("/batchInsert")
    @MyLog(Operation = "save")
    public ResultBean batchInsertSchedule(@Validated @RequestBody ScheduleBatchInsertDTO dto) {
        if (dto.getCalendars().size() != new HashSet<>(dto.getCalendars()).size()) {
            throw new ParamUnExpectException("出发时间存在重复！");
        }
        dto.getCalendars().forEach(cal -> {
            cal = cal.trim();
            int i = cal.compareTo(LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE));
            if (i < 0) {
                throw new ParamUnExpectException("出发时间需等于或晚于今天！");
            }
        });
        // 校验车辆座位号是否超出范围，是否重复
//        if (!CollectionUtils.isEmpty(dto.getBusDTOS())) {
//            if (!dto.getsCarNum().equals(dto.getBusDTOS().size())) {
//                return new ResultBean("-1", "输入车辆数量和车辆列表不一致！");
//            }
//            dto.getBusDTOS().forEach(bus -> {
//                Set<Integer> set = new HashSet<>();
//                validateBus(bus.getbSeatsNum(), bus.getbSeatsLock(), set);
//                if (!CollectionUtils.isEmpty(bus.getBusHolds())) {
//                    bus.getBusHolds().forEach(hold -> validateBus(bus.getbSeatsNum(), hold.getbSeat(), set));
//                }
//            });
//        }
        return restTemplate.postForObject(MODULE_URL + "/batchInsert", dto, ResultBean.class);
    }

    private void validateBus(int seatNum, String seats, Set<Integer> set) {
        if (set == null) {
            set = new HashSet<>();
        }
        if (StringUtils.isBlank(seats)) {
            return;
        }
        int total = set.size();
        String[] seatsArr = StringUtils.split(seats, ',');
        Set<Integer> seatSet = Arrays.stream(seatsArr).mapToInt(Integer::valueOf).boxed().collect(Collectors.toSet());
        if (seatSet.stream().anyMatch(num -> num > seatNum)) {
            throw new ParamUnExpectException("锁定保留座位号不能比座位数大！");
        } else if (seatsArr.length != seatSet.size()) {
            throw new ParamUnExpectException("锁定保留座位号存在重复！");
        }
        set.addAll(seatSet);
        if (set.size() != (total + seatSet.size())) {
            throw new ParamUnExpectException("锁定保留座位号存在重复！");
        }

    }

    @ApiOperation("班期编辑")
    @PostMapping("/updateSchedule")
    @MyLog
    public ResultBean updateSchedule(@Validated @RequestBody ScheduleUpdateDTO dto) {
        return restTemplate.postForObject(MODULE_URL + "/updateSchedule", dto, ResultBean.class);
    }

    @ApiOperation("清除自定义票价")
    @GetMapping("/clearCustomTickets/{id}")
    @MyLog(Operation = "update", SuccessInfo = "清楚自定义票价成功", ErrorInfo = "清楚自定义票价失败")
    public ResultBean clearCustomTickets(@NotNull @PathVariable Long id) {
        return restTemplate.getForObject(MODULE_URL + "/clearCustomTickets/{id}", ResultBean.class, id);
    }

    @ApiOperation("班期状态更新")
    @PostMapping("/updateStatus")
    @MyLog(Operation = "update", SuccessInfo = "更新班期状态成功", ErrorInfo = "更新班期状态失败")
    public ResultBean updateStatus(@Validated @RequestBody ScheduleUpdateStatusDTO dto) {
        return restTemplate.postForObject(MODULE_URL + "/updateSchedule", dto, ResultBean.class);
    }

    @ApiOperation("查询班期的接送站点信息")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "接送站信息", response = ScheduleDeparturesDTO.class)})
    @PostMapping("/departuresWithStops")
    public ResultBean departuresWithStops(@Validated @RequestBody ScheduleDepartsSearchVO vo) {
        return restTemplate.postForObject(MODULE_URL + "/departuresWithStops", vo, ResultBean.class);
    }

    @ApiOperation("某个班期下的所有游客列表")
    @RequestMapping(value = "/queryTouristsListByScheduleId", method = RequestMethod.POST)
    @ResponseBody
    public ResultBean queryTouristsListByScheduleId(@RequestBody ScheduleTouristsQueryDTO scheduleTouristsQueryDTO) {
        return restTemplate.postForObject(MODULE_URL + "/queryTouristsListByScheduleId", scheduleTouristsQueryDTO, ResultBean.class);
    }

    @ApiOperation("某个班期下的所有游客列表导出")
    @RequestMapping(value = "/exportTouristsListByScheduleId", method = RequestMethod.GET)
    public void exportTouristsListByScheduleId(@RequestParam("scheduleId") Long scheduleId, HttpServletResponse response) throws ParseException {
        ScheduleTouristsQueryDTO dto = new ScheduleTouristsQueryDTO();
        dto.setScheduleId(scheduleId);
        dto.setExport(true);
        ResultBean<PageInfo<JSONObject>> bean = restTemplate.postForObject(MODULE_URL + "/queryTouristsListByScheduleId", dto, ResultBean.class);
        PageInfo<JSONObject> p = bean.getParsedEnitity(PageInfo.class);
        List<JSONObject> list = p.getList();
        List<String> titles = new ArrayList<>();
        List<List> bodyList = new ArrayList<>();

        titles.add("序号");
        titles.add("下单人员");
        titles.add("状态");
        titles.add("票价类目");
        titles.add("票种");
        titles.add("游客姓名");
        titles.add("游客电话");
        titles.add("去程");
        titles.add("返程");
        titles.add("证件类型");
        titles.add("证件号");
        titles.add("订单号");

        if(!isEmpty(list)) {
            int i = 1;
            for(JSONObject t : list) {
                List body = new ArrayList<>();
                body.add(i++);
                body.add(t.get("orderCreatorName"));
                body.add(Objects.equals(0, t.get("touristStatus"))?"正常":"异常");
                body.add(t.get("ticketPriceCategoryName"));
                body.add(Objects.equals(0, t.get("ticketType"))?"成人票":"儿童票");
                body.add(t.get("touristName"));
                body.add(t.get("touristPhone"));
                body.add(t.get("startPlace"));
                body.add(t.get("backPlace"));
                body.add(LicenseTypeEnum.getDescByValue(t.getIntValue("licenseType")));
                body.add(t.get("licenseNo"));
                body.add(t.get("orderNo"));
                bodyList.add(body);
            }
        }

        // 生成模板并下载
        try {
            ExcelUtil.export(URLEncoder.encode("团期游客导出", "UTF8") + format(new Date(), "yyyy-MM-dd"), "团期游客导出", titles, bodyList, response);
        } catch (Exception e) {
            logger.error("团期游客导出失败", e);
        }
    }


    @ApiOperation("卖家出团通知书导出")
    @RequestMapping(value = "/exportGroupNotice/{scheduleId}", method = RequestMethod.GET)
    public void exportGroupNotice(@PathVariable Long scheduleId, HttpServletResponse response) throws UnsupportedEncodingException {
        String url = MODULE_URL + "/getScheduleSetting/"+scheduleId;
        ScheduleSettingDto res = (ScheduleSettingDto) restTemplate.getForObject(url, ResultBean.class).getParsedEnitity(ScheduleSettingDto.class);
        if (Objects.isNull(res)) {
            return;
        }
        res.setpSpecial(getTextFromHtml(res.getpSpecial()));
        res.setpNotes(getTextFromHtml(res.getpNotes()));
        res.setpCostExclude(getTextFromHtml(res.getpCostExclude()));
        res.setpCostInclude(getTextFromHtml(res.getpCostInclude()));
        if (!isEmpty(res.getTrips())) {
            res.getTrips().forEach(t -> {
                t.settSimpleTrip(getTextFromHtml(t.gettSimpleTrip()));
                t.settDetailTrip(getTextFromHtml(t.gettDetailTrip()));
            });
            for (int i = 0; i < res.getTrips().size(); i++) {
                OrderTripDTO trip = res.getTrips().get(i);
                trip.setDayInfo(DateFormatUtils.format(addDays(res.getsCalendar(), i), "MM月dd日"));
            }
        }

        Map<String, Object> map = new HashMap<>();
        map.put("sch", res);
        freeMarkerHandler.createDoc(map, "卖家出团通知书模板.ftl", "出团通知书.docx", response);
    }

    @ApiOperation("保存出团设置")
    @RequestMapping("saveScheduleSetting")
    public ResultBean getScheduleMessage(@RequestBody @Validated ScheduleSettingDto scheduleSettingDto){
        List<ScheduleFlight> scheduleFlightList = scheduleSettingDto.getScheduleFlightList();
        if(CollectionUtils.isEmpty(scheduleFlightList)){
            return ResultBean.getFailResult("航班的出团和回团有且只有一条~");
        }
        Map<Byte, List<ScheduleFlight>> collect = scheduleFlightList.stream().collect(Collectors.groupingBy(scheduleFlight -> scheduleFlight.getLineType()));
        List<ScheduleFlight> scheduleFlights = collect.get((byte) 0);
        List<ScheduleFlight> scheduleFlights1 = collect.get((byte) 2);
        if(CollectionUtils.isEmpty(scheduleFlights) || CollectionUtils.isEmpty(scheduleFlights1) || !Objects.equals(scheduleFlights.size(),1) || !Objects.equals(scheduleFlights1.size(),1)){
            return ResultBean.getFailResult("航班的出团和回团有且只有一条~");
        }
        return restTemplate.postForEntity(MODULE_URL + "/updateScheduleSetting",scheduleSettingDto, ResultBean.class).getBody();
    }

}
