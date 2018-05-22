package com.jdy.b2b.web.service;

import com.jdy.b2b.web.pojo.module.Module;
import com.jdy.b2b.web.pojo.module.ModuleQueryVo;
import com.jdy.b2b.web.pojo.module.ModuleSaveOrUpdateVo;
import com.jdy.b2b.web.util.ResultBean;

import java.util.List;
import java.util.Map;

/**
 * Created by yangcheng on 2017/8/7.
 */
public interface ModuleService {
    ResultBean getModuleById(Long id);

    ResultBean queryModuleListForPage(ModuleQueryVo vo);

    ResultBean<List<Module>> queryModuleList(ModuleQueryVo vo);

    ResultBean<Integer> saveOrUpdateModule(ModuleSaveOrUpdateVo vo);

    ResultBean<List<Module>> firstModuleList();

    ResultBean<Integer> deleteModules(ModuleSaveOrUpdateVo vo);

    ResultBean<Map<String,Module>> selectModulesByRoleId(Long roleId);

    ResultBean selectModulesTreeByRoleId(Long roleId);

    ResultBean<Map<String,Module>> selectAllModules();

    ResultBean<Map<String,Module>> getModulesByPositionId(Long positionId);
}
