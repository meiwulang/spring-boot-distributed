package com.jdy.b2b.web.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.aliyun.oss.model.OSSObject;
import com.jdy.b2b.web.aop.MyLogAop;
import com.jdy.b2b.web.config.oss.OSSUtils;
import com.jdy.b2b.web.config.oss.OssConfiguration;
import com.jdy.b2b.web.pojo.posterSettings.PosterSettings;
import com.jdy.b2b.web.service.PosterSettingsService;
import com.jdy.b2b.web.util.BaseService;
import com.jdy.b2b.web.util.Constants;
import com.jdy.b2b.web.util.DateTime;
import com.jdy.b2b.web.util.ResultBean;
import org.apache.commons.lang.SystemUtils;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;

/**
 * Created by dengbo on 2018/1/4.
 */
@Service
public class PosterSettingsServiceImpl extends BaseService implements PosterSettingsService {

    @Autowired
    private OssConfiguration ossConfiguration;

    @Value("${spring.wechat.publicid}")
    private String publicId;

    @Value("${spring.fxUrl}")
    private String fxUrl;

    protected static final org.slf4j.Logger logger = LoggerFactory
            .getLogger(MyLogAop.class);

    @Override
    public ResultBean sendPoster(String orderNo, int flag) {
        logger.error("PosterSettingsServiceImpl  sendPoster   entry  ");
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("orderNo",orderNo);
        StringBuffer url = new StringBuffer(controllCenterUrl).append("poster/sendPoster");
        ResultBean resultBean = restTemplate.postForEntity(url.toString(), jsonObject, ResultBean.class).getBody();
        logger.error("PosterSettingsServiceImpl  sendPoster   url  ====>"+url);
        logger.error("PosterSettingsServiceImpl  sendPoster   url 返回值  "+resultBean);
        if(null!=resultBean && null!=resultBean.getBody()){
            logger.error("PosterSettingsServiceImpl  sendPoster   url body  "+resultBean.getBody());
            List<Object> list = (List<Object>)resultBean.getBody();
            StringBuffer posterUrls = new StringBuffer();
            String openIds = "";
            logger.error("PosterSettingsServiceImpl  sendPoster   url list  "+list.size());
            for(int i=0;i<list.size();i++){
                Object object = list.get(i);
                PosterSettings posterSettings = new PosterSettings();
                if(object instanceof LinkedHashMap){
                    LinkedHashMap map  = (LinkedHashMap)object;
                    String jsonString = new JSONObject(map).toString();
                    posterSettings = JSONObject.parseObject(jsonString,PosterSettings.class);
                }
                String type = posterSettings.getType();
                logger.error("PosterSettingsServiceImpl  sendPoster  posterSettings  type  "+ type);
                if("10".equals(type)){
                    // 0 or 1 推个人
                    if(0 == flag || 1 == flag) {
                        posterUrls.append(getPersonalPoster(posterSettings)).append(",");
                        if (StringUtils.isEmpty(openIds)) {
                            openIds = posterSettings.getOpenIds();
                        }
                    }
                }else if("20".equals(type)){
                    // 0 or 2 推组
                    if(0 == flag || 2 == flag) {
                        posterUrls.append(getGroupPoster(posterSettings)).append(",");
                    }
                }else if("30".equals(type) || "40".equals(type)){
                    // 0 or 3 推分公司
                    if(0 == flag || 3 == flag) {
                        posterUrls.append(getCompanyPoster(posterSettings)).append(",");
                    }
                }

            }
            logger.error("PosterSettingsServiceImpl  sendPoster   posterUrls  "+posterUrls);
            logger.error("PosterSettingsServiceImpl  sendPoster openIds  "+openIds);
            //调用代言接口
            if(!StringUtils.isEmpty(posterUrls) && !StringUtils.isEmpty(openIds)){
                logger.error("PosterSettingsServiceImpl  sendPoster 调用代言接口  ");
                JSONObject param = new JSONObject();
                JSONObject posterJson = new JSONObject();
                posterJson.put("openIds",openIds);
                posterJson.put("publicId",publicId);
                posterJson.put("posterUrls",posterUrls);
                param.put("poster",posterJson);
                logger.error("PosterSettingsServiceImpl  sendPoster 调用代言接口  param ==>"+param.toString());
                restTemplate.postForEntity(fxUrl+"/dypc/zjdyout/sendPosterInSp", param, String.class);
                logger.error("PosterSettingsServiceImpl  sendPoster 调用代言接口  url ==>"+fxUrl+"/dypc/zjdyout/sendPosterInSp");
            }
        }
        return ResultBean.getSuccessResult();
    }

    /**
     * 获得个人喜报oss地址
     * @param posterSettings
     * @return
     */
    public String getPersonalPoster(PosterSettings posterSettings){
        logger.error("PosterSettingsServiceImpl  sendPoster  getPersonalPoster ====>");
        String posterUrl = "";
        try{
            OSSObject ossObject = null;

            //获取当前日期是3月8号
            boolean flag38 = false;
            Date date = new Date();
            Calendar ca = Calendar.getInstance();
            ca.setTime(date);
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy年MM月dd日");

            String st = sdf.format(date);
            int i = ca.get(Calendar.MONTH) + 1;
            int a = ca.get(Calendar.DAY_OF_MONTH);

            logger.info("当前时间：" + st + "-----月份为：" + i + "------日期为：" + a);

            if (i==3 && a==8){
                flag38 = true;
            }
            Color color = new Color(231,0,18);
            if(!flag38){
                ossObject = OSSUtils.getInstance(ossConfiguration).getPrefuxFile(ossConfiguration.getPic(),null,"poster/"+ Constants.PERSONAL_BAK_POSTER_URL+".jpg",false);
            }else{
                logger.info("今天三八节");
                ossObject = OSSUtils.getInstance(ossConfiguration).getPrefuxFile(ossConfiguration.getPic(),null,"poster/"+ Constants.PERSONAL_BAK_POSTER_URL+"_38.jpg",false);
                color = new Color(250, 240, 184);
            }

            logger.error("PosterSettingsServiceImpl sendPoster  getPersonalPoster ossObject====>"+ossObject);
            InputStream inputStream = ossObject.getObjectContent();
            BufferedImage img = ImageIO.read(inputStream);

            Font font = getCustomFont() ;

            String company_name = posterSettings.getCompanyName();
            company_name = (null == company_name ? "" : company_name);

            String group_name = posterSettings.getGroupName();
            String content_head1;
            String content_desc1 = null;
            String content_desc2 = null;
            if(null == posterSettings.getpUserName() || "".equals(posterSettings.getpUserName())){
                content_head1 = posterSettings.getUserName();
            }
            else{
                content_head1 = posterSettings.getpSaleManager();
                if (content_head1.equals(posterSettings.getpUserName())){
                    //上级就是销售经理的情况
                    content_desc1 = "代理" + posterSettings.getUserName();
                }else{
                    content_desc1 = "代理" + posterSettings.getpUserName();
                    content_desc2 = "二级代理" + posterSettings.getUserName();
                }
            }

            String content_product1 = posterSettings.getProductName();
            String content_amount = posterSettings.getAmount().toString();
            if(content_amount.contains(".")){
                content_amount = content_amount.substring(0,content_amount.indexOf("."));
            }
            String unit = "元";
            String date_content = posterSettings.getDate()+"成功出单";

            //获取图片大小
            int width = img.getWidth(null);
            int height = img.getHeight(null);


            int headY = 0;
            int descY = 0;
            int desc2Y = 0;
            int productY = 0;
            int amtY = 0;
            int companyY = 0;
            int dateY = 0;

            if(null == content_desc1 || "".equals(content_desc1)){
                companyY = (int)Math.ceil(height * 0.55);
                headY = (int)Math.ceil(height * 0.6);
                dateY = (int)Math.ceil(height * 0.64);
                productY = (int)Math.ceil(height * 0.68);
                amtY = (int)Math.ceil(height * 0.82);
            }else if(null == content_desc2 || "".equals(content_desc2)){
                companyY = (int)Math.ceil(height * 0.54);
                headY = (int)Math.ceil(height * 0.59);
                descY = (int)Math.ceil(height * 0.63);
                dateY = (int)Math.ceil(height * 0.67);
                productY = (int)Math.ceil(height * 0.71);
                amtY = (int)Math.ceil(height * 0.83);
            }else{
                companyY = (int)Math.ceil(height * 0.54);
                headY = (int)Math.ceil(height * 0.575);
                descY = (int)Math.ceil(height * 0.61);
                desc2Y = (int)Math.ceil(height * 0.635);
                dateY = (int)Math.ceil(height * 0.67);
                productY = (int)Math.ceil(height * 0.70);
                amtY = (int)Math.ceil(height * 0.82);
            }

            String content_head = "";
            if(StringUtils.isEmpty(group_name)){
                content_head = content_head1;
                if(content_head.length()>12){
                    content_head = content_head.substring(0,12);
                }
                font = font.deriveFont(42.0f);
            }else{
                content_head = group_name+"-"+content_head1;
                if(content_head.length()>18){
                    content_head = content_head.substring(0,18);
                    font = font.deriveFont(28.0f);
                }else if(content_head.length()>16){
                    font = font.deriveFont(30.0f);
                }else if(content_head.length()>14){
                    font = font.deriveFont(32.0f);
                }else{
                    font = font.deriveFont(32.0f);
                }
            }
            String content_product_more = "";
            String content_product = "";
            if(!StringUtils.isEmpty(content_product1)&& content_product1.length()>40){
                content_product = content_product1.substring(0,20);
                content_product_more = content_product1.substring(20,40);
            }
            else if(!StringUtils.isEmpty(content_product1)&& content_product1.length()>20){
                content_product = content_product1.substring(0,20);
                content_product_more = content_product1.substring(20,content_product1.length());
            }
            else{
                content_product = content_product1;
            }

            Graphics g = img.getGraphics();

            font = font.deriveFont(Font.BOLD);
            FontMetrics metrics = g.getFontMetrics(font);
            int x= (width-metrics.stringWidth(content_head))/2;
            g.setFont(font);
            g.setColor(color);
            g.drawString(content_head, x, headY);

            if(!StringUtils.isEmpty(company_name)){
                font = font.deriveFont(45.0f);
                metrics = g.getFontMetrics(font);
                x = (width - metrics.stringWidth(company_name)) / 2;
                g.setFont(font);
                g.drawString(company_name, x, companyY);
            }

            font = font.deriveFont(30.0f);
            metrics = g.getFontMetrics(font);
            x = (width - metrics.stringWidth(date_content)) / 2;
            g.setFont(font);
            g.drawString(date_content, x, dateY);

            if(null != content_desc1 && !"".equals(content_desc1)) {
                font = font.deriveFont(30.0f);
                metrics = g.getFontMetrics(font);
                x = (width - metrics.stringWidth(content_desc1)) / 2;
                g.setFont(font);
                g.drawString(content_desc1, x, descY);
            }

            if(null != content_desc2 && !"".equals(content_desc2)) {
                font = font.deriveFont(30.5f);
                metrics = g.getFontMetrics(font);
                x = (width - metrics.stringWidth(content_desc2)) / 2;
                g.setFont(font);
                g.drawString(content_desc2, x, desc2Y);
            }

            font = font.deriveFont(30.0f);
            metrics = g.getFontMetrics(font);
            x = (width-metrics.stringWidth(content_product))/2;
            g.setFont(font);
            g.drawString(content_product, x, productY);


            if(!"".equals(content_product_more)){
                font = font.deriveFont(30.0f);
                metrics = g.getFontMetrics(font);
                x = (width-metrics.stringWidth(content_product_more))/2;
                g.setFont(font);
                g.drawString(content_product_more, x, productY + 35);
            }

            int amoutWidth = 0;
            font = font.deriveFont(100.0f);
            metrics = g.getFontMetrics(font);
            amoutWidth = metrics.stringWidth(content_amount);
            x = (width-amoutWidth)/2;
            g.setFont(font);
            g.drawString(content_amount, x, amtY);

            font = font.deriveFont(30.0f);
            x = x + amoutWidth + 5;
            g.setFont(font);
            g.drawString(unit, x, amtY - 75);

            g.dispose();
            ByteArrayOutputStream os = new ByteArrayOutputStream();
            ImageIO.write(img, "jpg", os);
            InputStream is = new ByteArrayInputStream(os.toByteArray());
            String fileURl = "poster/" + DateTime.currentDate(DateTime.DateFormat1) +"/"+Constants.PERSONAL_BAK_POSTER_URL+"_"+ DateTime.currentTimeMillis()+".jpg";
            String key = OSSUtils.getInstance(ossConfiguration).uploadFile(ossConfiguration.getPic(), fileURl, is);
            posterUrl =  "http://" + ossConfiguration.getPic().concat(".").concat(ossConfiguration.getEndpoint()).concat("/") + key;
            os.flush();
            os.close();
            logger.error("获取个人喜报,喜报oss地址======》"+posterUrl);
        }catch (Exception e){
            logger.error("获取个人喜报报错------>"+e.getMessage());
        }
        return posterUrl;
    }


    /**
     * 获得个人喜报oss地址
     * @param posterSettings
     * @return
     */
    public String getPersonalPoster4Chunjie(PosterSettings posterSettings){
        logger.error("PosterSettingsServiceImpl  sendPoster  getPersonalPoster ====>");
        String posterUrl = "";
        try{
            OSSObject ossObject = OSSUtils.getInstance(ossConfiguration).getPrefuxFile(ossConfiguration.getPic(),null,"poster/"+ Constants.PERSONAL_BAK_POSTER_URL+"_chunjie.jpg",false);
            logger.error("getPersonalPoster4Chunjie  sendPoster  getPersonalPoster ossObject====>"+ossObject);
            InputStream inputStream = ossObject.getObjectContent();
            BufferedImage img = ImageIO.read(inputStream);
            Color color = new Color(248,216,20);

            Font font = getCustomFont() ;

            String company_name = posterSettings.getCompanyName();
            company_name = (null == company_name ? "" : company_name);

            String group_name = posterSettings.getGroupName();
            String content_head1;
            String content_desc1 = null;
            String content_desc2 = null;
            if(null == posterSettings.getpUserName() || "".equals(posterSettings.getpUserName())){
                content_head1 = posterSettings.getUserName();
            }
            else{
                content_head1 = posterSettings.getpSaleManager();
                if (content_head1.equals(posterSettings.getpUserName())){
                    //上级就是销售经理的情况
                    content_desc1 = "代理" + posterSettings.getUserName();
                }else{
                    content_desc1 = "代理" + posterSettings.getpUserName();
                    content_desc2 = "二级代理" + posterSettings.getUserName();
                }
            }

            String content_product1 = posterSettings.getProductName();
            String content_amount = posterSettings.getAmount().toString();
            if(content_amount.contains(".")){
                content_amount = content_amount.substring(0,content_amount.indexOf("."));
            }
            String unit = "元";
            String date_content = posterSettings.getDate()+"成功出单";

            //获取图片大小
            int width = img.getWidth(null);
            int height = img.getHeight(null);


            int headY = 0;
            int descY = 0;
            int desc2Y = 0;
            int productY = 0;
            int amtY = 0;
            int companyY = 0;
            int dateY = 0;

            if(null == content_desc1 || "".equals(content_desc1)){
                companyY = (int)Math.ceil(height * 0.55);
                headY = (int)Math.ceil(height * 0.6);
                dateY = (int)Math.ceil(height * 0.64);
                productY = (int)Math.ceil(height * 0.68);
                amtY = (int)Math.ceil(height * 0.82);
            }else if(null == content_desc2 || "".equals(content_desc2)){
                companyY = (int)Math.ceil(height * 0.54);
                headY = (int)Math.ceil(height * 0.59);
                descY = (int)Math.ceil(height * 0.63);
                dateY = (int)Math.ceil(height * 0.67);
                productY = (int)Math.ceil(height * 0.71);
                amtY = (int)Math.ceil(height * 0.83);
            }else{
                companyY = (int)Math.ceil(height * 0.54);
                headY = (int)Math.ceil(height * 0.575);
                descY = (int)Math.ceil(height * 0.61);
                desc2Y = (int)Math.ceil(height * 0.645);
                dateY = (int)Math.ceil(height * 0.68);
                productY = (int)Math.ceil(height * 0.71);
                amtY = (int)Math.ceil(height * 0.83);
            }

            String content_head = "";
            if(StringUtils.isEmpty(group_name)){
                content_head = content_head1;
                if(content_head.length()>12){
                    content_head = content_head.substring(0,12);
                }
                font = font.deriveFont(42.0f);
            }else{
                content_head = group_name+"-"+content_head1;
                if(content_head.length()>18){
                    content_head = content_head.substring(0,18);
                    font = font.deriveFont(28.0f);
                }else if(content_head.length()>16){
                    font = font.deriveFont(30.0f);
                }else if(content_head.length()>14){
                    font = font.deriveFont(32.0f);
                }else{
                    font = font.deriveFont(32.0f);
                }
            }
            String content_product_more = "";
            String content_product = "";
            if(!StringUtils.isEmpty(content_product1)&& content_product1.length()>40){
                content_product = content_product1.substring(0,20);
                content_product_more = content_product1.substring(20,40);
            }
            else if(!StringUtils.isEmpty(content_product1)&& content_product1.length()>20){
                content_product = content_product1.substring(0,20);
                content_product_more = content_product1.substring(20,content_product1.length());
            }
            else{
                content_product = content_product1;
            }

            Graphics g = img.getGraphics();

            font = font.deriveFont(Font.BOLD);
            FontMetrics metrics = g.getFontMetrics(font);
            int x= (width-metrics.stringWidth(content_head))/2;
            g.setFont(font);
            g.setColor(color);
            g.drawString(content_head, x, headY);

            if(!StringUtils.isEmpty(company_name)){
                font = font.deriveFont(45.0f);
                metrics = g.getFontMetrics(font);
                x = (width - metrics.stringWidth(company_name)) / 2;
                g.setFont(font);
                g.drawString(company_name, x, companyY);
            }

            font = font.deriveFont(30.0f);
            metrics = g.getFontMetrics(font);
            x = (width - metrics.stringWidth(date_content)) / 2;
            g.setFont(font);
            g.drawString(date_content, x, dateY);

            if(null != content_desc1 && !"".equals(content_desc1)) {
                font = font.deriveFont(30.0f);
                metrics = g.getFontMetrics(font);
                x = (width - metrics.stringWidth(content_desc1)) / 2;
                g.setFont(font);
                g.drawString(content_desc1, x, descY);
            }

            if(null != content_desc2 && !"".equals(content_desc2)) {
                font = font.deriveFont(30.5f);
                metrics = g.getFontMetrics(font);
                x = (width - metrics.stringWidth(content_desc2)) / 2;
                g.setFont(font);
                g.drawString(content_desc2, x, desc2Y);
            }

            font = font.deriveFont(30.0f);
            metrics = g.getFontMetrics(font);
            x = (width-metrics.stringWidth(content_product))/2;
            g.setFont(font);
            g.drawString(content_product, x, productY);


            if(!"".equals(content_product_more)){
                font = font.deriveFont(30.0f);
                metrics = g.getFontMetrics(font);
                x = (width-metrics.stringWidth(content_product_more))/2;
                g.setFont(font);
                g.drawString(content_product_more, x, productY + 35);
            }

            int amoutWidth = 0;
            font = font.deriveFont(100.0f);
            metrics = g.getFontMetrics(font);
            amoutWidth = metrics.stringWidth(content_amount);
            x = (width-amoutWidth)/2;
            g.setFont(font);
            g.drawString(content_amount, x, amtY);

            font = font.deriveFont(30.0f);
            x = x + amoutWidth + 5;
            g.setFont(font);
            g.drawString(unit, x, amtY - 75);

            g.dispose();
            ByteArrayOutputStream os = new ByteArrayOutputStream();
            ImageIO.write(img, "jpg", os);
            InputStream is = new ByteArrayInputStream(os.toByteArray());
            String fileURl = "poster/" + DateTime.currentDate(DateTime.DateFormat1) +"/"+Constants.PERSONAL_BAK_POSTER_URL+"_"+ DateTime.currentTimeMillis()+".jpg";
            String key = OSSUtils.getInstance(ossConfiguration).uploadFile(ossConfiguration.getPic(), fileURl, is);
            posterUrl =  "http://" + ossConfiguration.getPic().concat(".").concat(ossConfiguration.getEndpoint()).concat("/") + key;
            os.flush();
            os.close();
            logger.error("获取个人喜报,喜报oss地址======》"+posterUrl);
        }catch (Exception e){
            logger.error("获取个人喜报报错------>"+e.getMessage());
        }
        return posterUrl;
    }
    
    /**
     * 获得销售组喜报oss地址
     * @param posterSettings
     * @return
     */
    public String getGroupPoster(PosterSettings posterSettings){
        logger.error("PosterSettingsServiceImpl  sendPoster  getGroupPoster ====>");
        String posterUrl = "";
        try{
            OSSObject ossObject = OSSUtils.getInstance(ossConfiguration).getPrefuxFile(ossConfiguration.getPic(),null,"poster/"+ Constants.GROUP_BAK_POSTER_URL+".jpg",false);
            InputStream inputStream = ossObject.getObjectContent();
            logger.error("PosterSettingsServiceImpl  sendPoster  getGroupPoster ossObject====>"+ossObject);
            BufferedImage img = ImageIO.read(inputStream);
            Color color = new Color(114,0,0);
            //获取图片大小
            int width = img.getWidth(null);
            int height = img.getHeight(null);

            int headY = (int)Math.ceil(height * 0.6);
            int descY = (int)Math.ceil(height * 0.69);
            int amtY = (int)Math.ceil(height * 0.84);
            int botY = (int)Math.ceil(height * 0.95);

            String content_head = posterSettings.getCompanyName() + posterSettings.getGroupName();
            /*if(!StringUtils.isEmpty(content_head) && content_head.length()>5){
                content_head = content_head.substring(0,4);
            }*/
            String content_desc = posterSettings.getDate()+"突破业绩";
            NumberFormat nf = NumberFormat.getInstance();
            String content_amount = nf.format(posterSettings.getAmount().divide(new BigDecimal(10000)))+"万";
            String content_bottom = "特此祝贺";
            Graphics  g = img.getGraphics();

            Font font = getCustomFont() ;
            font = font.deriveFont(100.0f);
            font = font.deriveFont(Font.BOLD);
            FontMetrics metrics = g.getFontMetrics(font);
            int x= (width-metrics.stringWidth(content_head))/2;
            g.setFont(font);
            g.setColor(color);
            g.drawString(content_head, x, headY);

            font = font.deriveFont(110.0f);
            metrics = g.getFontMetrics(font);
            x = (width-metrics.stringWidth(content_desc))/2;
            g.setFont(font);
            g.drawString(content_desc, x, descY);

            font = font.deriveFont(300.0f);
            metrics = g.getFontMetrics(font);
            x = (width-metrics.stringWidth(content_amount))/2;
            g.setFont(font);
            color = new Color(114,0,0);
            g.setColor(color);
            g.drawString(content_amount, x, amtY);

            font = font.deriveFont(160.0f);
            metrics = g.getFontMetrics(font);
            x = (width-metrics.stringWidth(content_bottom))/2;
            g.setFont(font);
            color = new Color(114,0,0);
            g.setColor(color);
            g.drawString(content_bottom, x, botY);

            g.dispose();

            ByteArrayOutputStream os = new ByteArrayOutputStream();
            ImageIO.write(img, "jpg", os);
            InputStream is = new ByteArrayInputStream(os.toByteArray());
            String fileURl = "poster/" + DateTime.currentDate(DateTime.DateFormat1) +"/"+Constants.GROUP_BAK_POSTER_URL +"_"+ DateTime.currentTimeMillis() +".jpg";
            String key = OSSUtils.getInstance(ossConfiguration).uploadFile(ossConfiguration.getPic(), fileURl, is);
            posterUrl =  "http://" + ossConfiguration.getPic().concat(".").concat(ossConfiguration.getEndpoint()).concat("/") + key;
            os.flush();
            os.close();
            logger.error("获取销售组喜报,喜报oss地址======》"+posterUrl);
        }catch (Exception e){
            logger.error("获取销售组喜报报错------>"+e.getMessage());
        }
        return posterUrl;
    }

    /**
     * 获得公司喜报oss地址
     * @param posterSettings
     * @return
     */
    public String getCompanyPoster(PosterSettings posterSettings){
        String posterUrl = "";
        logger.error("PosterSettingsServiceImpl  sendPoster  getCompanyPoster ====>");
        try{
            OSSObject ossObject = OSSUtils.getInstance(ossConfiguration).getPrefuxFile(ossConfiguration.getPic(),null,"poster/"+ Constants.COMPANY_BAK_POSTER_URL+".jpg",false);
            logger.error("PosterSettingsServiceImpl  sendPoster  getCompanyPoster ossObject====>"+ossObject);
            InputStream inputStream = ossObject.getObjectContent();
            BufferedImage img = ImageIO.read(inputStream);
            Color color = new Color(114,0,0);
            //获取图片大小
            int width = img.getWidth(null);
            int height = img.getHeight(null);

            int headY = (int)Math.ceil(height * 0.63);
            int descY = (int)Math.ceil(height * 0.72);
            int amtY = (int)Math.ceil(height * 0.85);

            String content_head = posterSettings.getCompanyName();
            String content_desc = "本月业绩突破";
            if("30".equals(posterSettings.getType())){
                content_desc = "今日业绩突破";
            }
            NumberFormat nf = NumberFormat.getInstance();
            String content_amount = nf.format(posterSettings.getAmount().divide(new BigDecimal(10000)))+"万";
            Graphics2D  g = img.createGraphics();

            Font font = getCustomFont() ;
            font = font.deriveFont(180.0f);
            font = font.deriveFont(Font.BOLD);
            FontMetrics metrics = g.getFontMetrics(font);
            int x= (width-metrics.stringWidth(content_head))/2;
            g.setFont(font);
            g.setColor(color);
            g.drawString(content_head, x, headY);

            font = font.deriveFont(120.0f);
            metrics = g.getFontMetrics(font);
            x = (width-metrics.stringWidth(content_desc))/2;
            g.setFont(font);
            g.drawString(content_desc, x, descY);

            font = font.deriveFont(260.0f);
            metrics = g.getFontMetrics(font);
            x = (width-metrics.stringWidth(content_amount))/2;
            g.setFont(font);
            g.drawString(content_amount, x, amtY);

            g.dispose();
            ByteArrayOutputStream os = new ByteArrayOutputStream();
            ImageIO.write(img, "jpg", os);
            InputStream is = new ByteArrayInputStream(os.toByteArray());
            String fileURl = "poster/" +  DateTime.currentDate(DateTime.DateFormat1) +"/"+Constants.COMPANY_BAK_POSTER_URL+"_"+ DateTime.currentTimeMillis()+".jpg";
            String key = OSSUtils.getInstance(ossConfiguration).uploadFile(ossConfiguration.getPic(), fileURl, is);
            posterUrl =  "http://" + ossConfiguration.getPic().concat(".").concat(ossConfiguration.getEndpoint()).concat("/") + key;
            os.flush();
            os.close();
            logger.error("获取公司喜报,喜报oss地址======》"+posterUrl);
        }catch (Exception e){
            logger.error("获取公司喜报报错------>"+e.getMessage());
        }
        return posterUrl;
    }

    /**
     * 获取自定义字体
     * @return
     */

    public Font getCustomFont() {
        Font definedFont = null;
            if (SystemUtils.IS_OS_WINDOWS) {
                definedFont = new Font("微软雅黑",Font.BOLD,200);
            } else {
                String fontUrl = "/usr/share/fonts/msyh.ttf";
                InputStream is = null;
                BufferedInputStream bis = null;
                try {
                    is = new FileInputStream(new File(fontUrl));
                    bis = new BufferedInputStream(is);
                    definedFont = Font.createFont(Font.TRUETYPE_FONT, is);
                } catch (FontFormatException e) {
                    e.printStackTrace();
                } catch (IOException e) {
                    e.printStackTrace();
                } finally {
                    try {
                        if (null != bis) {
                            bis.close();
                        }
                        if (null != is) {
                            is.close();
                        }
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
            return definedFont;
    }
}
