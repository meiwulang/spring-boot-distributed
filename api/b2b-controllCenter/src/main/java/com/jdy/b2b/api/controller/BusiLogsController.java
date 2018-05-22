package com.jdy.b2b.api.controller;

import com.github.pagehelper.PageInfo;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.BusiLogs;
import com.jdy.b2b.api.service.BusiLogsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

/**
 * Created by dugq on 2017/7/18.
 */
@RequestMapping("busiLog")
@Controller
public class BusiLogsController {
    @Autowired
    private BusiLogsService busiLogsService;

    @RequestMapping("add")
    @ResponseBody
    public ResultBean add(@RequestBody BusiLogs busiLogs){
        int i = busiLogsService.insertSelective(busiLogs);
        return i == 0 ? new ResultBean("-1","失败") : ResultBean.getSuccessResult();
    }

    @ResponseBody
    @RequestMapping("selectLogs")
    public ResultBean selectLogsByModuleAndPid(String module,Long pid , Integer pageIndex){
        List<BusiLogs> logs = busiLogsService.selectLogsByModuleAndPid(module,pid,pageIndex);
        PageInfo info = new PageInfo(logs);
        return ResultBean.getSuccessResult(info);
    }
}
