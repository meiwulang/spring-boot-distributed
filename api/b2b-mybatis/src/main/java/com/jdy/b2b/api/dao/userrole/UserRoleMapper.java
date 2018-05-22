package com.jdy.b2b.api.dao.userrole;


import com.jdy.b2b.api.model.userrole.UserRole;
import com.jdy.b2b.api.model.userrole.UserRolePrivilegeDO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserRoleMapper {
    int deleteByPrimaryKey(Long id);

    int insert(UserRole record);

    int insertSelective(UserRole record);

    UserRole selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(UserRole record);

    int updateByPrimaryKeyWithBLOBs(UserRole record);

    int updateByPrimaryKey(UserRole record);
	
	 /*自定义*/

    List<UserRole> getRoleList(UserRole userrole);

    UserRolePrivilegeDO selectUserRolePrivilegeByUserId(@Param("userId") Long userId);

    int deleteByUserId(@Param("userId") Long userId);

    int insertUserRoleBatch(@Param("userRoleList") List<UserRole> userRoleList);

    List<UserRole> selectUserRoleByRoleId(Long roleId);
}