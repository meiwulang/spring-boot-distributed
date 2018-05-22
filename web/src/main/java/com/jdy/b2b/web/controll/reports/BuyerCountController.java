package com.jdy.b2b.web.controll.reports;

import com.alibaba.fastjson.JSON;
import com.jdy.b2b.web.pojo.reports.BuyerCountDO;
import com.jdy.b2b.web.pojo.reports.BuyerCountQueryVo;
import com.jdy.b2b.web.service.BuyerCountService;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.JSONUtil;
import com.jdy.b2b.web.util.ResultBean;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.poi.hssf.usermodel.HSSFCellStyle;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.xssf.streaming.SXSSFCell;
import org.apache.poi.xssf.streaming.SXSSFRow;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by yangcheng on 2017/9/12.
 */
@Api(value = "productRecommend", description = "分销商汇总报表")
@RestController
@RequestMapping("buyerCount")
public class BuyerCountController extends BaseController{
    @Autowired
    private BuyerCountService buyerCountService;

    @ApiOperation("列表查询")
    @PostMapping("list")
    public ResultBean<Map<String,Object>> queryBuyerCountPage(@RequestBody @Validated BuyerCountQueryVo vo){
        return buyerCountService.queryBuyerCountPage(vo);
    }

    @ApiOperation("导出报表,不分页")
    @GetMapping("export/{str}")
    //public ResultBean exportBuyerCount(@RequestBody @Validated BuyerCountQueryVo vo, HttpServletResponse response) throws IOException {
    public ResultBean exportBuyerCount(@PathVariable String str , HttpServletResponse response) throws Exception {
        BuyerCountQueryVo vo = new BuyerCountQueryVo();
        vo.setSearchStr(str);
        ResultBean<Map<String,Object>> resultBean = buyerCountService.queryBuyerCountPage(vo);
        Map<String,Object> map = resultBean.getParsedEnitity(Map.class);
        List result = (List<BuyerCountDO>)map.get("list");
        List<BuyerCountDO> list = JSONUtil.trans2List(JSON.toJSONString(result), BuyerCountDO.class);
        exportExcel(list,response);
        return ResultBean.getSuccessResult();
    }

    private void exportExcel(List<BuyerCountDO> list, HttpServletResponse response) throws IOException {
        //1.创建画布
        SXSSFWorkbook wb = new SXSSFWorkbook();
        SXSSFSheet sheet = wb.createSheet("分销商汇总1");
        //准备表头数据
        Map<Integer, String> map = new HashMap<Integer, String>();
        int i = 0;
        map.put(i++, "序号");
        map.put(i++, "供应商名称");
        map.put(i++, "省份");
        map.put(i++, "城市");
        map.put(i++, "区县");
        map.put(i++, "订单数");
        map.put(i++, "分销商数");
        map.put(i++, "产品数");
        map.put(i++, "总人数");
        map.put(i++, "成人数");
        map.put(i++, "儿童数");
        map.put(i++, "销售金额");
        map.put(i++, "结算金额");
        //打印表头
        SXSSFRow headRow = sheet.createRow((int) 0);
        CellStyle style = wb.createCellStyle();
        style.setFillForegroundColor(IndexedColors.TAN.getIndex());
        style.setFillPattern(CellStyle.SOLID_FOREGROUND);
        style.setAlignment(CellStyle.ALIGN_CENTER); // 创建一个居中格式
        for (int j = 0; j < 13; j++) {
            SXSSFCell cell = headRow.createCell(j);
            cell.setCellValue(map.get(j));
            cell.setCellStyle(style);
        }

        //设置内容样式
        CellStyle styleLeft = wb.createCellStyle();
        styleLeft.setAlignment(HSSFCellStyle.ALIGN_LEFT);// 水平方向的对齐方式
        Map<Integer, String> bodyMap = new HashMap<Integer, String>();
        if(list!=null && list.size()>0){
            for (int m = 0; m < list.size(); m++) {
                SXSSFRow bodyRow = sheet.createRow(m + 1);
                BuyerCountDO rowData = (BuyerCountDO) list.get(m);
                // 第四步，创建单元格，并设置值
                SXSSFCell cell0 = bodyRow.createCell(0);
                cell0.setCellValue(m + 1);
                cell0.setCellStyle(styleLeft);
                SXSSFCell cell1 = bodyRow.createCell(1);
                cell1.setCellValue(rowData.getcName()==null?"":rowData.getcName());
                cell1.setCellStyle(styleLeft);
                SXSSFCell cell2 = bodyRow.createCell(2);
                cell2.setCellValue(rowData.getProvince()==null?"":rowData.getProvince());
                cell2.setCellStyle(styleLeft);
                SXSSFCell cell3 = bodyRow.createCell(3);
                cell3.setCellValue(rowData.getCity()==null?"":rowData.getCity());
                cell3.setCellStyle(styleLeft);
                SXSSFCell cell4 = bodyRow.createCell(4);
                cell4.setCellValue(rowData.getArea()==null?"":rowData.getArea());
                cell4.setCellStyle(styleLeft);
                SXSSFCell cell5 = bodyRow.createCell(5);
                cell5.setCellValue(rowData.getOrderCounts()==null?0:rowData.getOrderCounts());
                cell5.setCellStyle(styleLeft);
                SXSSFCell cell6 = bodyRow.createCell(6);
                cell6.setCellValue(rowData.getSalerCounts()==null?0:rowData.getSalerCounts());
                cell6.setCellStyle(styleLeft);
                SXSSFCell cell7 = bodyRow.createCell(7);
                cell7.setCellValue(rowData.getProductCounts()==null?0:rowData.getProductCounts());
                cell7.setCellStyle(styleLeft);
                SXSSFCell cell8 = bodyRow.createCell(8);
                cell8.setCellValue(rowData.getPeopleNum()==null?0:rowData.getPeopleNum());
                cell8.setCellStyle(styleLeft);
                SXSSFCell cell9 = bodyRow.createCell(9);
                cell9.setCellValue(rowData.getAdultAmount()==null?0:rowData.getAdultAmount());
                cell9.setCellStyle(styleLeft);
                SXSSFCell cell10 = bodyRow.createCell(10);
                cell10.setCellValue(rowData.getChildAmount()==null?0:rowData.getChildAmount());
                cell10.setCellStyle(styleLeft);
                SXSSFCell cell11 = bodyRow.createCell(11);
                cell11.setCellValue("¥" + (rowData.getMarketAmount()==null?0:rowData.getMarketAmount()).toString());
                cell11.setCellStyle(styleLeft);
                SXSSFCell cell12 = bodyRow.createCell(12);
                cell12.setCellValue("¥" + (rowData.getTotalAmount()==null?0:rowData.getTotalAmount()).toString());
                cell12.setCellStyle(styleLeft);
            }
        }
        // 第六步，将文件存到指定位置
        OutputStream out = null;
        try {
            //否则，直接写到输出流中
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
            String dateStr = format.format(new Date());
            out = response.getOutputStream();
            String fileName = "分销商汇总报表" + dateStr;
            response.setContentType("application/vnd.ms-excel;charset=UTF-8");
            response.setCharacterEncoding("utf-8");
            response.setHeader("Content-Disposition", "attachment;filename="+new String(fileName.getBytes("gbk"), "iso8859-1")+".xlsx");
            wb.write(out);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            out.close();
        }
    }
}
