package com.jdy.b2b.web.util.exceptions;

/**
 * Created by dugq on 2017/12/15.
 */
public class NoPermissionException extends RuntimeException {
    private static final long serialVersionUID = -1924643574988427615L;


    public NoPermissionException() {
        super();
    }

    public NoPermissionException(String message) {
        super(message);
    }

    public NoPermissionException(String message, Throwable cause) {
        super(message, cause);
    }

    public NoPermissionException(Throwable cause) {
        super(cause);
    }

    protected NoPermissionException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
