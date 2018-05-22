package com.jdy.b2b.web.controll.scheduleplan;

import com.alibaba.fastjson.JSON;
import com.jdy.b2b.web.enums.UserDataLimitEnum;
import com.jdy.b2b.web.pojo.order.OrderListDTO;
import com.jdy.b2b.web.pojo.reports.PayMethodResultDO;
import com.jdy.b2b.web.pojo.reports.SalerCountDO;
import com.jdy.b2b.web.pojo.reports.SalerCountQueryVo;
import com.jdy.b2b.web.pojo.scheduleplan.SchedulePlanDetailQueryVO;
import com.jdy.b2b.web.pojo.scheduleplan.SchedulePlanExportDO;
import com.jdy.b2b.web.pojo.scheduleplan.SchedulePlanManageQueryVO;
import com.jdy.b2b.web.pojo.scheduleplan.SchedulePlanQueryVO;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.JSONUtil;
import com.jdy.b2b.web.util.POIUtils;
import com.jdy.b2b.web.util.ResultBean;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.streaming.SXSSFCell;
import org.apache.poi.xssf.streaming.SXSSFRow;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.Month;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by yangcheng on 2017/12/5.
 */
@Api("SchedulePlan")
@RestController
@RequestMapping("SchedulePlan")
public class SchedulePlanController extends BaseController{

    @ApiOperation(value="出团计划表改造")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "出团计划表改造返回数据", response = OrderListDTO.class)})
    @PostMapping("newPlanList")
    public ResultBean newPlanList(@RequestBody SchedulePlanQueryVO vo){
        StringBuffer url = new StringBuffer(controllCenterUrl).append("SchedulePlan/newPlanList");
        return restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody();
    }


    @ApiOperation(value = "查询出团计划管理列表")
    @PostMapping("manageList")
    public ResultBean manageList(@RequestBody @Validated SchedulePlanManageQueryVO vo){
        if(UserDataLimitEnum.DATA_LIMIT_SYSTEM.getValue().equals(vo.getPuDataLimit())
                && vo.getCompanyId()==null){
            return ResultBean.getFailResult("companyId必填");
        }

        StringBuffer url = new StringBuffer(controllCenterUrl).append("SchedulePlan/manageList");
        ResultBean result = restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody();
        return result;
    }

    @PostMapping("planList")
    public ResultBean getPlanList(@RequestBody SchedulePlanManageQueryVO vo){
        StringBuffer url = new StringBuffer(controllCenterUrl).append("SchedulePlan/planList");
        return restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody();
    }

    @PostMapping("planDetailList")
    public ResultBean getPlanDetailList(@RequestBody SchedulePlanDetailQueryVO vo){
        StringBuffer url = new StringBuffer(controllCenterUrl).append("SchedulePlan/planDetailList");
        return restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody();
    }

    @GetMapping("ticketList/{productId}")
    public ResultBean getTicketList(@PathVariable(value = "productId") Long productId){
        StringBuffer url = new StringBuffer(controllCenterUrl).append("SchedulePlan/ticketList/").append(productId);
        return restTemplate.getForEntity(url.toString(), ResultBean.class).getBody();
    }

}


