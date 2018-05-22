package com.jdy.b2b.web.controll.module;

import com.jdy.b2b.web.aop.MyPermissionsAuthorizationFilter;
import com.jdy.b2b.web.pojo.module.*;
import com.jdy.b2b.web.service.ModuleService;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.Constants;
import com.jdy.b2b.web.util.JSONUtil;
import com.jdy.b2b.web.util.ResultBean;
import com.jdy.b2b.web.util.annotations.Save;
import com.jdy.b2b.web.util.annotations.Update;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import javax.validation.constraints.NotNull;
import java.util.List;

/**
 * Created by yangcheng on 2017/8/7.
 */
@Api(value = "module", description = "操作模块")
@RestController
@RequestMapping("module")
public class ModuleController extends BaseController{
    @Autowired
    private ModuleService moduleService;

    /**
     * 根据id查
     * @param id
     * @return
     */
    @ApiOperation(value = "根据id查询模块",notes = "")
    @RequestMapping(value="get/{id}",method = RequestMethod.GET)
    public ResultBean getModuleById(@PathVariable("id") @NotNull @ApiParam(value = "模块id",required = true,name = "id") Long id){
        return moduleService.getModuleById(id);
    }

    /**
     * 分页查列表
     * 暂时不用
     * @param vo
     * @return
     */
    @ApiIgnore
    @ApiOperation(value = "分页查询模块列表",notes = "")
    @RequestMapping(value="page",method = RequestMethod.POST)
    public ResultBean queryModuleListForPage(@RequestBody @Validated ModuleQueryVo vo){
        return moduleService.queryModuleListForPage(vo);
    }

    /**
     * 不分页查列表
     * @param vo
     * @return
     */
    @ApiOperation(value = "不分页查询模块列表,添加模块时调用",notes = "")
    @RequestMapping(value="list",method = RequestMethod.POST)
    public ResultBean<List<Module>> queryModuleList(@RequestBody @Validated ModuleQueryVo vo){
        return moduleService.queryModuleList(vo);
    }

    /**
     * 查询中心列表
     * @return
     */
    @ApiOperation(value = "查询中心列表",notes = "")
    @RequestMapping(value="firstModuleList",method = RequestMethod.GET)
    public ResultBean<List<Module>> firstModuleList(){
        return moduleService.firstModuleList();
    }

    /**
     * 保存
     * @param vo
     * @return
     */
    @ApiOperation(value = "保存模块",notes = "")
    @RequestMapping(value="save",method = RequestMethod.POST)
    public ResultBean<Integer> saveModule(@RequestBody @Validated ModuleSaveVo vo){
        ModuleSaveOrUpdateVo saveOrUpdateVo = JSONUtil.trans(vo, ModuleSaveOrUpdateVo.class);
        //设置有效
        saveOrUpdateVo.setmStatus(0);
        saveOrUpdateVo.setmMode(0);
        ResultBean<Integer> integerResultBean = moduleService.saveOrUpdateModule(saveOrUpdateVo);
        MyPermissionsAuthorizationFilter.clearAllModules();
        return integerResultBean;
    }

    /**
     * 修改
     * @param vo
     * @return
     */
    @ApiOperation(value = "修改模块",notes = "")
    @RequestMapping(value="update",method = RequestMethod.POST)
    public ResultBean<Integer> updateModule(@RequestBody @Validated ModuleUpdateVo vo){
        ModuleSaveOrUpdateVo saveOrUpdateVo = JSONUtil.trans(vo, ModuleSaveOrUpdateVo.class);
        ResultBean<Integer> integerResultBean = moduleService.saveOrUpdateModule(saveOrUpdateVo);
        MyPermissionsAuthorizationFilter.clearAllModules();
        return integerResultBean;
    }

    /**
     * 删除
     * @param id
     * @return
     */
    @ApiOperation(value = "删除",notes = "")
    @RequestMapping(value="delete/{id}",method = RequestMethod.GET)
    public ResultBean<Integer> deleteModule(@PathVariable("id") @NotNull @ApiParam(value = "模块id",required = true,name = "id") Integer id){
        ModuleSaveOrUpdateVo vo = new ModuleSaveOrUpdateVo();
        vo.setId(id);
        vo.setmStatus(Constants.EFFECT_NO);
        if (getUser() != null) {
            vo.setUpdateUser(getUser().getUserId());
        }else{
            return new ResultBean("-1","未获取到用户信息");
        }
        ResultBean<Integer> integerResultBean = moduleService.deleteModules(vo);
        MyPermissionsAuthorizationFilter.clearAllModules();
        return integerResultBean;
    }


}
