package com.jdy.b2b.api.dto;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by yangcheng on 2018/3/7.
 */
public class SyncOrderOfflineResult<T> {
    private String code;
    private String msg;
    private T data;

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}
