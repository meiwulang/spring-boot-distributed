package com.jdy.b2b.web.util.exception;

/**
 * Created by dugq on 2017/9/23.
 */
public class ParamUnExpectException extends RuntimeException {
    private static final long serialVersionUID = -697463005000626191L;

    public ParamUnExpectException(String message) {
        super(message);
    }
}
