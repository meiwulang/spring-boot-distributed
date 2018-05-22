package com.jdy.b2b.web.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.cache.Cache;
import org.apache.shiro.cache.ehcache.EhCacheManager;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSON;
import com.jdy.b2b.web.pojo.distributionSystemEntity.DistributionSystemResponse;
import com.jdy.b2b.web.pojo.distributionSystemEntity.login.Dept;
import com.jdy.b2b.web.pojo.distributionSystemEntity.login.Employee;
import com.jdy.b2b.web.pojo.distributionSystemEntity.login.OpenIdLoginResult;
import com.jdy.b2b.web.pojo.distributionSystemEntity.login.OrgChart;
import com.jdy.b2b.web.pojo.distributionSystemEntity.login.Position;
import com.jdy.b2b.web.pojo.user.BatchSaveOrUpdateInfoVO;
import com.jdy.b2b.web.pojo.user.DistUserUpdateVo;
import com.jdy.b2b.web.pojo.user.MobileLoginResultDO;
import com.jdy.b2b.web.pojo.user.MobileLoginResultQueryVo;
import com.jdy.b2b.web.pojo.user.User;
import com.jdy.b2b.web.pojo.user.UserDistQueryVo;
import com.jdy.b2b.web.pojo.user.UserQueryVo;
import com.jdy.b2b.web.pojo.user.UserResultDTO;
import com.jdy.b2b.web.pojo.user.UserResultSycnDTO;
import com.jdy.b2b.web.pojo.user.UserSaveOrUpdateVo;
import com.jdy.b2b.web.pojo.user.UserSuperPositionVO;
import com.jdy.b2b.web.pojo.user.WXUserResultDO;
import com.jdy.b2b.web.service.UserService;
import com.jdy.b2b.web.util.BaseService;
import com.jdy.b2b.web.util.PinyinUtil;
import com.jdy.b2b.web.util.ResultBean;

/**
 * Created by yangcheng on 2017/7/11.
 */
@Service
@SuppressWarnings({ "unchecked", "rawtypes" })
public class UserServiceImpl extends BaseService implements UserService {

	@Autowired
	@Qualifier("shiroEhcacheManager")
	private EhCacheManager ehCacheManager;
	@Value("${spring.distributionSystemUrl}")
	private String getUserInfo;
	private static final String FEMALE = "1";
	private static final String SALER_POSTION = "1";

	@Override
	public ResultBean<User> queryForUserById(Long id) {
		StringBuffer url = new StringBuffer(systemCenterUrl).append("user/get/").append(id);
		return restTemplate.getForEntity(url.toString(), ResultBean.class).getBody();
	}

	@Override
	public ResultBean queryUserListForPage(UserQueryVo vo) {
		StringBuffer url = new StringBuffer(systemCenterUrl).append("user/list");
		return restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody();
	}

	@Override
	public ResultBean<Long> saveOrUpdateUsers(UserSaveOrUpdateVo vo) {
		StringBuffer url = new StringBuffer(systemCenterUrl).append("user/saveOrUpdate");
		return restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody();
	}

	@Override
	public ResultBean<UserResultDTO> queryForUserByAccount(String account) {

		StringBuffer url = new StringBuffer(systemCenterUrl).append("user/account/").append(account);
		ResultBean<UserResultDTO> result = restTemplate.getForEntity(url.toString(), ResultBean.class).getBody();
		// logger.info(result.getBody().getuAccount()+"~~~~~~~~~~~~~~~service");
		return result;
	}

	/**
	 * 同步代理人信息
	 * 
	 * @param vo
	 * @return
	 */
	@Override
	public ResultBean<UserResultSycnDTO> syncUser(UserQueryVo vo) {
		StringBuffer url = new StringBuffer(systemCenterUrl).append("user/syncUser");
		return restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody();
	}

	@Override
	public ResultBean<User> queryForUserByTel(String uTel) {
		StringBuffer url = new StringBuffer(systemCenterUrl).append("user/tel/").append(uTel);
		ResultBean<User> result = restTemplate.getForEntity(url.toString(), ResultBean.class).getBody();
		return result;
	}

	@Override
	public ResultBean<User> queryForUserByIdSingle(Long id) {
		StringBuffer url = new StringBuffer(systemCenterUrl).append("user/single/").append(id);
		return restTemplate.getForEntity(url.toString(), ResultBean.class).getBody();
	}

	@Override
	public ResultBean<MobileLoginResultDO> queryMobileLoginResult(MobileLoginResultQueryVo vo) {
		StringBuffer url = new StringBuffer(systemCenterUrl).append("user/mobileLoginResult");
		return restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody();
	}

	@Override
	public ResultBean<User> queryForUserByOpenId(String openId, Integer from) {
		StringBuffer url = new StringBuffer(systemCenterUrl).append("user/login/").append(openId).append("?from=");
		if (from != null) {
			url.append(from);
		}
		return restTemplate.getForEntity(url.toString(), ResultBean.class).getBody();
	}

	@Override
	public void putFrontUserIntoCache(String uAccount) {
		StringBuffer url = new StringBuffer(systemCenterUrl).append("user/queryFrontUser/").append(uAccount);
		ResultBean<WXUserResultDO> result = restTemplate.getForEntity(url.toString(), ResultBean.class).getBody();
		WXUserResultDO wxUser = result.getParsedEnitity(WXUserResultDO.class);
		// 将前端用户信息放入缓存
		Subject subject = SecurityUtils.getSubject();
		Cache<Object, Object> cache = ehCacheManager.getCache("currentUserCache");

		cache.put(((UserResultDTO) subject.getPrincipal()).getuAccount() + "_front", wxUser);
	}

	@Override
	public ResultBean selectDistUserList(UserDistQueryVo vo) {
		StringBuffer url = new StringBuffer(systemCenterUrl).append("user/distList");
		ResultBean result = restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody();
		return result;
	}

	@Override
	public ResultBean<User> selectDistUserInfo(Long id) {
		StringBuffer url = new StringBuffer(systemCenterUrl).append("user/selectDistUserInfo/").append(id);
		return restTemplate.getForEntity(url.toString(), ResultBean.class).getBody();
	}

	@Override
	public ResultBean<Long> updateDistUser(DistUserUpdateVo vo) {
		StringBuffer url = new StringBuffer(systemCenterUrl).append("user/updateDistUser");
		return restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody();
	}

	@Override
	public ResultBean selectMaxUserId() {
		StringBuffer url = new StringBuffer(systemCenterUrl).append("user/selectMaxUserId");
		return restTemplate.getForEntity(url.toString(), ResultBean.class).getBody();
	}

	@Override
	public ResultBean updateStatus(UserSaveOrUpdateVo vo) {
		StringBuffer url = new StringBuffer(systemCenterUrl).append("user/updateStatus");
		return restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody();
	}

	@Override
	public ResultBean<Long> updateUser(UserSaveOrUpdateVo vo) {
		StringBuffer url = new StringBuffer(systemCenterUrl).append("user/updateUser");
		return restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody();
	}

	@Override
	public ResultBean<List<Integer>> queryForUserByAccountWithOutStatus(UserSaveOrUpdateVo user) {
		StringBuffer url = new StringBuffer(systemCenterUrl).append("user/accountWithOutStatus/");
		return restTemplate.postForEntity(url.toString(), user, ResultBean.class).getBody();
	}

	@Override
	public ResultBean querySuperUsersByPosition(UserSuperPositionVO user) {
		StringBuffer url = new StringBuffer(systemCenterUrl).append("user/querySuperUsersByPosition");
		return restTemplate.postForEntity(url.toString(), user, ResultBean.class).getBody();
	}

	@Override
	public ResultBean<UserResultDTO> saveOrUpdateUsersByoaId(UserSaveOrUpdateVo vo) {
		StringBuffer url = new StringBuffer(systemCenterUrl).append("user/saveOrUpdateInfo");
		return restTemplate.postForEntity(url.toString(), vo, ResultBean.class).getBody();
	}

	@Override
	public ResultBean notifyUpdateUserInfo(List<Long> userIds) {
		// 组装参数
		StringBuffer url = new StringBuffer(distributionSystemUrl).append("/sm/user/userIdMobileLoginList");
		Map<String, Object> params = new HashMap() {
			private static final long serialVersionUID = 1L;
			{
				put("cloudId", 2);
				put("userIdList", userIds);
			}
		};

		// 接口调用
		logger.error("调用用户中心查询指定用户信息接口:\nurl=" + url);
		logger.error(new StringBuilder("调用用户中心查询指定用户信息接口入参:\n").append(params).toString());
		ResponseEntity<DistributionSystemResponse> responseEntity = restTemplate.postForEntity(url.toString(), params,
				DistributionSystemResponse.class);
		DistributionSystemResponse body = responseEntity.getBody();
		logger.error("调用用户中心查询指定用户信息接口出参:\n" + body);
		List<OpenIdLoginResult> resultList = JSON.parseArray(JSON.toJSONString(body.getData()),
				OpenIdLoginResult.class);
		if (!Objects.equals(responseEntity.getStatusCode(), HttpStatus.OK)
				|| (!Objects.equals(body.getCode(), 200) && !Objects.equals(body.getCode(), 300))) {
			logger.error("调用用户中心查询指定用户信息接口失败");
			return new ResultBean("-1", "调用用户中心查询指定用户信息接口失败");
		}

		// 参数重组
		if (resultList == null) {
			resultList = new ArrayList<>(0);
		}
		int size = resultList.size();
		List<UserSaveOrUpdateVo> distList = new ArrayList<>(size);
		recombineUsers(resultList, distList);
		BatchSaveOrUpdateInfoVO vo = new BatchSaveOrUpdateInfoVO(distList, userIds);

		// 持久化数据
		StringBuffer saveUrl = new StringBuffer(systemCenterUrl).append("user/batchSaveOrUpdateInfo");
		return restTemplate.postForEntity(saveUrl.toString(), vo, ResultBean.class).getBody();
	}

	private void recombineUsers(List<OpenIdLoginResult> srcList, List<UserSaveOrUpdateVo> distList) {
		for (OpenIdLoginResult item : srcList) {
			distList.add(recombineUser(item));
		}
	}

	/**
	 * @Description: 重组用户信息
	 * @author 王斌
	 * @date 2018年3月26日 下午1:48:52
	 */
	private UserSaveOrUpdateVo recombineUser(OpenIdLoginResult responseBody) {
		UserSaveOrUpdateVo uservo = new UserSaveOrUpdateVo();
		Employee employee = responseBody.getEmployee();
		Position position = responseBody.getPosition();
		Dept dept = responseBody.getDept();
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
		Integer positionType = responseBody.getPosition().getPositionType();// 1销售
		// 2非销售
		// `u_type` int(1) NOT NULL COMMENT '用户区分0:非销售类员工1:销售类员工',
		if (SALER_POSTION.equals(positionType)) {
			uservo.setuType(1);
			uservo.setuStype(1);
		} else {
			uservo.setuType(0);
			uservo.setuStype(0);
		}
		uservo.setOaid(employee.getEmployeeId());
		uservo.setuLastLogin(new Date());
		uservo.setuStatus(employee.getEmployeeState() == 0 ? 1 : 0);
		uservo.setuPassword("");
		uservo.setuRealName(realName);
		uservo.setPuDataLimit(2);
		uservo.setuDataLimit(2);
		uservo.setuRoleId(44L);
		return uservo;
	}
}
