package com.jdy.b2b.api.common;

import org.apache.log4j.Logger;

import java.lang.reflect.Method;

/**
 * Created by ghc on 2017/3/28.
 */
public class DynamicUtil {
   static Logger log = Logger.getLogger(DynamicUtil.class);
    private static final String [] numberMethod ={"addPercent","subPercent","fixed","add","sub"};
    //根据不同算法得到指定值
    public  static double unitAccount(int type, double price,double value){
        if(type<1 || type>5){
            return 0L;
        }
        String method= numberMethod[type-1];
        return  dynamicCompute(method,price,value);
    }
    public static double dynamicCompute(String method,double price,double value){
        log.info("DynamicUtil  ---- >  dynamicCompute ");
        Class c = NumberUtil.class;
        double result =0L;
        try {
            Method number = c.getMethod(method, double.class, double.class);
            Object obj=c.newInstance();
            Object[] arguments = new Object[]{price,value};
            result=(Double)number.invoke(obj , arguments);
            log.info("result--->:"+result);
        }catch (Exception e){
            log.error("DynamicUtil err ---->"+e.getMessage());
        }
        return result;
    }
}
