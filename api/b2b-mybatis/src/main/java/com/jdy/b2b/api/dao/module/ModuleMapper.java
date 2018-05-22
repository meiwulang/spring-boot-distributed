package com.jdy.b2b.api.dao.module;


import com.jdy.b2b.api.model.module.Module;
import com.jdy.b2b.api.model.module.ModuleDto;
import org.apache.ibatis.annotations.MapKey;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;


@Mapper
public interface ModuleMapper {
    int deleteByPrimaryKey(Integer id);

    int insert(Module record);

    int insertSelective(Module record);

    Module selectByPrimaryKey(Integer id);

    int updateByPrimaryKeySelective(Module record);

    int updateByPrimaryKey(Module record);

    List<Module> queryModuleListForPage(Module module);

    List<Module> queryModuleList(Module module);

    List<Module> firstModuleList();

    List<Module> querySameNameModule(@Param("mName") String mName, @Param("enName") String enName);

    int deleteModules(Module m);

    @MapKey("mUrl")
    Map<String,Module> selectModulesByRoleId(Long roleId);

    List<ModuleDto> selectModulesTreeByPositionId(@Param("positionId") Long positionId,@Param("pid") Long pid);




    @MapKey("mUrl")
    Map<String,Module> selectAllModules();

    List<Map> selectModuleListByRoleIdList(@Param("roleIdList") List<Long> roleIdList);

    List<Module> selectModuleListByRoleId(Long roleId);

    List<ModuleDto> selectModulesTree( Long pid);

    List<String> selectButtonClassNames(@Param("positionId") Long positionId);

    List<Module> selectAllModuleList();
}