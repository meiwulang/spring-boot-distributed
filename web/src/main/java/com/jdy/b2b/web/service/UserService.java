package com.jdy.b2b.web.service;

import java.util.List;

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
import com.jdy.b2b.web.util.ResultBean;

/**
 * Created by yangcheng on 2017/7/11.
 */
@SuppressWarnings({ "rawtypes" })
public interface UserService {
	ResultBean<User> queryForUserById(Long id);

	ResultBean queryUserListForPage(UserQueryVo vo);

	ResultBean<Long> saveOrUpdateUsers(UserSaveOrUpdateVo vo);

	ResultBean<UserResultDTO> saveOrUpdateUsersByoaId(UserSaveOrUpdateVo vo);

	ResultBean<UserResultDTO> queryForUserByAccount(String account);

	ResultBean<UserResultSycnDTO> syncUser(UserQueryVo vo);

	ResultBean<User> queryForUserByTel(String uTel);

	ResultBean<User> queryForUserByIdSingle(Long id);

	ResultBean<MobileLoginResultDO> queryMobileLoginResult(MobileLoginResultQueryVo vo);

	ResultBean<User> queryForUserByOpenId(String openId, Integer from);

	void putFrontUserIntoCache(String uAccount);

	ResultBean selectDistUserList(UserDistQueryVo vo);

	ResultBean<User> selectDistUserInfo(Long id);

	ResultBean<Long> updateDistUser(DistUserUpdateVo vo);

	ResultBean selectMaxUserId();

	ResultBean updateStatus(UserSaveOrUpdateVo vo);

	ResultBean<Long> updateUser(UserSaveOrUpdateVo vo);

	ResultBean<List<Integer>> queryForUserByAccountWithOutStatus(UserSaveOrUpdateVo vo);

	ResultBean<List<User>> querySuperUsersByPosition(UserSuperPositionVO user);

	/**
	 * @Description: 用户信息修改同步通知
	 * @author 王斌
	 * @date 2018年4月18日 上午9:43:50
	 * @param userIds
	 * @return
	 */
	ResultBean notifyUpdateUserInfo(List<Long> userIds);
}
