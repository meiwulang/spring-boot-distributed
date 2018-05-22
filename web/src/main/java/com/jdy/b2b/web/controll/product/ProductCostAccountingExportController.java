package com.jdy.b2b.web.controll.product;

import com.jdy.b2b.web.pojo.product.*;
import com.jdy.b2b.web.pojo.scheduleplan.SchedulePlanQueryVO;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.JSONUtil;
import com.jdy.b2b.web.util.ResultBean;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.streaming.SXSSFRow;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.awt.Color;
import java.io.IOException;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.DataFormat;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.streaming.SXSSFRow;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.jdy.b2b.web.pojo.product.ProductCostingAllInformation;
import com.jdy.b2b.web.pojo.product.ProductCostingCategoryDetail;
import com.jdy.b2b.web.pojo.product.ProductCostingCategoryInformation;
import com.jdy.b2b.web.pojo.product.ProductCostingQueryDTO;
import com.jdy.b2b.web.pojo.product.SchedulePlanCateExpendDO;
import com.jdy.b2b.web.pojo.product.SchedulePlanCountDO;
import com.jdy.b2b.web.pojo.product.SchedulePlanNewResult;
import com.jdy.b2b.web.pojo.product.SchedulePlanQueryDO;
import com.jdy.b2b.web.pojo.scheduleplan.SchedulePlanQueryVO;
import com.jdy.b2b.web.pojo.user.UserResultDTO;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.JSONUtil;
import com.jdy.b2b.web.util.ResultBean;

/**
 * Created by strict on 2018/2/5.
 */
@RestController
@RequestMapping("productCost")
public class ProductCostAccountingExportController extends BaseController{
    private static final String COL_BEIZHU = "备注";

    private  SXSSFWorkbook wb;
    //表头样式
    private  CellStyle headStyle;
    //蓝底白字样式
    private  XSSFCellStyle blueStyle;
    private  XSSFCellStyle blueNumberStyle;
    //蓝底黑字
    private  XSSFCellStyle blueBlackNumberStyle;
    //橙底黑字样式
    private  XSSFCellStyle orangeStyle;
    private  XSSFCellStyle orangeNumberStyle;
    //基本标签样式
    private  XSSFCellStyle normalStyle;
    //数据内容样式
    private  XSSFCellStyle bodyStyle;
    private  XSSFCellStyle bodyNumberStyle;
    private  XSSFCellStyle bodyIntegerStyle;

    private final static String  COL_SHULIANG = "数量";
    private final static String  COL_DANWEI = "单位(人OR团)";
    private final static String  COL_DANJIA = "单价";
    private final static String  COL_XIAOJI = "小计";

    private final static String  COL_DAJIAOTONG = "机票/火车票/船票/车费等费用";
    private final static String  COL_CHELIANGFEIYONG = "车辆费用(接送机等)";
    private final static String  COL_JIUDIANFEIYONG = "酒店费用";
    private final static String  COL_YONGCAN = "用餐";
    private final static String  COL_LVYOU = "旅游";
    private final static String  COL_LVYOUYIWAIXIAN = "旅游意外险";
    private final static String  COL_QITA = "其他";
    private final static String  COL_LVXINGSHEFUWUFEI = "旅行社服务费及税金";

    private final static String[] COL_NAME_ACCOUNTING_ARRAY = {COL_DAJIAOTONG,COL_CHELIANGFEIYONG,COL_JIUDIANFEIYONG,COL_YONGCAN,COL_LVYOU,COL_LVYOUYIWAIXIAN,
            COL_QITA,COL_QITA,COL_QITA,COL_QITA,COL_LVXINGSHEFUWUFEI};
    private final static String[] COL_NAME_LOSS_ARRAY = {"团号","产品名称","出团日期","人数","系统收入",
            "大交通","室内交通费用","住宿费用", "餐饮费用","地接费用","保险费用","领队费用","团队物料等费用(实物)","活动部分其他费用(非实物)","途忆旅拍","服务费及税金",
            "支出合计","毛利","毛利率","备注"};

    @GetMapping("exportProductCostAccountingExcel/{sid}/{type}")
    public ResultBean exportProductCostAccountingExcel(@PathVariable("sid") Long sid,@PathVariable("type") Integer type, HttpServletResponse response) throws IOException{
        String url = controllCenterUrl + "productCosting/queryProductCostingAllInformationById";
        ProductCostingQueryDTO productCostingQueryDTO = new ProductCostingQueryDTO();
        productCostingQueryDTO.setScheduleId(sid);
        productCostingQueryDTO.setType(type);
        ProductCostingAllInformation outputData = (ProductCostingAllInformation) restTemplate.postForEntity(url, productCostingQueryDTO, ResultBean.class).getBody().getParsedEnitity(ProductCostingAllInformation.class);
        //ProductCostingAllInformation outputData = JSONUtil.trans(resultBean.getBody(),ProductCostingAllInformation.class);
        beginExportCostAccountingExcel(response,outputData);
        return ResultBean.getSuccessResult();
    }
    @GetMapping("exportProductCostLossExcel")
    public ResultBean exportProductCostLossExcel(@RequestParam("searchStr") String searchStr,
    											 @RequestParam(required=false,value="companyId") Long companyId,
                                                 @RequestParam("flag") Integer flag,
                                                 @DateTimeFormat(pattern = "yyyy-MM-dd")
                                                 @RequestParam("beginDate") LocalDate beginDate,
                                                 @DateTimeFormat(pattern = "yyyy-MM-dd")
                                                 @RequestParam("endDate") LocalDate endDate,
                                                 HttpServletResponse response) throws IOException{
        SchedulePlanQueryVO vo = new SchedulePlanQueryVO();
        vo.setBeginDate(beginDate);
        vo.setEndDate(endDate);
        vo.setFlag(flag);
        vo.setSearchStr(searchStr);
        //如果是系统权限 可以操作公司 否则查当前公司数据
        UserResultDTO user = getUser();
        if(user.getuDataLimit() !=3){
        	vo.setPcompanyId(user.getuCompanyId());
        }else{
        	vo.setPcompanyId(companyId);
        }
        StringBuffer url = new StringBuffer(controllCenterUrl).append("SchedulePlan/newPlanList");

        @SuppressWarnings("unchecked")
		SchedulePlanNewResult outputData =(SchedulePlanNewResult) restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody().getParsedEnitity(SchedulePlanNewResult.class);
//        ResultBean<SchedulePlanNewResult> resultBean = restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody();
//        SchedulePlanNewResult outputData = JSONUtil.trans(resultBean.getBody(),SchedulePlanNewResult.class);
            if (beginDate==null || endDate==null) {
                LocalDate today = LocalDate.now();
                beginDate = today.plusDays(1);
                endDate = today.plus(15,ChronoUnit.DAYS);
            }
            String fileName = beginDate.format(DateTimeFormatter.ofPattern("yyyy.MM.dd"))+"-"+endDate.format(DateTimeFormatter.ofPattern("yyyy.MM.dd"))+"各产品线损益表";
            beginExportCostLossExcel(response,outputData,fileName);
        return ResultBean.getSuccessResult();
    }

    /**
     * 导出 成本损益表
     * 绘制基本数据前的表头数据
     * @param response
     * @param outputData
     * @param fileName
     * @throws IOException
     */
    private void beginExportCostLossExcel(HttpServletResponse response, SchedulePlanNewResult outputData, String fileName) throws IOException{
        initFirst();
        //创建sheet
        SXSSFSheet sheet = wb.createSheet(fileName);

        //空行
        SXSSFRow blankRow = sheet.createRow(0);

        SXSSFRow headRow = createHeadRow(sheet,fileName,20);

        SXSSFRow secondRow = createCostLossSecondRow(sheet);
        createCostLossBody(sheet,outputData);
        finallyExportExcel(wb,response,fileName);
    }

    private void createCostLossBody(SXSSFSheet sheet, SchedulePlanNewResult outputData) {
        Integer rowIndex = 2;
        if (outputData != null && outputData.getList()!=null && outputData.getList().size()>0){
            List<SchedulePlanQueryDO> rowList = outputData.getList();
            if (rowList != null && rowList.size() >0){
                for (SchedulePlanQueryDO g : rowList){
                    rowIndex = createGroupData(g,rowIndex,sheet);//创建一行的数据
                }

            }
        }
        SchedulePlanCountDO countDO =null;
		if(outputData !=null ){
			countDO = outputData.getCountDO();
		}
		createGroupTailData(sheet,countDO,rowIndex);//创建最后两行的数据

    }

    private void createGroupTailData(SXSSFSheet sheet, SchedulePlanCountDO countDO, Integer rowIndex) {
        if (countDO == null){
            countDO = new SchedulePlanCountDO();
            countDO.setPeopleNum(0);
            countDO.setStringExpendSum("0.00");
            countDO.setStringSystemIncome("0.00");
            countDO.setStringGrossProfit("0.00");
        }
        SXSSFRow totalRow = sheet.createRow(++rowIndex);
        Cell[] tCells = new Cell[20];
        for (int i=0;i<20;i++){
            tCells[i] = totalRow.createCell(i+1);
            tCells[i].setCellStyle(blueNumberStyle);
        }
        tCells[0].setCellValue("合计");
        tCells[3].setCellValue(countDO.getPeopleNum());
        tCells[4].setCellValue(countDO.getStringSystemIncome());
        tCells[16].setCellValue(countDO.getStringExpendSum());
        tCells[17].setCellValue(countDO.getStringGrossProfit());
        tCells[18].setCellValue(countDO.getGrossRate());
        SXSSFRow titleRow = sheet.createRow(++rowIndex);
        Cell[] ttCells = new Cell[16];
        CellStyle yellowStyle = wb.createCellStyle();
        yellowStyle.cloneStyleFrom(bodyStyle);
        XSSFCellStyle xssfYellowStyle = (XSSFCellStyle) yellowStyle;
        xssfYellowStyle.setFillForegroundColor(new XSSFColor(new Color(255,255,68)));
        xssfYellowStyle.setFillPattern(CellStyle.SOLID_FOREGROUND);
        for (int i=0;i<16;i++){
            ttCells[i] = titleRow.createCell(i+1);
            ttCells[i].setCellStyle(xssfYellowStyle);
        }
        ttCells[0].setCellValue("数据来源:产品订单");
        ttCells[5].setCellValue("数据来源:成本核算表");
        sheet.addMergedRegion(new CellRangeAddress(rowIndex,rowIndex,1,5));
        sheet.addMergedRegion(new CellRangeAddress(rowIndex,rowIndex,6,16));
    }

    private Integer createGroupData(SchedulePlanQueryDO g, Integer rowIndex, SXSSFSheet sheet) {

        SXSSFRow dataRow =  sheet.createRow(++rowIndex);
        Cell[] dCells = new Cell[20];
        for(int i = 0; i< 3;i++){
            dCells[i] = dataRow.createCell(i+1);
            dCells[i].setCellStyle(bodyStyle);
        }
        dCells[3] = dataRow.createCell(4);
        dCells[3].setCellStyle(bodyIntegerStyle);
        dCells[3].setCellValue(g.getPeopleNum());
        for (int i = 4;i<18;i++){
            dCells[i] = dataRow.createCell(i+1);
            dCells[i].setCellStyle(bodyNumberStyle);
        }
        for (int i = 18;i<20;i++){
            dCells[i] = dataRow.createCell(i+1);
            dCells[i].setCellStyle(bodyStyle);
        }
        dCells[0].setCellValue(g.getGroupOrderNo());
        dCells[1].setCellValue(g.getProductName());
        dCells[2].setCellValue(g.getCalendar().format(DateTimeFormatter.ofPattern("MM月dd日")));

        dCells[4].setCellValue(g.getStringhSystemIncome());
        int dCellIndex = 5;
        for (SchedulePlanCateExpendDO c : g.getList()){
            dCells[dCellIndex].setCellValue(c.getStringCateExpend());
            dCellIndex++;
        }
        dCells[16].setCellValue(g.getStringExpendSum());
        dCells[17].setCellValue(g.getStringGrossProfit());
        dCells[18].setCellValue(g.getGrossRate());
        return rowIndex;
    }

    private SXSSFRow createCostLossSecondRow(SXSSFSheet sheet) {
        SXSSFRow menuRow = sheet.createRow(2);
        Cell[] mCells = new Cell[20];
        for (int i = 0; i<20 ; i++){
            mCells[i] = menuRow.createCell(i+1);
            mCells[i].setCellStyle(blueStyle);
            mCells[i].setCellValue(COL_NAME_LOSS_ARRAY[i]);
        }
        return menuRow;
    }

    /**
     * 导出 成本核算表
     * 绘制基本数据前的表头数据
     * @param response
     * @param outputData
     * @throws IOException
     */
    private void beginExportCostAccountingExcel(HttpServletResponse response, ProductCostingAllInformation outputData) throws IOException{
        Integer rowIndex = 6;
        initFirst();
        //创建sheet
        SXSSFSheet sheet = wb.createSheet("产品成本核算表");

        //CellStyle headStyle = POIUtils.initSXSSColumnHeadStyle(wb);
        //空行
        SXSSFRow blankRow = sheet.createRow(0);

        SXSSFRow headRow = createHeadRow(sheet,"产品成本核算表",7);
        SXSSFRow secondRow = createSecondRow(sheet,outputData);
        SXSSFRow thirdRow = createThirdRow(sheet);
        SXSSFRow fourthRow = createFourthRow(sheet,outputData);
        SXSSFRow fifthRow = createFifthRow(sheet,outputData);
        SXSSFRow sixthRow = createSixthRow(sheet,outputData);
        //中间动态数据
        createCostAccountingBody(sheet,outputData,rowIndex);
        //写到 输出流
        finallyExportExcel(wb,response,"产品成本核算表");
    }

    private void createCostAccountingBody(SXSSFSheet sheet, ProductCostingAllInformation outputData, Integer rowIndex) {
        BigDecimal finalMoney = BigDecimal.ZERO;
        BigDecimal unitPriceTotalMoney = BigDecimal.ZERO;
        BigDecimal receptionMoney = BigDecimal.ZERO;
        BigDecimal activityMoney = BigDecimal.ZERO;
        Map<String,BigDecimal> moneyMap = new HashMap<>();
        if (outputData != null){
            List<ProductCostingCategoryInformation> categoryList = outputData.getProductCostingCategoryInformationList();

            moneyMap.put("finalMoney",finalMoney);
            moneyMap.put("unitPriceTotalMoney",unitPriceTotalMoney);
            moneyMap.put("receptionMoney",receptionMoney);
            moneyMap.put("activityMoney",activityMoney);
            if (categoryList != null && categoryList.size()>0){

                int listIndex = 0;
                for (ProductCostingCategoryInformation c : categoryList){
                    rowIndex = createCategoryData(c,rowIndex,listIndex,moneyMap,sheet);
                    listIndex++;
                }
            }
        }

        createCostAccountingTail(moneyMap,rowIndex,sheet);
    }

    private void createCostAccountingTail(Map<String,BigDecimal> moneyMap, Integer rowIndex, SXSSFSheet sheet) {
        SXSSFRow firstRow = sheet.createRow(++rowIndex);
        Cell[] fCells = new Cell[7];
        for ( int i =0 ; i < 7 ; i++ ){
            fCells[i] = firstRow.createCell(i+1);
            fCells[i].setCellStyle(blueBlackNumberStyle);
        }
        fCells[0].setCellValue("成本单价(人OR团)");
        fCells[5].setCellValue(moneyMap.get("unitPriceTotalMoney").doubleValue());
        fCells[6].setCellStyle(bodyStyle);
        sheet.addMergedRegion(new CellRangeAddress(rowIndex,rowIndex,1,5));
        SXSSFRow secondRow = sheet.createRow(++rowIndex);
        Cell[] sCells = new Cell[7];
        for ( int i =0 ; i < 7 ; i++ ){
            sCells[i] = secondRow.createCell(i+1);
            sCells[i].setCellStyle(blueBlackNumberStyle);
        }
        sCells[0].setCellValue("团费总计");
        sCells[5].setCellValue(moneyMap.get("finalMoney").doubleValue());
        sCells[6].setCellStyle(bodyStyle);
        sheet.addMergedRegion(new CellRangeAddress(rowIndex,rowIndex,1,5));

    }

    private Integer createCategoryData(ProductCostingCategoryInformation c, Integer rowIndex, int listIndex, Map<String,BigDecimal> moneyMap, SXSSFSheet sheet) {
        //合并起始行数
        Integer firstRow = ++rowIndex;
        //菜单行
        SXSSFRow menuRow = sheet.createRow(firstRow);
        //依次创建7个单元格
        Cell[] mCells = new Cell[7];
        for ( int i =0 ; i < 7 ; i++ ){
            mCells[i] = menuRow.createCell(i+1);
            mCells[i].setCellStyle(blueStyle);//默认先菜单栏所有都设置为 蓝底白字样式
        }
        mCells[0].setCellStyle(normalStyle);//第一个格子为 白底黑字加粗样式
        mCells[0].setCellValue(c.getCategoryName());
        mCells[1].setCellValue(COL_NAME_ACCOUNTING_ARRAY[listIndex]);//每个不同类目的特殊字段保存在数组中，根据顺序获取
        mCells[2].setCellValue(COL_SHULIANG);
        mCells[3].setCellValue(COL_DANWEI);
        mCells[4].setCellValue(COL_DANJIA);
        mCells[5].setCellValue(COL_XIAOJI);
        mCells[6].setCellValue(COL_BEIZHU);
        BigDecimal tempTotal = BigDecimal.ZERO;
        if (c.getProductCostingCategoryDetailList() != null && c.getProductCostingCategoryDetailList().size()>0){

            for (ProductCostingCategoryDetail cd : c.getProductCostingCategoryDetailList()){
                SXSSFRow dataRow = sheet.createRow(++rowIndex);//每创建一行，行索引加一
                Cell[] dCells = new Cell[7];
                for ( int i =0 ; i < 7 ; i++ ){
                    dCells[i] = dataRow.createCell(i+1);
                }
                dCells[0].setCellStyle(normalStyle);
                dCells[0].setCellValue("");
                dCells[1].setCellStyle(bodyStyle);
                dCells[1].setCellValue(cd.getContent());
                dCells[2].setCellStyle(bodyIntegerStyle);
                dCells[2].setCellValue(cd.getAmount());
                dCells[3].setCellStyle(bodyStyle);
                dCells[3].setCellValue(cd.getUnit()==0?"人":"团");
                dCells[4].setCellStyle(bodyNumberStyle);
                dCells[4].setCellValue(cd.getUnitPrice().doubleValue());
                dCells[5].setCellStyle(bodyNumberStyle);
                moneyMap.put("unitPriceTotalMoney",moneyMap.get("unitPriceTotalMoney").add(cd.getUnitPrice()));
                BigDecimal subTotal = cd.getUnitPrice().multiply(new BigDecimal(cd.getAmount()));
                tempTotal = tempTotal.add(subTotal);
                dCells[5].setCellValue(subTotal.doubleValue());
                dCells[6].setCellStyle(bodyStyle);
                dCells[6].setCellValue(cd.getRemark());
            }

            if (listIndex <= 6){//接待部分费用合计
                moneyMap.put("receptionMoney",moneyMap.get("receptionMoney").add(tempTotal));
                moneyMap.put("finalMoney",moneyMap.get("finalMoney").add(moneyMap.get("receptionMoney")));
            }else if(listIndex <= 9){//活动部分费用合计
                moneyMap.put("activityMoney",moneyMap.get("activityMoney").add(tempTotal));
                moneyMap.put("finalMoney",moneyMap.get("finalMoney").add(moneyMap.get("activityMoney")));
            }else{//加上 第 10 项
                moneyMap.put("finalMoney",moneyMap.get("finalMoney").add(tempTotal));
            }

        }else{
            SXSSFRow dataRow = sheet.createRow(++rowIndex);//每创建一行，行索引加一
            Cell[] dCells = new Cell[7];
            for ( int i =0 ; i < 7 ; i++ ){
                dCells[i] = dataRow.createCell(i+1);
                dCells[i].setCellStyle(bodyStyle);
            }
            dCells[0].setCellStyle(normalStyle);
            dCells[0].setCellValue("");
        }
        //创建 合计 行
        if (listIndex <= 5 ){
            SXSSFRow totalRow = sheet.createRow(++rowIndex);
            Cell[] tCells = new Cell[7];
            for ( int i =0 ; i < 7 ; i++ ){
                tCells[i] = totalRow.createCell(i+1);
                tCells[i].setCellStyle(orangeStyle);
            }
            tCells[0].setCellStyle(normalStyle);
            tCells[0].setCellValue("");
            tCells[1].setCellValue("合计"+(listIndex+1));
            tCells[5].setCellStyle(orangeNumberStyle);
            tCells[5].setCellValue(tempTotal.doubleValue());
            tCells[6].setCellStyle(bodyStyle);
            //合并中间三个格子
            sheet.addMergedRegion(new CellRangeAddress(rowIndex,rowIndex,3,5));
        }else if ((listIndex >= 7 && listIndex <= 8) || listIndex == 10){// 不同之处 在于  合计N  的 N 的值
            SXSSFRow totalRow = sheet.createRow(++rowIndex);
            Cell[] tCells = new Cell[7];
            for ( int i =0 ; i < 7 ; i++ ){
                tCells[i] = totalRow.createCell(i+1);
                tCells[i].setCellStyle(orangeStyle);
            }
            tCells[0].setCellStyle(normalStyle);
            tCells[0].setCellValue("");
            tCells[1].setCellValue("合计"+listIndex);
            tCells[5].setCellStyle(orangeNumberStyle);
            tCells[5].setCellValue(tempTotal.doubleValue());
            tCells[6].setCellStyle(bodyStyle);
            //合并 合计 中间三个格子
            sheet.addMergedRegion(new CellRangeAddress(rowIndex,rowIndex,3,5));
        }
        //合并第一个格子
        sheet.addMergedRegion(new CellRangeAddress(firstRow,rowIndex,1,1));
        if (listIndex == 6){
            //特殊行  接待部分  总计
            SXSSFRow receptionRow = sheet.createRow(++rowIndex);
            Cell[] rCells = new Cell[7];
            for ( int i =0 ; i < 7 ; i++ ){
                rCells[i] = receptionRow.createCell(i+1);
                rCells[i].setCellStyle(bodyStyle);
            }
            rCells[0].setCellValue("接待部分费用合计(1-7项)");
            rCells[5].setCellStyle(bodyNumberStyle);
            rCells[5].setCellValue(moneyMap.get("receptionMoney").doubleValue());
            sheet.addMergedRegion(new CellRangeAddress(rowIndex,rowIndex,1,5));
        }else if (listIndex == 9){
            //特殊行  活动部分  总计
            SXSSFRow activityRow = sheet.createRow(++rowIndex);
            Cell[] aCells = new Cell[7];
            for ( int i =0 ; i < 7 ; i++ ){
                aCells[i] = activityRow.createCell(i+1);
                aCells[i].setCellStyle(bodyStyle);
            }
            aCells[0].setCellValue("活动部分费用合计(8-10项)");
            aCells[5].setCellStyle(bodyNumberStyle);
            aCells[5].setCellValue(moneyMap.get("activityMoney").doubleValue());
            sheet.addMergedRegion(new CellRangeAddress(rowIndex,rowIndex,1,5));
            //特殊行  以上部分  总计
            SXSSFRow specialRow = sheet.createRow(++rowIndex);
            Cell[] sCells = new Cell[7];
            for ( int i =0 ; i < 7 ; i++ ){
                sCells[i] = specialRow.createCell(i+1);
                sCells[i].setCellStyle(bodyStyle);
            }
            sCells[0].setCellValue("以上费用小计(1-10项)");
            sCells[5].setCellStyle(bodyNumberStyle);
            sCells[5].setCellValue((moneyMap.get("receptionMoney").add(moneyMap.get("activityMoney"))).doubleValue());
            sheet.addMergedRegion(new CellRangeAddress(rowIndex,rowIndex,1,5));
        }

        return rowIndex;
    }

	private SXSSFRow createSixthRow(SXSSFSheet sheet,
			ProductCostingAllInformation outputData) {
		SXSSFRow row = sheet.createRow(6);
		Cell[] cells = new Cell[7];
		for (int i = 0; i < 7; i++) {
			cells[i] = row.createCell(i + 1);
			cells[i].setCellStyle(normalStyle);
		}
		cells[0].setCellValue("价格适用期");
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		String sb = "时间段 " + (outputData.getBeginTime()==null?"":sdf.format(outputData.getBeginTime())) + "~~~"
				+ (outputData.getEndTime()==null?"":sdf.format(outputData.getEndTime()));
		cells[1].setCellValue(sb);
		cells[6].setCellValue("日历方式可选");
		sheet.addMergedRegion(new CellRangeAddress(6, 6, 2, 6));
		return row;
	}

    private SXSSFRow createFifthRow(SXSSFSheet sheet, ProductCostingAllInformation outputData) {
        SXSSFRow row = sheet.createRow(5);
        Cell[] cells = new Cell[7];
        for (int i =0;i<7;i++){
            cells[i] = row.createCell(i+1);
            cells[i].setCellStyle(normalStyle);
        }
        cells[0].setCellValue("领队/全陪是否免");
        Byte isExempt =  outputData.getIsExempt();
        if (isExempt != null && isExempt.byteValue() == 1){
            cells[1].setCellValue("是");
        }else{
            cells[1].setCellValue("否");
        }
        //cells[6].setCellStyle(bodyNumberStyle);
        cells[6].setCellValue(outputData.getIsExemptExplain());
        sheet.addMergedRegion(new CellRangeAddress(5,5,2,6));
        return row;
    }

	private SXSSFRow createFourthRow(SXSSFSheet sheet,
			ProductCostingAllInformation outputData) {
		SXSSFRow row = sheet.createRow(4);
		Cell[] cells = new Cell[7];
		for (int i = 0; i < 7; i++) {
			cells[i] = row.createCell(i + 1);
			if (i == 0) {
				cells[i].setCellStyle(normalStyle);
			} else {
				cells[i].setCellStyle(bodyStyle);
			}
		}
		cells[0].setCellValue("核算人数");
		cells[1].setCellValue(outputData.getPeopleNum()==null?0:outputData.getPeopleNum());
		cells[6].setCellValue(outputData.getPeopleNumExplain());
		sheet.addMergedRegion(new CellRangeAddress(4, 4, 2, 6));
		return row;
	}

    private SXSSFRow createThirdRow(SXSSFSheet sheet) {
        SXSSFRow row = sheet.createRow(3);
        Cell[] cells = new Cell[7];
        for (int i =0;i<7;i++){
            cells[i] = row.createCell(i+1);
            cells[i].setCellStyle(blueStyle);
        }
        cells[0].setCellValue("费用类型");
        cells[1].setCellValue("项目");
        cells[2].setCellValue("价格明细(RMB)");
        cells[6].setCellValue("报价说明");
        sheet.addMergedRegion(new CellRangeAddress(3,3,3,6));
        return row;
    }

    private SXSSFRow createSecondRow(SXSSFSheet sheet, ProductCostingAllInformation outputData) {
        SXSSFRow row = sheet.createRow(2);
        Cell[] cells = new Cell[7];
        for (int i =0;i<7;i++){
            cells[i] = row.createCell(i+1);
            cells[i].setCellStyle(normalStyle);
        }
        cells[0].setCellValue("产品名称");
        cells[1].setCellValue(outputData.getProductName());
        sheet.addMergedRegion(new CellRangeAddress(2,2,2,7));
        return row;
    }

    /**
     * 生成第一行
     * @param sheet
     * @return
     */
    private SXSSFRow createHeadRow(SXSSFSheet sheet,String headName,int colNum) {
        SXSSFRow headRow = sheet.createRow(1);
        Cell headCell = headRow.createCell(1);
        headCell.setCellValue(headName);
        headCell.setCellStyle(headStyle);
        sheet.addMergedRegion(new CellRangeAddress(1,1,1,colNum));
        for ( int i = 2 ; i <= colNum ; i++ ){
            headRow.createCell(i).setCellStyle(headStyle);
        }
        return headRow;
    }

    /**
     * 最终导出 excel 到 输出流中
     * @param wb
     * @param response
     * @throws IOException
     */
    private void finallyExportExcel(SXSSFWorkbook wb,HttpServletResponse response,String fileName) throws IOException{
        OutputStream out = null;
        try {
            //否则，直接写到输出流中
            out = response.getOutputStream();
            response.setContentType("application/vnd.ms-excel;charset=UTF-8");
            response.setCharacterEncoding("utf-8");
            response.setHeader("Content-Disposition", "attachment;filename="+new String(fileName.getBytes("gbk"), "iso8859-1")+".xlsx");
            wb.write(out);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (out != null){
                out.close();
            }
        }
    }

    private void initFirst() {
        wb = new SXSSFWorkbook();
        //表头样式
        headStyle = createHeadCellStyle(wb);
        //蓝底白字样式
        blueStyle = createBlueWhiteCellStyle(wb,false,false);
        blueNumberStyle = createBlueWhiteCellStyle(wb,true,false);
        //蓝底黑字
        blueBlackNumberStyle = createBlueWhiteCellStyle(wb,true,true);
        //橙底黑字样式
        orangeStyle = createOrangeBlackStyle(wb,false);
        orangeNumberStyle = createOrangeBlackStyle(wb,true);
        //基本标签样式
        normalStyle = createNormalCellStyle(wb,false, true, true);
        //数据内容样式
        bodyStyle = createNormalCellStyle(wb,true,false, true);
        bodyNumberStyle = createNormalCellStyle(wb,true,true,false);
        bodyIntegerStyle = createNormalCellStyle(wb,true,false,true);
    }

    /**
     * 橘黑样式
     * @param wb
     * @param isNumber
     * @return
     */
    private  XSSFCellStyle createOrangeBlackStyle(SXSSFWorkbook wb, boolean isNumber) {
        // 橙底黑字样式
        CellStyle orangeStyle = wb.createCellStyle();
        orangeStyle.cloneStyleFrom(headStyle);
        XSSFCellStyle xssfOrangeStyle = (XSSFCellStyle) orangeStyle;
        //定义前景色
        xssfOrangeStyle.setFillForegroundColor(new XSSFColor(new Color(251,176,137)));
        xssfOrangeStyle.setFillPattern(CellStyle.SOLID_FOREGROUND);
        XSSFFont xssfBlackFont = (XSSFFont) wb.createFont();
        //定义黑色字体
        xssfBlackFont.setFontName("微软雅黑 Light");
        xssfBlackFont.setFontHeightInPoints((short) 10);
        xssfBlackFont.setColor(IndexedColors.BLACK.getIndex());
        //设置粗体
        xssfBlackFont.setBoldweight(XSSFFont.BOLDWEIGHT_BOLD);
        xssfOrangeStyle.setFont(xssfBlackFont);
        xssfOrangeStyle.setBorderTop(CellStyle.BORDER_THIN);
        xssfOrangeStyle.setBorderLeft(CellStyle.BORDER_THIN);
        xssfOrangeStyle.setBorderRight(CellStyle.BORDER_THIN);
        xssfOrangeStyle.setBorderBottom(CellStyle.BORDER_THIN);
        if (isNumber){
            DataFormat df = wb.createDataFormat();
            xssfOrangeStyle.setDataFormat(df.getFormat("#,##0.00"));
        }
        //水平居中
        xssfOrangeStyle.setAlignment(CellStyle.ALIGN_CENTER);
        //垂直居中
        xssfOrangeStyle.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
        return xssfOrangeStyle;
    }

    /**
     * 蓝白样式
     * @param wb
     * @param isNumber
     * @return
     */
    private  XSSFCellStyle createBlueWhiteCellStyle(SXSSFWorkbook wb, boolean isNumber,boolean isTail){
        // 蓝底白字样式
        CellStyle blueStyle = wb.createCellStyle();
        blueStyle.cloneStyleFrom(headStyle);
        XSSFCellStyle xssfBlueStyle = (XSSFCellStyle) blueStyle;
        //定义前景色
        xssfBlueStyle.setFillForegroundColor(new XSSFColor(new Color(137,169,216)));
        xssfBlueStyle.setFillPattern(CellStyle.SOLID_FOREGROUND);
        XSSFFont xssfWhiteFont = (XSSFFont) wb.createFont();
        //定义白色字体
        xssfWhiteFont.setFontName("微软雅黑 Light");
        xssfWhiteFont.setFontHeightInPoints((short) 10);
        if (isTail){
            xssfWhiteFont.setColor(IndexedColors.BLACK.getIndex());
        }else{
            xssfWhiteFont.setColor(IndexedColors.WHITE.getIndex());
        }
        //设置粗体
        xssfWhiteFont.setBoldweight(XSSFFont.BOLDWEIGHT_BOLD);
        xssfBlueStyle.setFont(xssfWhiteFont);
        xssfBlueStyle.setBorderTop(CellStyle.BORDER_THIN);
        xssfBlueStyle.setBorderLeft(CellStyle.BORDER_THIN);
        xssfBlueStyle.setBorderRight(CellStyle.BORDER_THIN);
        xssfBlueStyle.setBorderBottom(CellStyle.BORDER_THIN);

        if (isNumber){
            DataFormat df = wb.createDataFormat();
            xssfBlueStyle.setDataFormat(df.getFormat("#0.00"));
        }
        //水平居中
        xssfBlueStyle.setAlignment(CellStyle.ALIGN_CENTER);
        //垂直居中
        xssfBlueStyle.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
        return xssfBlueStyle;
    }

    /**
     * 普通样式
     * @param wb
     * @param isBody
     * @param isNumber
     * @param isInteger
     * @return
     */
    private  XSSFCellStyle createNormalCellStyle(SXSSFWorkbook wb, boolean isBody, boolean isNumber, boolean isInteger){
        // 白底黑字样式
        CellStyle normalStyle = wb.createCellStyle();
        normalStyle.cloneStyleFrom(headStyle);
        XSSFCellStyle xssfNormalStyle = (XSSFCellStyle) normalStyle;

        XSSFFont xssfBlackFont = (XSSFFont) wb.createFont();
        xssfBlackFont.setFontName("微软雅黑 Light");
        //定义黑色字体
        xssfBlackFont.setColor(IndexedColors.BLACK.getIndex());
        xssfBlackFont.setFontHeightInPoints((short) 10);
        //设置粗体
        if (!isBody){//非正文内容设置 粗体
            xssfBlackFont.setBoldweight(XSSFFont.BOLDWEIGHT_BOLD);
        }
        xssfNormalStyle.setFont(xssfBlackFont);
        xssfNormalStyle.setBorderTop(CellStyle.BORDER_THIN);
        xssfNormalStyle.setBorderLeft(CellStyle.BORDER_THIN);
        xssfNormalStyle.setBorderRight(CellStyle.BORDER_THIN);
        xssfNormalStyle.setBorderBottom(CellStyle.BORDER_THIN);

        if (isNumber){
            DataFormat df = wb.createDataFormat();
            xssfNormalStyle.setDataFormat(df.getFormat("#,##0.00"));
        }
        if (isInteger){
            DataFormat df = wb.createDataFormat();
            xssfNormalStyle.setDataFormat(df.getFormat("#0"));
        }
        //水平居中
        xssfNormalStyle.setAlignment(CellStyle.ALIGN_CENTER);
        //垂直居中
        xssfNormalStyle.setVerticalAlignment(CellStyle.VERTICAL_CENTER);
        return xssfNormalStyle;
    }

    private  CellStyle createHeadCellStyle(SXSSFWorkbook wb){

        CellStyle headStyle = wb.createCellStyle();
        Font font = wb.createFont();
        font.setFontName("微软雅黑 Light");
        font.setFontHeightInPoints((short) 11);

        headStyle.setFont(font);

        headStyle.setBorderTop(CellStyle.BORDER_THIN);
        headStyle.setBorderLeft(CellStyle.BORDER_THIN);
        headStyle.setBorderRight(CellStyle.BORDER_THIN);
        headStyle.setBorderBottom(CellStyle.BORDER_THIN);

        //headStyle.setBorderLeft(CellStyle.BORDER_THIN);
        //水平居中
        headStyle.setAlignment(CellStyle.ALIGN_CENTER);
        //垂直居中
        headStyle.setVerticalAlignment(CellStyle.VERTICAL_CENTER);

        return headStyle;
    }

    @GetMapping("/selectNewestCostUnitPriceByProductId/{productId}")
    @ResponseBody
    public ResultBean selectNewestCostUnitPriceByProductId(@PathVariable Long productId){
        StringBuffer url = new StringBuffer(controllCenterUrl)
                .append("productCosting/selectNewestCostUnitPriceByProductId/").append(productId);
        return restTemplate
                .getForEntity(url.toString(), ResultBean.class).getBody();
    }
}
