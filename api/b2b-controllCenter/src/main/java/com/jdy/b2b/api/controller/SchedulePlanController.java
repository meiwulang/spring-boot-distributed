package com.jdy.b2b.api.controller;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jdy.b2b.api.common.BaseController;
import com.jdy.b2b.api.common.JSONUtil;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.common.UserDataLimitEnum;
import com.jdy.b2b.api.model.scheduleplan.SchedulePlanDetailQueryDO;
import com.jdy.b2b.api.model.scheduleplan.SchedulePlanDetailQueryDTO;
import com.jdy.b2b.api.model.scheduleplan.SchedulePlanExportDO;
import com.jdy.b2b.api.model.scheduleplan.SchedulePlanManageDTO;
import com.jdy.b2b.api.model.scheduleplan.SchedulePlanManageResult;
import com.jdy.b2b.api.model.scheduleplan.SchedulePlanQueryDTO;
import com.jdy.b2b.api.model.scheduleplan.SchedulePlanResult;
import com.jdy.b2b.api.model.ticket.Ticket;
import com.jdy.b2b.api.service.SchedulePlanService;
import com.jdy.b2b.api.service.TicketService;
import com.jdy.b2b.api.vo.scheduleplan.SchedulePlanDetailQueryVO;
import com.jdy.b2b.api.vo.scheduleplan.SchedulePlanManageQueryVO;
import com.jdy.b2b.api.vo.scheduleplan.SchedulePlanQueryVO;

/**
 * Created by yangcheng on 2017/12/5.
 */
@RestController
@RequestMapping("SchedulePlan")
public class SchedulePlanController extends BaseController {
    @Autowired
    private SchedulePlanService schedulePlanService;

    @Autowired
    private TicketService ticketService;

    //出团计划表改造
    @PostMapping("newPlanList")
    public ResultBean newPlanList(@RequestBody SchedulePlanQueryVO vo){

        SchedulePlanQueryDTO trans = JSONUtil.trans(vo, SchedulePlanQueryDTO.class);
        //默认展示未来15天的数据--全部
        if (trans.getBeginDate()==null || trans.getEndDate()==null) {
            LocalDate today = LocalDate.now();
            trans.setBeginDate(today.plusDays(1));
            trans.setEndDate(today.plus(15, ChronoUnit.DAYS));
        }
        if(StringUtils.isBlank(trans.getSearchStr())){trans.setSearchStr(null);}
        return ResultBean.getSuccessResult(schedulePlanService.newPlanList(trans));
    }




    //查询某公司下 出团计划管理列表
    @PostMapping("manageList")
    public ResultBean querySchedulePlanManageList(@RequestBody SchedulePlanManageQueryVO vo){

        SchedulePlanManageDTO trans = JSONUtil.trans(vo, SchedulePlanManageDTO.class);
        //如果当前用户是系统级,使用前端传递的数据
        //如果不是系统级,使用当前用户公司id
        if(!UserDataLimitEnum.DATA_LIMIT_SYSTEM.getValue().equals(vo.getPuDataLimit())){
            trans.setCompanyId(vo.getPcompanyId());
        }
        //默认展示未来15天的数据--全部
        if (trans.getBeginDate()==null || trans.getEndDate()==null) {
            LocalDate today = LocalDate.now();
            trans.setBeginDate(today.plusDays(1));
            trans.setEndDate(today.plus(15, ChronoUnit.DAYS));
        }
        SchedulePlanManageResult result = schedulePlanService.querySchedulePlanManageList(trans);
        return ResultBean.getSuccessResult(result);
    }

    @PostMapping("queryBeforeExport")
    public ResultBean<List<SchedulePlanExportDO>> queryBeforeExport(@RequestBody SchedulePlanManageQueryVO vo){
        SchedulePlanManageDTO trans = JSONUtil.trans(vo, SchedulePlanManageDTO.class);
        //如果当前用户是系统级,使用前端传递的数据
        //如果不是系统级,使用当前用户公司id
        if(!UserDataLimitEnum.DATA_LIMIT_SYSTEM.getValue().equals(vo.getPuDataLimit())){
            trans.setCompanyId(vo.getPcompanyId());
        }
        return ResultBean.getSuccessResult(schedulePlanService.queryBeforeExport(trans));
    }


    @PostMapping("getProductCountBeforeExport")
    public ResultBean<Map<String,Integer>> getProductCountBeforeExport(@RequestBody SchedulePlanManageQueryVO vo){
        SchedulePlanManageDTO trans = JSONUtil.trans(vo, SchedulePlanManageDTO.class);
        //如果当前用户是系统级,使用前端传递的数据
        //如果不是系统级,使用当前用户公司id
        if(!UserDataLimitEnum.DATA_LIMIT_SYSTEM.getValue().equals(vo.getPuDataLimit())){
            trans.setCompanyId(vo.getPcompanyId());
        }
        return ResultBean.getSuccessResult(schedulePlanService.getProductCountBeforeExport(trans));
    }

    //出团计划表
    @PostMapping("planList")
    public ResultBean getPlanList(@RequestBody SchedulePlanManageQueryVO vo){
        SchedulePlanManageDTO trans = JSONUtil.trans(vo, SchedulePlanManageDTO.class);
        trans.setCompanyId(vo.getPcompanyId());
        //默认展示未来15天的数据--全部
        if (trans.getBeginDate()==null || trans.getEndDate()==null) {
            LocalDate today = LocalDate.now();
            trans.setBeginDate(today.plusDays(1));
            trans.setEndDate(today.plus(15, ChronoUnit.DAYS));
        }
        SchedulePlanResult result = schedulePlanService.getPlanList(trans);
        return ResultBean.getSuccessResult(result);
    }

    //明细列表
    @PostMapping("planDetailList")
    public ResultBean planDetailList(@RequestBody SchedulePlanDetailQueryVO vo){
        if (vo.getCurrPage() != null && vo.getPageSize() != null) {
            PageHelper.startPage(vo.getCurrPage(), vo.getPageSize());
        }
        SchedulePlanDetailQueryDTO trans = JSONUtil.trans(vo, SchedulePlanDetailQueryDTO.class);
        List<SchedulePlanDetailQueryDO> list = schedulePlanService.planDetailList(trans);
        return ResultBean.getSuccessResult(new PageInfo<>(list));

    }

    @GetMapping("ticketList/{productId}")
    public ResultBean getTicketList(@PathVariable(value = "productId") Long productId){
        List<Ticket> list = ticketService.getTicketList(productId);
        return ResultBean.getSuccessResult(list);
    }
}
