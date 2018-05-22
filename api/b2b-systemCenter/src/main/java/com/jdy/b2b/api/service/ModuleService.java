package com.jdy.b2b.api.service;

import com.jdy.b2b.api.model.module.Module;
import com.jdy.b2b.api.model.module.ModuleDto;
import com.jdy.b2b.api.model.role.Roles;

import java.util.List;
import java.util.Map;

/**
 * Created by yangcheng on 2017/7/31.
 */
public interface ModuleService {
    Module queryByModuleId(Integer id);

    int updateModule(Module module);

    int saveModule(Module module);

    List<Module> getBeforeModuleList(Module module);

    List<Module> queryModuleListForPage(Module module);

    List<Module> getModuleList(Module module);

    Map<String,Object> getModuleJson(Module module);

    List<Module> firstModuleList();

    List<Module> querySameNameModule(String mName, String enName);

    int deleteModules(Module m);

    Map<String, Module> selectModulesByRoleId(Long roleId);

    List<ModuleDto> selectModulesTreeByPositionId(Long positionId);


    Map<String,Module> selectAllModules();

    Map<String, Object> queryModuleByRole(Roles roles);

    Map<String,Object> getModuleJsonByRoldId(Long userId);

    List<ModuleDto> selectModulesTree();

    List<String> selectButtonClassNames(Long positionId);
}
