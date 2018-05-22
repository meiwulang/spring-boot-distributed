package com.jdy.b2b.web.controll.user;

import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.jdy.b2b.web.pojo.user.UserResultDTO;
import com.jdy.b2b.web.service.ModuleService;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ResultBean;

import io.swagger.annotations.Api;

/**
 * Created by dugq on 2017/11/22.
 */
@RestController
@RequestMapping("user")
@Api(description = "权限", value = "AuthorizationController")
public class AuthorizationController extends BaseController {
	@Autowired
	ModuleService moduleService;

	@RequestMapping("authorization")
	public ResultBean authorization() {
		UserResultDTO user = getUser();
		if ("admin".equals(user.getuAccount())) {
			return moduleService.selectModulesTreeByRoleId(Long.MAX_VALUE);
		}
		Long positionId = user.getuPositionId();
		if (Objects.isNull(positionId)) {
			return new ResultBean("-1", "没有岗位赛");
		}
		ResultBean resultBean = moduleService
				.selectModulesTreeByRoleId(positionId);
		return resultBean;
	}

}
