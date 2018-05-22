package com.jdy.b2b.api.service.impl;

import com.alibaba.fastjson.JSON;
import com.jdy.b2b.api.common.BaseService;
import com.jdy.b2b.api.common.Constants;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.common.StringUtils;
import com.jdy.b2b.api.dao.DepartmentMapper;
import com.jdy.b2b.api.dao.UserGroupMapper;
import com.jdy.b2b.api.dao.VirtualGroupMapper;
import com.jdy.b2b.api.dao.user.UserMapper;
import com.jdy.b2b.api.model.Department;
import com.jdy.b2b.api.model.user.*;
import com.jdy.b2b.api.model.virtualGroup.UserGroup;
import com.jdy.b2b.api.model.virtualGroup.VirtualGroup;
import com.jdy.b2b.api.service.UserService;
import com.jdy.b2b.api.util.MQAssembleService;
import com.jdy.b2b.api.vo.struct.QueryManagerVO;
import com.jdy.b2b.api.vo.struct.SetManagerVO;
import com.jdy.b2b.api.vo.user.SynchronizeUserInfo;
import org.apache.shiro.crypto.hash.SimpleHash;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.task.TaskExecutor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

import static org.apache.commons.lang3.StringUtils.isNotBlank;

/**
 * Created by yangcheng on 2017/7/4.
 */
@Service
public class UserServiceImpl extends BaseService implements UserService {

	@Autowired
	private UserMapper usersMapper;
	@Autowired
	private DepartmentMapper departmentMapper;
	@Autowired
	private UserGroupMapper userGroupMapper;
	@Autowired
	private VirtualGroupMapper virtualGroupMapper;
	@Autowired
	TaskExecutor taskExecutor;
	@Autowired
	MQAssembleService mqAssembleService;

	@Value("${spring.numberLimit}")
	private Integer numberLimit;

	@Override
	public List<UserResultDTO> queryUserListForPage(User users) {
		return usersMapper.queryForUserListForPage(users);
	}

	@Override
	public List<UserResultSycnDTO> syncUser(User users) {
		return usersMapper.syncUser(users);
	}

	@Override
	public int updateUser(User users) {
		int i = usersMapper.updateByPrimaryKeySelective(users);
		// taskExecutor.execute(() -> mqAssembleService.getMQClinet()
		// .syncSmUser(MQTransformationUtils.transSmUser(
		// usersMapper.queryForUserByIdSingle(users.getId()))));
		return i;
	}

	@Override
	public int saveUser(User users) {
		int result = usersMapper.insertSelective(users);
		// taskExecutor.execute(() -> mqAssembleService.getMQClinet()
		// .syncSmUser(MQTransformationUtils.transSmUser(
		// usersMapper.queryForUserByIdSingle(users.getId()))));
		return result;
	}

	@Override
	public UserExtendDTO queryForUserById(Long id) {
		UserExtendDTO user = usersMapper.selectById(id);
		return user;
	}

	@Override
	public UserResultDTO queryForUserByAccount(String account) {
		return usersMapper.selectByAccount(account);
	}

	@Override
	public User queryForUserByTel(String tel) {
		return usersMapper.queryForUserByTel(tel);
	}

	@Override
	public User queryForUserByIdSingle(Long id) {
		User u = usersMapper.queryForUserByIdSingle(id);
		if (isNotBlank(u.getuPuserid())) {
			User p = usersMapper.queryForUserByIdSingle(Long.parseLong(u.getuPuserid()));
			if (p != null) {
				u.setuPuserName(p.getuRealName());
			}
		}
		return u;
	}

	@Override
	public MobileLoginResultDO queryMobileLoginResult(MobileLoginResultQueryDTO trans) {
		return usersMapper.queryMobileLoginResultByAccount(trans);
	}

	@Override
	public User queryForUserByOpenId(String openId, Integer from) {
		return usersMapper.queryForUserByOpenId(openId, from);
	}

	@Override
	public WXUserResultDO queryFrontUser(String uAccount) {
		return usersMapper.queryFrontUser(uAccount);
	}

	@Override
	public int synchronizeUserInfo(SynchronizeUserInfo info) {
		logger.error(
				"synchronizeUserInfo ==========================================================================================="
						+ JSON.toJSONString(info));
		User user = usersMapper.selectUserByRealNameAndPhone(info.getRealname(), info.getPhone());
		// Department record = getDepartment(info);

		// create new VirtualGroup if without virtualGroup
		updateOrInsertVirtualGroup(info);

		if (Objects.isNull(user)) {

			User oUser = usersMapper.selectByOpenId(info.getOpenid());
			User pUser = usersMapper.selectByOpenId(info.getPid());

			if (Objects.isNull(oUser)) {
				user = new User();
				putUserIfno2AgentUser(info, user, pUser.getuDepartmentId(), pUser.getuCompanyId());
				logger.error("######insertSelective#########");
				int i = usersMapper.insertSelective(user);
				Long userId = user.getId();
				// taskExecutor.execute(() -> mqAssembleService.getMQClinet()
				// .syncSmUser(MQTransformationUtils.transSmUser(
				// usersMapper.queryForUserByIdSingle(userId))));
				logger.error("######insertSelective#########after####");
				logger.info(
						"insert user ==========================================================================================="
								+ JSON.toJSONString(user));

				// insert new userVirtualGroup relation
				updateOrInsertUserGroup(info, user);
				return i;
			} else {

				putUserInfoActivate(info, oUser, pUser == null ? null : pUser.getuDepartmentId(),
						pUser == null ? null : pUser.getuCompanyId());
				int i = usersMapper.updateByPrimaryKeySelective(oUser);
				logger.info(
						"通过 openid 找到用户信息 更新用户信息 ==========================================================================================="
								+ JSON.toJSONString(oUser));
				Long userId = user.getId();
				// taskExecutor.execute(() -> mqAssembleService.getMQClinet()
				// .syncSmUser(MQTransformationUtils.transSmUser(
				// usersMapper.queryForUserByIdSingle(userId))));
				updateOrInsertUserGroup(info, oUser);
				return i;
			}
		} else {
			if (null != user.getLevel() && user.getLevel() > 1) {
				if (info.getLevel() == 1) {// 由代理人转变为销售经理
					putAgentUserIfno2User(info, user);// 代理人转为销售经理(系统员工)
				} else {
					putUserIfno2UserAgent(info, user);// 代理人还是代理人
				}
			} else {
				// 原本就是已录入的员工
				putUserIfno2User(info, user);
			}
			int i = usersMapper.updateByPrimaryKeySelective(user);
			logger.info(
					"update user ==========================================================================================="
							+ JSON.toJSONString(user));
			Long userId = user.getId();
			// taskExecutor.execute(() -> mqAssembleService.getMQClinet()
			// .syncSmUser(MQTransformationUtils.transSmUser(
			// usersMapper.queryForUserByIdSingle(userId))));
			// select by account
			// update or insert
			updateOrInsertUserGroup(info, user);
			return i;
		}
	}

	private void putUserInfoActivate(SynchronizeUserInfo info, User user, Long departmentId, Long companyId) {
		putUserIfno2AgentUser(info, user, departmentId, companyId);
		user.setuStatus(0);
	}

	private void putUserIfno2AgentUser(SynchronizeUserInfo info, User user, Long departmentId, Long companyId) {
		user.setuDepartmentId(departmentId);
		user.setuAccount(info.getPhone());
		user.setuCompanyId(companyId);
		user.setuPassword(new SimpleHash("md5", "123456", user.getuAccount(), 3).toHex());
		user.setuDataLimit(0);
		user.setuRoleId((long) 999999);
		user.setuType(1);
		user.setuTel(info.getPhone());
		user.setuRealName(info.getRealname());
		user.setuWxOpenId(info.getOpenid());
		user.setuIdcard(info.getIdcard());
		user.setuStatus(0);
		user.setPid(info.getPid());
		user.setLevel(info.getLevel());
		user.setuPhone(info.getPhone());
		if (info.getLevel() == 1) {
			user.setuStype(1);
		} else {
			user.setuStype(2);
		}
		user.setuUid(info.getUid());
	}

	private Department getDepartment(SynchronizeUserInfo info) {
		// create new department if without department
		Department record = departmentMapper.selectByIdAndNo(info.getGroupId(), null, (long) 999999, null);
		if (Objects.isNull(record)) {
			record = new Department();
			record.setdName(info.getGroupName());
			record.setCompanyId((long) 999999);
			record.setdLevel(1);
			record.setdNo(info.getGroupId());
			record.setdPid((long) 0);
			record.setdStatus(0);
			departmentMapper.insertSelective(record);
			departmentMapper.updatePids();
			logger.error(
					"insert department ==========================================================================================="
							+ JSON.toJSONString(record));
		} else {
			record.setdName(info.getGroupName());
			departmentMapper.updateByPrimaryKeySelective(record);
		}
		return record;
	}

	private void updateOrInsertVirtualGroup(SynchronizeUserInfo info) {
		if (StringUtils.isNotNullOrEmptyStr(info.getvGroupId())) {
			String[] groupArr = info.getvGroupId().split(",");
			String[] groupNameArr = info.getvGroupName().split(",");
			// List<VirtualGroup> virtualGroups =
			// virtualGroupMapper.selectByNos(groupArr);
			for (int i = 0; i < groupArr.length; i++) {
				VirtualGroup virtualGroup = virtualGroupMapper.selectByNo(groupArr[i]);
				if (Objects.isNull(virtualGroup)) {
					virtualGroup = new VirtualGroup();
					virtualGroup.setCompanyId(999999);
					virtualGroup.setgName(groupNameArr[i]);
					virtualGroup.setgNo(groupArr[i]);
					virtualGroup.setgStatus(0);
					virtualGroupMapper.insertSelective(virtualGroup);
				} else {
					virtualGroup.setgName(groupNameArr[i]);
					virtualGroupMapper.updateByPrimaryKeySelective(virtualGroup);
				}
			}
		}
	}

	private void updateOrInsertUserGroup(SynchronizeUserInfo info, User user) {
		userGroupMapper.deleteByUserAccount(user.getuWxOpenId());
		if (StringUtils.isNotNullOrEmptyStr(info.getvGroupId())) {
			String[] groupArr = info.getvGroupId().split(",");
			for (String groupId : groupArr) {
				UserGroup userGroup = new UserGroup();
				userGroup.setgNo(groupId);
				userGroup.setuAccount(user.getuWxOpenId());
				userGroupMapper.insertSelective(userGroup);
			}
		}
	}

	@Override
	public User selectForUserByAccount(String phone) {
		return usersMapper.selectByAccountOnly(phone);
	}

	private void putUserIfno2User(SynchronizeUserInfo info, User user) {
		// user.setuAccount(info.getOpenid());
		// user.setuCompanyId((long) 999999);
		// user.setuPassword("123456");
		// user.setuDataLimit(0);
		// user.setuRoleId((long) 999999);
		// user.setuType(1);
		// user.setuTel(info.getPhone());
		// user.setuRealName(info.getRealname());
		user.setuWxOpenId(info.getOpenid());
		// user.setuIdcard(info.getIdcard());
		// user.setuStatus(0);
		user.setPid(info.getPid());
		user.setLevel(info.getLevel());
		// user.setuPhone(info.getPhone());
		if (info.getLevel() == 1) {
			user.setuStype(1);
		} else {
			user.setuStype(2);
		}
		user.setuUid(info.getUid());
	}

	private void putUserIfno2UserAgent(SynchronizeUserInfo info, User user) {
		// user.setuAccount(info.getOpenid());
		// user.setuCompanyId((long) 999999);
		// user.setuPassword("123456");
		// user.setuDataLimit(0);
		// user.setuRoleId((long) 999999);
		// user.setuType(1);
		// user.setuTel(info.getPhone());
		// user.setuRealName(info.getRealname());
		user.setuWxOpenId(info.getOpenid());
		// user.setuIdcard(info.getIdcard());
		// user.setuStatus(0);
		user.setPid(info.getPid());
		user.setLevel(info.getLevel());
		// user.setuPhone(info.getPhone());
		// if(info.getLevel()==1){
		// user.setuStype(1);
		// }else{
		// user.setuStype(2);
		// }
		user.setuUid(info.getUid());
	}

	private void putAgentUserIfno2User(SynchronizeUserInfo info, User user) {
		user.setuAccount(info.getPhone());
		// user.setuCompanyId((long) 999999);
		user.setuPassword(new SimpleHash("md5", "123456", user.getuAccount(), 3).toHex());
		// user.setuDataLimit(0);
		// user.setuRoleId((long) 999999);
		// user.setuType(1);
		// user.setuTel(info.getPhone());
		// user.setuRealName(info.getRealname());
		user.setuWxOpenId(info.getOpenid());
		// user.setuIdcard(info.getIdcard());
		// user.setuStatus(0);
		user.setPid(info.getPid());
		user.setLevel(info.getLevel());
		// user.setuPhone(info.getPhone());
		// if(info.getLevel()==1){
		user.setuStype(1);
		// }else{
		// user.setuStype(2);
		// }
		user.setuUid(info.getUid());
	}

	@Override
	public List<AgentUserDO> selectDistUserList(String searchStr) {
		return usersMapper.selectDistUserList(searchStr);
	}

	@Override
	public User selectDistUserInfo(Long id) {
		return usersMapper.selectDistUserInfo(id);
	}

	@Override
	public int updateDistUser(User user) {
		int i = usersMapper.updateDistUser(user);
		// taskExecutor.execute(() -> mqAssembleService.getMQClinet()
		// .syncSmUser(MQTransformationUtils.transSmUser(
		// usersMapper.queryForUserByIdSingle(user.getId()))));
		return i;
	}

	@Override
	public List<DepartDistDO> selectSubDistUserByDepartId(Long departId) {
		List<DepartDistDO> list = usersMapper.selectSubDistUserByDepartId(departId);

		// 计算每个代理人的下线数量
		Map<String, Integer> map = new HashMap<>(list.size());
		list.stream().forEach(u -> {
			map.put(u.getuAccount(), 0);
		});
		// 1.过滤掉没有推荐人的代理人
		// 2.有推荐人的代理人 找到对应的代理人 然后在代理人的map中加1
		// 3.另外 将代理人a的下线数量全部加在a的推荐人b中

		// 共五级分销商,现已完成第四级分销商的统计
		list.stream().filter(u -> (u.getLevel() == 5)).forEach(u -> {
			map.put(u.getPid(), map.get(u.getPid()) + 1);
		});

		list.stream().filter(u -> (u.getLevel() == 4)).forEach(u -> {
			map.put(u.getPid(), map.get(u.getPid()) + 1);
			map.put(u.getPid(), map.get(u.getuAccount()));
		});

		list.stream().filter(u -> (u.getLevel() == 3)).forEach(u -> {
			map.put(u.getPid(), map.get(u.getPid()) + 1);
			map.put(u.getPid(), map.get(u.getuAccount()));
		});

		list.stream().filter(u -> (u.getLevel() == 2)).forEach(u -> {
			map.put(u.getPid(), map.get(u.getPid()) + 1);
			map.put(u.getPid(), map.get(u.getuAccount()));
		});

		list.stream().forEach(u -> {
			u.setuCount(map.get(u.getuAccount()));
		});

		return list;
	}

	@Override
	public List<User> selectAdminOfDepart(Long departId) {
		return usersMapper.selectAdminOfDepart(departId);
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public ResultBean<Object> setManagerForDepartment(SetManagerVO vo) {
		// 查询将要处理的用户是否可以满足修改条件
		Long managerId = vo.getManagerId();
		Long orgId = vo.getOrgId();
		User manager = usersMapper.queryForUserByIdSingle(managerId);
		Integer getuDtype = manager.getuDtype();
		Long companyId = vo.getCompanyId();
		if (manager == null || !Integer.valueOf(0).equals(manager.getuStatus())
				|| (!Integer.valueOf(3).equals(getuDtype) && !Integer.valueOf(4).equals(getuDtype))
				|| !Objects.equals(manager.getuCompanyId(), companyId)
				|| !Objects.equals(manager.getuDepartmentId(), orgId)) {
			return new ResultBean<>(Constants.Error.COMMON_ERROR_CODE, "无效用户");
		}
		// // 查询当前负责人基本信息
		// User currentManager = usersMapper
		// .queryForManagerByDepartmentIdAndCompanyId(orgId,
		// vo.getCompanyId());
		// if (currentManager != null) {
		// currentManager.setuChargeType(Integer.valueOf(0));
		// usersMapper.updateByPrimaryKey(currentManager);
		// }
		usersMapper.updateByDepartmentIdAndCompanyId(orgId, companyId);
		User user = new User();
		user.setUpdateTime(new Date());
		user.setuDepartmentId(orgId);
		user.setUpdateUser(vo.getUpdateUser());
		user.setId(managerId);
		user.setuChargeType(Integer.valueOf(1));
		if (usersMapper.setManagerForDepartment(user) < 1) {
			return new ResultBean<>(Constants.Error.COMMON_ERROR_CODE, "操作失败");
		} else {
			// taskExecutor.execute(() -> mqAssembleService.getMQClinet()
			// .syncSmUser(MQTransformationUtils.transSmUser(
			// usersMapper.queryForUserByIdSingle(user.getId()))));
			return ResultBean.getSuccessResult();
		}
	}

	@Override
	public ResultBean<Object> managers(QueryManagerVO vo) {
		User user = new User();
		user.setuRealName(vo.getName());
		user.setuCompanyId(vo.getCompanyId());
		user.setuDepartmentId(vo.getDepartmentId());
		return ResultBean.getSuccessResult(usersMapper.managers(user));
	}

	/*
	 * @Override public Long selectMaxUserId() { return
	 * usersMapper.selectMaxUserId(); }
	 */
	@Override
	public String selectMaxUserNO(Integer flag) {
		return usersMapper.selectMaxUserNO(flag);
	}

	@Override
	public int updateStatus(User user) {
		int i = usersMapper.updateStatus(user);
		// taskExecutor.execute(() -> mqAssembleService.getMQClinet()
		// .syncSmUser(MQTransformationUtils.transSmUser(
		// usersMapper.queryForUserByIdSingle(user.getId()))));
		return i;
	}

	@Override
	public int updateUserWithNull(User trans) {
		int i = usersMapper.updateUserWithNull(trans);
		// taskExecutor.execute(() -> mqAssembleService.getMQClinet()
		// .syncSmUser(MQTransformationUtils.transSmUser(
		// usersMapper.queryForUserByIdSingle(trans.getId()))));
		return i;
	}

	@Override
	public List<Integer> queryForUserByAccountWithOutStatus(String account, String tel) {
		return usersMapper.queryForUserByAccountWithOutStatus(account, tel);
	}

	@Override
	public ResultBean queryUserByRealNameAndPhone(String realName, String phone) {
		Map<String, Object> resultMap = new HashMap<>();
		User user = usersMapper.selectUserByRealNameAndPhone(realName, phone);
		if (Objects.equals(user, null)) {
			logger.error("该用户不存在！");
			resultMap.put("existence", "0");
			return ResultBean.getSuccessResult(resultMap);
		}

		boolean flag = (!Objects.equals(user.getuPositionId(), null))
				&& (user.getuPositionId().longValue() == 200L || user.getuPositionId().longValue() == 201L);
		if (flag) {
			user.setuType(0);
		}
		resultMap.put("existence", 1);
		resultMap.put("groupName", user.getuStype());
		resultMap.put("saleMangerState", user.getuType());
		resultMap.put("limited", numberLimit);
		resultMap.put("uid", user.getId());
		resultMap.put("companyid", user.getuCompanyId());
		logger.error("返回值：" + resultMap.toString());
		return ResultBean.getSuccessResult(resultMap);
	}

	@Override
	public List<User> querySuperUsersByPosition(UserSuperPositionVO user) {
		return usersMapper.querySuperUsersByPosition(user);
	}

	@Override
	public int insertUserGroup(UserGroup record) {
		int group = userGroupMapper.insertSelective(record);
		return group;
	}

	@Override
	public List<UserGroup> selectByUserAccount(String name, String gno) {
		return userGroupMapper.selectByUserAccount(name, gno);
	}

	@Override
	public List<Map<String, Object>> selectOldUnoById() {
		return usersMapper.selectOldUnoById();
	}

	@Override
	public Map<String, Object> getUserPinfo(Long uId) {
		User user = usersMapper.queryForUserByIdSingle(uId);
		if (Objects.isNull(user) || Objects.isNull(user.getuWxOpenId())) {
			throw new RuntimeException("未查找到用户!");
		}
		String wxOpenId = user.getuWxOpenId();
		// 查询卖家上级信息
		Map<String, Object> userPinfo = usersMapper.getUserPinfo(wxOpenId);
		// 查询卖家销售经理信息
		Long childById = usersMapper.getChildById(wxOpenId);
		Map<String, Object> userMinfo = usersMapper.getUserMinfo(childById);
		// 将买家销售经理信息放入买家上级信息中,一并返回
		userPinfo.keySet().stream().forEach(s -> {
			userMinfo.put(s, userPinfo.get(s));
		});
		return userMinfo;
	}

	@Override
	public List<User> leader(Long id) {
		return usersMapper.leader(id);
	}

	public static void main(String[] args) {
		System.out.println(new SimpleHash("md5", "123456", "15990776226", 3).toHex());
	}

	@Override
	public User queryForUserByOAid(Long oaid) {
		return usersMapper.selectByOAid(oaid);
	}

	@Override
	public int batchDeleteById(List<Long> userIdList) {
		return usersMapper.batchDeleteById(userIdList);
	}

	@Override
	public int batchSaveUser(List<User> userList) {
		return usersMapper.batchSaveUser(userList);
	}

}
