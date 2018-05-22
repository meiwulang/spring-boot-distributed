package com.jdy.b2b.api.controller;

import com.github.pagehelper.PageHelper;
import com.jdy.b2b.api.common.BaseController;
import com.jdy.b2b.api.common.JSONUtil;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.reports.SalerCountDO;
import com.jdy.b2b.api.model.reports.SalerCountQueryDTO;
import com.jdy.b2b.api.service.SalerCountService;
import com.jdy.b2b.api.vo.SalerCountQueryVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by yangcheng on 2017/9/11.
 */
@RestController
@RequestMapping("salerCount")
public class SalerCountController extends BaseController {
    @Autowired
    private SalerCountService salerCountService;

    /**
     * 查列表
     */
    @PostMapping("list")
    public ResultBean<Map<String, Object>> salerCountReportsList(@RequestBody SalerCountQueryVo vo) {
        if (vo.getCurrPage() != null && vo.getPageSize() != null) {
            PageHelper.startPage(vo.getCurrPage(), vo.getPageSize());
        }
        SalerCountQueryDTO dto = JSONUtil.trans(vo, SalerCountQueryDTO.class);
        //查询列表信息
        List<SalerCountDO> list = salerCountService.salerCountReportsList(dto);
        //查询统计信息
        SalerCountDO countResult = salerCountService.queryAllSalerCount(dto);
        Map map = new HashMap<>();
        map.put("list", list);
        map.put("count", countResult);
        return ResultBean.getSuccessResult(map);

    }

}
