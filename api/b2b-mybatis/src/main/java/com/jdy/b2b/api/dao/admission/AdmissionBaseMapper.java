package com.jdy.b2b.api.dao.admission;

import com.jdy.b2b.api.model.admission.*;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AdmissionBaseMapper {
    int deleteByPrimaryKey(Long id);

    int insert(AdmissionBaseWithBLOBs record);

    int insertSelective(AdmissionBaseWithBLOBs record);

    AdmissionBaseWithBLOBs selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(AdmissionBaseWithBLOBs record);

    int updateByPrimaryKeyWithBLOBs(AdmissionBaseWithBLOBs record);

    int updateByPrimaryKey(AdmissionBase record);

    List<AdmissionBaseDto> selectByParam(AdmissionBaseListParam param);

    boolean isAdmissionComplete(Long id);

    int updateAdmissionBaseStatus(@Param("baseId") Long baseId, @Param("status") Byte status);

}