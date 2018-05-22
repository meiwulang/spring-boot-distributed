package com.jdy.b2b.web.util.exception;

import org.apache.shiro.authc.AuthenticationException;

public class AgentLoginException extends AuthenticationException {

    public AgentLoginException(String message) {
        super(message);
    }
}
