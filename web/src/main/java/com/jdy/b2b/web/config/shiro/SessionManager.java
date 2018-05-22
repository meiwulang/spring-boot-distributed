package com.jdy.b2b.web.config.shiro;

import java.io.Serializable;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.shiro.web.servlet.Cookie;
import org.apache.shiro.web.servlet.ShiroHttpServletRequest;
import org.apache.shiro.web.servlet.SimpleCookie;
import org.apache.shiro.web.session.mgt.DefaultWebSessionManager;

public class SessionManager extends DefaultWebSessionManager {

	public SessionManager() {
		super();
	}

	@Override
	protected Serializable getSessionId(ServletRequest request,
			ServletResponse response) {
		HttpServletRequest rq = (HttpServletRequest) request;
		HttpServletResponse rs = (HttpServletResponse) response;
		String sessionId = rq.getHeader("Authorization");

		if (StringUtils.isNotBlank(sessionId)) {
			Cookie template = getSessionIdCookie();

			Cookie cookie = new SimpleCookie(template);
			cookie.setValue(sessionId);
			cookie.saveTo(rq, rs);
			// 设置当前session状态
			request.setAttribute(
					ShiroHttpServletRequest.REFERENCED_SESSION_ID_SOURCE,
					ShiroHttpServletRequest.URL_SESSION_ID_SOURCE); // session来源与url
			request.setAttribute(ShiroHttpServletRequest.REFERENCED_SESSION_ID,
					sessionId);
			request.setAttribute(
					ShiroHttpServletRequest.REFERENCED_SESSION_ID_IS_VALID,
					Boolean.TRUE);
			return sessionId;
		} else {
			return super.getSessionId(request, response);
		}

	}
}
