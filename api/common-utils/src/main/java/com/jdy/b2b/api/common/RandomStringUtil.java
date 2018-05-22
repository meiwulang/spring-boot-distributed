package com.jdy.b2b.api.common;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;

/**
 * Created by zhangfofa on 2017/5/18.
 */
public class RandomStringUtil {

    public static String getString(int length){

        char[] charArray = new char[length];

        for(int i=0;i<length;i++){

            Random r = new Random();
            int n = r.nextInt(123);
            while(n<48 || (n>57 && n<65) || (n>90 && n <97) || n>122){//(!((n>=48 && n<=57) || (n>=65 && n<=90) && (n>=97 && n<=122))){
                n = r.nextInt(123);
            }
            charArray[i] = (char)n ;
        }

        return String.valueOf(charArray) ;

    }

    public static String generateNameAccordingDateAndRandomString(int randomStringLength) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmssSSS");
        String date = sdf.format(new Date());
        return date+getString(randomStringLength);
    }
}
