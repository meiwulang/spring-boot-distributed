package com.jdy.b2b.api.dao;

import com.jdy.b2b.api.model.BusiLogs;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BusiLogsMapper {
    int deleteByPrimaryKey(Long id);

    int insert(BusiLogs record);

    int insertSelective(BusiLogs record);

    BusiLogs selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(BusiLogs record);

    int updateByPrimaryKey(BusiLogs record);

    List<BusiLogs> selectLogsByModuleAndPid(@Param("blModule") String module,@Param("blPid") Long pid);
}