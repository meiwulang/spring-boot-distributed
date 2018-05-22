package com.jdy.b2b.web.controll.reports;

import com.jdy.b2b.web.pojo.reports.AgentActivityQueryVO;
import com.jdy.b2b.web.service.AgentActivityStatisticsService;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ResultBean;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 代理人活跃度统计控制类
 * @author chris
 * @since Jan 09.18
 */
@Api("agentActivity")
@RestController
@RequestMapping("agentActivityStatistics")
public class AgentActivityStatisticsController extends BaseController{
    @Autowired
    private AgentActivityStatisticsService agentActivityStatisticsService;

    @PostMapping("queryAgentActivityOfTotalCompany")
    public ResultBean queryAgentActivityOfTotalCompany(@RequestBody AgentActivityQueryVO vo){
        return this.agentActivityStatisticsService.selectAgentActivityOfTotalCompany(vo);
    }

    @PostMapping("queryAgentActivityOfDeptByCompany")
    public ResultBean queryAgentActivityOfDeptByCompany(@RequestBody AgentActivityQueryVO vo){
        return this.agentActivityStatisticsService.selectAgentActivityOfDeptByCompany(vo);
    }
    @PostMapping("queryAgentActivityOfSalesManagerByCompany")
    public ResultBean queryAgentActivityOfSalesManagerByCompany(@RequestBody AgentActivityQueryVO vo){
        return this.agentActivityStatisticsService.selectAgentActivityOfSalesManagerByCompany(vo);
    }
    @PostMapping("queryAgentActivityOfSalesManagerByDept")
    public ResultBean queryAgentActivityOfSalesManagerByDept(@RequestBody AgentActivityQueryVO vo){
        return this.agentActivityStatisticsService.selectAgentActivityOfSalesManagerByDept(vo);
    }
    @PostMapping("queryAgentActivityBySalesManager")
    public ResultBean queryAgentActivityBySalesManager(@RequestBody AgentActivityQueryVO vo){
        return this.agentActivityStatisticsService.selectAgentActivityBySalesManager(vo);
    }

}
