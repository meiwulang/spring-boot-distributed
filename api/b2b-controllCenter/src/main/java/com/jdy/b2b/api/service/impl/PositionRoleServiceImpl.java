package com.jdy.b2b.api.service.impl;

import com.jdy.b2b.api.dao.PositionMapper;
import com.jdy.b2b.api.dao.PositionRoleMapper;
import com.jdy.b2b.api.model.module.Module;
import com.jdy.b2b.api.model.position.PositionRole;
import com.jdy.b2b.api.model.position.PositionRoleDto;
import com.jdy.b2b.api.model.role.RolesDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

/**
 * Created by dugq on 2018/3/24.
 */
@Service
public class PositionRoleServiceImpl implements com.jdy.b2b.api.service.PositionRoleService {
    @Autowired
    private PositionRoleMapper positionRoleMapper;
    @Autowired
    private PositionMapper positionMapper;

    @Override
    public int deleteByPrimaryKey(Long id) {
        return positionRoleMapper.deleteByPrimaryKey(id);
    }

    @Override
    public int insert(PositionRole record) {
        return positionRoleMapper.insert(record);
    }

    @Override
    public int insertSelective(PositionRole record) {
        return positionRoleMapper.insertSelective(record);
    }

    @Override
    public PositionRole selectByPrimaryKey(Long id) {
        return positionRoleMapper.selectByPrimaryKey(id);
    }

    @Override
    public int updateByPrimaryKeySelective(PositionRole record) {
        return positionRoleMapper.updateByPrimaryKeySelective(record);
    }

    @Override
    public int updateByPrimaryKey(PositionRole record) {
        return positionRoleMapper.updateByPrimaryKey(record);
    }

    @Override
    public int addPositionRoles(PositionRoleDto positionRoleDto) {
        if(Objects.nonNull(positionRoleDto.getPositionName())){
            List<Long> ids = positionMapper.selectByName(positionRoleDto.getPositionName());
            ids.forEach(id->{
                positionRoleMapper.deleteByPositionId(id);
                positionMapper.updateDataLimit(id,positionRoleDto.getDataLimit());
                positionRoleDto.setPositionId(id);
                positionRoleMapper.bathInsert(positionRoleDto);
            });
            return ids.size();
        }
        else if(Objects.nonNull(positionRoleDto.getPositionId())){
            positionRoleMapper.deleteByPositionId(positionRoleDto.getPositionId());
            positionMapper.updateDataLimit(positionRoleDto.getPositionId(),positionRoleDto.getDataLimit());
            return positionRoleMapper.bathInsert(positionRoleDto);
        }
        throw new RuntimeException("跟新失败~");
    }

    @Override
    public List<RolesDTO> selectByPositionId(Long positionId) {
        return positionRoleMapper.selectRolesByPositionId(positionId);
    }

    @Override
    public List<Module> selectModulesByPositionId(Long positionId) {
        return positionRoleMapper.selectModulesByPositionId(positionId);
    }
}
