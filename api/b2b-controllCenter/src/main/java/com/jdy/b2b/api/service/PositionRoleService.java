package com.jdy.b2b.api.service;

import com.jdy.b2b.api.model.module.Module;
import com.jdy.b2b.api.model.position.PositionRole;
import com.jdy.b2b.api.model.position.PositionRoleDto;
import com.jdy.b2b.api.model.role.RolesDTO;

import java.util.List;

/**
 * Created by dugq on 2018/3/24.
 */
public interface PositionRoleService {
    int deleteByPrimaryKey(Long id);

    int insert(PositionRole record);

    int insertSelective(PositionRole record);

    PositionRole selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(PositionRole record);

    int updateByPrimaryKey(PositionRole record);

    int addPositionRoles(PositionRoleDto positionRoleDto);

    List<RolesDTO> selectByPositionId(Long positionId);

    List<Module> selectModulesByPositionId(Long positionId);
}
