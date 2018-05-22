package com.jdy.b2b.api.common;

import org.apache.commons.codec.binary.Base64;
import sun.misc.BASE64Decoder;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;

public class Base64Util {
    /**
     * @param bytes
     * @return
     */
    public static byte[] decode(final byte[] bytes) {
        return Base64.decodeBase64(bytes);
    }

    /**
     * 二进制数据编码为BASE64字符串
     *
     * @param
     * @return
     * @throws Exception
     */
    public static String encode(String source) throws UnsupportedEncodingException {
        return new String(Base64.encodeBase64(source.getBytes("UTF-8")), "UTF-8");
    }

    public static String decode(String source) throws UnsupportedEncodingException {
        return new String(Base64.decodeBase64(source.getBytes("UTF-8")), "UTF-8");
    }

    public static InputStream base64ToInputStream(String imgStr) {   //对字节数组字符串进行Base64解码并生成图片
        if (imgStr == null) //图像数据为空
            return null;
        BASE64Decoder decoder = new BASE64Decoder();
        imgStr = imgStr.replace("data:image/jpeg;base64,","").replace("data:image/png;base64,","").replace("data:image/png;jpg,","").replace("data:image/bmp;base64,","").replace("data:image/gif;base64,","");
        try {
            //Base64解码
            byte[] b = decoder.decodeBuffer(imgStr);

            for(int i=0;i<b.length;++i)
            {
                if(b[i]<0)
                {//调整异常数据
                    b[i]+=256;
                }
            }

            InputStream inputStream = new ByteArrayInputStream(b);

            return inputStream;
        } catch (Exception e) {
            return null;
        }
    }
}
