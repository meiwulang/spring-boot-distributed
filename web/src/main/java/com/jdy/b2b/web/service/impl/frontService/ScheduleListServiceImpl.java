package com.jdy.b2b.web.service.impl.frontService;

import com.jdy.b2b.web.pojo.front.ScheduleCalendarRequestParam;
import com.jdy.b2b.web.pojo.front.ScheduleListDetailRequestParam;
import com.jdy.b2b.web.pojo.front.ScheduleListRequstParam;
import com.jdy.b2b.web.service.frontService.ScheduleListService;
import com.jdy.b2b.web.util.BaseService;
import com.jdy.b2b.web.util.ResultBean;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;

/**
 * Created by dugq on 2017/9/20.
 */
@Service
public class ScheduleListServiceImpl extends BaseService implements ScheduleListService {
    private String busListUrl;
    private String scheduleCalenderUrl;
    private String scheduleListUrl;

    @PostConstruct
    public void init(){
        busListUrl = controllCenterUrl + "product/buslist";
        scheduleCalenderUrl = controllCenterUrl + "product/calendar";
        scheduleListUrl = controllCenterUrl+"product/scheduleList";
    }

    @Override
    public ResultBean busList(ScheduleListRequstParam param) {
        return restTemplate.postForObject(busListUrl,param,ResultBean.class);
    }

    @Override
    public ResultBean selectScheduleCalenderList(ScheduleCalendarRequestParam param) {
        return restTemplate.postForObject(scheduleCalenderUrl,param,ResultBean.class);
    }

    @Override
    public ResultBean selectScheduleListOfProduct(ScheduleListDetailRequestParam param) {
        return restTemplate.postForObject(scheduleListUrl,param,ResultBean.class);
    }
}
