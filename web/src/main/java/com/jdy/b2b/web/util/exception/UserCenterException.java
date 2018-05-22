package com.jdy.b2b.web.util.exception;

/**
 * Created by dugq on 2018/3/29.
 */
public class UserCenterException extends RuntimeException {

    private static final long serialVersionUID = -1557801121009370648L;
    private String message;

    public UserCenterException(String message) {
        this.message = message;
    }

    @Override
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
