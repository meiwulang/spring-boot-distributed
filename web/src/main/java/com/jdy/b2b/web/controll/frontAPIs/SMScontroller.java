package com.jdy.b2b.web.controll.frontAPIs;

import org.apache.shiro.crypto.hash.SimpleHash;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.common.base.Objects;
import com.jdy.b2b.web.pojo.sms.SLsmsVO;
import com.jdy.b2b.web.solr.service.SMSserviceI;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ResultBean;

/**
 * @Description 短信模块
 * @author 王斌
 * @date 2017年9月21日 下午1:42:09
 * @version V1.0
 */
@RestController
public class SMScontroller extends BaseController {
	@Value("${spring.shiro.password.algorithmName:md5}")
	private String algorithmName;
	@Value("${spring.shiro.password.hashIterations:3}")
	private Integer hashIterations;
	@Autowired
	private SMSserviceI smsService;

	@RequestMapping(value = "front/b2b/user/sendcheckcode", method = RequestMethod.GET)
	public ResultBean<?> sendSMS(@RequestParam("source") String source,
			@RequestParam("phone") String phone,
			@RequestParam("guide") String guide) throws Exception {
		String type = "";
		ResultBean<?> sendSMS = smsService.sendSMS(source, phone, type);

		SLsmsVO vo = new SLsmsVO();
		String code = (String) sendSMS.getBody();
		sendSMS.setBody(null);
		if (Objects.equal(sendSMS.getCode(), "0")) {
			vo.setV_md5(
					new SimpleHash(algorithmName, code, phone, hashIterations)
							.toHex());
			vo.setvCode(code);
			vo.setvPhone(phone);
			vo.setvType(0);
			StringBuffer url = new StringBuffer(controllCenterUrl)
					.append("slsms/save");
			ResultBean<?> result = restTemplate
					.postForEntity(url.toString(), vo, ResultBean.class)
					.getBody();
			if (Objects.equal(result.getCode(), "0")) {
				return result;
			} else {
				return sendSMS;
			}
		} else {
			return sendSMS;
		}

	}
}
