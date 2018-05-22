package com.jdy.b2b.api.dao;

import com.jdy.b2b.api.model.position.Position;
import com.jdy.b2b.api.model.position.PositionVO;
import com.jdy.b2b.api.model.synchronizeDistributionSystem.PositionDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PositionMapper {
    int deleteByPrimaryKey(Long id);

    int insert(Position record);

    int insertSelective(Position record);

    Position selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(Position record);

    int updateByPrimaryKey(Position record);

    List<PositionVO> selectByCompanyId(@Param("companyId") Long companyId, @Param("name") String name);

    List<Position> selectByDepartmentId(@Param("departmentId") Long departmentId, @Param("name") String name);

    int bathDelete(List<Long> removeList);

    int insertDto(PositionDto dto);

    int bathInsert(@Param("addList") List<PositionDto> addList);

    int update(PositionDto position);

    int updateDataLimit(@Param("positionId") Long positionId,@Param("dataLimit") Byte dataLimit);

    List<Long> selectByName(String positionName);
}