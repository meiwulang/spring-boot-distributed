package com.jdy.b2b.web.service.impl;

import com.jdy.b2b.web.pojo.reports.AgentDevelopChartQueryVo;
import com.jdy.b2b.web.service.AgentDevelopChartService;
import com.jdy.b2b.web.util.BaseService;
import com.jdy.b2b.web.util.ResultBean;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;

/**
 * Created by strict on 2017/12/7.
 */
@Service
public class AgentDevelopChartServiceImpl extends BaseService implements AgentDevelopChartService {


    private String agentCountUrl;

    @PostConstruct
    private void initUrl() {
        agentCountUrl =    reportsCenterUrl + "agentDistChart/agentChart";
    }

    @Override
    public ResultBean agentCount(AgentDevelopChartQueryVo vo) {
        LocalDate now = LocalDate.now();
        LocalDate startDate = LocalDate.parse(vo.getStartDate());
        switch (vo.getQueryType()){
            case 2://日
                if (now.isBefore(startDate)){
                    return new ResultBean("-1","不能查询今天之后的日期");
                }
                vo.setEndDate(startDate.plusDays(1).toString());
                break;
            case 1://月
                LocalDate lastDate = startDate.with(TemporalAdjusters.lastDayOfMonth()).plusDays(1);
                if (startDate.isAfter(now)){
                    return new ResultBean("-1","不能查询今天之后的日期");
                }else {
                    if (now.isAfter(lastDate)){
                        vo.setEndDate(lastDate.toString());
                    }else{
                        vo.setEndDate(now.plusDays(1).toString());
                    }
                }
                break;
            case 3://周
            case 4://季
            case 5://年

                LocalDate endDate = LocalDate.parse(vo.getEndDate());
                if (startDate.isAfter(now)){
                    return new ResultBean("-1","不能查询今天之后的日期");
                }else {
                    if (now.isAfter(endDate)){
                        vo.setEndDate(endDate.plusDays(1).toString());
                    }else{
                        vo.setEndDate(now.plusDays(1).toString());
                    }
                }
                break;
            default:
                return new ResultBean("-1","统计方式未传值");
        }
        return restTemplate.postForEntity(agentCountUrl, vo, ResultBean.class).getBody();
    }
}
