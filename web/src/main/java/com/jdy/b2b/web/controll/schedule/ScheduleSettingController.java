package com.jdy.b2b.web.controll.schedule;

import com.jdy.b2b.web.pojo.orderTouristConfirm.ConfirmTouristParam;
import com.jdy.b2b.web.pojo.orderTouristConfirm.OrderTouristConfirmListParam;
import com.jdy.b2b.web.pojo.schedule.*;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ExcelUtil;
import com.jdy.b2b.web.util.ResultBean;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.hibernate.validator.constraints.NotEmpty;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import javax.annotation.PostConstruct;
import java.net.URLEncoder;
import java.util.*;

/**
 * Created by dugq on 2018/3/18.
 */
@RestController
@RequestMapping("Schedule")
public class ScheduleSettingController extends BaseController{
    @Autowired
    @Qualifier("customRestTemplate")
    protected RestTemplate restTemplate;
    @Value("${controllCenterUrl}Schedule")
    String MODULE_URL;
    private List<String> touristExcelTitle = new ArrayList<>();

    private List<String> touristExcelFieldList = new ArrayList<>();

    private final static String BLANK_STR = "";

    @ApiOperation("团期下所有客人列表")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "团期下所有客人列表", response = ScheduleGuestDO.class)})
    @PostMapping("guestList")
    public ResultBean guestList(@RequestBody ScheduleGuestQueryVO vo){
        return restTemplate.postForEntity(MODULE_URL + "/guestList",vo, ResultBean.class).getBody();
    }
    @ApiOperation("批量取消客人")
    @PostMapping("batchCancelTourist")
    public ResultBean batchCancelTourist(@RequestBody TouristCancelVO touristCancelVO){
        return restTemplate.postForObject(MODULE_URL + "/batchCancelTourist",touristCancelVO, ResultBean.class);
    }


    @ApiOperation("团期管理列表")
    @RequestMapping(value = "/queryScheduleManagerList", method = RequestMethod.POST)
    @ResponseBody
    public ResultBean queryScheduleManagerList(@RequestBody ScheduleManagerQueryDTO scheduleManagerQueryDTO) {
        return restTemplate.postForObject(MODULE_URL + "/queryScheduleManagerList", scheduleManagerQueryDTO, ResultBean.class);
    }

    @ApiOperation("出团")
    @RequestMapping("startSchedule/{scheduleSettingId}")
    public ResultBean startSchedule(@PathVariable Long scheduleSettingId){
        return restTemplate.postForObject(MODULE_URL + "/updateScheduleStartStatus",new ScheduleDepartureStatusDTO(scheduleSettingId,(byte) 1), ResultBean.class);
    }
    @ApiOperation("取消团期")
    @RequestMapping("cancelSchedule")
    public ResultBean cancelSchedule(@RequestBody @Validated ScheduleDepartureStatusDTO dto){
        dto.setDepartureStatus((byte) 4);
        dto.setCancelUser(getUser().getUserId());
        dto.setCancelTime(new Date());
        return restTemplate.postForObject(MODULE_URL + "/updateScheduleStartStatus",dto, ResultBean.class);
    }
    @ApiOperation("结团")
    @RequestMapping("finishSchedule/{scheduleSettingId}")
    public ResultBean finishSchedule(@PathVariable Long scheduleSettingId){
        return restTemplate.postForObject(MODULE_URL + "/updateScheduleStartStatus",new ScheduleDepartureStatusDTO(scheduleSettingId,(byte)2), ResultBean.class);
    }
    @ApiOperation("获取班期")
    @RequestMapping("getScheduleMessage/{scheduleSettingId}")
    public ResultBean getScheduleMessage(@PathVariable Long scheduleSettingId){
        return restTemplate.getForObject(MODULE_URL + "/getScheduleSetting/"+scheduleSettingId, ResultBean.class);
    }

    @ApiOperation("确认游客列表")
    @RequestMapping("/confirmTouristList")
    public ResultBean confirmTouristList(@RequestBody OrderTouristConfirmListParam dto) {
        return restTemplate.postForObject(MODULE_URL + "/confirmTouristList/",dto, ResultBean.class);
    }

    @ApiOperation("确认游客列表")
    @RequestMapping("/exportConfirmTouristList/{scheduleSettingId}")
    public void exportConfirmTouristList(@PathVariable Long scheduleSettingId) throws Exception {
        OrderTouristConfirmListParam dto = new OrderTouristConfirmListParam();
        dto.setScheduleSettingId(scheduleSettingId);
        dto.setExport(true);
        ResultBean  result = restTemplate.postForObject(MODULE_URL + "/confirmTouristList/",dto, ResultBean.class);

        List<List> content = new LinkedList();
        if(Objects.nonNull(result)){
                List<Map> rowsData = (List<Map>) result.getBody();
                int index = 1;
                for (Map rowDate : rowsData){
                    List<String> row = new ArrayList<>();
                    row.add(Integer.toString((index++)));
                    for(String filed : touristExcelFieldList){
                        if(Objects.equals(filed,"touristStatus")){
                            //0 未确认 1-退票，2-改签 ，3- 已经确认
                            switch ((int)rowDate.get(filed)){
                                case 0: row.add("未确认");break;
                                case 1:
                                case 2: row.add("确认不出行"); break;
                                case 3: row.add("确认出行"); break;
                                default: row.add("");
                            }
                        }else if(Objects.equals(filed,"ticketType")){
                            //票价类型 0:成人票 1:儿童票
                            int value = (int) rowDate.get(filed);
                            row.add(Objects.equals(value,0)?"成人票":"儿童票");
                        }
                        else if(Objects.equals(filed,"licenseType")){
                            //证件类型 0:身份证 1:护照 2:军官证 3:回乡证 4:台胞证 5:国际海员证 6:港澳通行证 7:赴台证 8:其他
                            switch ((int)rowDate.get(filed)){
                                case 0: row.add("身份证");break;
                                case 1: row.add("护照");break;
                                case 2: row.add("军官证"); break;
                                case 3: row.add("回乡证"); break;
                                case 4: row.add("台胞证"); break;
                                case 5: row.add("国际海员证"); break;
                                case 6: row.add("港澳通行证"); break;
                                case 7: row.add("赴台证"); break;
                                case 8: row.add("其他"); break;
                                default: row.add("");
                            }
                        }
                        else{
                            Optional<Object> rowOptional = Optional.ofNullable(rowDate.get(filed));
                            row.add(rowOptional.orElse(BLANK_STR).toString());
                        }
                    }
                    content.add(row);
                }
            }
        ExcelUtil.export(URLEncoder.encode("游客出行名单", "UTF8"),"游客出行名单", touristExcelTitle,content,getResponse());
    }

    @ApiOperation("确认游客列表")
    @RequestMapping("/confirmTourists")
    public ResultBean confirmTourists(@RequestBody @NotEmpty List<ConfirmTouristParam> param) throws Exception {
        return restTemplate.postForObject(MODULE_URL + "/confirmTourists/",param, ResultBean.class);
    }


    @ApiOperation("确认游客列表")
    @RequestMapping("/confirmScheduleSetting/{scheduleSettingId}")
    public ResultBean confirmScheduleSetting(@PathVariable Long scheduleSettingId) throws Exception {
        return restTemplate.getForObject(MODULE_URL + "/confirmScheduleSetting/"+scheduleSettingId, ResultBean.class);
    }

    @RequestMapping("/getConfirmTime/{scheduleSettingId}")
    public ResultBean getConfirmTime(@PathVariable Long scheduleSettingId) {
        return restTemplate.getForObject(MODULE_URL + "/getConfirmTime/"+scheduleSettingId, ResultBean.class);
    }


    @PostConstruct
    public void init(){
        touristExcelTitle.add("序号");
        touristExcelTitle.add("游客姓名");
        touristExcelTitle.add("状态");
        touristExcelTitle.add("票价类目");
        touristExcelTitle.add("票种");
        touristExcelTitle.add("下单人员");
        touristExcelTitle.add("游客电话");
        touristExcelTitle.add("证件类型");
        touristExcelTitle.add("证件号");
        touristExcelTitle.add("订单号");


        touristExcelFieldList.add("touristName");
        touristExcelFieldList.add("touristStatus");
        touristExcelFieldList.add("ticketPriceCategoryName");
        touristExcelFieldList.add("ticketType");
        touristExcelFieldList.add("orderCreatorName");
        touristExcelFieldList.add("touristPhone");
        touristExcelFieldList.add("licenseType");
        touristExcelFieldList.add("licenseNo");
        touristExcelFieldList.add("orderNo");
    }

}
