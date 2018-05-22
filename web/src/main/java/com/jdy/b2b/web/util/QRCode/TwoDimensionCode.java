package com.jdy.b2b.web.util.QRCode;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;

import javax.imageio.ImageIO;

import com.jdy.b2b.web.service.CommonService;
import com.jdy.b2b.web.util.RandomStringUtil;
import com.swetake.util.Qrcode;

import jp.sourceforge.qrcode.QRCodeDecoder;
import jp.sourceforge.qrcode.exception.DecodingFailedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Created by zhangfofa on 2017/10/9.
 */

@Service
public class TwoDimensionCode {
    @Autowired
    private CommonService commonService;

    /**
     * 生成二维码(QRCode)图片
     * @param content 存储内容
     * @param imgPath 图片路径
     * @param imgType 图片类型
     * @param size 二维码尺寸
     */
    public String encoderQRCode(String content, String imgPath, String imgName, String imgType, int size) {
        try {
            BufferedImage bufImg =this.qRCodeCommon(content, imgType, size);

            File imgFile = new File(imgPath+imgName);
            // 生成二维码QRCode图片
            ImageIO. write(bufImg, imgType , imgFile);
            InputStream is = new FileInputStream(imgFile);
            String url = commonService.uploadFile(is, imgName);
            if(imgFile.exists()) {
                imgFile.delete();
            }
            return url;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 生成二维码(QRCode)图片的公共方法
     * @param content 存储内容
     * @param imgType 图片类型
     * @param size 二维码尺寸
     * @return
     */
    private BufferedImage qRCodeCommon(String content, String  imgType, int size) {
        BufferedImage bufImg = null;
        try {
            Qrcode qrcodeHandler = new Qrcode();
            // 设置二维码排错率，可选L(7%)、M(15%)、Q(25%)、H(30%)，排错率越高可存储的信息越少，但对二维码清晰度的要求越小
            qrcodeHandler.setQrcodeErrorCorrect( 'M');
            qrcodeHandler.setQrcodeEncodeMode( 'B');
            // 设置设置二维码尺寸，取值范围1-40，值越大尺寸越大，可存储的信息越大
            qrcodeHandler.setQrcodeVersion(size);
            // 获得内容的字节数组，设置编码格式
            byte[] contentBytes = content.getBytes( "utf-8");
            // 图片尺寸
            int imgSize = 67 + 12 * (size - 1);
            bufImg = new BufferedImage(imgSize, imgSize, BufferedImage.TYPE_INT_RGB );
            Graphics2D gs = bufImg.createGraphics();
            // 设置背景颜色
            gs.setBackground(Color. WHITE);
            gs.clearRect(0, 0, imgSize, imgSize);

            // 设定图像颜色> BLACK
            gs.setColor(Color. BLACK);
            // 设置偏移量，不设置可能导致解析出错
            int pixoff = 2;
            // 输出内容> 二维码
            if (contentBytes. length > 0 && contentBytes.length < 800) {
                boolean[][] codeOut = qrcodeHandler.calQrcode(contentBytes);
                for ( int i = 0; i < codeOut. length; i++) {
                    for ( int j = 0; j < codeOut. length; j++) {
                        if (codeOut[j][i]) {
                            gs.fillRect(j * 3 + pixoff, i * 3 + pixoff, 3, 3);
                        }
                    }
                }
            } else {
                throw new Exception( "QRCode content bytes  length = " + contentBytes. length + " not in [0, 800].");
            }
            gs.dispose();
            bufImg.flush();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return bufImg;
    }
}