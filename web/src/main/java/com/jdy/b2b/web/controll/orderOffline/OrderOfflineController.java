package com.jdy.b2b.web.controll.orderOffline;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jdy.b2b.web.pojo.orderOffline.OrderOfflineSaveVO;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ResultBean;

import io.swagger.annotations.Api;

/**
 * Created by yangcheng on 2018/1/23.
 */
@Api(value = "凭证")
@RequestMapping("orderOffline")
@RestController
public class OrderOfflineController extends BaseController {
	// 保存凭证
	@PostMapping("saveOrderOffline")
	public ResultBean saveOrderOffline(@RequestBody OrderOfflineSaveVO vo) {

		vo.setPuserId(vo.getUserId());

		String url = new StringBuilder(salesCenterUrl)
				.append("orderOffline/saveOrderOffline").toString();
		return restTemplate.postForEntity(url, vo, ResultBean.class).getBody();
	}

}
