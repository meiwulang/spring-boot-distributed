package com.jdy.b2b.web.util.excel;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;

import static java.net.URLEncoder.encode;

/**
 * Created by lenovo on 2015/12/14.
 */
public class ExcelUtil {

    public static void excel(ExcelOffice excel, SheetDO sheetDO, String fileName, HttpServletResponse response) {
        try {
            fileName += ".xlsx";
            // 清空response
            response.reset();
            // 设置response的Header
            response.setContentType("application/x-msdownload;charset=UTF-8");
            response.addHeader("Content-Disposition", "attachment;filename=" + encode(fileName, "UTF-8"));
            OutputStream toClient = response.getOutputStream();
            excel.write(sheetDO, toClient);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
