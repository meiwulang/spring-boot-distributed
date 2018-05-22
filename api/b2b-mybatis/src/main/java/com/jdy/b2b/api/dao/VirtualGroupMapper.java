package com.jdy.b2b.api.dao;

import com.jdy.b2b.api.model.virtualGroup.VirtualGroup;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface VirtualGroupMapper {
    int deleteByPrimaryKey(Long id);

    int insert(VirtualGroup record);

    int insertSelective(VirtualGroup record);

    VirtualGroup selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(VirtualGroup record);

    int updateByPrimaryKey(VirtualGroup record);

    VirtualGroup selectByNo(String no);

    List<VirtualGroup> selectByNos(String[] split);

}