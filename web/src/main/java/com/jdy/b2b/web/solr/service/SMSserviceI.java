package com.jdy.b2b.web.solr.service;

import com.jdy.b2b.web.util.ResultBean;

public interface SMSserviceI {

	ResultBean<?> sendSMS(String source, String phone, String type)
			throws Exception;

}