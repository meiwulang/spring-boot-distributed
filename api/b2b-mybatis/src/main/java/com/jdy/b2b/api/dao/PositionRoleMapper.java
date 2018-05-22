package com.jdy.b2b.api.dao;

import com.jdy.b2b.api.model.module.Module;
import com.jdy.b2b.api.model.position.PositionRole;
import com.jdy.b2b.api.model.position.PositionRoleDto;
import com.jdy.b2b.api.model.role.RolesDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface PositionRoleMapper {
    int deleteByPrimaryKey(Long id);

    int insert(PositionRole record);

    int insertSelective(PositionRole record);

    PositionRole selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(PositionRole record);

    int updateByPrimaryKey(PositionRole record);

    int deleteByPositionId(Long positionId);

    int bathInsert(PositionRoleDto positionRoleDto);

    List<RolesDTO> selectRolesByPositionId(Long positionId);

    List<Long> selectRolesIdsByPositionId(Long positionId);

    List<Module> selectModulesByPositionId(Long positionId);

}