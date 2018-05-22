package com.jdy.b2b.api.dao.role;

import com.jdy.b2b.api.model.role.Roles;
import com.jdy.b2b.api.model.role.RolesVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

/**
 * Created by strict on 2017/11/16.
 */
@Mapper
public interface RoleMapper {

    /**
     * 搜索 登录所在公司及下属公司中 某个名字的角色列表 或 直接展示
     * @param rolesVO
     * @return
     */
    List<Roles> selectByName(RolesVO rolesVO);

    int updateRoleBySelective(RolesVO rolesVO);

    int insertRoleBySelective(RolesVO rolesVO);

    int deleteByRoleId(@Param("id") Long roleId);

    Roles selectById(Long roleId);

    List<Roles> selectRolesByRoleIdList(@Param("roleIdList") List<Integer> roleIdList);

    List<Map> selectRoleListByUserId(@Param("userId") Long userId);
}
