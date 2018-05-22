package com.jdy.b2b.api.service;

import java.util.List;
import java.util.Map;

import com.jdy.b2b.api.common.ResultBean;
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
import com.jdy.b2b.api.vo.struct.QueryManagerVO;
import com.jdy.b2b.api.vo.struct.SetManagerVO;
import com.jdy.b2b.api.vo.user.SynchronizeUserInfo;

/**
 * Created by yangcheng on 2017/7/4.
 */
public interface UserService {
	List<UserResultDTO> queryUserListForPage(User users);

	List<UserResultSycnDTO> syncUser(User users);

	int updateUser(User users);

	int saveUser(User users);

	UserExtendDTO queryForUserById(Long id);

	UserResultDTO queryForUserByAccount(String account);

	User queryForUserByTel(String tel);

	User queryForUserByIdSingle(Long id);

	User queryForUserByOAid(Long oaid);

	MobileLoginResultDO queryMobileLoginResult(MobileLoginResultQueryDTO trans);

	User queryForUserByOpenId(String openId, Integer from);

	WXUserResultDO queryFrontUser(String uAccount);

	int synchronizeUserInfo(SynchronizeUserInfo info);

	User selectForUserByAccount(String phone);

	List<AgentUserDO> selectDistUserList(String searchStr);

	User selectDistUserInfo(Long id);

	int updateDistUser(User user);

	List<DepartDistDO> selectSubDistUserByDepartId(Long departId);

	List<User> selectAdminOfDepart(Long departId);

	ResultBean<Object> setManagerForDepartment(SetManagerVO vo);

	ResultBean<Object> managers(QueryManagerVO vo);

	String selectMaxUserNO(Integer flag);

	// Long selectMaxUserId();

	int updateStatus(User user);

	int updateUserWithNull(User trans);

	List<Integer> queryForUserByAccountWithOutStatus(String account, String tel);

	ResultBean queryUserByRealNameAndPhone(String realName, String phone);

	List<User> querySuperUsersByPosition(UserSuperPositionVO user);

	int insertUserGroup(UserGroup record);

	List<UserGroup> selectByUserAccount(String name, String gno);

	List<Map<String, Object>> selectOldUnoById();

	Map<String, Object> getUserPinfo(Long uId);

	List<User> leader(Long id);

	/**
	 * @Description: 批量删除用户
	 * @author 王斌
	 * @date 2018年4月18日 下午2:49:12
	 * @param userIdList
	 */
	int batchDeleteById(List<Long> userIdList);

	/**
	 * @Description: 批量保存用户
	 * @author 王斌
	 * @date 2018年4月18日 下午4:01:16
	 * @param userList
	 */
	int batchSaveUser(List<User> userList);

}
