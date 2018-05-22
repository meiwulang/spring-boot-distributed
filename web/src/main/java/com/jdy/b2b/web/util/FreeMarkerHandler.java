package com.jdy.b2b.web.util;

import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.Version;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.io.Writer;
import java.util.Map;

import static java.net.URLEncoder.encode;

/**
 * @Description freemarker word 导出功能
 * @Author yyf
 * @DateTime 2017/9/7 15:18
 */
@Component
public class FreeMarkerHandler {

    protected final Logger logger = LoggerFactory.getLogger(this.getClass());
    private Configuration configuration = null;

    public FreeMarkerHandler() throws IOException {
        configuration = new Configuration(new Version("2.3.23"));
        configuration.setDefaultEncoding("utf-8");
        configuration.setClassForTemplateLoading(this.getClass(), "/templates/ftl");
    }

    public void createDoc(Map<String, Object> dataMap, String templateName, String exportName, HttpServletResponse response) throws UnsupportedEncodingException {
        // 清空response
        response.reset();
        // 设置response的Header
        response.setContentType("application/msword;charset=UTF-8");
        response.addHeader("Content-Disposition", "attachment;filename=" + encode(exportName, "UTF-8"));
        Writer writer;
        try {
            Template t = configuration.getTemplate(templateName);
            writer = new OutputStreamWriter(response.getOutputStream());
            t.process(dataMap, writer);
        } catch (Exception e) {
            logger.error("导出模板文档【"+exportName+"】失败！", e);
        }
    }
}
