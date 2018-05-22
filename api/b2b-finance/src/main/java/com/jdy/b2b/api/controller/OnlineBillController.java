package com.jdy.b2b.api.controller;

import com.github.pagehelper.PageInfo;
import com.jdy.b2b.api.common.BaseController;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.bill.*;
import com.jdy.b2b.api.service.OnlineBillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by strict on 2017/8/30.
 */
@RestController
@RequestMapping("OnlineBill")
public class OnlineBillController extends BaseController{
    @Autowired
    private OnlineBillService onlineBillService;


    @PostMapping("list")
    public ResultBean queryOnlineBillList(@RequestBody OnlineBillVo onlineBillVo){
        Map<String,Object> res = new HashMap<>();
        String regex ="\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\\d|3[0-1])";

        if (onlineBillVo.getCreateTimeE() != null && onlineBillVo.getCreateTimeE().matches(regex)){
            LocalDate endTime = LocalDate.parse(onlineBillVo.getCreateTimeE(), DateTimeFormatter.ISO_LOCAL_DATE);
            endTime = endTime.plusDays(1);
            onlineBillVo.setCreateTimeE(endTime.format(DateTimeFormatter.ISO_LOCAL_DATE));
        }
        res.put("totalDetail",onlineBillService.sumOnlineBillTotal(onlineBillVo));
        PageInfo<OnlineBillParentDTO> pageInfo = onlineBillService.queryOnlineBillList(onlineBillVo);
        BillTotalInfoDTO billTotalInfoDTO = calcPageTotalInfo(pageInfo.getList());
        res.put("pageInfo",pageInfo);
        res.put("pageTotalInfo",billTotalInfoDTO);
        return ResultBean.getSuccessResult(res);
    }

    /**
     * 计算在线账单 当页数据 的总合
     * @param list
     * @return
     */
    private BillTotalInfoDTO calcPageTotalInfo(List<OnlineBillParentDTO> list) {
        if (list == null){
            return null;
        }
        BillTotalInfoDTO billTotalInfoDTO = new BillTotalInfoDTO();
        billTotalInfoDTO.setTotalAmount(new BigDecimal(0));
        billTotalInfoDTO.setTotalBrokerage(new BigDecimal(0));
        billTotalInfoDTO.setTotalPayedAmount(new BigDecimal(0));
        for (OnlineBillParentDTO p : list){
            billTotalInfoDTO.getTotalAmount().add(p.getbAmount());
            billTotalInfoDTO.getTotalPayedAmount().add(p.getbPayedAmount());
            billTotalInfoDTO.getTotalBrokerage().add(p.getbBrokerage());
        }
        return billTotalInfoDTO;
    }

    /**
     *
     * @param
     * @return
     */
    @RequestMapping("/{id}")
    public ResultBean queryOnlineBillDetail(@PathVariable Long id){
        BillWithOrderPayDto billWithOrderPayDto = onlineBillService.queryOnlineBillDetail(id);
        return ResultBean.getSuccessResult(billWithOrderPayDto);
    }

    @PostMapping("queryOnlineBillList4Export")
    public ResultBean queryOnlineBillList4Export(@RequestBody ParamDto4ExportBillList param){
        List<BillDto4ExportBillList> billDto4ExportBillLists = onlineBillService.queryOnlineBillList4Export(param);
        return ResultBean.getSuccessResult(billDto4ExportBillLists);
    }
}
