package com.jdy.b2b.web.controll.scheduleplan;

import com.alibaba.fastjson.JSON;
import com.jdy.b2b.web.enums.UserDataLimitEnum;
import com.jdy.b2b.web.enums.WeekEnum;
import com.jdy.b2b.web.pojo.scheduleplan.SchedulePlanExportDO;
import com.jdy.b2b.web.pojo.scheduleplan.SchedulePlanManageQueryVO;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.JSONUtil;
import com.jdy.b2b.web.util.POIUtils;
import com.jdy.b2b.web.util.ResultBean;
import com.jdy.b2b.web.util.excel.Columns;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.streaming.SXSSFCell;
import org.apache.poi.xssf.streaming.SXSSFRow;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import javax.validation.constraints.Pattern;
import java.io.IOException;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;

/**
 * Created by YangCheng on 2017/7/10.
 */
@Api("SchedulePlan")
@RestController
@RequestMapping("SchedulePlan")
public class SchedulePlanExportController extends BaseController{

    @ApiOperation(value = "出团计划报表导出")
    @GetMapping("export")
    public ResultBean exportSchedulePlanExcel(
            @RequestParam(value = "beginDate",required = false) String beginDate,
            @RequestParam(value = "endDate",required = false) String endDate,
            @RequestParam(value = "flag",required = false) Integer flag,
            @RequestParam(value = "companyId",required = false) Long companyId,
            HttpServletResponse response) throws Exception {

        if(UserDataLimitEnum.DATA_LIMIT_SYSTEM.getValue().equals(getUser().getuDataLimit())
                && companyId==null){
            return ResultBean.getFailResult("companyId必填");
        }
        SchedulePlanManageQueryVO vo = new SchedulePlanManageQueryVO();
        vo.setPcompanyId(getUser().getuCompanyId());
        vo.setPuDataLimit(getUser().getuDataLimit());
        vo.setCompanyId(companyId);
        if(beginDate!=null && !beginDate.isEmpty()){
            vo.setBeginDate(LocalDate.parse(beginDate));
        }
        if (beginDate!=null && !beginDate.isEmpty()) {
            vo.setEndDate(LocalDate.parse(endDate));
        }
        vo.setFlag(flag);
        //获取数据
        List<SchedulePlanExportDO> dataList = getData(vo);
        //获取每个产品在dataList中的记录数
        Map<String,Integer> productCountMap = getProductCountMap(vo);
        //导出报表-- 预定和已售
        if (vo.getFlag()==null) {
            exportExcelAll(vo,dataList,productCountMap,response);
        }else if(vo.getFlag().equals(Integer.valueOf(0))){
            exportExcelReserve(vo,dataList,productCountMap,response);
        }else if(vo.getFlag().equals(Integer.valueOf(1))){
            exportExcelPayed(vo,dataList,productCountMap,response);
        }
        return ResultBean.getSuccessResult();
    }



    private void exportExcelReserve(SchedulePlanManageQueryVO vo, List<SchedulePlanExportDO> dataList, Map<String, Integer> productCountMap, HttpServletResponse response) throws IOException {
//获取开始结束时间
        LocalDate beginDate = vo.getBeginDate();
        LocalDate endDate = vo.getEndDate();
        //创建画布
        SXSSFWorkbook wb = new SXSSFWorkbook();
        //创建sheet
        SXSSFSheet sheet = wb.createSheet("尚品旅游出团计划表");
        //创建表头样式
        CellStyle style = POIUtils.initSXSSColumnHeadStyle(wb);
        style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setFillPattern(CellStyle.SOLID_FOREGROUND);
        //计算日期跨度
        long until = beginDate.until(endDate, ChronoUnit.DAYS);

        //设置标题
        
        SXSSFRow headRow = sheet.createRow((int) 0);
        Cell headCell = headRow.createCell(0);
        String titleBeginDateStr = beginDate.format(DateTimeFormatter.ofPattern("yyyy.MM.dd"));
        String titleEndDateStr = endDate.format(DateTimeFormatter.ofPattern("yyyy.MM.dd"));
        String titleName = "尚品旅游" + titleBeginDateStr+"--"+titleEndDateStr+"出团计划表";
        headCell.setCellValue(titleName);
        CellStyle headStyle = wb.createCellStyle();
        headStyle.setAlignment(CellStyle.ALIGN_CENTER);
        Font font = wb.createFont();
        font.setFontName("黑体");
        font.setFontHeightInPoints((short) 20);//设置字体大小
        headStyle.setFont(font);
        headCell.setCellStyle(headStyle);
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, (int)(2*until+5)));

        //设置统计日期
        SXSSFRow statusRow = sheet.createRow((int) 1);
        Cell statusCell = statusRow.createCell((int)(2*until+2));
        statusCell.setCellValue("统计日期: "+LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd")));
        sheet.addMergedRegion(new CellRangeAddress(1, 1, (int)(2*until+2), (int)(2*until+4)));

        //1.组织第1行表头数据
        Map<Integer, String> firstMap = new HashMap<Integer, String>();
        firstMap.put(0, "时间");
        //循环设置第一行日期
        LocalDate firstDate = beginDate;
        int h = 2;
        for(h=2;h<2*until+4;h=h+2,firstDate=firstDate.plus(1,ChronoUnit.DAYS)){
            firstMap.put(h,firstDate.format(DateTimeFormatter.ofPattern("MM.dd")));
        }
        //设置第一行最后两个单元格
        firstMap.put(h,"预约总计");
        //firstMap.put(h+1,"发团总计(已订购合计)");
        //添加格式,并将数据放入单元格
        SXSSFRow firstRow = sheet.createRow((int) 2);
        for(int f:firstMap.keySet()){
            Cell cell = firstRow.createCell(f);
            cell.setCellValue(firstMap.get(f));
            cell.setCellStyle(style);
        }

        //2.组织第二行表头数据
        Map<Integer, String> secondMap = new HashMap<Integer, String>();
        secondMap.put(0,"产品名称");
        //循环设置第二行日期
        LocalDate secondDate = beginDate;
        int i = 2;
        for(i=2;i<2*until+4;i=i+2,secondDate=secondDate.plus(1,ChronoUnit.DAYS)){
            secondMap.put(i, WeekEnum.getDescByValue(secondDate.getDayOfWeek().toString()));

        }
        //设置第二行表头样式,并且填充值
        SXSSFRow secondRow = sheet.createRow((int) 3);
        for (int j:secondMap.keySet()) {
            Cell cell = secondRow.createCell(j);
            cell.setCellValue(secondMap.get(j));
            cell.setCellStyle(style);
        }

        //3.组织第三行表头数据
        Map<Integer, String> thirdMap = new HashMap<Integer, String>();
        //循环设置第一行日期
        LocalDate thirdDate = beginDate;
        int m = 2;
        for(m=2;m<2*until+4;m=m+2,thirdDate=thirdDate.plus(1,ChronoUnit.DAYS)){
            thirdMap.put(m,"已预约");
            //thirdMap.put(m+1,"已订购");
        }
        SXSSFRow thirdRow = sheet.createRow((int) 4);
        for (int j:thirdMap.keySet()) {
            Cell cell = thirdRow.createCell(j);
            cell.setCellValue(thirdMap.get(j));
            cell.setCellStyle(style);
        }

        //4.设置单元格合并
        sheet.addMergedRegion(new CellRangeAddress(2, 2, 0, 1));
        POIUtils.setSXSSRegionStyle(sheet,new CellRangeAddress(2, 2, 0, 1),style);
        sheet.addMergedRegion(new CellRangeAddress(3, 4, 0, 1));
        POIUtils.setSXSSRegionStyle(sheet,new CellRangeAddress(3, 4, 0, 1),style);
        int t = setMergerHead(beginDate, sheet, style, until);
        sheet.addMergedRegion(new CellRangeAddress(2, 4, t, t));
        POIUtils.setSXSSRegionStyle(sheet,new CellRangeAddress(2, 4, t, t),style);

        //5,将数据放入excel
        putDataReserve(style,dataList,productCountMap,response,wb,sheet,beginDate,endDate);

    }

    private void exportExcelPayed(SchedulePlanManageQueryVO vo, List<SchedulePlanExportDO> dataList, Map<String, Integer> productCountMap, HttpServletResponse response) throws IOException {
        //获取开始结束时间
        LocalDate beginDate = vo.getBeginDate();
        LocalDate endDate = vo.getEndDate();
        //创建画布
        SXSSFWorkbook wb = new SXSSFWorkbook();
        //创建sheet
        SXSSFSheet sheet = wb.createSheet("尚品旅游出团计划表");
        //创建表头样式
        CellStyle style = POIUtils.initSXSSColumnHeadStyle(wb);
        style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setFillPattern(CellStyle.SOLID_FOREGROUND);
        //计算日期跨度
        long until = beginDate.until(endDate, ChronoUnit.DAYS);

        //设置标题
        SXSSFRow headRow = sheet.createRow((int) 0);
        Cell headCell = headRow.createCell(0);
        String titleBeginDateStr = beginDate.format(DateTimeFormatter.ofPattern("yyyy.MM.dd"));
        String titleEndDateStr = endDate.format(DateTimeFormatter.ofPattern("yyyy.MM.dd"));
        String titleName = "尚品旅游" + titleBeginDateStr+"--"+titleEndDateStr+"出团计划表";

        headCell.setCellValue(titleName);
        CellStyle headStyle = wb.createCellStyle();
        headStyle.setAlignment(CellStyle.ALIGN_CENTER);
        Font font = wb.createFont();
        font.setFontName("黑体");
        font.setFontHeightInPoints((short) 20);//设置字体大小
        headStyle.setFont(font);
        headCell.setCellStyle(headStyle);
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, (int)(2*until+5)));

        //设置统计日期
        SXSSFRow statusRow = sheet.createRow((int) 1);
        Cell statusCell = statusRow.createCell((int)(2*until+2));
        statusCell.setCellValue("统计日期: "+LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd")));
        sheet.addMergedRegion(new CellRangeAddress(1, 1, (int)(2*until+2), (int)(2*until+4)));

        //1.组织第1行表头数据
        Map<Integer, String> firstMap = new HashMap<Integer, String>();
        firstMap.put(0, "时间");
        //循环设置第一行日期
        LocalDate firstDate = beginDate;
        int h = 2;
        for(h=2;h<2*until+4;h=h+2,firstDate=firstDate.plus(1,ChronoUnit.DAYS)){
            firstMap.put(h,firstDate.format(DateTimeFormatter.ofPattern("MM.dd")));
        }
        //设置第一行最后两个单元格
        firstMap.put(h,"订购总计");
        //firstMap.put(h+1,"发团总计(订购人数合计)");
        //添加格式,并将数据放入单元格
        SXSSFRow firstRow = sheet.createRow((int) 2);
        for(int f:firstMap.keySet()){
            Cell cell = firstRow.createCell(f);
            cell.setCellValue(firstMap.get(f));
            cell.setCellStyle(style);
        }

        //2.组织第二行表头数据
        Map<Integer, String> secondMap = new HashMap<Integer, String>();
        secondMap.put(0,"产品名称");
        //循环设置第二行日期
        LocalDate secondDate = beginDate;
        int i = 2;
        for(i=2;i<2*until+4;i=i+2,secondDate=secondDate.plus(1,ChronoUnit.DAYS)){
            secondMap.put(i, WeekEnum.getDescByValue(secondDate.getDayOfWeek().toString()));

        }
        //设置第二行表头样式,并且填充值
        SXSSFRow secondRow = sheet.createRow((int) 3);
        for (int j:secondMap.keySet()) {
            Cell cell = secondRow.createCell(j);
            cell.setCellValue(secondMap.get(j));
            cell.setCellStyle(style);
        }

        //3.组织第三行表头数据
        Map<Integer, String> thirdMap = new HashMap<Integer, String>();
        //循环设置第一行日期
        LocalDate thirdDate = beginDate;
        int m = 2;
        for(m=2;m<2*until+4;m=m+2,thirdDate=thirdDate.plus(1,ChronoUnit.DAYS)){
            thirdMap.put(m,"已订购");
            //thirdMap.put(m+1,"已订购");
        }
        SXSSFRow thirdRow = sheet.createRow((int) 4);
        for (int j:thirdMap.keySet()) {
            Cell cell = thirdRow.createCell(j);
            cell.setCellValue(thirdMap.get(j));
            cell.setCellStyle(style);
        }

        //4.设置单元格合并
        sheet.addMergedRegion(new CellRangeAddress(2, 2, 0, 1));
        POIUtils.setSXSSRegionStyle(sheet,new CellRangeAddress(2, 2, 0, 1),style);
        sheet.addMergedRegion(new CellRangeAddress(3, 4, 0, 1));
        POIUtils.setSXSSRegionStyle(sheet,new CellRangeAddress(3, 4, 0, 1),style);
        int t = setMergerHead(beginDate, sheet, style, until);
        sheet.addMergedRegion(new CellRangeAddress(2, 4, t, t));
        POIUtils.setSXSSRegionStyle(sheet,new CellRangeAddress(2, 4, t, t),style);
        //5,将数据放入excel
        putDataPayed(style,dataList,productCountMap,response,wb,sheet,beginDate,endDate);
    }

    private int setMergerHead(LocalDate beginDate, SXSSFSheet sheet, CellStyle style, long until) {
        int t = 2;
        LocalDate mergeDate = beginDate;
        for(t=2;t<2*until+4;t=t+2,mergeDate=mergeDate.plus(1, ChronoUnit.DAYS)){
            sheet.addMergedRegion(new CellRangeAddress(2, 2, t, t+1));
            POIUtils.setSXSSRegionStyle(sheet,new CellRangeAddress(2, 2, t, t+1),style);
            sheet.addMergedRegion(new CellRangeAddress(3, 3, t, t+1));
            POIUtils.setSXSSRegionStyle(sheet,new CellRangeAddress(3, 3, t, t+1),style);
            sheet.addMergedRegion(new CellRangeAddress(4, 4, t, t+1));
            POIUtils.setSXSSRegionStyle(sheet,new CellRangeAddress(4, 4, t, t+1),style);
        }
        return t;
    }

    //构造Excel
    private void exportExcelAll(SchedulePlanManageQueryVO vo,List<SchedulePlanExportDO> dataList,Map<String,Integer> productCountMap, HttpServletResponse response) throws IOException {
        //获取开始结束时间
        LocalDate beginDate = vo.getBeginDate();
        LocalDate endDate = vo.getEndDate();
        //创建画布
        SXSSFWorkbook wb = new SXSSFWorkbook();
        //创建sheet
        SXSSFSheet sheet = wb.createSheet("尚品旅游出团计划表");
        //创建表头样式
        CellStyle style = POIUtils.initSXSSColumnHeadStyle(wb);
        style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setFillPattern(CellStyle.SOLID_FOREGROUND);
        //计算日期跨度
        long until = beginDate.until(endDate, ChronoUnit.DAYS);

        //设置标题
        SXSSFRow headRow = sheet.createRow((int) 0);
        
        SXSSFCell headCell = headRow.createCell(0);
        
        String titleBeginDateStr = beginDate.format(DateTimeFormatter.ofPattern("yyyy.MM.dd"));
        String titleEndDateStr = endDate.format(DateTimeFormatter.ofPattern("yyyy.MM.dd"));
        String titleName = "尚品旅游" + titleBeginDateStr+"--"+titleEndDateStr+"出团计划表";
        headCell.setCellValue(titleName);
        CellStyle headStyle = wb.createCellStyle();
        headStyle.setAlignment(CellStyle.ALIGN_CENTER);
        Font font = wb.createFont();
        font.setFontName("黑体");
        font.setFontHeightInPoints((short) 20);//设置字体大小
        headStyle.setFont(font);
        headCell.setCellStyle(headStyle);
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, (int)(2*until+5)));

        //设置统计日期
        SXSSFRow statusRow = sheet.createRow((int) 1);
        Cell statusCell = statusRow.createCell((int)(2*until+3));
        statusCell.setCellValue("统计日期: "+LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd")));
        sheet.addMergedRegion(new CellRangeAddress(1, 1, (int)(2*until+3), (int)(2*until+5)));

        //1.组织第1行表头数据
        Map<Integer, String> firstMap = new HashMap<Integer, String>();
        firstMap.put(0, "时间");
        //循环设置第一行日期
        LocalDate firstDate = beginDate;
        int h = 2;
        for(h=2;h<2*until+4;h=h+2,firstDate=firstDate.plus(1,ChronoUnit.DAYS)){
            firstMap.put(h,firstDate.format(DateTimeFormatter.ofPattern("MM.dd")));
        }
        //设置第一行最后两个单元格
        firstMap.put(h,"预约总计");
        firstMap.put(h+1,"订购总计");
        //添加格式,并将数据放入单元格
        SXSSFRow firstRow = sheet.createRow((int) 2);
        for(int f:firstMap.keySet()){
            Cell cell = firstRow.createCell(f);
            cell.setCellValue(firstMap.get(f));
            cell.setCellStyle(style);
        }

        //2.组织第二行表头数据
        Map<Integer, String> secondMap = new HashMap<Integer, String>();
        secondMap.put(0,"产品名称");
        //循环设置第二行日期
        LocalDate secondDate = beginDate;
        int i = 2;
        for(i=2;i<2*until+4;i=i+2,secondDate=secondDate.plus(1,ChronoUnit.DAYS)){
            secondMap.put(i, WeekEnum.getDescByValue(secondDate.getDayOfWeek().toString()));
        }
        //设置第二行表头样式,并且填充值
        SXSSFRow secondRow = sheet.createRow((int) 3);
        for (int j:secondMap.keySet()) {
            Cell cell = secondRow.createCell(j);
            cell.setCellValue(secondMap.get(j));
            cell.setCellStyle(style);
        }

        //3.组织第三行表头数据
        Map<Integer, String> thirdMap = new HashMap<Integer, String>();
        //循环设置第一行日期
        LocalDate thirdDate = beginDate;
        int m = 2;
        for(m=2;m<2*until+4;m=m+2,thirdDate=thirdDate.plus(1,ChronoUnit.DAYS)){
            thirdMap.put(m,"已预约");
            thirdMap.put(m+1,"已订购");
        }
        SXSSFRow thirdRow = sheet.createRow((int) 4);
        for (int j:thirdMap.keySet()) {
            Cell cell = thirdRow.createCell(j);
            cell.setCellValue(thirdMap.get(j));
            cell.setCellStyle(style);
        }

        //4.设置单元格合并
        sheet.addMergedRegion(new CellRangeAddress(2, 2, 0, 1));
        POIUtils.setSXSSRegionStyle(sheet,new CellRangeAddress(2, 2, 0, 1),style);
        sheet.addMergedRegion(new CellRangeAddress(3, 4, 0, 1));
        POIUtils.setSXSSRegionStyle(sheet,new CellRangeAddress(3, 4, 0, 1),style);
        int t = 2;
        LocalDate mergeDate = beginDate;
        for(t=2;t<2*until+4;t=t+2,mergeDate=mergeDate.plus(1,ChronoUnit.DAYS)){
            sheet.addMergedRegion(new CellRangeAddress(2, 2, t, t+1));
            POIUtils.setSXSSRegionStyle(sheet,new CellRangeAddress(2, 2, t, t+1),style);
            sheet.addMergedRegion(new CellRangeAddress(3, 3, t, t+1));
            POIUtils.setSXSSRegionStyle(sheet,new CellRangeAddress(3, 3, t, t+1),style);
        }
        sheet.addMergedRegion(new CellRangeAddress(2, 4, t, t));
        POIUtils.setSXSSRegionStyle(sheet,new CellRangeAddress(2, 4, t, t),style);
        sheet.addMergedRegion(new CellRangeAddress(2, 4, t+1, t+1));
        POIUtils.setSXSSRegionStyle(sheet,new CellRangeAddress(2, 4, t+1, t+1),style);

        //5,将数据放入excel
        putDataAll(style,dataList,productCountMap,response,wb,sheet,beginDate,endDate);
    }

    private void putDataReserve(CellStyle borderStyle,List<SchedulePlanExportDO> dataList,Map<String,Integer> productCountMap, HttpServletResponse response, SXSSFWorkbook wb,SXSSFSheet sheet, LocalDate beginDate, LocalDate endDate) throws IOException {
        //计算时间跨度
        long until = beginDate.until(endDate, ChronoUnit.DAYS);
        CellStyle singleStyle = wb.createCellStyle();

        //定义初始行数
        int firstDataRow = 5;
        int tRowNum = 5;
        int rowNum = firstDataRow;
        Map<String,SXSSFRow> rowMap = new HashMap<>();
        //计算当前行数是否已经达到该产品在dataList中的最后一条
        Map<String,Integer> myProductCountMap = new HashMap<>();
        Map<Long,Boolean> createdHeadCellsMap = new HashMap<>();
        Map<Long,HashSet<Long>> productTicketsMap = new HashMap<>();

        //计算每个产品的票数
        computeProductTicketCount(dataList, productTicketsMap);

        for(SchedulePlanExportDO data:dataList){
            //遍历dataList,累加myMap
            if(myProductCountMap.get(data.getProductId().toString())==null){
                myProductCountMap.put(data.getProductId().toString(),1);
            }else{
                myProductCountMap.put(data.getProductId().toString(),myProductCountMap.get(data.getProductId().toString())+1);
            }

            //判断两个map的值是否达到一致
            Boolean isCountRow = false;
            Integer myValue = myProductCountMap.get(data.getProductId().toString());
            Integer pValue = productCountMap.get(data.getProductId().toString());
            if(pValue!=null){
                isCountRow = myValue.equals(pValue);
            }

            //1.如果是同一个产品的同一张票,只创建一行row
            SXSSFRow row = null;
            if(rowNum==32){
                System.out.println(rowNum==32);
            }
            if (rowMap.get(""+data.getProductId()+data.gettId()) == null) {
                //如果该票id从rowmap中没有取到值,则创建一条row,并将rownum+1
                row = sheet.createRow(rowNum);
                rowMap.put(""+data.getProductId()+data.gettId(), row);
                rowNum++;
            } else {
                //如果取到了,就使用该row
                row = rowMap.get(""+data.getProductId()+data.gettId());
            }

            //如果map中未取到该产品的value,说明未创建过该产品的行,则设置行头
            setProductName(singleStyle,wb, sheet, createdHeadCellsMap, productTicketsMap, data, row);

            //设置数据行的票价名称
            Cell secondCell = row.createCell(1);
            POIUtils.setSXSSBorderCell(singleStyle,wb, secondCell);
            secondCell.setCellValue(data.gettName());

            LocalDate defaultDate = beginDate;
            int c = 2;
            for (c = 2; c <= 2 * until + 4; c = c + 2, defaultDate = defaultDate.plus(1, ChronoUnit.DAYS)) {
                //设置预约单元格边框
                if (row.getCell(c) == null) {
                    Cell cell = row.createCell(c);
                    POIUtils.setSXSSBorderCell(singleStyle,wb, cell);
                    cell.setCellValue(0);
                }
            }

            //如果是预约的数据
            if (data.getoStatus().equals(Integer.valueOf(1))) {
                LocalDate firstDate = beginDate;
                int i = 2;
                for (i = 2; i < 2 * until + 4; i = i + 2, firstDate = firstDate.plus(1, ChronoUnit.DAYS)) {
                    Cell cell = null;
                    //Cell rightCell = null;
                    //设置预约单元格边框
                    if (row.getCell(i) == null) {
                        cell = row.createCell(i);
                        POIUtils.setSXSSBorderCell(singleStyle,wb, cell);
                        cell.setCellValue(0);
                    } else {
                        cell = row.getCell(i);
                    }
                    //将值塞入单元格
                    if (data.getsCalendar().compareTo(firstDate) == 0) {
                        cell.setCellValue(data.getTicketCounts());
                    }
                }
                Cell reserveCountCell = row.createCell(i);
                //设置单元格公式--预定和
                String reserveFormula = getRowReserveSum(reserveCountCell);
                reserveCountCell.setCellFormula(reserveFormula);
                POIUtils.setSXSSBorderCell(singleStyle,wb,reserveCountCell);
            }

            //2.设置总计行
            if(isCountRow){
                LocalDate firstDate = beginDate;
                //如果该商品的行数已经打印完,就打印该产品的统计行
                //设置产品名称和"总计"
                row = sheet.createRow(rowNum);
                Cell secondCountCell = row.createCell(1);
                POIUtils.setSXSSBorderBlackCell(wb, secondCountCell);
                secondCountCell.setCellValue("总计");
                //设置总计的统计数据
                int i = 2;
                for (i = 2; i < 2 * until + 4; i = i + 2, firstDate = firstDate.plus(1, ChronoUnit.DAYS)) {
                    //设置边框
                    Cell cell = null;
                    Cell leftCell = null;
                    if (row.getCell(i) == null) {
                        leftCell = row.createCell(i);
                        CellStyle style = POIUtils.initSXSSColumnHeadStyle(wb);
                        leftCell.setCellStyle(style);
                    } else {
                        leftCell = row.getCell(i);
                        CellStyle style = POIUtils.initSXSSColumnHeadStyle(wb);
                        leftCell.setCellStyle(style);
                    }
                    //设置预定总计和已售总计
                    String productPayedFormula = getProductCountFormula(leftCell,tRowNum);
                    if (productPayedFormula!=null) {
                        leftCell.setCellFormula(productPayedFormula);
                    }
                }
                tRowNum = rowNum+1;
                //设置行尾统计
                Cell reserveCountCell = row.createCell(i);
                //设置单元格公式--预定和
                String reserveFormula = getRowReserveSum(reserveCountCell);
                reserveCountCell.setCellFormula(reserveFormula);
                POIUtils.setSXSSBorderCell(singleStyle,wb,reserveCountCell);
                rowNum++;

                //设置产品统计行的值
                int t = 2;
                for (t = 2; t < 2 * until + 4; t = t + 2, firstDate = firstDate.plus(1, ChronoUnit.DAYS)) {
                    Cell reserveCell = row.getCell(t);
                    Cell payedCell = row.getCell(t+1);
                }
            }
        }

        //设置最后一行
        LocalDate firstDate = beginDate;
        //如果该商品的行数已经打印完,就打印该产品的统计行
        //设置产品名称和"总计"
        SXSSFRow lastRow = sheet.createRow(rowNum);
        Cell firstAllCell = lastRow.createCell(0);
        POIUtils.setSXSSBorderBlackCell(wb, firstAllCell);
        firstAllCell.setCellValue("合计");
        Cell secondAllCell = lastRow.createCell(1);
        POIUtils.setSXSSBorderBlackCell(wb, secondAllCell);
        //设置总计的统计数据
        int j = 2;
        for (j = 2; j < 2 * until + 4; j = j + 2, firstDate = firstDate.plus(1, ChronoUnit.DAYS)) {
            //设置边框
            Cell cell = null;
            Cell leftCell = null;
            if (lastRow.getCell(j) == null) {
                leftCell = lastRow.createCell(j);
                leftCell.setCellStyle(borderStyle);
            } else {
                leftCell = lastRow.getCell(j);
                leftCell.setCellStyle(borderStyle);
            }
            //设置最后一行的值
            String leftCellSumFormula =getFormula(leftCell,rowNum);
            if(leftCellSumFormula==null){
                leftCell.setCellValue("0");
            }else{
                leftCell.setCellFormula(leftCellSumFormula);
            }
        }

        //设置行尾统计
        Cell payedCountCell = lastRow.createCell(j);
        //设置单元格公式--预定和
        String reserveFormula = getRowReserveSum(payedCountCell);
        payedCountCell.setCellFormula(reserveFormula);
        POIUtils.setSXSSBorderCell(singleStyle,wb,payedCountCell);
        //设置单元格合并
        sheet.addMergedRegion(new CellRangeAddress(rowNum, rowNum, 0, 1));
        POIUtils.setSXSSRegionStyle(sheet,new CellRangeAddress(rowNum, rowNum, 0, 1),borderStyle);
        payedCountCell.setCellStyle(borderStyle);
        //payedCountCell.setCellStyle(borderStyle);

        mergeDataCell(borderStyle, wb, sheet, beginDate, until, firstDataRow, lastRow);
        //导出excel
        export(response,wb,beginDate,endDate);
    }

    private void mergeDataCell(CellStyle borderStyle, SXSSFWorkbook wb, SXSSFSheet sheet, LocalDate beginDate, long until, int firstDataRow, SXSSFRow lastRow) {
        LocalDate mergeDate = beginDate;
        for(int r = firstDataRow;r<=lastRow.getRowNum();r++){
            if(r<lastRow.getRowNum()){
                int k = 2;
                for (k = 2; k < 2 * until + 4; k = k + 2, mergeDate = mergeDate.plus(1, ChronoUnit.DAYS)) {
                    sheet.addMergedRegion(new CellRangeAddress(r, r, k, k+1));
                    POIUtils.setSXSSRegionStyle(sheet,new CellRangeAddress(r, r, k, k+1),POIUtils.getSXSSBorderCell(wb));
                }
            }else{
                int k = 2;
                for (k = 2; k < 2 * until + 4; k = k + 2, mergeDate = mergeDate.plus(1, ChronoUnit.DAYS)) {
                    sheet.addMergedRegion(new CellRangeAddress(r, r, k, k+1));
                    POIUtils.setSXSSRegionStyle(sheet,new CellRangeAddress(r, r, k, k+1),borderStyle);
                }
            }
        }
    }

    private void setProductName(CellStyle singleStyle,SXSSFWorkbook wb, SXSSFSheet sheet, Map<Long, Boolean> createdHeadCellsMap, Map<Long, HashSet<Long>> productTicketsMap, SchedulePlanExportDO data, SXSSFRow row) {
        if (createdHeadCellsMap.get(data.getProductId())==null) {
            System.out.println(data.getProductId());
            Cell firstCell = row.createCell(0);
            POIUtils.setSXSSBorderCell(singleStyle,wb, firstCell);
            firstCell.setCellValue(data.getpName());
            createdHeadCellsMap.put(data.getProductId(),true);
            //合并产品名称
            Integer ticketSetSize = productTicketsMap.get(data.getProductId()).size();
            System.out.println(row.getRowNum()+"###"+(row.getRowNum()+ticketSetSize));
            sheet.addMergedRegion(new CellRangeAddress(row.getRowNum(),row.getRowNum()+ticketSetSize, 0, 0));
            CellStyle productNameStyle = POIUtils.initSXSSColumnHeadStyle(wb);
            sheet.setColumnWidth(0, data.getpName().getBytes().length/2*256);
            productNameStyle.setFillForegroundColor(IndexedColors.PALE_BLUE.getIndex());
            productNameStyle.setFillPattern(CellStyle.SOLID_FOREGROUND);
            POIUtils.setSXSSRegionStyle(sheet,new CellRangeAddress(row.getRowNum(),row.getRowNum()+ticketSetSize, 0, 0),productNameStyle);
        }
    }

    private void computeProductTicketCount(List<SchedulePlanExportDO> dataList, Map<Long, HashSet<Long>> productTicketsMap) {
        for(SchedulePlanExportDO exportDO:dataList){
            HashSet<Long> ticketSet = null;
            if(productTicketsMap.get(exportDO.getProductId())==null){
                ticketSet= new HashSet<>();
                productTicketsMap.put(exportDO.getProductId(),ticketSet);
            }else{
                ticketSet = productTicketsMap.get(exportDO.getProductId());
            }
            ticketSet.add(Long.parseLong(""+exportDO.getProductId()+exportDO.gettId()));
        }
    }

    private void putDataPayed(CellStyle borderStyle,List<SchedulePlanExportDO> dataList,Map<String,Integer> productCountMap, HttpServletResponse response, SXSSFWorkbook wb,SXSSFSheet sheet, LocalDate beginDate, LocalDate endDate) throws IOException {
        //计算时间跨度
        long until = beginDate.until(endDate, ChronoUnit.DAYS);
        CellStyle singleStyle = wb.createCellStyle();
        //定义初始行数
        int firstDataRow = 5;
        int tRowNum = 5;
        int rowNum = firstDataRow;
        Map<String,SXSSFRow> rowMap = new HashMap<>();
        //计算当前行数是否已经达到该产品在dataList中的最后一条
        Map<String,Integer> myProductCountMap = new HashMap<>();
        Map<Long,Boolean> createdHeadCellsMap = new HashMap<>();
        Map<Long,HashSet<Long>> productTicketsMap = new HashMap<>();

        //计算每个产品的票数
        computeProductTicketCount(dataList, productTicketsMap);

        for(SchedulePlanExportDO data:dataList){
            //遍历dataList,累加myMap
            if(myProductCountMap.get(data.getProductId().toString())==null){
                myProductCountMap.put(data.getProductId().toString(),1);
            }else{
                myProductCountMap.put(data.getProductId().toString(),myProductCountMap.get(data.getProductId().toString())+1);
            }
            //判断两个map的值是否达到一致
            Boolean isCountRow = false;
            Integer myValue = myProductCountMap.get(data.getProductId().toString());
            Integer pValue = productCountMap.get(data.getProductId().toString());
            if(pValue!=null){
                isCountRow = myValue.equals(pValue);
            }
            //1.如果是同一个产品的同一张票,只创建一行row
            SXSSFRow row = null;
            if (rowMap.get(""+data.getProductId()+data.gettId()) == null) {
                //如果该票id从rowmap中没有取到值,则创建一条row,并将rownum+1
                row = sheet.createRow(rowNum);
                rowMap.put(""+data.getProductId()+data.gettId(), row);
                rowNum++;
            } else {
                //如果取到了,就使用该row
                row = rowMap.get(""+data.getProductId()+data.gettId());
            }

            //如果map中未取到该产品的value,说明未创建过该产品的行,则设置行头
            setProductName(singleStyle,wb, sheet, createdHeadCellsMap, productTicketsMap, data, row);

            //设置数据行的票价名称
            Cell secondCell = row.createCell(1);
            POIUtils.setSXSSBorderCell(singleStyle,wb, secondCell);
            secondCell.setCellValue(data.gettName());
            LocalDate defaultDate = beginDate;
            int c = 2;
            for (c = 2; c <= 2 * until + 4; c = c + 2, defaultDate = defaultDate.plus(1, ChronoUnit.DAYS)) {
                Cell cell = null;
                //Cell rightCell = null;
                //设置预约单元格边框
                if (row.getCell(c) == null) {
                    cell = row.createCell(c);
                    POIUtils.setSXSSBorderCell(singleStyle,wb, cell);
                    cell.setCellValue(0);
                } else {
                    cell = row.getCell(c);
                }
            }

            //如果是预约的数据
            if (data.getoStatus().equals(Integer.valueOf(3))) {
                LocalDate firstDate = beginDate;
                int i = 2;
                for (i = 2; i < 2 * until + 4; i = i + 2, firstDate = firstDate.plus(1, ChronoUnit.DAYS)) {
                    Cell cell = null;
                    //Cell rightCell = null;
                    //设置预约单元格边框
                    if (row.getCell(i) == null) {
                        cell = row.createCell(i);
                        POIUtils.setSXSSBorderCell(singleStyle,wb, cell);
                        cell.setCellValue(0);
                    } else {
                        cell = row.getCell(i);
                    }
                    //将值塞入单元格
                    if (data.getsCalendar().compareTo(firstDate) == 0) {
                        cell.setCellValue(data.getTicketCounts());
                    }
                }
                Cell payedCountCell = row.createCell(i);
                //设置单元格公式--预定和
                String payedFormula = getRowReserveSum(payedCountCell);
                payedCountCell.setCellFormula(payedFormula);
                POIUtils.setSXSSBorderCell(singleStyle,wb,payedCountCell);
            }
            //2.设置总计行
            if(isCountRow){
                LocalDate firstDate = beginDate;
                //如果该商品的行数已经打印完,就打印该产品的统计行
                //设置产品名称和"总计"
                row = sheet.createRow(rowNum);
                Cell secondCountCell = row.createCell(1);
                POIUtils.setSXSSBorderBlackCell(wb, secondCountCell);
                secondCountCell.setCellValue("总计");
                //设置总计的统计数据
                int i = 2;
                for (i = 2; i < 2 * until + 4; i = i + 2, firstDate = firstDate.plus(1, ChronoUnit.DAYS)) {
                    //设置边框
                    Cell cell = null;
                    Cell leftCell = null;
                    if (row.getCell(i) == null) {
                        leftCell = row.createCell(i);
                        CellStyle style = POIUtils.initSXSSColumnHeadStyle(wb);
                        leftCell.setCellStyle(style);
                    } else {
                        leftCell = row.getCell(i);
                        CellStyle style = POIUtils.initSXSSColumnHeadStyle(wb);
                        leftCell.setCellStyle(style);
                    }
                    //设置预定总计和已售总计
                    int leftCellRow = leftCell.getRowIndex();
                    int leftCellCol = leftCell.getColumnIndex();

                    String productReserveFormula = getProductCountFormula(leftCell,tRowNum);
                    if (productReserveFormula!=null) {
                        leftCell.setCellFormula(productReserveFormula);
                    }
                }
                tRowNum = rowNum+1;

                //设置行尾统计
                Cell reserveCountCell = row.createCell(i);
                //设置单元格公式--预定和
                String reserveFormula = getRowReserveSum(reserveCountCell);
                reserveCountCell.setCellFormula(reserveFormula);
                POIUtils.setSXSSBorderCell(singleStyle,wb,reserveCountCell);
                rowNum++;

                //设置产品统计行的值
                int t = 2;
                for (t = 2; t < 2 * until + 4; t = t + 2, firstDate = firstDate.plus(1, ChronoUnit.DAYS)) {
                    Cell reserveCell = row.getCell(t);
                    Cell payedCell = row.getCell(t+1);
                }
            }
        }

        //设置最后一行
        LocalDate firstDate = beginDate;
        //如果该商品的行数已经打印完,就打印该产品的统计行
        //设置产品名称和"总计"
        SXSSFRow lastRow = sheet.createRow(rowNum);
        Cell firstAllCell = lastRow.createCell(0);
        POIUtils.setSXSSBorderBlackCell(wb, firstAllCell);
        firstAllCell.setCellValue("合计");
        Cell secondAllCell = lastRow.createCell(1);
        POIUtils.setSXSSBorderBlackCell(wb, secondAllCell);
        //设置总计的统计数据
        int j = 2;
        for (j = 2; j < 2 * until + 4; j = j + 2, firstDate = firstDate.plus(1, ChronoUnit.DAYS)) {
            //设置边框
            Cell cell = null;
            Cell leftCell = null;
            if (lastRow.getCell(j) == null) {
                leftCell = lastRow.createCell(j);
                leftCell.setCellStyle(borderStyle);
            } else {
                leftCell = lastRow.getCell(j);
                leftCell.setCellStyle(borderStyle);
            }
            //设置最后一行的值
            String leftCellSumFormula =getFormula(leftCell,rowNum);
            if(leftCellSumFormula==null){
                leftCell.setCellValue("0");
            }else{
                leftCell.setCellFormula(leftCellSumFormula);
            }

        }

        //设置行尾统计
        Cell reserveCountCell = lastRow.createCell(j);
        //设置单元格公式--预定和
        String reserveFormula = getRowReserveSum(reserveCountCell);
        reserveCountCell.setCellFormula(reserveFormula);
        POIUtils.setSXSSBorderCell(singleStyle,wb,reserveCountCell);
        //设置单元格合并
        sheet.addMergedRegion(new CellRangeAddress(rowNum, rowNum, 0, 1));
        POIUtils.setSXSSRegionStyle(sheet,new CellRangeAddress(rowNum, rowNum, 0, 1),borderStyle);
        reserveCountCell.setCellStyle(borderStyle);
        //payedCountCell.setCellStyle(borderStyle);

        mergeDataCell(borderStyle, wb, sheet, beginDate, until, firstDataRow, lastRow);
        //导出excel
        export(response,wb,beginDate,endDate);
    }

    private void putDataAll(CellStyle borderStyle,List<SchedulePlanExportDO> dataList,Map<String,Integer> productCountMap, HttpServletResponse response, SXSSFWorkbook wb,SXSSFSheet sheet, LocalDate beginDate, LocalDate endDate) throws IOException {
        //计算时间跨度
        long until = beginDate.until(endDate, ChronoUnit.DAYS);
        //获取单例style
        CellStyle singleStyle = wb.createCellStyle();

        //定义初始行数
        int firstDataRow = 5;
        int tRowNum = 5;
        int rowNum = firstDataRow;
        Map<String,SXSSFRow> rowMap = new HashMap<>();
        //计算当前行数是否已经达到该产品在dataList中的最后一条
        Map<String,Integer> myProductCountMap = new HashMap<>();
        Map<Long,Boolean> createdHeadCellsMap = new HashMap<>();
        Map<Long,HashSet<Long>> productTicketsMap = new HashMap<>();
        //计算每个产品的票数
        for(SchedulePlanExportDO exportDO:dataList){
            HashSet<Long> ticketSet = null;
            if(productTicketsMap.get(exportDO.getProductId())==null){
                ticketSet= new HashSet<>();
                productTicketsMap.put(exportDO.getProductId(),ticketSet);
            }else{
                ticketSet = productTicketsMap.get(exportDO.getProductId());
            }
            ticketSet.add(Long.parseLong(""+exportDO.getProductId()+exportDO.gettId()));
        }
        logger.error("应该改为遍历所有的产品的票,即使没有数据");
        for(SchedulePlanExportDO data:dataList){
            //遍历dataList,计算每个产品共有几条记录
            if(myProductCountMap.get(data.getProductId().toString())==null){
                myProductCountMap.put(data.getProductId().toString(),1);
            }else{
                myProductCountMap.put(data.getProductId().toString(),myProductCountMap.get(data.getProductId().toString())+1);
            }

            //判断两个map的值是否达到一致
            Boolean isCountRow = false;
            Integer myValue = myProductCountMap.get(data.getProductId().toString());
            Integer pValue = productCountMap.get(data.getProductId().toString());
            if(pValue!=null){
                isCountRow = myValue.equals(pValue);
            }
            //1.如果是同一个产品的同一张票,只创建一行row
            SXSSFRow row = null;
            if (rowMap.get(""+data.getProductId()+data.gettId()) == null) {
                //如果该票id从rowmap中没有取到值,则创建一条row,并将rownum+1
                row = sheet.createRow(rowNum);
                rowMap.put(""+data.getProductId()+data.gettId(), row);
                rowNum++;
            } else {
                //如果取到了,就使用该row
                row = rowMap.get(""+data.getProductId()+data.gettId());
            }

            //如果map中未取到该产品的value,说明未创建过该产品的行,则设置行头
            setProductName(singleStyle,wb, sheet, createdHeadCellsMap, productTicketsMap, data, row);

            //设置数据行的票价名称
            Cell secondCell = row.createCell(1);
            POIUtils.setSXSSBorderCell(singleStyle,wb, secondCell);
            secondCell.setCellValue(data.gettName());

            //如果是预约的数据
            if (data.getoStatus()!=null && data.getoStatus().equals(Integer.valueOf(1))) {
                LocalDate firstDate = beginDate;
                int i = 2;
                for (i = 2; i < 2 * until + 4; i = i + 2, firstDate = firstDate.plus(1, ChronoUnit.DAYS)) {
                    Cell cell = null;
                    Cell rightCell = null;
                    //设置预约单元格边框
                    if (row.getCell(i) == null) {
                        cell = row.createCell(i);
                        POIUtils.setSXSSBorderCell(singleStyle,wb, cell);
                        cell.setCellValue(0);
                    } else {
                        cell = row.getCell(i);
                    }
                    //设置已付单元格边框
                    if (row.getCell(i + 1) == null) {
                        rightCell = row.createCell(i + 1);
                        rightCell.setCellValue(0);
                        POIUtils.setSXSSBorderCell(singleStyle,wb, rightCell);
                    } else {
                        rightCell = row.getCell(i + 1);
                        POIUtils.setSXSSBorderCell(singleStyle,wb, rightCell);
                    }
                    //将值塞入单元格
                    if (data.getsCalendar().compareTo(firstDate) == 0) {
                        cell.setCellValue(data.getTicketCounts());
                    }
                }
                Cell reserveCountCell = row.createCell(i);
                //设置单元格公式--预定和
                String reserveFormula = getRowReserveSum(reserveCountCell);
                reserveCountCell.setCellFormula(reserveFormula);

                POIUtils.setSXSSBorderCell(singleStyle,wb,reserveCountCell);
                Cell payedCountCell =row.createCell(i+1);
                //设置单元格公式--已付和
                String payedFormula = getRowPayedSum(payedCountCell);
                payedCountCell.setCellFormula(payedFormula);
                POIUtils.setSXSSBorderCell(singleStyle,wb,payedCountCell);
            //如果是已付的数据
            } else if (data.getoStatus()!=null && data.getoStatus().equals(Integer.valueOf(3))) {
                LocalDate firstDate = beginDate;
                int i = 2;
                for (i = 2; i < 2 * until + 4; i = i + 2, firstDate = firstDate.plus(1, ChronoUnit.DAYS)) {
                    Cell cell = null;
                    Cell leftCell = null;
                    if (row.getCell(i + 1) == null) {
                        cell = row.createCell(i + 1);
                        cell.setCellValue(0);
                        POIUtils.setSXSSBorderCell(singleStyle,wb, cell);
                    } else {
                        cell = row.getCell(i + 1);
                    }
                    if (row.getCell(i) == null) {
                        leftCell = row.createCell(i);
                        leftCell.setCellValue(0);
                        POIUtils.setSXSSBorderCell(singleStyle,wb, leftCell);
                    } else {
                        leftCell = row.getCell(i);
                        POIUtils.setSXSSBorderCell(singleStyle,wb, leftCell);
                    }
                    if (data.getsCalendar().compareTo(firstDate) == 0) {
                        cell.setCellValue(data.getTicketCounts());
                        //continue loop;
                    }
                }
                Cell reserveCountCell = row.createCell(i);
                //设置单元格公式--预定和
                String reserveFormula = getRowReserveSum(reserveCountCell);
                reserveCountCell.setCellFormula(reserveFormula);
                POIUtils.setSXSSBorderCell(singleStyle,wb,reserveCountCell);

                Cell payedCountCell =row.createCell(i+1);
                //设置单元格公式--已付和
                String payedFormula = getRowPayedSum(payedCountCell);
                payedCountCell.setCellFormula(payedFormula);
                POIUtils.setSXSSBorderCell(singleStyle,wb,payedCountCell);
            }else if(data.getoStatus() == null){
                //如果票没有卖出
                LocalDate firstDate = beginDate;
                int i = 2;
                for (i = 2; i < 2 * until + 4; i = i + 2, firstDate = firstDate.plus(1, ChronoUnit.DAYS)) {
                    Cell cell = null;
                    Cell leftCell = null;
                    if (row.getCell(i + 1) == null) {
                        cell = row.createCell(i + 1);
                        cell.setCellValue(0);
                        POIUtils.setSXSSBorderCell(singleStyle,wb, cell);
                    } else {
                        cell = row.getCell(i + 1);
                    }
                    if (row.getCell(i) == null) {
                        leftCell = row.createCell(i);
                        leftCell.setCellValue(0);
                        POIUtils.setSXSSBorderCell(singleStyle,wb, leftCell);
                    } else {
                        leftCell = row.getCell(i);
                        POIUtils.setSXSSBorderCell(singleStyle,wb, leftCell);
                    }
                    if (data.getsCalendar().compareTo(firstDate) == 0) {
                        cell.setCellValue(data.getTicketCounts());
                        //continue loop;
                    }
                }
                row.getCell(1).setCellValue("hahaha");
                Cell reserveCountCell = row.createCell(i);
                //设置单元格公式--预定和
                String reserveFormula = getRowReserveSum(reserveCountCell);
                reserveCountCell.setCellFormula(reserveFormula);
                POIUtils.setSXSSBorderCell(singleStyle,wb,reserveCountCell);

                Cell payedCountCell =row.createCell(i+1);
                //设置单元格公式--已付和
                String payedFormula = getRowPayedSum(payedCountCell);
                payedCountCell.setCellFormula(payedFormula);
                POIUtils.setSXSSBorderCell(singleStyle,wb,payedCountCell);
            }
            //2.设置总计行
            if(isCountRow){
                LocalDate firstDate = beginDate;
                //如果该商品的行数已经打印完,就打印该产品的统计行
                //设置产品名称和"总计"
                row = sheet.createRow(rowNum);
                Cell secondCountCell = row.createCell(1);
                POIUtils.setSXSSBorderBlackCell(wb, secondCountCell);
                secondCountCell.setCellValue("总计");
                //设置总计的统计数据
                int i = 2;
                for (i = 2; i < 2 * until + 4; i = i + 2, firstDate = firstDate.plus(1, ChronoUnit.DAYS)) {
                    //设置边框
                    Cell cell = null;
                    Cell leftCell = null;
                    if (row.getCell(i + 1) == null) {
                        cell = row.createCell(i + 1);
                        CellStyle style = POIUtils.initSXSSColumnHeadStyle(wb);
                        cell.setCellStyle(style);
                    } else {
                        cell = row.getCell(i + 1);
                        CellStyle style = POIUtils.initSXSSColumnHeadStyle(wb);
                        cell.setCellStyle(style);
                    }
                    if (row.getCell(i) == null) {
                        leftCell = row.createCell(i);
                        CellStyle style = POIUtils.initSXSSColumnHeadStyle(wb);
                        leftCell.setCellStyle(style);
                    } else {
                        leftCell = row.getCell(i);
                        CellStyle style = POIUtils.initSXSSColumnHeadStyle(wb);
                        leftCell.setCellStyle(style);
                    }
                    //设置预定总计和已售总计
                    String productReserveFormula = getProductCountFormula(leftCell,tRowNum);
                    String productPayedFormula = getProductCountFormula(cell,tRowNum);
                    if (productReserveFormula!=null) {
                        leftCell.setCellFormula(productReserveFormula);
                    }
                    if(productPayedFormula!=null){
                        cell.setCellFormula(productPayedFormula);

                    }
                }
                tRowNum = rowNum+1;

                //设置行尾统计
                Cell reserveCountCell = row.createCell(i);
                //设置单元格公式--预定和
                String reserveFormula = getRowReserveSum(reserveCountCell);
                reserveCountCell.setCellFormula(reserveFormula);
                POIUtils.setSXSSBorderCell(singleStyle,wb,reserveCountCell);
                Cell payedCountCell =row.createCell(i+1);
                //设置单元格公式--已售和
                String payedFormula = getRowPayedSum(payedCountCell);
                payedCountCell.setCellFormula(payedFormula);
                POIUtils.setSXSSBorderCell(singleStyle,wb,payedCountCell);
                rowNum++;

                //设置产品统计行的值
                int t = 2;
                for (t = 2; t < 2 * until + 4; t = t + 2, firstDate = firstDate.plus(1, ChronoUnit.DAYS)) {
                    Cell reserveCell = row.getCell(t);
                    Cell payedCell = row.getCell(t+1);
                }
            }
        }

        //设置最后一行
        LocalDate firstDate = beginDate;
        //如果该商品的行数已经打印完,就打印该产品的统计行
        //设置产品名称和"总计"
        SXSSFRow lastRow = sheet.createRow(rowNum);
        Cell firstAllCell = lastRow.createCell(0);
        POIUtils.setSXSSBorderBlackCell(wb, firstAllCell);
        firstAllCell.setCellValue("合计");
        Cell secondAllCell = lastRow.createCell(1);
        POIUtils.setSXSSBorderBlackCell(wb, secondAllCell);
        //设置总计的统计数据
        int j = 2;
        for (j = 2; j < 2 * until + 4; j = j + 2, firstDate = firstDate.plus(1, ChronoUnit.DAYS)) {
            //设置边框
            Cell cell = null;
            Cell leftCell = null;
            if (lastRow.getCell(j + 1) == null) {
                cell = lastRow.createCell(j + 1);
                cell.setCellStyle(borderStyle);
            } else {
                cell = lastRow.getCell(j + 1);
                cell.setCellStyle(borderStyle);
            }
            if (lastRow.getCell(j) == null) {
                leftCell = lastRow.createCell(j);
                leftCell.setCellStyle(borderStyle);
            } else {
                leftCell = lastRow.getCell(j);
                leftCell.setCellStyle(borderStyle);
            }
            //设置最后一行的值
            String sumFormula  = getFormula(cell,rowNum);
            if(sumFormula==null){
                cell.setCellValue("0");
            }else{
                cell.setCellFormula(sumFormula);
            }
            String leftCellSumFormula =getFormula(leftCell,rowNum);
            if(leftCellSumFormula==null){
                leftCell.setCellValue("0");
            }else{
                leftCell.setCellFormula(leftCellSumFormula);
            }
        }

        //设置行尾统计
        Cell reserveCountCell = lastRow.createCell(j);
        //设置单元格公式--预定和
        String reserveFormula = getRowReserveSum(reserveCountCell);
        reserveCountCell.setCellFormula(reserveFormula);
        POIUtils.setSXSSBorderCell(singleStyle,wb,reserveCountCell);
        Cell payedCountCell =lastRow.createCell(j+1);
        //设置单元格公式--预定和
        String payedFormula = getRowPayedSum(payedCountCell);
        payedCountCell.setCellFormula(payedFormula);
        POIUtils.setSXSSBorderCell(singleStyle,wb,payedCountCell);
        //设置单元格合并
        sheet.addMergedRegion(new CellRangeAddress(rowNum, rowNum, 0, 1));
        POIUtils.setSXSSRegionStyle(sheet,new CellRangeAddress(rowNum, rowNum, 0, 1),borderStyle);
        reserveCountCell.setCellStyle(borderStyle);
        payedCountCell.setCellStyle(borderStyle);
        //导出excel
        export(response,wb,beginDate,endDate);
    }

    private String getProductCountFormula(Cell cell,int tRowNum) {
        ArrayList<String> strList = new ArrayList<>();
        StringBuilder sb  = new StringBuilder();
        int col = cell.getRowIndex();
        for(int i = (tRowNum+1);i<=(cell.getRowIndex());i++ ){
            strList.add(Columns.getIndexLabel(cell.getColumnIndex())+i);
        }
        sb.append("SUM(");
        strList.stream().forEach(s->{
            sb.append(s).append(",");
        });
        if(sb.lastIndexOf(",")<0){
            return null;
        }
        String str = sb.substring(0, sb.lastIndexOf(","));
        String resultStr = str+")";
        return resultStr;
    }

    private String getRowPayedSum(Cell cell) {
        ArrayList<String> strList = new ArrayList<>();
        StringBuilder sb  = new StringBuilder();
        for(int i = 3;i<cell.getColumnIndex();i+=2 ){
            strList.add(Columns.getIndexLabel(i)+(cell.getRowIndex()+1));
        }
        sb.append("SUM(");
        strList.stream().forEach(s->{
            sb.append(s).append(",");
        });
        String str = sb.substring(0, sb.lastIndexOf(","));
        String resultStr = str+")";
        return resultStr;
    }

    private String getRowReserveSum(Cell cell) {
        ArrayList<String> strList = new ArrayList<>();
        StringBuilder sb  = new StringBuilder();
        for(int i = 2;i<cell.getColumnIndex();i+=2 ){
            strList.add(Columns.getIndexLabel(i)+(cell.getRowIndex()+1));
        }
        sb.append("SUM(");
        strList.stream().forEach(s->{
            sb.append(s).append(",");
        });
        String str = sb.substring(0, sb.lastIndexOf(","));
        String resultStr = str+")";
        return resultStr;
    }

    private String getFormula(Cell leftCell,Integer rowNum) {
        if(rowNum>5){
            ArrayList<String> strList = new ArrayList<>();
            StringBuilder sb  = new StringBuilder();
            for(int i = 6;(i)<=rowNum;i++ ){
                strList.add(Columns.getIndexLabel(leftCell.getColumnIndex())+i);
            }
            sb.append("SUM(");
            strList.stream().forEach(s->{
                sb.append(s).append(",");
            });
            String str = sb.substring(0, sb.lastIndexOf(","));
            String resultStr = str+")/2";
            return resultStr;
        }else{
            return null;
        }
    }

    public List<SchedulePlanExportDO> getData(SchedulePlanManageQueryVO vo) {
        //默认展示未来15天的数据--全部
        if (vo.getBeginDate()==null || vo.getEndDate()==null) {
            LocalDate today = LocalDate.now();
            vo.setBeginDate(today.plusDays(1));
            vo.setEndDate(today.plus(15, ChronoUnit.DAYS));
        }

        //2.查询基本数据
        StringBuffer url = new StringBuffer(controllCenterUrl).append("SchedulePlan/queryBeforeExport");
        ResultBean<List<SchedulePlanExportDO>> result  = restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody();
        List unParseList = result.getParsedEnitity(List.class);
        String jsonStr = JSON.toJSONString(unParseList);
        List<SchedulePlanExportDO> resultList = JSONUtil.trans2List(JSON.toJSONString(unParseList), SchedulePlanExportDO.class);
        return resultList;
    }

    private Map<String,Integer> getProductCountMap(SchedulePlanManageQueryVO vo) {
        //1.默认展示未来15天的数据--全部
        if (vo.getBeginDate()==null || vo.getEndDate()==null) {
            LocalDate today = LocalDate.now();
            vo.setBeginDate(today.plusDays(1));
            vo.setEndDate(today.plus(15, ChronoUnit.DAYS));
        }
        //2.查询基本数据
        StringBuffer url = new StringBuffer(controllCenterUrl).append("SchedulePlan/getProductCountBeforeExport");
        ResultBean<Map<String,Integer>> result  = restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody();
        Map<String,Integer> productCountMap = result.getParsedEnitity(Map.class);
        return productCountMap;
    }


    //将数据输入到客户端
    private void export(HttpServletResponse response, SXSSFWorkbook wb, LocalDate beginDate, LocalDate endDate) throws IOException {
        String beginDateStr = beginDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        String endDateStr = endDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        // 第六步，将文件存到指定位置
        OutputStream out = null;
        try {
            //否则，直接写到输出流中
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
            String dateStr = format.format(new Date());
            out = response.getOutputStream();
            String fileName = "尚品旅游" + beginDateStr+"--"+endDateStr+"出团计划表";
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
