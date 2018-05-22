package com.jdy.b2b.api.common;

import java.lang.reflect.Field;
import java.text.SimpleDateFormat;

/**
 * Created by zhangfofa on 2017/6/16.
 */
public class ReflectUtil {
    public static String compare(Object src,Object target) throws Exception{
        StringBuffer compareResult = new StringBuffer();
        Class<?> srcClass = src.getClass();
        Class<?> targetClass = target.getClass();
        Field[] e1Field = srcClass.getDeclaredFields();
        Field[] e2Field = targetClass.getDeclaredFields();
        for(int i=0;i<e1Field.length;i++){
            Field e1F = e1Field[i];
            Object o1 = srcClass.getMethod(getMethodName(e1F.getName())).invoke(src);
            for(int j=0;j<e2Field.length;j++){
                Field e2F = e2Field[j];
                if(e1F.getName().equals(e2F.getName())){
                    Class<?> type1 = e1F.getType();
                    Class<?> type2 = e2F.getType();
                    if(!type1.equals(type2)){
                        continue;
                    }
                    Object o2 = targetClass.getMethod(getMethodName(e2F.getName())).invoke(target);
                    if(o1 == null && o2 != null ){
                        if(type2.getSimpleName().equals("Date")) {
                            String dateTargetStr = new SimpleDateFormat("yyyy-MM-dd").format(o2);
                            compareResult.append("," + "\"" +e1F.getName()+ "\"" + ":" + "\"" + "/" +dateTargetStr+"\"");
                            continue;
                        }
                        compareResult.append("," + "\"" +e1F.getName()+ "\"" + ":" + "\"" + "/" +o2+"\"");
                        continue;
                    }
                    if(o1 != null && o2 != null && !o1.equals(o2)){
                        if(type1.getSimpleName().equals("Date")) {
                            String dateSourceStr = new SimpleDateFormat("yyyy-MM-dd").format(o1);
                            String dateTargetStr = new SimpleDateFormat("yyyy-MM-dd").format(o2);
                            compareResult.append("," + "\"" +e1F.getName()+ "\"" + ":" + "\"" +dateSourceStr+ "/" +dateTargetStr+"\"");
                            continue;
                        }
                        compareResult.append("," + "\"" +e1F.getName()+ "\"" + ":" + "\"" +o1+ "/" +o2+"\"");
                    }
                }
            }
        }
        String str = compareResult.toString();
        if(!StringUtils.isNullOrEmptyStr(str)) {
            return "\""+targetClass.getSimpleName().substring(0, 1).toLowerCase()+targetClass.getSimpleName().substring(1)+"\":{" +str.substring(1)+ "}";
        }
        return null;
    }

    public static String compareAll(Object src,Object target) throws Exception{
        StringBuffer compareResult = new StringBuffer();
        Class<?> srcClass = src.getClass();
        Class<?> targetClass = target.getClass();
        Field[] e1Field = srcClass.getDeclaredFields();
        Field[] e2Field = targetClass.getDeclaredFields();
        for(int i=0;i<e1Field.length;i++){
            Field e1F = e1Field[i];
            Object o1 = srcClass.getMethod(getMethodName(e1F.getName())).invoke(src);
            for(int j=0;j<e2Field.length;j++){
                Field e2F = e2Field[j];
                if(e1F.getName().equals(e2F.getName())){
                    Class<?> type1 = e1F.getType();
                    Class<?> type2 = e2F.getType();
                    if(!type1.equals(type2)){
                        continue;
                    }
                    Object o2 = targetClass.getMethod(getMethodName(e2F.getName())).invoke(target);
                    if(o1 == null && o2 != null ){
                        if(type2.getSimpleName().equals("Date")) {
                            String dateTargetStr = new SimpleDateFormat("yyyy-MM-dd").format(o2);
                            compareResult.append("," + "\"" +e2F.getName()+ "\"" + ":" + "\"" + "/" +dateTargetStr+"\"");
                            continue;
                        }
                        compareResult.append("," + "\"" +e2F.getName()+ "\"" + ":" + "\"" + "/" +o2+"\"");
                        continue;
                    }
                    if(o1 != null && o2 != null){
                        if(type1.getSimpleName().equals("Date")) {
                            String dateSourceStr = new SimpleDateFormat("yyyy-MM-dd").format(o1);
                            String dateTargetStr = new SimpleDateFormat("yyyy-MM-dd").format(o2);
                            compareResult.append("," + "\"" +e1F.getName()+ "\"" + ":" + "\"" +dateSourceStr+ "/" +dateTargetStr+"\"");
                            continue;
                        }
                        compareResult.append("," + "\"" +e1F.getName()+ "\"" + ":" + "\"" +o1+ "/" +o2+"\"");
                    }
                }
            }
        }
        String str = compareResult.toString();
        if(!StringUtils.isNullOrEmptyStr(str)) {
            return "\""+targetClass.getSimpleName().substring(0, 1).toLowerCase()+targetClass.getSimpleName().substring(1)+"\":{" +str.substring(1)+ "}";
        }
        return null;
    }

    public static String attributeJoint(Object src) throws Exception {
        StringBuffer jointResult = new StringBuffer();
        Class<?> srcClass = src.getClass();
        Field[] e1Field = srcClass.getDeclaredFields();
        for(int i=0; i<e1Field.length; i++) {
            Field e1F = e1Field[i];
            Object o1 = srcClass.getMethod(getMethodName(e1F.getName())).invoke(src);
            Class<?> type1 = e1F.getType();
            if(null != o1) {
                if(type1.getSimpleName().equals("Date")) {
                    String dateTargetStr = new SimpleDateFormat("yyyy-MM-dd").format(o1);
                    jointResult.append("," + "\"" +e1F.getName()+ "\"" + ":" + "\"" +dateTargetStr+ "\"");
                    continue;
                }
                jointResult.append("," + "\"" +e1F.getName()+ "\"" + ":" + "\"" +o1+ "\"");
            }
        }
        String str = jointResult.toString();
        if(!StringUtils.isNullOrEmptyStr(str)) {
            return "\""+srcClass.getSimpleName().substring(0, 1).toLowerCase()+srcClass.getSimpleName().substring(1)+"\":{" +str.substring(1)+ "}";
        }
        return null;
    }

    private static String getMethodName(String fieldName){
        return "get"+fieldName.substring(0, 1).toUpperCase()+fieldName.substring(1,fieldName.length());
    }
    private static String setMethodName(String fieldName){
        return "set"+fieldName.substring(0, 1).toUpperCase()+fieldName.substring(1,fieldName.length());
    }
}
