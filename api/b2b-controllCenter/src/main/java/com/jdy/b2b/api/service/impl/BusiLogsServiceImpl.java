package com.jdy.b2b.api.service.impl;

import com.github.pagehelper.PageHelper;
import com.jdy.b2b.api.dao.BusiLogsMapper;
import com.jdy.b2b.api.model.BusiLogs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by dugq on 2017/7/18.
 */
@Service
@Transactional
public class BusiLogsServiceImpl implements com.jdy.b2b.api.service.BusiLogsService {
    @Autowired
    BusiLogsMapper busiLogsMapper;

    @Override
    public int deleteByPrimaryKey(Long id) {
        return busiLogsMapper.deleteByPrimaryKey(id);
    }

    @Override
    public int insert(BusiLogs record) {
        return busiLogsMapper.insert(record);
    }

    @Override
    public int insertSelective(BusiLogs record) {
        return busiLogsMapper.insertSelective(record);
    }

    @Override
    public BusiLogs selectByPrimaryKey(Long id) {
        return busiLogsMapper.selectByPrimaryKey(id);
    }

    @Override
    public int updateByPrimaryKeySelective(BusiLogs record) {
        return busiLogsMapper.updateByPrimaryKeySelective(record);
    }

    @Override
    public int updateByPrimaryKey(BusiLogs record) {
        return busiLogsMapper.updateByPrimaryKey(record);
    }

    @Override
    public List<BusiLogs> selectLogsByModuleAndPid(String module, Long pid, Integer pageIndex) {
        PageHelper.startPage(pageIndex,10);
        return busiLogsMapper.selectLogsByModuleAndPid(module,pid);
    }

}
