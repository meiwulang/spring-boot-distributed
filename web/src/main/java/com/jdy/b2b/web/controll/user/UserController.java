package com.jdy.b2b.web.controll.user;

import com.alibaba.fastjson.JSON;
import com.jdy.b2b.web.pojo.distributionSystemEntity.DistributionSystemResponse;
import com.jdy.b2b.web.pojo.log.MyLog;
import com.jdy.b2b.web.pojo.user.*;
import com.jdy.b2b.web.service.UserService;
import com.jdy.b2b.web.util.*;
import com.jdy.b2b.web.util.annotations.Save;
import com.jdy.b2b.web.util.exception.AgentLoginException;
import com.jdy.b2b.web.util.exception.UserCenterException;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.*;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.apache.shiro.cache.Cache;
import org.apache.shiro.cache.ehcache.EhCacheManager;
import org.apache.shiro.crypto.hash.SimpleHash;
import org.apache.shiro.session.Session;
import org.apache.shiro.session.mgt.eis.SessionDAO;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.subject.support.DefaultSubjectContext;
import org.apache.shiro.web.session.mgt.DefaultWebSessionManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import javax.validation.constraints.NotNull;
import java.util.*;

import static org.apache.commons.lang3.StringUtils.isNotBlank;

/**
 * Created by yangcheng on 2017/7/11.
 */
@Api(value = "user", description = "操作用户")
@RequestMapping("user")
@Controller
@SuppressWarnings({ "unchecked", "rawtypes", "unused" })
public class UserController extends BaseController {
	@Autowired
	private UserService userService;
	@Autowired
	private UserCacheBean userCacheBean;

	@Autowired
	@Qualifier("shiroEhcacheManager")
	private EhCacheManager shiroEhcacheManager;

	@Autowired
	@Qualifier("sessionManager")
	private DefaultWebSessionManager sessionManager;
	@Autowired
	private SessionDAO sessionDAO;
	@Value("${spring.distributionSystemUrl}")
	private String distributionSystemUrl;

	@Autowired
	@Qualifier("shiroEhcacheManager")
	private EhCacheManager ehCacheManager;

	@Value("${spring.shiro.password.algorithmName:md5}")
	private String algorithmName;
	@Value("${spring.shiro.password.hashIterations:3}")
	private Integer hashIterations;
	@Value("${spring.login.verifiCode.time:120000}")
	private Integer virifitime;
	@Value("${spring.shiro.password.originPassword:123456}")
	private String originPassword;
	@Value("${spring.wechat.publicid}")
	private String publicid;
	@Value("${spring.registerUrl}")
	private String registerUrl;
	@Value("${spring.registerKey}")
	private String registerKey;
	@Value("${spring.mineKey}")
	private String mineKey;

	@RequiresPermissions(value = { "计调中心:线路管理:删除", "计调中心:线路管理:添加",
			"计调中心:票价管理:添加:添加单票" })
	@RequestMapping(value = "/hello", method = RequestMethod.GET)
	public String hello(Model model) {
		model.addAttribute("name", "hello");
		logger.info("hellocontroller~~~~~~~~~~需要a,b,c权限~~~~~~~~~~~~~~");
		return "hello";
	}

	@ApiOperation(value = "手机端用户退出")
	@RequestMapping(value = "/mobileLogout", method = RequestMethod.POST)
	@ResponseBody
	public ResultBean mobileLogout() {
		SecurityUtils.getSubject().logout();
		return new ResultBean("-5", "手机端退出");
	}

	/**
	 * 用户注册
	 * <p>
	 * 判断验证码是否正确,及是否超时 判断用户是否存在 判断密码 密码加密...
	 *
	 * @param vo
	 * @return
	 */
	@ApiIgnore
	@ApiOperation(value = "用户注册", notes = "")
	@RequestMapping(value = "/register", method = RequestMethod.POST)
	@ResponseBody
	public ResultBean register(
			@RequestBody @Validated(Save.class) UserSaveOrUpdateVo vo) {
		return ResultBean.getSuccessResult();
	}

	/**
	 * pc端 用户名登录
	 *
	 * @return
	 */
	@ApiOperation(value = "登录", notes = "")
	@RequestMapping(value = "/login", method = { RequestMethod.POST })
	@ResponseBody
	public ResultBean login(@RequestBody @Validated UserLoginVo vo) {
		Subject subject = SecurityUtils.getSubject();
		//
		Session session = subject.getSession(false);
		String accessToken = subject.getSession().getId().toString();
		if (!Objects.isNull(session)) {
			UserResultDTO user = (UserResultDTO) subject.getPrincipal();
			if (!Objects.isNull(user)) {
				ResultBean<UserResultDTO> indexSuccessResult = ResultBean
						.getSuccessResult(getUser());
				indexSuccessResult.setToken(accessToken);
				return indexSuccessResult;
			}
		}

		// 执行登录
		UsernamePasswordToken token = new UsernamePasswordToken(
				vo.getuAccount(), vo.getuPassword());
		token.setRememberMe(false);
		String error = getAccountErrorMessage(vo.getuAccount(), subject, token);
		if (error != null) {// 出错了，返回登录页面
			return new ResultBean("-1", error);
		} else {// 登录成功
			// 获取用户信息
			logger.debug(subject.getPrincipal() + "登录成功");
			ResultBean<UserResultDTO> indexSuccessResult = ResultBean
					.getSuccessResult(getUser());
			indexSuccessResult.setToken(accessToken);
			return indexSuccessResult;
		}
	}

	/**
	 * 用户本人修改密码
	 *
	 * @param vo
	 * @return
	 */
	@ApiOperation(value = "用户本人修改密码", notes = "")
	@ResponseBody
	@RequestMapping(value = "/newPass", method = RequestMethod.POST)
	public ResultBean<Long> newPassWord(
			@RequestBody @Validated UserResetPassVo vo) {
		SimpleHash hash = new SimpleHash(algorithmName, vo.getuPassword(),
				vo.getuAccount(), hashIterations);
		String encodedPassword = hash.toHex();

		ResultBean<UserResultDTO> resultBean = userService
				.queryForUserByAccount(vo.getuAccount());
		User user = resultBean.getParsedEnitity(User.class);
		if (user == null) {
			return new ResultBean("-1", "该用户不存在");
		}
		logger.info(encodedPassword + "~~~~~~~~~~~~~~" + user.getuPassword());

		HttpStatus status = updateDistributionPassword(vo);
		if (!HttpStatus.OK.equals(status)) {
			return new ResultBean("-1", "远程修改密码失败!");
		}

		SimpleHash newHash = new SimpleHash(algorithmName,
				vo.getNewPassword(), vo.getuAccount(), hashIterations);
		String newEncodedPassword = newHash.toHex();

		UserSaveOrUpdateVo userSaveOrUpdateVo = new UserSaveOrUpdateVo();
		userSaveOrUpdateVo.setId(vo.getId());
		userSaveOrUpdateVo.setuPassword(newEncodedPassword);

		ResultBean<Long> result = userService
				.saveOrUpdateUsers(userSaveOrUpdateVo);
		// 先修改,然后清空
		userCacheBean.clearAll(vo.getuAccount());

		return result;

	}

	private HttpStatus updateDistributionPassword(UserResetPassVo vo) {
		String modifyUrl = distributionSystemUrl + "/sm/user/modifyPwd";
		Map map = new HashMap();
		map.put("cloudId", 2);
		map.put("loginName", vo.getuAccount());
		map.put("loginPwd", vo.getNewPassword());
		logger.info("更改密码：" + JSON.toJSONString(map));
		ResponseEntity<DistributionSystemResponse> responseEntity = restTemplate.postForEntity(modifyUrl, map, DistributionSystemResponse.class);
		logger.info("更改密码回执：" + JSON.toJSONString(responseEntity));
		return responseEntity.getStatusCode();
	}

	/**
	 * 根据id查询
	 *
	 * @param id
	 * @return
	 */
	@ApiOperation(value = "根据id查用户 单表", notes = "")
	@ResponseBody
	@RequestMapping(value = "/get/{id}", method = RequestMethod.GET)
	public ResultBean<User> queryForUserById(
			@PathVariable @NotNull @ApiParam(value = "用户id", required = true, name = "id") Long id) {
		return userService.queryForUserById(id);
	}

	/**
	 * 游客注册
	 * <p>
	 * 判断验证码是否正确,及是否超时 判断用户是否存在 判断密码 密码加密...
	 *
	 * @param
	 * @return
	 */
	@ApiIgnore
	@ApiOperation(value = "游客注册", notes = "")
	@RequestMapping(value = "/visitorRegister", method = RequestMethod.GET)
	@ResponseBody
	public ResultBean visitorRegister(
			@RequestParam(value = "openId") @NotNull @ApiParam(value = "openId", required = true, name = "openId") String openId) {
		logger.info("游客注册openId:" + openId);
		UserSaveOrUpdateVo vo = new UserSaveOrUpdateVo();
		vo.setuWxOpenId(openId);
		vo.setuStype(3);
		return userService.saveOrUpdateUsers(vo);
	}

	/**
	 *
	 * 同步代理人信息
	 * 
	 * @param vo
	 * @return
	 */
	@ApiOperation(value = "同步代理人信息", notes = "")
	@ResponseBody
	@RequestMapping(value = "/syncUser", method = RequestMethod.POST)
	public ResultBean syncUser(@RequestBody @Validated UserQueryVo vo) {
		return userService.syncUser(vo);
	}

	/**
	 * 根据id查询
	 *
	 * @param id
	 * @return
	 */
	@ApiOperation(value = "根据id查用户 单表", notes = "")
	@ResponseBody
	@RequestMapping(value = "/single/{id}", method = RequestMethod.GET)
	public ResultBean<User> querySingleUserById(
			@PathVariable @NotNull @ApiParam(value = "用户id", required = true, name = "id") Long id) {
		return userService.queryForUserByIdSingle(id);
	}

	/**
	 * 根据用户名查询
	 *
	 * @return
	 */
	@ApiOperation(value = "根据用户名查用户")
	@ResponseBody
	@RequestMapping(value = "/getByAccount", method = RequestMethod.GET)
	public ResultBean<UserResultDTO> queryForUserById() {
		Subject subject = SecurityUtils.getSubject();
		UserResultDTO principal = (UserResultDTO) subject.getPrincipal();
		String str = principal.getuAccount();
		return userService.queryForUserByAccount(str);
	}

	/**
	 * 查询用户列表 条件搜索(用户,拼音码,真是名字,手机号)
	 *
	 * @param vo
	 * @return
	 */
	@ApiOperation(value = "查用户列表", notes = "")
	@ResponseBody
	@RequestMapping(value = "/list", method = RequestMethod.POST)
	public ResultBean queryUserListForPage(
			@RequestBody @Validated UserQueryVo vo) {

		Cache<Object, Object> cache = ehCacheManager
				.getCache("currentUserCache");
		Subject subject = SecurityUtils.getSubject();
		UserResultDTO principal = (UserResultDTO) subject.getPrincipal();
		WXUserResultDO result = (WXUserResultDO) cache
				.get(principal.getuAccount() + "_front");
		return userService.queryUserListForPage(vo);
	}

	/**
	 * 后台添加用户
	 *
	 * @param userSaveVo
	 * @return
	 */
	@ApiOperation(value = "保存", notes = "")
	@ResponseBody
	@RequestMapping(value = "/save", method = RequestMethod.POST)
	public ResultBean<Long> saveUsers(
			@RequestBody @Validated UserSaveVo userSaveVo) {
		UserSaveOrUpdateVo vo = JSONUtil.trans(userSaveVo,
				UserSaveOrUpdateVo.class);
		ResultBean<List<Integer>> accountResultBean = userService
				.queryForUserByAccountWithOutStatus(vo);
		List<Integer> statusList = accountResultBean
				.getParsedEnitity(List.class);
		if (statusList != null && statusList.size() > 0) {
			return new ResultBean("-1",
					String.format("该用户名或手机号已有%s个重复记录!", statusList.size()));
		}
		String pinyin = PinyinUtil.getFirstSpell(vo.getuAccount());
		vo.setuPym(pinyin.length() > 10 ? pinyin.substring(0, 10) : pinyin);
		SimpleHash hash = new SimpleHash(algorithmName, originPassword,
				vo.getuAccount(), hashIterations);
		String encodedPassword = hash.toHex();
		vo.setuPassword(encodedPassword);
		// 自动生成uNo
		// vo.setuNo(getNewUniqueUno());
		return userService.saveOrUpdateUsers(vo);
	}

	private synchronized String getNewUniqueUno() {
		Cache<Object, Object> cache = ehCacheManager
				.getCache("currentUserCache");
		Long maxId = (Long) cache.get("maxId");
		String maxIdStr = "";
		logger.error("maxId是否为null #### " + maxId);
		if (maxId == null) {
			ResultBean<Long> result = userService.selectMaxUserId();
			maxId = result.getParsedEnitity(Long.class);
			maxId++;
			maxIdStr = maxId + "";
			logger.error("maxId是null,去数据库查询后,+1, 新的maxId为 #### " + maxId);
		}
		logger.error("#新增--最终的maxId为### " + maxId);
		logger.error("#新增--最终的maxIdStr为### " + maxIdStr);
		maxIdStr = "8" + String.format("%0" + 7 + "d", maxId);
		cache.put("maxId", maxId + 1);
		return maxIdStr;
	}

	private synchronized String getOldUniqueUno(Long id) {
		String maxIdStr = "";
		maxIdStr = "8" + String.format("%0" + 7 + "d", id);
		logger.error("#修改--最终的maxId为### " + id);
		logger.error("#修改--最终的maxIdStr为### " + maxIdStr);
		return maxIdStr;
	}

	/**
	 * 修改状态
	 *
	 * @param id
	 * @return
	 */
	@ApiOperation(value = "修改状态", notes = "")
	@ResponseBody
	@RequestMapping(value = "/status/{id}/{status}/{uAccount}", method = RequestMethod.POST)
	public ResultBean<Long> deleteUsers(
			@NotNull @PathVariable("id") @ApiParam(value = "用户id", required = true, name = "id") Long id,
			@NotNull @PathVariable("status") @ApiParam(value = "status 0:有效 1:删除 2:锁定", required = true, name = "status") Integer status,
			@NotNull @PathVariable("uAccount") @ApiParam(value = "用户名", required = true, name = "uAccount") String uAccount) {

		UserSaveOrUpdateVo vo = new UserSaveOrUpdateVo();
		vo.setId(id);
		vo.setuStatus(status);
		if (getUser() != null) {
			vo.setUpdateUser(getUser().getUserId());
		} else {
			return new ResultBean("-1", "未获取到用户信息");
		}
		ResultBean resultBean = userService.updateStatus(vo);

		// 先修改,然后清空被操作用户的 部分 缓存
		userCacheBean.clearCurrentUserCache(uAccount);
		logger.error("注销同步接口返回解雇 ######  code :" + resultBean.getCode()
				+ " message: " + resultBean.getMessage());
		return resultBean;
	}

	/**
	 * 编辑
	 *
	 * @param userUpdateVo
	 * @return
	 */
	@MyLog(SuccessInfo = "新增、编辑用户信息成功")
	@ApiOperation(value = "编辑", notes = "")
	@ResponseBody
	@RequestMapping(value = "/update", method = RequestMethod.POST)
	public ResultBean<Long> updateUsers(
			@RequestBody @Validated UserUpdateVo userUpdateVo) {
		UserSaveOrUpdateVo vo = JSONUtil.trans(userUpdateVo,
				UserSaveOrUpdateVo.class);
		// 如果用户编号为null,即为代理人,然后设置用户编号
		// vo.setuNo(getOldUniqueUno(vo.getId()));

		// 不修改密码
		vo.setuPassword(null);
		ResultBean<User> oldResult = userService
				.queryForUserByIdSingle(vo.getId());
		User oldUser = oldResult.getParsedEnitity(User.class);
		if (!(oldUser.getuAccount()).equals(vo.getuAccount())) {
			return new ResultBean("-1", "用户名不可修改!");
		}
		String pinyin = PinyinUtil.getFirstSpell(vo.getuAccount());
		vo.setuPym(pinyin.length() > 10 ? pinyin.substring(0, 10) : pinyin);
		ResultBean<Long> resultBean = userService.updateUser(vo);

		// 先修改,然后清空
		Subject subject = SecurityUtils.getSubject();
		if (vo.getuAccount().equals(subject.getPrincipal())) {
			// 如果是本人
			userCacheBean.clearCurrentUserCache(vo.getuAccount());
			// 重新放入缓存,供其他地方使用
			ResultBean<UserResultDTO> result = userService
					.queryForUserByAccount(vo.getuAccount());
			UserResultDTO user = result.getParsedEnitity(UserResultDTO.class);
			user.setUrRoleContentArray(null);
			user.setuPassword(null);
			Cache<Object, Object> cache = ehCacheManager
					.getCache("currentUserCache");
			cache.put(vo.getuAccount(), user);
		} else {
			// 如果是管理员
			userCacheBean.clearCurrentUserCache(vo.getuAccount());
		}

		return resultBean;
	}

	/**
	 * 重置密码为123456
	 *
	 * @param id
	 * @return
	 */
	@ApiOperation(value = "重置密码", notes = "")
	@ResponseBody
	@RequestMapping(value = "/reset/{id}/{uAccount}", method = RequestMethod.GET)
	public ResultBean<Long> resetPassword(
			@NotNull @PathVariable("id") @ApiParam(value = "用户id", required = true, name = "id") Long id,
			@NotNull @PathVariable("uAccount") @ApiParam(value = "用户名", required = true, name = "uAccount") String uAccount) {
		// 根据id查用户名和电话
		ResultBean<User> resultBean = userService.queryForUserByIdSingle(id);
		User user = resultBean.getParsedEnitity(User.class);

		if (user == null) {
			return new ResultBean("-1", "该用户不存在");
		}

		SimpleHash hash = new SimpleHash(algorithmName, originPassword,
				user.getuAccount(), hashIterations);
		String encodedPassword = hash.toHex();

		UserSaveOrUpdateVo saveOrUpdateVo = new UserSaveOrUpdateVo();
		saveOrUpdateVo.setId(id);
		saveOrUpdateVo.setuPassword(encodedPassword);
		if (getUser() != null) {
			saveOrUpdateVo.setUpdateUser(getUser().getUserId());
		} else {
			return new ResultBean("-1", "未获取到用户信息");
		}

		ResultBean<Long> result = userService.saveOrUpdateUsers(saveOrUpdateVo);
		// 先修改,然后清空
		userCacheBean.clearCurrentUserCache(uAccount);
		return result;
	}

	/**
	 * 设为管理员(数据权限修改为单位级)
	 *
	 * @param id
	 * @return
	 */
	@ApiOperation(value = "设为管理员", notes = "")
	@ResponseBody
	@RequestMapping(value = "/admin/{id}", method = RequestMethod.GET)
	public ResultBean<Long> setAdmin(
			@NotNull @PathVariable("id") @ApiParam(value = "用户id", required = true, name = "id") Long id) {
		UserSaveOrUpdateVo vo = new UserSaveOrUpdateVo();
		vo.setId(id);
		vo.setuDataLimit(Constants.DATA_LIMIT_COM);
		if (getUser() != null) {
			vo.setUpdateUser(getUser().getUserId());
		} else {
			return new ResultBean("-1", "未获取到用户信息");
		}
		ResultBean<Long> resultBean = userService.saveOrUpdateUsers(vo);

		// 先修改,然后清空
		ResultBean<User> userResult = userService.queryForUserByIdSingle(id);
		User user = userResult.getParsedEnitity(User.class);
		if (user != null && user.getuAccount() != null) {
			userCacheBean.clearCurrentUserCache(user.getuAccount());
		} else {
			throw new RuntimeException("未能清理缓存");
		}
		return resultBean;
	}

	/**
	 * 手机端 手机号登录
	 *
	 * @return
	 */
	@ApiOperation(value = "手机号登录", notes = "")
	@RequestMapping(value = "/mobileLogin", method = { RequestMethod.POST })
	@ResponseBody
	public ResultBean mobileLogin(@RequestBody @Validated MobileLoginVo vo) {
		// 验证手机号是否存在.uname实际是手机号
		ResultBean<User> telResultBean = userService
				.queryForUserByTel(vo.getUname());
		User userResult = telResultBean.getParsedEnitity(User.class);
		if (Objects.isNull(userResult)) {
			return ResultBean.getIndexFailResult("该手机号未注册!");
		}
		// 如果存在,查找到用户信息后,使用用户名方式登录
		Subject subject = SecurityUtils.getSubject();
		UsernamePasswordToken token = new UsernamePasswordToken(
				userResult.getuAccount(), vo.getUpass());
		token.setRememberMe(false);
		String error = getAccountErrorMessage(userResult.getuAccount(), subject,
				token);
		if (error != null) {// 出错了，返回登录页面
			return ResultBean.getIndexFailResult(error);
		} else {// 登录成功
			// 将前端用户信息放入缓存
			putFrontUserIntoCache(userResult.getuAccount());
			// 将后端用户信息放入缓存
			ResultBean<UserResultDTO> cacheUserResult = userService
					.queryForUserByAccount(userResult.getuAccount());
			UserResultDTO cacheUser = cacheUserResult
					.getParsedEnitity(UserResultDTO.class);
			if (cacheUser != null && cacheUser.getUserId() != null) {
				Cache<Object, Object> cache = ehCacheManager
						.getCache("currentUserCache");
				cache.put(userResult.getuAccount(), cacheUser);
				// 更新最后登录时间
				return updateLastLoginTime(cacheUser.getUserId());
			} else {
				// 如果未取到用户信息,应该退出登录
				userCacheBean.clearAll(vo.getUname());
				return ResultBean.getIndexFailResult("登录获取用户信息失败!");
			}
		}
	}

	@ApiOperation(value = "登出", notes = "")
	@GetMapping("logout")
	@ResponseBody
	public ResultBean logout() {
		UserResultDTO principal = (UserResultDTO) SecurityUtils.getSubject()
				.getPrincipal();
		userCacheBean.clearAll(principal.getuAccount());
		return ResultBean.getSuccessResult();
	}

	/**
	 * 单点登录b2b参数校验接口 如果通过了参数校验的过滤器,说明验证成功,所以这里直接返回成功
	 *
	 * @return
	 */
	@GetMapping("/singlePointLoginValidateSuccess")
	@ResponseBody
	public ResultBean singlePointLoginValidateSuccess(
			@RequestParam("uid") Long uid) {
		logger.error("#############调用单点登录方法##########");
		ResultBean<User> userResult = userService.queryForUserByIdSingle(uid);
		User user = userResult.getParsedEnitity(User.class);
		if (user == null) {
			logger.error("此用户不存在!!");
			return new ResultBean("-1", "此用户不存在!");
		}
		String account = user.getuAccount();

        Cache<Object, Object> cache = ehCacheManager
                .getCache("currentUserCache");
        UserResultDTO userResultDTO = (UserResultDTO) cache.get(account);

		if (userResultDTO != null && userResultDTO.getuAccount() != null) {
			logger.error("成功返回用户信息,用户名 : " + user.getuAccount());
			return ResultBean.getSuccessResult(user);
		} else {
			logger.error("此用户未登录!!");
			return new ResultBean("-1", "此用户未登录!");
		}
	}

	// 更新最后登录时间,手机号登录
	private ResultBean updateLastLoginTime(Long userId) {
		UserSaveOrUpdateVo updateTimeVo = new UserSaveOrUpdateVo();
		updateTimeVo.setId(userId);
		updateTimeVo.setuLastLogin(new Date());
		ResultBean<Long> resultBean = userService
				.saveOrUpdateUsers(updateTimeVo);
		if ("0".equals(resultBean.getCode())) {
			Long longResult = resultBean.getParsedEnitity(Long.class);
			if (longResult != null && longResult > 0) {
				return ResultBean.getIndexSuccessResult(0);
			} else {
				return ResultBean.getIndexFailResult("更新最后登录时间失败");
			}
		} else {
			return ResultBean.getIndexFailResult("更新最后登录时间失败)");
		}
	}

	// 账号登录,pc登录,openid登录,手机号登录调用
	private String getAccountErrorMessage(String uAccount, Subject subject,
			UsernamePasswordToken token) {
		String error = null;
		// try {
		// Cache<Object, Object> cache = ehCacheManager
		// .getCache("currentUserCache");
		// Object o = cache.get(uAccount);
		// if (o == null) {
		// userCacheBean.clearShiroCache();
		// }
		// } catch (Exception e) {
		// error = "登录判断缓存出错!! " + e.getMessage();
		// }
		// if (subject.isAuthenticated()) {
		// return null;
		// }
		doKickout(uAccount);
		try {
 			subject.login(token);
			// Session session = subject.getSession(false);
			// session.setAttribute("user_ip",
			// HttpUtils.getIpAddr(getRequest()));
			// session.setAttribute("user_browser",
			// HttpUtils.getBrowser(getRequest()));
		} catch (UnknownAccountException e) {
			String message = e.getMessage();
			logger.error("登陆错误信息：" + message);
			error = message;
		} catch (IncorrectCredentialsException e) {
			error = "用户名或密码错误";
		} catch (ExcessiveAttemptsException e) {
			error = "登录失败次数超过3次，账户锁定10分钟";
		} catch (LockedAccountException e) {
			error = "账号状态错误：" + e.getCause();
		} catch (AgentLoginException e) {
			error = "代理人不允许登录!";
		}catch (UserCenterException e){
			error = "用户中心登录报错啦~~~~~："+e.getMessage();
		}
		catch (AuthenticationException e) {
			e.printStackTrace();
			logger.error("认证异常: ", e);
			logger.error("登录出错1!  ##  " + e.getMessage());
			logger.error("登录出错2!  ##  " + e.getLocalizedMessage());
			logger.error("登录出错3!  ##  " + e.getCause());
			error = "登录出错!" + e.getMessage();
		} catch (NullPointerException e) {
			error = "空指针异常: " + e.getMessage();
		}
		return error;
	}

	private boolean doKickout(String name) {
		try {
			Collection<Session> activeSessions = sessionDAO.getActiveSessions();
			Iterator<Session> iterator = activeSessions.iterator();
			while (iterator.hasNext()) {
				Session session = iterator.next();
				Object attribute = session.getAttribute(
						DefaultSubjectContext.PRINCIPALS_SESSION_KEY);
				if (Objects.isNull(attribute)) {
					continue;
				}
				UserResultDTO user = (UserResultDTO) ((PrincipalCollection) attribute)
						.getPrimaryPrincipal();
				boolean AUTHENTICATED = (boolean) session.getAttribute(
						DefaultSubjectContext.AUTHENTICATED_SESSION_KEY);
				if (!Objects.isNull(user) && user.getuAccount().equals(name)
						&& AUTHENTICATED) {
					sessionDAO.delete(session);
					logger.debug(user.getuAccount()
							+ "-已经登陆,并踢出~~~~~~~~~~~~~~~~~~~~~~~~");
					return true;
				}
			}
		} catch (Exception e) {
			logger.error("登陆验证用户是否已经登陆", e);
			return false;
		}
		return false;
	}

	// 登录成功后,将用户信息放入缓存,手机号登录,openid登录调用
	private void putFrontUserIntoCache(String uAccount) {
		userService.putFrontUserIntoCache(uAccount);
	}

	/**
	 * 代理人列表查询
	 *
	 * @param vo
	 * @return
	 */
	@PostMapping("distList")
	@ResponseBody
	public ResultBean selectDistUserList(@RequestBody UserDistQueryVo vo) {
		return userService.selectDistUserList(vo);
	}

	/**
	 * 代理人信息查询
	 *
	 * @param id
	 * @return
	 */
	@GetMapping("selectDistUserInfo/{id}")
	@ResponseBody
	public ResultBean<User> selectDistUserInfo(
			@PathVariable("id") @NotNull @ApiParam(value = "用户id", required = true, name = "id") Long id) {
		return userService.selectDistUserInfo(id);
	}

	/**
	 * 管理员编辑代理人信息
	 *
	 * @param vo
	 * @return
	 */
	@ApiOperation(value = "管理员编辑代理人信息", notes = "")
	@ResponseBody
	@RequestMapping(value = "/updateDistUser", method = RequestMethod.POST)
	public ResultBean<Long> updateDistUser(
			@RequestBody @Validated DistUserUpdateVo vo) {
		ResultBean<User> oldResult = userService
				.queryForUserByIdSingle(vo.getId());
		User oldUser = oldResult.getParsedEnitity(User.class);
		ResultBean<User> telResultBean = userService
				.queryForUserByTel(vo.getuTel());
		User user1 = telResultBean.getParsedEnitity(User.class);
		if (user1 != null && !(oldUser.getuTel().equals(vo.getuTel()))) {
			return new ResultBean("-1", "该手机号已存在!");
		}

		ResultBean<Long> resultBean = userService.updateDistUser(vo);
		// 如果是管理员
		userCacheBean.clearCurrentUserCache(oldUser.getuAccount());
		return resultBean;
	}

	@ApiOperation(value = "查询上级岗位员工")
	@PostMapping("/querySuperUsersByPosition")
	@ResponseBody
	public ResultBean querySuperUsersByPosition(
			@Validated @RequestBody UserSuperPositionVO user) {
		if (user.getCompanyId() == null)
			user.setCompanyId(user.getPcompanyId());
		if (isNotBlank(user.getPositionName())
				&& user.getPositionName().equals("销售总")) {
			user.setDepartId(null);
		}
		if (isNotBlank(user.getPositionName())
				&& !user.getPositionName().equals("销售总")
				&& user.getDepartId() == null) {
			return new ResultBean("-1", "请指定部门！");
		}
		return userService.querySuperUsersByPosition(user);
	}

	@ApiOperation(value = "发布项目前处理员工编号")
	@GetMapping("/handleUno")
	@ResponseBody
	public ResultBean handleUno() {
		StringBuffer url = new StringBuffer(systemCenterUrl)
				.append("refreshUno/handleUno");
		return restTemplate.getForEntity(url.toString(), ResultBean.class)
				.getBody();
	}

	@ApiOperation(value = "查询卖家的上级和销售经理信息")
	@GetMapping("pInfo/{uId}")
	@ResponseBody
	public ResultBean getUserPinfo(
			@PathVariable @NotNull(message = "用户id不能为null") Long uId) {
		StringBuffer url = new StringBuffer(systemCenterUrl)
				.append("user/pInfo/").append(uId);
		return restTemplate.getForEntity(url.toString(), ResultBean.class)
				.getBody();
	}

    @ApiOperation(value = "用户信息变更通知")
    @PostMapping("notifyUpdateUserInfo")
    @ResponseBody
    public ResultBean changeNotify(@RequestBody List<Long> userIds) {

        return userService.notifyUpdateUserInfo(userIds);
    }


}
