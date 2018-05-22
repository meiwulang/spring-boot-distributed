package com.jdy.b2b.web.service.frontService;

import com.jdy.b2b.web.pojo.front.ScheduleCalendarRequestParam;
import com.jdy.b2b.web.pojo.front.ScheduleListDetailRequestParam;
import com.jdy.b2b.web.pojo.front.ScheduleListRequstParam;
import com.jdy.b2b.web.util.ResultBean;
import com.sun.org.apache.regexp.internal.RE;

/**
 * Created by dugq on 2017/9/20.
 */
public interface ScheduleListService {
    ResultBean busList(ScheduleListRequstParam param);

    ResultBean selectScheduleCalenderList(ScheduleCalendarRequestParam param);

    ResultBean selectScheduleListOfProduct(ScheduleListDetailRequestParam param);
}
