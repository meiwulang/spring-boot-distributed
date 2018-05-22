package com.jdy.b2b.api.common;

/**
 * Created by yangcheng on 2017/7/6.
 */
public class ThreadLocalUtil {

    private static ThreadLocal threadLocal = new ThreadLocal();

    /**
     * 使用默认的key
     */
    public static Object getData() {
        return threadLocal.get();
    }

    /**
     * 使用默认的key
     */
    public static void setData(Object obj) {
        threadLocal.set(obj);
    }

    /**
     * 使用自定义的key
     */
    public static Object getData(ThreadLocal key) {
        return key.get();
    }

    /**
     * 使用自定义的key
     */
    public static void setData(ThreadLocal key, Object value) {
        key.set(value);
    }
}