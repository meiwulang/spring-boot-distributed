package com.jdy.b2b.api.controller;

import com.github.pagehelper.PageInfo;
import com.jdy.b2b.api.common.BaseController;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.bill.BillTotalInfoDTO;
import com.jdy.b2b.api.model.bill.CreditBillDTO;
import com.jdy.b2b.api.model.bill.CreditBillDetailDTO;
import com.jdy.b2b.api.model.bill.CreditBillVo;
import com.jdy.b2b.api.service.CreditBillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by strict on 2017/9/5.
 */
@RestController
@RequestMapping("CreditBill")
public class CreditBillController extends BaseController {
    @Autowired
    private CreditBillService creditBillService;

    @PostMapping("list")
    public ResultBean queryCreditBillList(@RequestBody CreditBillVo creditBillVo){
        Map<String,Object> res = new HashMap<>();
        String regex ="\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\\d|3[0-1])";

        if (creditBillVo.getCreateTimeE() != null && creditBillVo.getCreateTimeE().matches(regex)){
            LocalDate endTime = LocalDate.parse(creditBillVo.getCreateTimeE(), DateTimeFormatter.ISO_LOCAL_DATE);
            endTime = endTime.plusDays(1);
            creditBillVo.setCreateTimeE(endTime.format(DateTimeFormatter.ISO_LOCAL_DATE));
        }

        BillTotalInfoDTO totalDetail = creditBillService.sumCreditBillTotal(creditBillVo);
        if(totalDetail != null){
            if (totalDetail.getTotalPayedAmount()==null){
                totalDetail.setProgress(0.0);
            }else{
                if (totalDetail.getTotalAmount()!=null){
                    totalDetail.setProgress((totalDetail.getTotalPayedAmount().doubleValue()/totalDetail.getTotalAmount().doubleValue())*100);
                }else{
                    totalDetail.setProgress(0.0);
                }
            }
        }
        res.put("totalDetail", new ArrayList<BillTotalInfoDTO>(){
            {
                add(totalDetail);
            }
        });
        PageInfo<CreditBillDTO> pageInfo = creditBillService.queryCreditBillList(creditBillVo);
        BillTotalInfoDTO billTotalInfoDTO = calcPageTotalInfo(pageInfo.getList());
        res.put("pageInfo",pageInfo);
        res.put("pageTotalInfo", new ArrayList<BillTotalInfoDTO>() {
            {
                add(billTotalInfoDTO);
            }
        });
        return ResultBean.getSuccessResult(res);
    }

    private BillTotalInfoDTO calcPageTotalInfo(List<CreditBillDTO> list) {
        if (list == null){
            return null;
        }
        BillTotalInfoDTO billTotalInfoDTO = new BillTotalInfoDTO();
        billTotalInfoDTO.setTotalPayedAmount(new BigDecimal(0));
        billTotalInfoDTO.setTotalAmount(new BigDecimal(0));
        billTotalInfoDTO.setTotalDeduction(new BigDecimal(0));
        for (CreditBillDTO p : list){
            billTotalInfoDTO.setTotalAmount(billTotalInfoDTO.getTotalAmount().add(p.getbAmount()==null?new BigDecimal(0):p.getbAmount()));
            billTotalInfoDTO.setTotalPayedAmount(billTotalInfoDTO.getTotalPayedAmount().add(p.getbPayedAmount()==null?new BigDecimal(0):p.getbPayedAmount()));
            billTotalInfoDTO.setTotalDeduction(billTotalInfoDTO.getTotalDeduction().add(p.getbDeduction()==null?new BigDecimal(0):p.getbDeduction()));
        }
        billTotalInfoDTO.setProgress(billTotalInfoDTO.getTotalPayedAmount().doubleValue()/billTotalInfoDTO.getTotalAmount().doubleValue()*100);
        return billTotalInfoDTO;
    }

    @GetMapping("/detail/{billNo}")
    public ResultBean queryCreditBillDetail(@PathVariable("billNo") String billNo){
        CreditBillDetailDTO creditBillDetailDTO  = creditBillService.queryCreditBillDetail(billNo);
        if (creditBillDetailDTO != null){
            return ResultBean.getSuccessResult(creditBillDetailDTO);
        }
        return ResultBean.getErrorResult();
    }

    @PostMapping("/writeoff")
    public ResultBean writeOff(Long billId,BigDecimal reduction, BigDecimal payMoney){
        return creditBillService.writeOffBill(billId,reduction,payMoney);
    }
}
