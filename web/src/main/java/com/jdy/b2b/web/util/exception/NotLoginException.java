package com.jdy.b2b.web.util.exception;

/**
 * Created by yangcheng on 2017/9/12.
 */
public class NotLoginException extends RuntimeException {

    private static final long serialVersionUID = -1557801121009370648L;

    public NotLoginException(String message) {
        super(message);
    }
}