package com.jdy.b2b.api.service;

import com.jdy.b2b.api.model.BusiLogs;

import java.util.List;

/**
 * Created by dugq on 2017/7/18.
 */
public interface BusiLogsService {
    int deleteByPrimaryKey(Long id);

    int insert(BusiLogs record);

    int insertSelective(BusiLogs record);

    BusiLogs selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(BusiLogs record);

    int updateByPrimaryKey(BusiLogs record);

    List<BusiLogs> selectLogsByModuleAndPid(String module, Long pid, Integer pageIndex);
}
