package com.jdy.b2b.web.config.shiro;

import java.util.Date;
import java.util.Map;
import java.util.Objects;

import javax.annotation.PostConstruct;

import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.LockedAccountException;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.cache.Cache;
import org.apache.shiro.cache.ehcache.EhCacheManager;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import com.alibaba.fastjson.JSON;
import com.jdy.b2b.web.pojo.distributionSystemEntity.DistributionSystemResponse;
import com.jdy.b2b.web.pojo.distributionSystemEntity.login.AccountLoginRequstion;
import com.jdy.b2b.web.pojo.distributionSystemEntity.login.Dept;
import com.jdy.b2b.web.pojo.distributionSystemEntity.login.Employee;
import com.jdy.b2b.web.pojo.distributionSystemEntity.login.JwtUser;
import com.jdy.b2b.web.pojo.distributionSystemEntity.login.OpenIdLoginRequstion;
import com.jdy.b2b.web.pojo.distributionSystemEntity.login.OpenIdLoginResult;
import com.jdy.b2b.web.pojo.distributionSystemEntity.login.OrgChart;
import com.jdy.b2b.web.pojo.distributionSystemEntity.login.Position;
import com.jdy.b2b.web.pojo.module.Module;
import com.jdy.b2b.web.pojo.user.UserResultDTO;
import com.jdy.b2b.web.pojo.user.UserSaveOrUpdateVo;
import com.jdy.b2b.web.service.ModuleService;
import com.jdy.b2b.web.service.UserService;
import com.jdy.b2b.web.util.Constants;
import com.jdy.b2b.web.util.DataContext;
import com.jdy.b2b.web.util.MD5;
import com.jdy.b2b.web.util.PinyinUtil;
import com.jdy.b2b.web.util.ResultBean;
import com.jdy.b2b.web.util.exception.AgentLoginException;

/**
 * Created by yangcheng on 2017/6/15.
 */
@SuppressWarnings({ "rawtypes" })
public class ShiroRealm extends AuthorizingRealm {
	final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Autowired
	@Qualifier("shiroEhcacheManager")
	private EhCacheManager shiroEhcacheManager;
	@Autowired
	private RetryLimitCredentialsMatcher matcher;
	@Autowired
	private UserService userService;
	@Autowired
	private ModuleService moduleService;
	@Autowired
	@Qualifier("customRestTemplate")
	RestTemplate restTemplate;
	private String loginByAccount;
	private String loginByOpenIdUrl;
	@Value("${spring.distributionSystemUrl}")
	private String distributionSystemUrl;
	@Value("${controllCenterUrl:http://localhost:8088}")
	protected String controllCenterUrl;
	private static final String FEMALE = "1";
	private static final String SALER_POSTION = "1";

	@PostConstruct
	public void initUrl() {
		loginByOpenIdUrl = distributionSystemUrl + "/sm/user/wxOpenIdLogin";
		loginByAccount = distributionSystemUrl + "/sm/user/login";
	}

	/**
	 * 用户登录后,认证和权限信息都会返回到前端,可以实现标签的选择性显示,授权方法中将权限信息放入授权信息中,可以实现接口授权
	 *
	 * @param principalCollection
	 * @return
	 */

	@Override
	protected AuthorizationInfo doGetAuthorizationInfo(
			PrincipalCollection principalCollection) {
		logger.debug("执行授权~~~~~~~~~~~~~~~~~~~");
		SimpleAuthorizationInfo info = new SimpleAuthorizationInfo();
		UserResultDTO user = (UserResultDTO) principalCollection
				.getPrimaryPrincipal();

		Long positionId = user.getDistributionSystemDTO().getPosition()
				.getPositionId();
		if (Objects.isNull(positionId)) {
			return info;
		}
		ResultBean<Map<String, Module>> resultBean;
		if (Objects.equals(user.getuAccount(), "admin")) {
			resultBean = moduleService.getModulesByPositionId(100000l);
		} else {
			resultBean = moduleService.getModulesByPositionId(positionId);
		}
		resultBean.getBody().keySet().stream().forEach(url -> {
			if (url.indexOf("#") != -1) {
				url = url.substring(0, url.indexOf("#"));
				info.addStringPermission(url);
			}
		});
		return info;
	}

	@Override
	protected AuthenticationInfo doGetAuthenticationInfo(
			AuthenticationToken token) throws AuthenticationException {
		DistributionSystemResponse body = doLogin(token);
//		logger.error(new StringBuilder("调用用户中心openId登陆登陆返回值:").append(body)
//				.toString());
		OpenIdLoginResult result = JSON.parseObject(
				JSON.toJSONString(body.getData()), OpenIdLoginResult.class);
		result.translateAccessToken();

		logger.error("解析后====" + JSON.toJSONString(result));
		// 重组用户信息入库
		recombineUser(result, token);

		UserResultDTO userResultDTO;
		if (Objects.isNull(result.getEmployee())) {
			userResultDTO = new UserResultDTO(result.getJwtUser());
			userResultDTO.setDistributionSystemDTO(result);
		} else {
			userResultDTO = userService
					.queryForUserByAccount(result.getEmployee().getLoginName())
					.getParsedEnitity(UserResultDTO.class);
			userResultDTO.setDistributionSystemDTO(result);
			userResultDTO.setuDataLimit(
					getDateLimit(userResultDTO.getuPositionId()));
		}

		Cache<Object, Object> cache = shiroEhcacheManager
				.getCache("currentUserCache");
		cache.put(token.getPrincipal(), userResultDTO);

		return new SimpleAuthenticationInfo(userResultDTO, null,
				new MySimpleByteSource((String) token.getPrincipal()),
				getName());
	}

	private int getDateLimit(Long positionId) {
		try {
			ResultBean body = restTemplate.getForEntity(controllCenterUrl
					+ "position/getPositionById/" + positionId,
					ResultBean.class).getBody();
			return Integer.valueOf(
					((Map) body.getBody()).get("dataLimit").toString());
		} catch (Exception e) {
			return 2;
		}
	}

	/**
	 * @Description: 登陆认证
	 * @author 王斌
	 * @date 2018年3月25日 下午6:08:58
	 * @param token
	 * @return
	 */
	private DistributionSystemResponse doLogin(AuthenticationToken token) {
		ResponseEntity<DistributionSystemResponse> responseEntity;
		if (Constants.LOGIN_BY_OPENID
				.equals(DataContext.get(Constants.LOGIN_BY_OPENID))) {
			DataContext.remove(Constants.LOGIN_BY_OPENID);
			// 如果是通过openId登录
			String openId = (String) token.getPrincipal();
			Integer from = (Integer) DataContext.get("loginByOpenIdFrom");// 登陆来源，0:表示h5,1:表示其他
			if (from == null) {
				from = 1;
			}
			OpenIdLoginRequstion openIdLoginRequstion = new OpenIdLoginRequstion(
					2l, openId);
			logger.error("调用用户中心用户名密码登陆路径:\n" + "{url=" + loginByAccount);
			logger.error(new StringBuilder("调用用户中心用户名密码登陆入参:\n")
					.append(openIdLoginRequstion).toString());
			responseEntity = restTemplate.postForEntity(loginByOpenIdUrl,
					openIdLoginRequstion, DistributionSystemResponse.class);
		} else {
			// 调用用户中心登陆接口
			String passwdMD5Code = MD5
					.GetMD5Code(new String(
							((UsernamePasswordToken) token).getPassword()))
					.toUpperCase();

			AccountLoginRequstion accountLoginRequstion = new AccountLoginRequstion(
					(String) token.getPrincipal(), passwdMD5Code);
			logger.error("调用用户中心用户名密码登陆路径:\n" + "{url=" + loginByAccount);
			logger.error(new StringBuilder("调用用户中心用户名密码登陆入参:\n")
					.append(accountLoginRequstion).toString());

			responseEntity = restTemplate.postForEntity(loginByAccount,
					accountLoginRequstion, DistributionSystemResponse.class);
		}
		DistributionSystemResponse body = responseEntity.getBody();
		logger.error("调用用户中心用户名密码出参:\n" + body);
		if (Objects.equals(responseEntity.getStatusCode(), HttpStatus.OK)
				&& Objects.equals(body.getCode(), 200)) {
			return body;
		} else {
			if (body != null) {
				throw new AuthenticationException(body.getMsg());
			}
			throw new AuthenticationException("登录失败~");
		}

	}

	/**
	 * @Description: 用户校验
	 * @author 王斌
	 * @date 2018年3月25日 下午6:06:42
	 * @param user
	 */
	private void validUser(UserResultDTO user) {
		if (user == null) {
			logger.info("user为null");
			throw new UnknownAccountException("用户不存在");
		}
		if (Constants.EFFECT_NO.equals(user.getuStatus())
				|| Constants.USER_LOCK.equals(user.getuStatus())) {
			logger.info("用户状态错误");
			throw new LockedAccountException();
		}
		//
		if (!(Integer.valueOf(0).equals(user.getuStype()))
				&& !(Integer.valueOf(1).equals(user.getuStype()))) {
			throw new AgentLoginException("代理人不允许登录!!");
		}
	}

	@PostConstruct
	public void initCredentialsMatcher() {
		logger.info("规定使用自定义密码比较器~~~~~~~~~~~~~~~~");
		setCredentialsMatcher(matcher);

	}

	// 清空当前用户授权信息
	@Override
	public void clearCachedAuthorizationInfo(PrincipalCollection principals) {
		super.clearCachedAuthorizationInfo(principals);
	}

	// 清空当前用户认证信息
	@Override
	public void clearCachedAuthenticationInfo(PrincipalCollection principals) {
		super.clearCachedAuthenticationInfo(principals);
	}

	// 清除当前用户认证和授权信息
	@Override
	public void clearCache(PrincipalCollection principals) {
		super.clearCache(principals);
	}

	public void clearAllCache() {
		clearAllCachedAuthenticationInfo();
		clearAllCachedAuthorizationInfo();
	}

	public void clearAllCachedAuthorizationInfo() {
		getAuthorizationCache().clear();
	}

	public void clearAllCachedAuthenticationInfo() {
		getAuthenticationCache().clear();
	}

	public String getDistributionSystemUrl() {
		return distributionSystemUrl;
	}

	public void setDistributionSystemUrl(String distributionSystemUrl) {
		this.distributionSystemUrl = distributionSystemUrl;
	}

	/**
	 * @Description: 重组用户信息和岗位信息，一人一岗
	 * @author 王斌
	 * @date 2018年3月26日 下午1:48:52
	 */
	private void recombineUser(OpenIdLoginResult responseBody,
			AuthenticationToken token) {
		UserSaveOrUpdateVo uservo = new UserSaveOrUpdateVo();
		Employee employee = responseBody.getEmployee();
		Position position = responseBody.getPosition();
		Dept dept = responseBody.getDept();
		JwtUser jwtUser = responseBody.getJwtUser();
		if (employee == null && jwtUser.getIsAgent() == 1) {
			uservo.setId(jwtUser.getUid());
			uservo.setOaid(jwtUser.getUid());
			uservo.setuAccount((String) token.getPrincipal());
			uservo.setuRealName(jwtUser.getUsername());
			uservo.setuDepartmentId(jwtUser.getDeptId());
			uservo.setuCompanyId(jwtUser.getOrgId());
			uservo.setuType(3);
			uservo.setuStype(2);
			uservo.setuWxOpenId(jwtUser.getOpenId());
			uservo.setuPassword("");
			uservo.setuDataLimit(0);
			uservo.setuRoleId(0l);
			uservo.setuTel(jwtUser.getPhone());
			uservo.setuStatus(0);
		} else {
			// 设置用户信息
			uservo.setuAccount(employee.getLoginName());
			String realName = employee.getEmployeeName();
			uservo.setuPym(PinyinUtil.getPingYin(realName));
			uservo.setpURealName(realName);
			uservo.setuNo(employee.getEmployeeCode());
			uservo.setuPost(position.getPositionName());
			uservo.setuPositionId(position.getPositionId());
			OrgChart orgChart = dept.getOrgChart();
			if (orgChart != null) {
				uservo.setuCompanyId(orgChart.getDeptId());
			}
			uservo.setuDepartmentId(dept.getDeptId());
			uservo.setPuDepartmentId(dept.getDeptId());
			String mobile = employee.getMobile();
			uservo.setuTel(mobile);
			uservo.setuPhone(mobile);
			uservo.setuIdcard(employee.getIdCode());
			String gendar = employee.getGendar();

			if (FEMALE.equals(gendar)) {
				uservo.setuSex(true);
			} else {
				uservo.setuSex(false);
			}
			uservo.setuQq(employee.getQqCode());
			uservo.setuWxOpenId(employee.getWxOpenId());
			uservo.setuWxname(employee.getWxName());
			uservo.setuEmail(employee.getEmail());
			if (jwtUser.getIsAgent() == 1&& responseBody.getUserDto().getIsEmployee()!=1) {
				uservo.setuType(3);
				uservo.setuStype(2);
			} else {
				Integer positionType = responseBody.getPosition()
						.getPositionType();// 1销售
				// 2非销售
				// `u_type` int(1) NOT NULL COMMENT '用户区分0:非销售类员工1:销售类员工',
				if (SALER_POSTION.equals(positionType)) {
					uservo.setuType(1);
					uservo.setuStype(1);
				} else {
					uservo.setuType(0);
					uservo.setuStype(0);
				}
			}
			uservo.setOaid(employee.getEmployeeId());
			uservo.setuLastLogin(new Date());
			uservo.setuStatus(employee.getEmployeeState() == 0 ? 1 : 0);
			uservo.setuPassword("");
			uservo.setuRealName(realName);
			uservo.setPuDataLimit(2);
			uservo.setuDataLimit(2);
			uservo.setuRoleId(44L);
		}
		userService.saveOrUpdateUsersByoaId(uservo);

	}
}
