package com.jdy.b2b.web.solr.service.impl;

import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map.Entry;

import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.jdy.b2b.web.solr.service.SMSserviceI;
import com.jdy.b2b.web.util.ResultBean;
import com.jdy.b2b.web.util.SMSUtil;

@Service
@SuppressWarnings("deprecation")
public class SMSserviceImpl implements SMSserviceI {

	@Override
	public ResultBean<?> sendSMS(String source, String phone, String type)
			throws Exception {
		String generateRandomCode = generateRandomCode();

		HashMap<String, Object> map = new HashMap<>();
		map.put("#code#", generateRandomCode);

		String sendSMS = SMSUtil.sendSMS(phone, "46199", generateTplValue(map));
		HashMap<?, ?> result = JSON.parseObject(sendSMS, HashMap.class);

		ResultBean<Object> resultBean = new ResultBean<>(
				result.get("error_code").toString(),
				result.get("reason").toString());
		resultBean.setBody(generateRandomCode);
		return resultBean;
	}

	// 生成随机码
	private String generateRandomCode() {
		return String.valueOf(Math.random() * 9000 + 1000).substring(0, 4);

	};

	// 生成tpl_value

	private String generateTplValue(HashMap<String, Object> map) {
		Iterator<Entry<String, Object>> iterator = map.entrySet().iterator();
		StringBuilder sb = new StringBuilder();
		while (iterator.hasNext()) {
			Entry<String, Object> next = iterator.next();
			sb.append(next.getKey()).append("=").append(next.getValue());

		}
		return URLEncoder.encode(sb.toString());

	}
}