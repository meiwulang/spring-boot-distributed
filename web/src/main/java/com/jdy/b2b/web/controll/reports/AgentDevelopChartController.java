package com.jdy.b2b.web.controll.reports;

import com.alibaba.fastjson.JSON;
import com.jdy.b2b.web.pojo.reports.AgentDevelopChartQueryVo;
import com.jdy.b2b.web.service.AgentDevelopChartService;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ResultBean;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotNull;

/**
 * Created by yangcheng on 2017/11/10.
 */
@Api("agentDistChart")
@RestController
@RequestMapping("agentDistChart")
public class AgentDevelopChartController extends BaseController{
    @Autowired
    private AgentDevelopChartService agentDevelopChartService;

    @PostMapping("chartData")
    public ResultBean getTodayAgentCount(@RequestBody  AgentDevelopChartQueryVo vo){

        if (vo.getPuDataLimit() == null){
            return new ResultBean("-1","请登录之后再操作");
        }
        switch (vo.getPuDataLimit()){
            case 0:// 用户级别
                vo.setDepartId(vo.getPuDepartmentId());
                vo.setUserId(vo.getPuserId());
                break;
            case 1:// 部门级别
                vo.setDepartId(vo.getPuDepartmentId());
                break;
            case 2:// 单位级别
                vo.setCompanyId(vo.getPcompanyId());
            case 3:// 系统级别
                   // 不作处理
                break;
        }
        logger.info("代理人折线图 访问参数 ---> "+JSON.toJSONString(vo));
        return agentDevelopChartService.agentCount(vo);
    }

    //生成订单统计表数据
    @ApiOperation(value = "生成订单统计表中的数据,dateStr格式为yyyy-MM-dd")
    @GetMapping("syncOrderData/{dateStr}")
    public ResultBean syncOrderData(@PathVariable @NotNull(message = "日期字符串不能为空")
        @ApiParam(value = "dateStr格式为yyyy-MM-dd,必填", required = true)String dateStr){
        StringBuffer url = new StringBuffer(reportsCenterUrl).append("agentDistChart/syncOrderData/").append(dateStr);
        return restTemplate.getForEntity(url.toString(), ResultBean.class).getBody();
    }
}
