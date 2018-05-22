package com.jdy.b2b.web.controll.bill;

import com.jdy.b2b.web.enums.BillStatusEnum;
import com.jdy.b2b.web.pojo.bill.ParamDto4ExportBillList;
import com.jdy.b2b.web.service.CreditBillService;
import com.jdy.b2b.web.service.OnlineBillService;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ResultBean;
import com.jdy.b2b.web.util.excel.ExcelOffice;
import com.jdy.b2b.web.util.excel.ExcelUtil;
import com.jdy.b2b.web.util.excel.SheetDO;
import io.swagger.annotations.Api;
import org.apache.commons.lang.time.DateFormatUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.util.*;

import static org.apache.commons.lang.time.DateFormatUtils.format;

/**
 * Created by dugq on 2017/9/28.
 */
@Api(value = "bill", description = "账单管理")
@Controller
@RequestMapping("bill")
public class BillExportController extends BaseController {
    @Autowired
    private CreditBillService creditBillService;
    @Autowired
    private OnlineBillService onlineBillService;

    @RequestMapping(value = "downloadOnlineBillList",method = RequestMethod.GET)
    public void downloadOnlineBillList(ParamDto4ExportBillList param, HttpServletResponse response){
        ResultBean result = onlineBillService.queryOnlineBillList4Export(param);
        ExcelOffice excel = ExcelOffice.getInstance();
        SheetDO sheetDO = new SheetDO();
        List<String> titles = buildTitles();
        List<List<Object>> bodyList = new ArrayList<>();
        ArrayList<Map> list = (ArrayList)result.getBody();
        list.forEach(map -> {
            LinkedList row = new LinkedList();
            bodyList.add(row);
            row.add(map.get("bBillNo"));
            row.add(map.get("companyNo"));
            row.add(map.get("bSalerCompanyName"));
            row.add(DateFormatUtils.format(new Date((long)map.get("createTime")),"yyyy-MM-dd"));
            row.add(map.get("bAmount"));
            row.add(map.get("bBrokerage"));
            row.add(map.get("realPay"));
            row.add(DateFormatUtils.format(new Date((long)map.get("createTime")),"yyyy-MM-dd"));
            row.add("暂无");
            row.add("暂无");
            row.add(BillStatusEnum.getDescByValue((Integer) map.get("bStatus")));
            row.add((int)map.get("bBillType") == 0? "自动账单":"手动账单");
            row.add((int)map.get("bType") == 0? "线上账单":"信用账单");
            row.add(map.get("bigArea"));
            row.add(map.get("bRemark") == null ? "" : map.get("bRemark"));
            row.add("");

        });
        sheetDO.setHeadlist(titles);
        sheetDO.setBodyList(bodyList);
        ExcelUtil.excel(excel, sheetDO, "账单明细" + format(new Date(), "yyyy-MM-dd"), response);
    }

    private List<String> buildTitles() {
        List<String> titles = new ArrayList<>();
        titles.add("账单号");
        titles.add("收款单位编号");
        titles.add("账单收款单位");
        titles.add("账单日");
        titles.add("账单金额");
        titles.add("提现手续费");
        titles.add("供应商实收");
        titles.add("账单生成时间");
        titles.add("请求提现时间");
        titles.add("请求受理时间");
        titles.add("账单状态");
        titles.add("生成方式");
        titles.add("账单类型");
        titles.add("大区");
        titles.add("备注");
        titles.add("特殊说明");
        return titles;
    }
}
