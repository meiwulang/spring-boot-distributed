package com.jdy.b2b.api.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jdy.b2b.api.common.BaseController;
import com.jdy.b2b.api.common.Constants;
import com.jdy.b2b.api.common.EncodingObjectWithMd5Utils;
import com.jdy.b2b.api.common.HttpClientUtils;
import com.jdy.b2b.api.common.JSONUtil;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.dao.UserGroupMapper;
import com.jdy.b2b.api.dao.VerificationMapper;
import com.jdy.b2b.api.model.user.AgentUserDO;
import com.jdy.b2b.api.model.user.DepartDistDO;
import com.jdy.b2b.api.model.user.MobileLoginResultDO;
import com.jdy.b2b.api.model.user.MobileLoginResultQueryDTO;
import com.jdy.b2b.api.model.user.User;
import com.jdy.b2b.api.model.user.UserExtendDTO;
import com.jdy.b2b.api.model.user.UserResultDTO;
import com.jdy.b2b.api.model.user.UserResultSycnDTO;
import com.jdy.b2b.api.model.user.UserSuperPositionVO;
import com.jdy.b2b.api.model.user.WXUserResultDO;
import com.jdy.b2b.api.model.virtualGroup.UserGroup;
import com.jdy.b2b.api.service.UserService;
import com.jdy.b2b.api.vo.user.BatchSaveOrUpdateInfoVO;
import com.jdy.b2b.api.vo.user.DistUserUpdateVo;
import com.jdy.b2b.api.vo.user.MobileLoginResultQueryVo;
import com.jdy.b2b.api.vo.user.UserDistQueryVo;
import com.jdy.b2b.api.vo.user.UserQueryVo;
import com.jdy.b2b.api.vo.user.UserSaveOrUpdateVo;

/**
 * Created by yangcheng on 2017/7/4.
 */
@RestController
@RequestMapping("user")
public class UserController extends BaseController {

	@Autowired
	private UserService userService;
	@Autowired
	private VerificationMapper verificationMapper;
	@Autowired
	private UserGroupMapper userGroupMapper;
	@Value("${fxUrl}")
	private String fxUrl;

	@Value("${GNO}")
	private String GNO;

	/**
	 * 根据id查询 new
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "get/{id}", method = RequestMethod.GET)
	public ResultBean<UserExtendDTO> queryForUserById(@PathVariable Long id) {
		return ResultBean.getSuccessResult(userService.queryForUserById(id));
	}

	/**
	 * 单表查询
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "single/{id}", method = RequestMethod.GET)
	public ResultBean<User> queryForUserByIdSingle(@PathVariable Long id) {
		return ResultBean.getSuccessResult(userService.queryForUserByIdSingle(id));
	}

	/**
	 * 根据用户名查询 new
	 * 
	 * @param account
	 * @return
	 */
	@RequestMapping(value = "account/{account}", method = RequestMethod.GET)
	public ResultBean<UserResultDTO> queryForUserByAccount(@PathVariable("account") String account) {
		return ResultBean.getSuccessResult(userService.queryForUserByAccount(account));
	}

	/**
	 * 添加用户前根据用户名查询 不过滤用户状态 new
	 * 
	 * @param vo
	 * @return
	 */
	@RequestMapping(value = "accountWithOutStatus", method = RequestMethod.POST)
	public ResultBean<List<Integer>> queryForUserByAccountWithOutStatus(@RequestBody UserSaveOrUpdateVo vo) {
		return ResultBean
				.getSuccessResult(userService.queryForUserByAccountWithOutStatus(vo.getuAccount(), vo.getuTel()));
	}

	/**
	 * 根据手机号查询 new
	 * 
	 * @param tel
	 * @return
	 */
	@RequestMapping(value = "tel/{tel}", method = RequestMethod.GET)
	public ResultBean<User> queryForUserByUtel(@PathVariable("tel") String tel) {
		return ResultBean.getSuccessResult(userService.queryForUserByTel(tel));
	}

	/**
	 * 查询用户列表 条件搜索(用户,拼音码,真是名字,手机号) new
	 * 
	 * @param vo
	 * @return
	 */
	@RequestMapping(value = "list", method = RequestMethod.POST)
	public ResultBean queryUserListForPage(@RequestBody UserQueryVo vo) {
		if (vo.getCurrPage() != null && vo.getPageSize() != null) {
			PageHelper.startPage(vo.getCurrPage(), vo.getPageSize());
		}
		User user = JSONUtil.trans(vo, User.class);
		user.setuStatus(Constants.USER_DELETE);

		List<UserResultDTO> userList = userService.queryUserListForPage(user);

		return ResultBean.getSuccessResult(new PageInfo(userList));
	}

	/**
	 * 同步用户信息 new
	 * 
	 * @param vo
	 * @return
	 */
	@RequestMapping(value = "syncUser", method = RequestMethod.POST)
	public ResultBean syncUser(@RequestBody UserQueryVo vo) {
		User user = JSONUtil.trans(vo, User.class);
		List<UserResultSycnDTO> userList = userService.syncUser(user);
		return ResultBean.getSuccessResult(userList);
	}

	/**
	 * 新增 编辑 伪删除用户 new
	 * 
	 * @param vo
	 * @return
	 */
	@Transactional
	@RequestMapping(value = "saveOrUpdate", method = RequestMethod.POST)
	public ResultBean<Long> saveOrUpdateUsers(@RequestBody UserSaveOrUpdateVo vo) {
		Integer from = (Integer) com.jdy.b2b.api.util.DataContext.get("loginByOpenIdFrom");
		if (from == null) {
			from = 1;
		}
		if (Integer.valueOf(3).equals(vo.getuStype())) {
			from = 1;
		}
		User user = JSONUtil.trans(vo, User.class);
		if (user != null && user.getId() != null) {
			// 执行更新
			user.setUpdateTime(new Date());
			if (vo.getUpdateUser() == null) {
				user.setUpdateUser(vo.getPuserId());
			}

			Integer result = userService.updateUser(user);
			if (result > 0) {
				return ResultBean.getSuccessResult((long) result);
			} else {
				return new ResultBean("-1", "更新用户失败");
			}
		} else {
			// 注册游客信息
			if (user.getuStype() == Constants.Visitor.USTYPE) {
				User userR = userService.queryForUserByOpenId(user.getuWxOpenId(), from);
				if (userR == null) {
					user.setuAccount(user.getuWxOpenId());
					user.setuPassword(Constants.Visitor.UPASSWORD);
					user.setuRealName(Constants.Visitor.UREALNAME);
					// user.setuWxOpenId(user.getuWxOpenId());//openId
					user.setuDataLimit(Constants.Visitor.UDATALIMIT);// 用户级
					user.setuRoleId(Constants.Visitor.UROLEID);
					user.setuType(Constants.Visitor.UTYPE);
					// user.setuStype(Constants.Visitor.USTYPE);
					user.setuTel(Constants.Visitor.UTEL);
					user.setuCompanyId(Constants.Visitor.COMPANYID);
					user.setuChargeType(Constants.Visitor.UCHARGETYPE);
					user.setuStatus(Constants.Visitor.USTATUS);
					user.setLevel(null);
					UserGroup record = new UserGroup();
					// record.setgNo(Constants.Visitor.GNO);
					record.setgNo(GNO);
					record.setuAccount(user.getuWxOpenId());
					record.setCreateTime(new Date());
					record.setCreateUser(vo.getPuserId());
					List<UserGroup> recordR = userService.selectByUserAccount(user.getuWxOpenId(), GNO);
					if (recordR == null || recordR.size() == 0) {
						userService.insertUserGroup(record);
					}
					if (userService.saveUser(user) > 0) {
						ResultBean result = new ResultBean("200", "SUCCESS");
						result.setBody(user.getId());
						result.setId(user.getId());
						return result;
					} else {
						return new ResultBean("-1", "新增用户失败");
					}

				} else {
					// 销售或者代理人已经存在了,直接插入usergroup表。20180124 add by zhaoxiaohuan
					List<UserGroup> recordR = userService.selectByUserAccount(user.getuWxOpenId(), GNO);
					if (recordR == null || recordR.size() == 0) {
						UserGroup record = new UserGroup();
						record.setgNo(GNO);
						record.setuAccount(user.getuWxOpenId());
						record.setCreateTime(new Date());
						record.setCreateUser(vo.getPuserId());
						userService.insertUserGroup(record);
						logger.info("销售或者代理人已经存在了,直接插入usergroup表" + user.getuWxOpenId());
					}
					return new ResultBean("200", "用戶已注冊");
				}
			} else {
				// 执行新增
				user.setCreateUser(vo.getPuserId());
				user.setCreateTime(new Date());
				user.setuStatus(Constants.USER_EFFECT_YES);
				user.setuDataLimit(Constants.DATA_LIMIT_UESR);
				// 新建用户时创建默认角色
				user.setuRoleId(0L);
				// 增加level，尚品员工默认level为1
				user.setLevel(new Byte("1"));
			}
			if (userService.saveUser(user) > 0) {
				ResultBean<Long> successResult = ResultBean.getSuccessResult(user.getId());
				successResult.setId(user.getId());
				return successResult;
			} else {
				return new ResultBean("-1", "新增用户失败");
			}
		}
	}

	/**
	 * 新增 编辑 伪删除用户 new
	 * 
	 * @param vo
	 * @return
	 */
	@Transactional
	@RequestMapping(value = "saveOrUpdateInfo", method = RequestMethod.POST)
	public ResultBean<User> saveOrUpdateInfo(@RequestBody UserSaveOrUpdateVo vo) {
		User user = JSONUtil.trans(vo, User.class);
		// 通过oaid查询用户信息 若存在则更新 不存在则入库
		User currentUser = userService.queryForUserByOAid(vo.getOaid());
		if (currentUser != null) {
			user.setId(currentUser.getId());
			userService.updateUser(user);
		} else {
			user.setuRoleId(2L);
			userService.saveUser(user);
		}
		return ResultBean.getSuccessResult(user);
	}

	@Transactional
	@PostMapping("updateStatus")
	public ResultBean<Long> updateStatus(@RequestBody UserSaveOrUpdateVo vo) {
		User user = JSONUtil.trans(vo, User.class);
		if (user != null && user.getId() != null) {
			// 执行更新
			user.setUpdateTime(new Date());
			if (vo.getUpdateUser() == null) {
				user.setUpdateUser(vo.getPuserId());
			}
			// 如果是注销用户并且注销的是公司的销售员工,并且uid不为null,则调用分销中心接口
			if (user.getuStatus().equals(Constants.USER_DELETE)) {
				logger.error("注销同步#### 是删除###");
				User u = userService.queryForUserByIdSingle(user.getId());

				// 删除虚拟分组数据
				Integer deleteResult = userGroupMapper.deleteByUserAccount(u.getuWxOpenId());

				// 判断ustype为1
				if (u.getuStype().equals(Constants.USER_STYPE_SALE_YES) && u.getuUid() != null) {
					logger.error("注销同步 #### stype为1 并且 uid 不为null");
					String url = fxUrl + "/zjqd-web/channels/sp/partner/logout.do";
					logger.error("注销同步url #########" + url);
					Map<String, String> params = new HashMap<>();
					params.put("uid", u.getuUid());
					JSONObject encoding = EncodingObjectWithMd5Utils.encoding(params);
					System.out.println("注销同步map  ####### " + encoding.toJSONString());
					Map encodedMap = encoding;
					// 调用分销接口
					JSONObject resultJson = HttpClientUtils.httpPost(url, encodedMap);
					logger.error("分销同步返回结果 #### " + resultJson.toJSONString());
					logger.error("分销同步返回结果 #### code" + resultJson.get("code") + "msg: " + resultJson.get("msg"));
					// 更新状态
					Integer result = userService.updateStatus(user);
					return new ResultBean(resultJson.get("code").toString(), (String) resultJson.get("msg"));
				}
			}
			Integer result = userService.updateStatus(user);
			if (result > 0) {
				return ResultBean.getSuccessResult((long) result);
			} else {
				return new ResultBean("-1", "更新用户失败");
			}
		}
		return new ResultBean("-1", "更新用户失败");
	}

	@PostMapping("mobileLoginResult")
	public ResultBean<MobileLoginResultDO> queryMobileLoginResult(@RequestBody MobileLoginResultQueryVo vo) {
		MobileLoginResultQueryDTO trans = JSONUtil.trans(vo, MobileLoginResultQueryDTO.class);
		return ResultBean.getIndexSuccessResult(userService.queryMobileLoginResult(trans));
	}

	@GetMapping("login/{openId}")
	public ResultBean<User> queryForUserByOpenId(@PathVariable String openId,
			@RequestParam(value = "from", required = false) Integer from) {
		com.jdy.b2b.api.util.DataContext.set("loginByOpenIdFrom", from);
		return ResultBean.getSuccessResult(userService.queryForUserByOpenId(openId, from));
	}

	@GetMapping("queryFrontUser/{uAccount}")
	public ResultBean<WXUserResultDO> queryFrontUser(@PathVariable String uAccount) {
		WXUserResultDO result = userService.queryFrontUser(uAccount);
		return ResultBean.getSuccessResult(result);
	}

	/**
	 * 代理人列表查询
	 * 
	 * @param vo
	 * @return
	 */
	@PostMapping("distList")
	public ResultBean<PageInfo<AgentUserDO>> selectDistUserList(@RequestBody UserDistQueryVo vo) {
		if (vo.getCurrPage() != null && vo.getPageSize() != null) {
			PageHelper.startPage(vo.getCurrPage(), vo.getPageSize());
		}
		List<AgentUserDO> userList = userService.selectDistUserList(vo.getSearchStr());
		return ResultBean.getSuccessResult(new PageInfo(userList));
	}

	/**
	 * 代理人信息查询
	 * 
	 * @param id
	 * @return
	 */
	@GetMapping("selectDistUserInfo/{id}")
	public ResultBean<User> selectDistUserInfo(@PathVariable Long id) {
		User user = userService.selectDistUserInfo(id);
		if (user.getuDepartmentId() == null) {
			user.setuDepartmentId(-1L);
		}
		return ResultBean.getSuccessResult(user);
	}

	/**
	 * 代理人信息查询
	 * 
	 * @param vo
	 * @return
	 */
	@PostMapping("updateDistUser")
	public ResultBean<Long> updateDistUser(@RequestBody DistUserUpdateVo vo) {
		User user = JSONUtil.trans(vo, User.class);
		// 判断一个部门只能有一个管理员
		if (vo.getuDepartmentId() != null) {
			List<User> adminList = userService.selectAdminOfDepart(vo.getuDepartmentId());
			if (adminList.size() > 0 && vo.getuDepartmentId() != adminList.get(0).getuDepartmentId()) {
				throw new RuntimeException("每个部门职能有一个负责人!");
			}
		}
		int result = userService.updateDistUser(user);
		if (result > 0) {
			return ResultBean.getSuccessResult((long) result);
		} else {
			return new ResultBean("-1", "更新用户失败");
		}
	}

	@GetMapping("subDistUserCount/{departId}")
	public ResultBean<List<DepartDistDO>> selectSubDistUserByDepartId(@PathVariable("departId") Long departId) {
		return ResultBean.getSuccessResult(userService.selectSubDistUserByDepartId(departId));
	}
	/*
	 * @GetMapping("selectMaxUserId") public ResultBean selectMaxUserId(){
	 * //return ResultBean.getSuccessResult(userService.selectMaxUserId());
	 * return ResultBean.getSuccessResult(userService.selectMaxUserNO());
	 * //return ResultBean.getSuccessResult(userService.selectMaxUserId()); }
	 */

	@RequestMapping(value = "updateUser", method = RequestMethod.POST)
	public ResultBean<Integer> updateUser(@RequestBody UserSaveOrUpdateVo vo) {
		User trans = JSONUtil.trans(vo, User.class);
		return ResultBean.getSuccessResult(userService.updateUserWithNull(trans));
	}

	@PostMapping("querySuperUsersByPosition")
	public ResultBean querySuperUsersByPosition(@RequestBody UserSuperPositionVO user) {
		return ResultBean.getSuccessResult(userService.querySuperUsersByPosition(user));
	}

	@GetMapping("pInfo/{uId}")
	public ResultBean getUserPinfo(@PathVariable Long uId) {
		return ResultBean.getSuccessResult(userService.getUserPinfo(uId));
	}

	/**
	 * @Description: 批量保存用户信息
	 * @author 王斌
	 * @date 2018年4月18日 下午3:20:35
	 * @param vo
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@Transactional
	@RequestMapping(value = "batchSaveOrUpdateInfo", method = RequestMethod.POST)
	public ResultBean<String> batchSaveOrUpdateInfo(@RequestBody BatchSaveOrUpdateInfoVO vo) {
		List<User> userList = JSONUtil.transInSide(vo.getUserList(), User.class);
		if (vo.getUserIdList().size() > 0) {
			userService.batchDeleteById(vo.getUserIdList());
		}
		if (userList.size() > 0) {
			userService.batchSaveUser(userList);
		}
		return ResultBean.getSuccessResult();
	}
}
