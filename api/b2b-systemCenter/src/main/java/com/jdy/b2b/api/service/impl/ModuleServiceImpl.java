package com.jdy.b2b.api.service.impl;

import com.jdy.b2b.api.dao.module.ModuleMapper;
import com.jdy.b2b.api.model.module.Module;
import com.jdy.b2b.api.model.module.ModuleDto;
import com.jdy.b2b.api.model.module.ModuleTreeDO;
import com.jdy.b2b.api.model.role.Roles;
import com.jdy.b2b.api.service.ModuleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by yangcheng on 2017/7/31.
 */
@Service
public class ModuleServiceImpl implements ModuleService{
    @Autowired
    private ModuleMapper moduleMapper;

    @Override
    public Module queryByModuleId(Integer id) {
        return moduleMapper.selectByPrimaryKey(id);
    }

    @Override
    public int updateModule(Module module) {
        return moduleMapper.updateByPrimaryKeySelective(module);
    }

    @Override
    public int saveModule(Module module) {
        return moduleMapper.insert(module);
    }

    @Override
    public List<Module> queryModuleListForPage(Module module) {
        return moduleMapper.queryModuleListForPage(module);
    }


    @Override
    public List<Module> getBeforeModuleList(Module module) {
        List<Module> sortList = new ArrayList<>();
        List<Module> allList =moduleMapper.queryModuleList(module);
        //查询基础数据
        Integer i = module.getmType();
        int begin =0;

        switch(i){
            case 1:
                begin = 0;
                break;
            case 2:
                begin = 1;
                break;
            case 3:
                begin =1;
                break;
            case 4:
                begin = 1;
                break;
            case 5:
                begin = 1;
                break;

        }

        List<Module> firstList  = new ArrayList<>();
        if (allList.size()>0) {
            for(Module m:allList) {
                if (m.getmType().equals(begin)) {
                    //将第一级菜单放入firstList
                    firstList.add(m);
                }
            }
        }
        if (firstList.size()>0) {
            recursiveSort(firstList,allList,sortList);
        }
        return sortList;
    }


    @Override
    public List<Module> getModuleList(Module module) {
        List<Module> sortList = new ArrayList<>();
        List<Module> allList =moduleMapper.queryModuleList(module);
        //查询基础数据
        List<Module> firstList  = new ArrayList<>();
        if (allList.size()>0) {
            for(Module m:allList) {
                if (m.getmPid().equals(0)) {
                    //将第一级菜单放入firstList
                    firstList.add(m);
                }
            }
        }
        if (firstList.size()>0) {
            recursiveSort(firstList,allList,sortList);
        }
        return sortList;
    }

    private void recursiveSort(List<Module> pList,List<Module> allList,List<Module> sortList){
        for(Module m:pList){
            //将第一级菜单放入sortList
            sortList.add(m);
            //获取第二级菜单集合
            List<Module> recursiveList = new ArrayList();
            for(Module n:allList){
                //重新设置数据库备注
                if(n.getmPid().equals(m.getId())){
                    recursiveList.add(n);
                }
            }
            if(recursiveList!=null && recursiveList.size()>0){
                recursiveSort(recursiveList,allList,sortList);
            }
        }
    }

    public Map<String,Object> getModuleJson(Module module) {
        List<ModuleTreeDO> sortList = new ArrayList<>();
        List<Module> allList =moduleMapper.queryModuleList(module);
        List<Integer> moduleId = new ArrayList<>();
        //查询基础数据
        List<Module> firstList  = new ArrayList<>();
        if (allList.size()>0) {
            for(Module m:allList) {
                moduleId.add(m.getId());
                if (m.getmPid().equals(0)) {
                    //将第一级菜单放入firstList
                    firstList.add(m);
                }
            }
        }
        if (firstList.size()>0) {
            getJson(firstList,allList,sortList);
        }
        Map<String,Object> res = new HashMap<>();
        res.put("tree",sortList);
        res.put("allTreeId",moduleId);
        return res;
    }

    @Override
    public List<Module> firstModuleList() {
        return moduleMapper.firstModuleList();
    }

    @Override
    public List<Module> querySameNameModule(String mName, String enName) {
        return moduleMapper.querySameNameModule(mName,enName);
    }

    @Override
    public int deleteModules(Module m) {
        return moduleMapper.deleteModules(m);
    }

    private void getJson(List<Module> pList,List<Module> allList,List<ModuleTreeDO> sortList){
        for(Module m:pList){
            //将父级菜单放入sortList
            ModuleTreeDO mdo = new ModuleTreeDO();
            mdo.setId(m.getId());
            mdo.setLabel(m.getmName());
            mdo.setpId(m.getmPid());
            mdo.setMenu(m.getmType()<3);
            sortList.add(mdo);
            //获取子级菜单集合
            List<Module> recursiveList = new ArrayList();
            for(Module n:allList){
                //重新设置数据库备注
                if(n.getmPid().equals(m.getId())){
                    recursiveList.add(n);
                }
            }
            if(recursiveList!=null && recursiveList.size()>0){
                getJson(recursiveList,allList,mdo.getChildren());
            }
        }
    }

    @Override
    public Map<String, Module> selectModulesByRoleId(Long roleId) {
        return moduleMapper.selectModulesByRoleId(roleId);
    }

    @Override
    public List<ModuleDto> selectModulesTreeByPositionId(Long positionId) {
        return moduleMapper.selectModulesTreeByPositionId(positionId, (long) 0);
    }

    @Override
    public Map<String, Module> selectAllModules() {
        return moduleMapper.selectAllModules();
    }

    @Override
    public Map<String, Object> queryModuleByRole(Roles roles) {
        Map<String,Object> res = new HashMap<>();
        List<ModuleTreeDO> sortList = new ArrayList<>();
        List<Module> allList = moduleMapper.selectModuleListByRoleId(roles.getId());
        //查询基础数据
        List<Module> firstList  = new ArrayList<>();
        List<Integer> menuId = new ArrayList<>();
        if (allList.size()>0) {
            for(Module m:allList) {
                if (m.getmType()<3){
                    menuId.add(m.getId());
                }
                if (m.getmPid().equals(0)) {
                    //将第一级菜单放入firstList
                    firstList.add(m);
                }
            }
        }
        if (firstList.size()>0) {
            getJson(firstList,allList,sortList);
        }
        List<Integer> lastChildrenIds = new ArrayList<>();
        if (sortList.size() > 0){

            getLastChildren(sortList,lastChildrenIds);
        }
        res.put("checkedKeys",lastChildrenIds);
        res.put("checkedMenuKeys",menuId);
        return res;
    }

    private void getLastChildren(List<ModuleTreeDO> sortList, List<Integer> lastChildrenIds){
        for (ModuleTreeDO treeDO : sortList){
            if (treeDO.getChildren() != null && treeDO.getChildren().size() > 0){
                getLastChildren(treeDO.getChildren(),lastChildrenIds);
            }else{
                lastChildrenIds.add(treeDO.getId());
            }
        }
    }

    @Override
    public Map<String, Object> getModuleJsonByRoldId(Long roleId) {
        List<ModuleTreeDO> sortList = new ArrayList<>();
        List<Module> allList = moduleMapper.selectAllModuleList();

        List<Integer> moduleId = new ArrayList<>();
        //查询基础数据
        List<Module> firstList = new ArrayList<>();
        if (allList.size()>0) {
            for(Module m:allList) {
                moduleId.add(m.getId());
                if (m.getmPid().equals(0)) {
                    //将第一级菜单放入firstList
                    firstList.add(m);
                }
            }
        }
        if (firstList.size()>0) {
            getJson(firstList,allList,sortList);
        }
        Map<String,Object> res = new HashMap<>();
        res.put("tree",sortList);
        res.put("allTreeId",moduleId);
        return res;
    }

    @Override
    public List<ModuleDto> selectModulesTree() {
        return moduleMapper.selectModulesTree((long) 0);
    }

    @Override
    public List<String> selectButtonClassNames(Long positionId) {
        return moduleMapper.selectButtonClassNames( positionId);
    }
}
