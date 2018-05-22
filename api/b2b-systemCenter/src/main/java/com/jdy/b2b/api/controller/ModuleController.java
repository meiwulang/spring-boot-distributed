package com.jdy.b2b.api.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jdy.b2b.api.common.Constants;
import com.jdy.b2b.api.common.JSONUtil;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.module.Authorization;
import com.jdy.b2b.api.model.module.Module;
import com.jdy.b2b.api.model.module.ModuleDto;
import com.jdy.b2b.api.service.ModuleService;
import com.jdy.b2b.api.vo.module.ModuleInfoDO;
import com.jdy.b2b.api.vo.module.ModuleQueryVo;
import com.jdy.b2b.api.vo.module.ModuleSaveOrUpdateVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created by yangcheng on 2017/7/31.
 */
@RestController
@RequestMapping(value="module")
public class ModuleController {
    @Autowired
    private ModuleService moduleService;

    /**
     * 根据id查询模块
     * @param id
     * @return
     */
    @RequestMapping(value="get/{id}",method = RequestMethod.GET)
    public ResultBean queryByModuleId(@PathVariable Integer id){
        Module module = moduleService.queryByModuleId(id);
        Module m = new Module();
        m.setmType(module.getmType());
        List<Module> list =  moduleService.getBeforeModuleList(m);
        ModuleInfoDO infoDO = new ModuleInfoDO();
        infoDO.setList(list);
        infoDO.setModule(module);
        return ResultBean.getSuccessResult(infoDO);
    }

    /**
     * 新增 修改 伪删除
     * @param vo
     * @return
     */
    @RequestMapping(value="saveOrUpdate",method = RequestMethod.POST)
    public ResultBean<Integer> saveOrUpdateModule(@RequestBody ModuleSaveOrUpdateVo vo){
        Module module = JSONUtil.trans(vo, Module.class);
        if(module!=null && module.getId()!=null){
            //执行更新
            module.setUpdateTime(new Date());
            if(vo.getUpdateUser()==null){
                module.setUpdateUser(vo.getPuserId());
            }
            int result = moduleService.updateModule(module);
            if(result>0){
                return ResultBean.getSuccessResult(result);
            }else{
                return new ResultBean("-1","更新模块失败");
            }
        }else if(module!=null){
            //执行新增
            //查询是否存在重复的一级二级三级菜单名
            List<Module> sameModuleList = moduleService.querySameNameModule(vo.getmName(),vo.getmEnName());
            if(sameModuleList!=null && sameModuleList.size()>0){
                return new ResultBean<>("-1","该菜单名或class名已存在");
            }
            module.setCreateTime(new Date());
            module.setCreateUser(vo.getPuserId());
            int result = moduleService.saveModule(module);
            if(result>0){
                ResultBean<Integer> successResult = ResultBean.getSuccessResult(module.getId());
                successResult.setId((long)module.getId());
                return successResult;
            }else{
                return new ResultBean("-1","更新模块失败");
            }
        }else{
            return new ResultBean<>("-1","Module数据为空");
        }
    }

    /**
     * 查列表/分页
     * @param vo
     * @return
     */
    @RequestMapping(value="page",method = RequestMethod.POST)
    public ResultBean queryModuleListForPage(@RequestBody ModuleQueryVo vo){
        if (vo.getCurrPage() != null && vo.getPageSize() != null) {
            PageHelper.startPage(vo.getCurrPage(), vo.getPageSize());
        }
        Module module = JSONUtil.trans(vo, Module.class);
        module.setmStatus(Constants.EFFECT_YES);
        List<Module> moduleList = moduleService.queryModuleListForPage(module);
        return ResultBean.getSuccessResult(new PageInfo(moduleList));
    }

    /**
     * 查列表/不分页 但是按级别分组排序
     * @param vo
     * @return
     */
    @RequestMapping(value="list",method = RequestMethod.POST)
    public ResultBean<List<Module>> queryModuleList(@RequestBody ModuleQueryVo vo){
        Module module = JSONUtil.trans(vo, Module.class);
        module.setmStatus(Constants.EFFECT_YES);
        List<Module> list = null;
        if (vo.getmType()!=null) {
             list= moduleService.getBeforeModuleList(module);
        }else{
            list = moduleService.getModuleList(module);
        }

        return ResultBean.getSuccessResult(list);
    }

    /**
     * 动态查询中心
     * @return
     */
    @RequestMapping(value="firstModuleList",method = RequestMethod.GET)
    public ResultBean<List<Module>> firstModuleList(){
        List<Module> moduleList = moduleService.firstModuleList();
        return ResultBean.getSuccessResult(moduleList);
    }

    @PostMapping("deleteModules")
    public ResultBean<Integer> deleteModules(@RequestBody ModuleSaveOrUpdateVo vo){
        Module m = JSONUtil.trans(vo, Module.class);
        return ResultBean.getSuccessResult(moduleService.deleteModules(m));
    }

    @RequestMapping("selectModulesByRoleId")
    public ResultBean selectModulesByRoleId(Long roleId) {
        Map<String, Module> stringModuleMap = moduleService.selectModulesByRoleId(roleId);
        return ResultBean.getSuccessResult(stringModuleMap);
    }

    @RequestMapping("selectAllModules")
    public ResultBean selectAllModules() {
        Map<String, Module> stringModuleMap = moduleService.selectAllModules();
        return ResultBean.getSuccessResult(stringModuleMap);
    }

    @RequestMapping("selectModulesTreeByRoleId")
    public ResultBean selectModulesTreeByRoleId(Long positionId) {
        if(Long.MAX_VALUE == positionId){
            Authorization authorization = new Authorization();
            List<ModuleDto> moduleDtos = moduleService.selectModulesTree();
            List<String> buttons = moduleService.selectButtonClassNames(null);
            authorization.setMenus(moduleDtos);
            authorization.setButtonClassNames(buttons);
            return ResultBean.getSuccessResult(authorization);
        }else{
            Authorization authorization = new Authorization();
            List<ModuleDto> moduleDtos = moduleService.selectModulesTreeByPositionId(positionId);
            authorization.setMenus(moduleDtos);
            List<String> buttons = moduleService.selectButtonClassNames(positionId);
            authorization.setButtonClassNames(buttons);
            return ResultBean.getSuccessResult(authorization);
        }
    }
}
