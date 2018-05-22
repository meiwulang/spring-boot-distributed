package com.jdy.b2b.api.dao.roleModule;

import com.jdy.b2b.api.model.role.Roles;
import com.jdy.b2b.api.model.role.RolesVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
 * Created by strict on 2017/11/16.
 */
@Mapper
public interface RoleModuleMapper {
    List<Long> selectModuleIdByRole(Roles roles);

    int deleteRelByRole(Roles roles);

    int insertRelByRole(RolesVO rolesVO);
}
