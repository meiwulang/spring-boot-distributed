package com.jdy.b2b.web.util;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.streaming.SXSSFCell;
import org.apache.poi.xssf.streaming.SXSSFRow;
import org.apache.poi.xssf.streaming.SXSSFSheet;
import org.apache.poi.xssf.streaming.SXSSFWorkbook;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.*;
import java.util.regex.Pattern;

/**
 * excel 处理工具类
 *
 * @author yzChen
 * @date 2016年12月18日 下午2:00:20
 */
public class ExcelUtil {
	private static final	Pattern NUMBER_PATTERN = Pattern.compile("[-]?[\\d.]+");
	public static void main(String[] args) {
		String filePath = "D:/order.xls";
		List<String> title = Arrays.asList("ID", "OrderNo");
		List<List> contents = Arrays.asList(Arrays.asList(1, "订单1"),
				Arrays.asList(2, "订单2"));
		try {
			ExcelUtil.export(filePath, "订单", title, contents);
		} catch (Exception e) {
			e.printStackTrace();
		}

		System.out.println("------------------------------------------");

		List<Map<String, Object>> impList;
		try {
			impList = ExcelUtil.imp(filePath, title);
			impList.forEach(System.out::println);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * excel导入
	 *
	 * @param keys
	 *            字段名称数组，如 ["id", "name", ... ]
	 * @param filePath
	 *            文件物理地址
	 * @return
	 * @author yzChen
	 * @date 2016年12月18日 下午2:46:51
	 */
	public static List<Map<String, Object>> imp(String filePath,
			List<String> keys) throws Exception {
		List<Map<String, Object>> list = new ArrayList<>();
		Map<String, Object> map = new HashMap<>();

		if (null == keys) {
			throw new Exception("keys can not be null!");
		}

		if (!filePath.endsWith(".xls") && !filePath.endsWith(".xlsx")) {
			throw new Exception("The file is not excel document!");
		}

		// 读取文件
		FileInputStream fis = null;
		Workbook wookbook = null;
		try {

			fis = new FileInputStream(filePath);
			if (filePath.endsWith(".xls")) {
				wookbook = new HSSFWorkbook(fis);
			} else if (filePath.endsWith(".xlsx")) {
				wookbook = new XSSFWorkbook(fis);
			}

			// 获取第一个工作表信息
			Sheet sheet = wookbook.getSheetAt(0);

			// 获得数据的总行数
			int totalRowNum = sheet.getLastRowNum();

			// 获得表头
			Row rowHead = sheet.getRow(0);
			// 获得表头总列数
			int cols = rowHead.getPhysicalNumberOfCells();

			// 传入的key数组长度与表头长度不一致
			if (keys.size() != cols) {
				throw new Exception(
						"keys length does not match head row's cols!");
			}

			Row row = null;
			Cell cell = null;
			Object value = null;
			// 遍历所有行
			for (int i = 1; i <= totalRowNum; i++) {
				// 清空数据，避免遍历时读取上一次遍历数据
				row = null;
				cell = null;
				value = null;
				map = new HashMap<String, Object>();

				row = sheet.getRow(i);
				if (null == row)
					continue; // 若该行第一列为空，则默认认为该行就是空行

				// 遍历该行所有列
				for (short j = 0; j < cols; j++) {
					cell = row.getCell(j);
					if (null == cell)
						continue; // 为空时，下一列

					// 根据poi返回的类型，做相应的get处理
					if (Cell.CELL_TYPE_STRING == cell.getCellType()) {
						value = cell.getStringCellValue();
					} else if (Cell.CELL_TYPE_NUMERIC == cell.getCellType()) {
						value = cell.getNumericCellValue();

						// 由于日期类型格式也被认为是数值型，此处判断是否是日期的格式，若时，则读取为日期类型
						if (cell.getCellStyle().getDataFormat() > 0) {
							value = cell.getDateCellValue();
						}
					} else if (Cell.CELL_TYPE_BOOLEAN == cell.getCellType()) {
						value = cell.getBooleanCellValue();
					} else if (Cell.CELL_TYPE_BLANK == cell.getCellType()) {
						value = cell.getDateCellValue();
					} else {
						throw new Exception(
								"At row: %s, col: %s, can not discriminate type!");
					}

					map.put(keys.get(j), value);
				}

				list.add(map);
			}
		} catch (Exception e) {
			throw new Exception("analysis excel exception!", e);
		} finally {
			if (null != fis) {
				fis.close();
			}
		}

		return list;
	}

	private static SXSSFWorkbook createWorkBook(String sheetName,
			List<String> titles, List<List> contents) throws Exception {

		SXSSFWorkbook wb = new SXSSFWorkbook();
		SXSSFSheet sheet = null;

		// 对每个表生成一个新的sheet,并以表名命名
		if (sheetName == null) {
			sheetName = "sheet1";
		}
		sheet = wb.createSheet(sheetName);
		sheet.setDefaultColumnWidth(10*256);
		// 设置表头的说明
		SXSSFRow topRow = sheet.createRow(0);
		for (int i = 0; i < titles.size(); i++) {
			setCellGBKValue(topRow.createCell(i), titles.get(i));
			sheet.setColumnWidth(i, titles.get(i).getBytes().length*258);
		}

        XSSFCellStyle wrapStyle = (XSSFCellStyle)wb.createCellStyle();
        wrapStyle.setWrapText(true);// 设置单元格内容是否自动换行

        Map columnWidth = new HashMap<Integer,Integer>();
		for (int i = 0; i < contents.size(); i++) {
			List one = contents.get(i);
			SXSSFRow row = sheet.createRow(i + 1);
			int height = 1;//行高
			for (int j = 0; j < titles.size(); j++) {
				Object cellValue = one.get(j);
				/**
				 * 数字按照数字样式处理
				 * 2018/1/18
				 * 王斌
				 */
				if(cellValue == null){
					setCellGBKValue(row.createCell(j),"");
				} else {
					String cellStringValue = cellValue.toString();
                    SXSSFCell cell = row.createCell(j);
                    if(NUMBER_PATTERN.matcher(cellStringValue).matches()&&cellStringValue.length()<11){//非11位的数字、设置数字格式
							setCellGBKValue(cell,Double.valueOf(cellStringValue));
					}else{
						setCellGBKValue(cell,cellStringValue);
					}
					if(cellStringValue.length()>4){//内容长度大于4做自适应处理
						int width = (cellStringValue.getBytes().length + 4)*256;
                        sheet.setColumnWidth(j, width<3000?3000:width<255*256?width:6000);
                        int old = columnWidth.get(j) != null? (int) columnWidth.get(j) :0;
                        if(width > old) {
                            columnWidth.put(j, width);
                            sheet.setColumnWidth(j, width<3000?3000:width<255*256?width:60000);
                        }
					}
					if(cellStringValue.contains("\n")) {
					    cell.setCellStyle(wrapStyle);
					    int newH = StringUtils.countMatches(cellStringValue,"\n")+1;
                        if(height < newH) {
                            height = newH;
                        }
                    }
				}
				if(height != 1)
				    row.setHeightInPoints(height*20);
			}
		}
		//设置合计信息
		if(Boolean.TRUE.equals(DataContext.get("isOrderReport"))){
			DataContext.remove("isOrderReport");
			int rownum = contents.size() + 1;
			SXSSFRow lastRow = sheet.createRow(rownum);
			lastRow.createCell(15+1);
			lastRow.createCell(16+1);
			lastRow.createCell(17+1);
			lastRow.createCell(18+1);
			lastRow.createCell(19+1);
			lastRow.createCell(20+1);
			lastRow.createCell(21+1);
			lastRow.createCell(30+2);
			lastRow.createCell(31+2);
			lastRow.createCell(32+2);
			lastRow.getCell(15+1).setCellFormula(new StringBuilder("sum(Q2:Q").append(rownum).append(")").toString());
			lastRow.getCell(16+1).setCellFormula(new StringBuilder("sum(R2:R").append(rownum).append(")").toString());
			lastRow.getCell(17+1).setCellFormula(new StringBuilder("sum(S2:S").append(rownum).append(")").toString());
			lastRow.getCell(18+1).setCellFormula(new StringBuilder("sum(T2:T").append(rownum).append(")").toString());
			lastRow.getCell(19+1).setCellFormula(new StringBuilder("sum(U2:U").append(rownum).append(")").toString());
			lastRow.getCell(20+1).setCellFormula(new StringBuilder("sum(V2:V").append(rownum).append(")").toString());
			lastRow.getCell(21+1).setCellFormula(new StringBuilder("sum(W2:W").append(rownum).append(")").toString());
			lastRow.getCell(30+2).setCellFormula(new StringBuilder("sum(AG2:AG").append(rownum).append(")").toString());
			lastRow.getCell(31+2).setCellFormula(new StringBuilder("sum(AH2:AH").append(rownum).append(")").toString());
			lastRow.getCell(32+2).setCellFormula(new StringBuilder("sum(AI2:AI").append(rownum).append(")").toString());
		}
		return wb;
	}

//	/** 
//	 * @Description: 自适应宽度
//	 * @author 王斌
//	 * @date 2018年1月18日 上午10:39:51
//	 * @param cellStyle
//	 * @param cell
//	 */
//	private static final void setStyle(CellStyle cellStyle, SXSSFCell cell) {
//		cell.setCellStyle(cellStyle);
//
//	}
	
	/**
	 * excel导出
	 *
	 * @param fileNamePath
	 *            导出的文件名称
	 * @param sheetName
	 *            导出的sheet名称
	 * @param titles
	 *            第一行表头
	 * @param contents
	 *            数据集合
	 * @return
	 * @throws Exception
	 * @author yzChen
	 * @date 2017年5月6日 下午3:53:47
	 */
	public static <T> File export(String fileNamePath, String sheetName,
			List<String> titles, List<List> contents) throws Exception {

		SXSSFWorkbook wb = createWorkBook(sheetName, titles, contents);
		File file = null;
		OutputStream os = null;
		file = new File(fileNamePath);
		try {
			os = new FileOutputStream(file);
			wb.write(os);
		} catch (Exception e) {
			throw new Exception("write excel file error!", e);
		} finally {
			if (null != os) {
				os.flush();
				os.close();
			}
		}
		return file;
	}

	public static void export(String fileName, String sheetName,
			List<String> titles, List<List> contents,
			HttpServletResponse response) throws Exception {
		try {
			SXSSFWorkbook wb = createWorkBook(sheetName, titles, contents);
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
			wb.write(baos);
			baos.flush();
			byte[] aa = baos.toByteArray();
			response.addHeader("Content-Disposition",
					"attachment;filename=" + fileName + ".xlsx");
			response.setHeader("Content-Type", "application/vnd.ms-excel");
			response.setCharacterEncoding("UTF-8");
			response.getOutputStream().write(aa);
			response.setContentLength(aa.length);
		} catch (Exception e) {
			throw new Exception("write excel to stream error!", e);
		} finally {
			if (response.getOutputStream() != null) {
				response.getOutputStream().flush();
			}
		}
	}

	private static void setCellGBKValue(SXSSFCell cell, String value) {
		cell.setCellType(HSSFCell.CELL_TYPE_STRING);
		cell.setCellValue(value);
	}
	private static void setCellGBKValue(SXSSFCell cell, double value) {
		cell.setCellType(HSSFCell.CELL_TYPE_NUMERIC);
		cell.setCellValue(value);
	}

}
