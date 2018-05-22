package com.jdy.b2b.web.util.exception;

import org.apache.shiro.authc.AccountException;

/**
 * Created by yangcheng on 2017/9/12.
 */
public class SMSTimeOutException extends AccountException {

    private static final long serialVersionUID = -1557801121009370648L;
    private String message;

    public SMSTimeOutException(String message) {
        this.message = message;
    }
}