package com.jdy.b2b.web.service;

import com.jdy.b2b.web.pojo.log.BusiLogs;
import com.jdy.b2b.web.util.ResultBean;

/**
 * Created by dugq on 2017/7/18.
 */
public interface BusiLogsService {
    void add(BusiLogs[] busiLogs);
    ResultBean selectLogsByModuleAndPid(String module,Long pid,Integer pageIndex);
}
