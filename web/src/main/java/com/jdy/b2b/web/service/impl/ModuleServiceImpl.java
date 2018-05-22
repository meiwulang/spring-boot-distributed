package com.jdy.b2b.web.service.impl;


import com.jdy.b2b.web.pojo.module.Module;
import com.jdy.b2b.web.pojo.module.ModuleQueryVo;
import com.jdy.b2b.web.pojo.module.ModuleSaveOrUpdateVo;
import com.jdy.b2b.web.service.ModuleService;
import com.jdy.b2b.web.util.BaseService;
import com.jdy.b2b.web.util.ResultBean;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;

import javax.annotation.PostConstruct;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * Created by yangcheng on 2017/8/7.
 */
@Service
public class ModuleServiceImpl extends BaseService implements ModuleService {
    private String selectModulesByRoleIdUrl;
    private String selectModulesTreeByRoleIdUrl;
    private String selectAllModulesUrl;
    private String getModulesByPositionIdUrl;
    @PostConstruct
    private void initUrl(){
        selectModulesByRoleIdUrl = systemCenterUrl +"module/selectModulesByRoleId";
        selectModulesTreeByRoleIdUrl = systemCenterUrl+"module/selectModulesTreeByRoleId";
        selectAllModulesUrl = systemCenterUrl+"module/selectAllModules";
        getModulesByPositionIdUrl = controllCenterUrl+"getModulesByPositionId/";
    }


    @Override
    public ResultBean getModuleById(Long id) {
        StringBuffer url = new StringBuffer(systemCenterUrl).append("module/get/").append(id);
        return restTemplate.getForEntity(url.toString(), ResultBean.class).getBody();
    }

    @Override
    public ResultBean queryModuleListForPage(ModuleQueryVo vo) {
        StringBuffer url = new StringBuffer(systemCenterUrl).append("module/page");
        return restTemplate.postForEntity(url.toString(),vo, ResultBean.class).getBody();
    }

    @Override
    public ResultBean<List<Module>> queryModuleList(ModuleQueryVo vo) {
        StringBuffer url = new StringBuffer(systemCenterUrl).append("module/list");
        return restTemplate.postForEntity(url.toString(),vo, ResultBean.class).getBody();
    }

    @Override
    public ResultBean<Integer> saveOrUpdateModule(ModuleSaveOrUpdateVo vo) {
        StringBuffer url = new StringBuffer(systemCenterUrl).append("module/saveOrUpdate");
        return restTemplate.postForEntity(url.toString(),vo, ResultBean.class).getBody();
    }

    @Override
    public ResultBean<List<Module>> firstModuleList() {
        StringBuffer url = new StringBuffer(systemCenterUrl).append("module/firstModuleList");
        return restTemplate.getForEntity(url.toString(),ResultBean.class).getBody();
    }

    @Override
    public ResultBean<Integer> deleteModules(ModuleSaveOrUpdateVo vo) {
        StringBuffer url = new StringBuffer(systemCenterUrl).append("module/deleteModules/");
        return restTemplate.postForEntity(url.toString(),vo,ResultBean.class).getBody();
    }
    @Override
    public ResultBean<Map<String,Module>> selectModulesByRoleId(Long roleId) {
        MultiValueMap map = buildMultiValueMap(new String[]{"roleId"},new String[]{roleId.toString()});
        return restTemplate.postForObject(selectModulesByRoleIdUrl,map,ResultBean.class);
    }
    @Override
    public ResultBean selectModulesTreeByRoleId(Long positionId) {
        MultiValueMap map = buildMultiValueMap(new String[]{"positionId"},new String[]{positionId.toString()});
        return restTemplate.postForObject(selectModulesTreeByRoleIdUrl,map,ResultBean.class);
    }

    @Override
    public ResultBean<Map<String,Module>> selectAllModules() {
        return restTemplate.postForEntity(selectAllModulesUrl,null,ResultBean.class).getBody();
    }

    @Override
    public ResultBean<Map<String, Module>> getModulesByPositionId(Long positionId) {
        return restTemplate.getForObject(getModulesByPositionIdUrl+positionId,ResultBean.class);
    }

    private MultiValueMap buildMultiValueMap(String[] key, String[] value){
        MultiValueMap map = new LinkedMultiValueMap<String,String>();
        for(int i =0 ; i < key.length; i++){
            if(Objects.equals(value[i], null) || Objects.equals(value[i], "")) continue;
            map.add(key[i],value[i]);
        }
        return map;
    }
}
