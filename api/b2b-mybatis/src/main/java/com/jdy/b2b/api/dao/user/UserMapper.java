package com.jdy.b2b.api.dao.user;

import com.jdy.b2b.api.model.user.*;
import com.jdy.b2b.api.model.userrole.UserForUserRolePrivilegeDO;
import com.jdy.b2b.api.model.userrole.UserForUserRolePrivilegeDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Mapper
public interface UserMapper {
	List<UserResultSycnDTO> syncUser(User users);

	int deleteByPrimaryKey(Long id);

	int insert(User record);

	int insertSelective(User record);

	UserExtendDTO selectByPrimaryKey(Long id);

	UserExtendDTO selectById(Long id);

	int updateByPrimaryKeySelective(User record);

	int updateByPrimaryKey(User record);

	int updateByDepartmentIdAndCompanyId(@Param("department") Long department, @Param("companyId") Long companyId);

	/* 自定义 */

	List<UserResultDTO> queryForUserListForPage(User users);

	UserResultDTO selectByAccount(String account);

	User queryForUserByTel(String tel);

	User queryForUserByIdSingle(Long id);

	User queryForManagerByDepartmentIdAndCompanyId(@Param("department") Long department,
			@Param("companyId") Long companyId);

	MobileLoginResultDO queryMobileLoginResultByAccount(MobileLoginResultQueryDTO trans);

	User queryForUserByOpenId(@Param("openId") String openId, @Param("from") Integer from);

	WXUserResultDO queryFrontUser(String uAccount);

	User selectByAccountOnly(String uAccount);

	User selectByOpenId(String openid);

	List<User> selectUserListByDepartmentId(@Param("departmentId") Long departmentId,
			@Param("isEffective") Integer isEffective);

	List<AgentUserDO> selectDistUserList(@Param("searchStr") String searchStr);

	User selectDistUserInfo(Long id);

	int updateDistUser(User user);

	List<DepartDistDO> selectSubDistUserByDepartId(Long departId);

	List<User> selectAdminOfDepart(@Param("departId") Long departId);

	int setManagerForDepartment(User users);

	int getUserCountByDepartmentIds(List<Long> departmentIds);

	int getUserCountByCompanyId(Long companyId);

	List<LinkedHashMap<String, Object>> managers(User user);

	String selectMaxUserNO(Integer flag);

	// Long selectMaxUserId();

	List<UserForUserRolePrivilegeDO> selectUserForUserRolePrivilegeByDepartmentIdList(
			UserForUserRolePrivilegeDTO userForUserRolePrivilegeDTO);

	int updateStatus(User user);

	int updateDataPrivilegeByUserId(@Param("dataPrivilegeLevel") Integer dataPrivilegeLevel,
			@Param("userId") Long userId);

	int updateUserWithNull(User trans);

	List<Long> selectUserIdsBycompanyId(@Param("companyId") Long pcompanyId);

	List<Integer> queryForUserByAccountWithOutStatus(@Param("account") String account, @Param("tel") String tel);

	/**
	 * 根据 姓名 手机号 查询员工信息(排除游客身份)
	 * 
	 * @param realName
	 * @param phone
	 * @return
	 */
	User selectUserByRealNameAndPhone(@Param("realName") String realName, @Param("phone") String phone);

	List<User> querySuperUsersByPosition(UserSuperPositionVO user);

	List<Map<String, Object>> selectOldUnoById();

	int updateAllUnoNull();

	int updateAllUno(List<UserNoDTO> idNoList);

	List<Long> selectAllDistIds();

	// 查询上级用户信息
	Map<String, Object> getUserPinfo(String openid);

	// 查询销售经理信息
	Map<String, Object> getUserMinfo(Long id);

	/**
	 * 查找一个部门下 有效 状态的 代理人
	 * 
	 * @param departmentId
	 * @return
	 */
	List<User> selectAgentByDepartId(Long departmentId);

	List<User> leader(Long id);

	User selectSimpleById(Long id);

	User selectByOAid(Long oaid);

	String selectUserNameByPostionId(Long positionId);

	int batchDeleteById(List<Long> userIdList);

	int batchSaveUser(List<User> users);

	Long getChildById(String openId);
}