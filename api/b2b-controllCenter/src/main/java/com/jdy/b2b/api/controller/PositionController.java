package com.jdy.b2b.api.controller;

import com.github.pagehelper.PageInfo;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.dao.PositionMapper;
import com.jdy.b2b.api.model.module.Module;
import com.jdy.b2b.api.model.position.*;
import com.jdy.b2b.api.model.role.Roles;
import com.jdy.b2b.api.model.role.RolesDTO;
import com.jdy.b2b.api.model.synchronizeDistributionSystem.Dept;
import com.jdy.b2b.api.model.synchronizeDistributionSystem.PositionDto;
import com.jdy.b2b.api.service.PositionRoleService;
import com.jdy.b2b.api.service.PositionService;
import com.jdy.b2b.api.service.synchronizeDistributionSystemMessage.SynchronizePositionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Calendar;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Created by dugq on 2018/3/24.
 */
@RestController
@RequestMapping("position")
public class PositionController {
    @Autowired
    private PositionService positionService;
    @Autowired
    private PositionRoleService positionRoleService;
    @Autowired
    private SynchronizePositionService synchronizePositionService;
    @Autowired
    private PositionMapper positionMapper;

    @RequestMapping("positionListByCompanyId")
    public ResultBean positionListByCompanyId(@RequestBody PositionListParam param){
        List<PositionVO> positions = positionService.selectListByCompanyId(param);
        PageInfo pageInfo = new PageInfo(positions);
        return ResultBean.getSuccessResult(pageInfo);
    }

    @RequestMapping("getPositionById/{positionId}")
    public ResultBean getPositionById(@PathVariable("positionId") Long positionId){
        Position position = positionService.selectByPrimaryKey(positionId);
        return ResultBean.getSuccessResult(position);
    }

    @RequestMapping("positionByUserId/{userId}")
    public ResultBean positionByUserId(@PathVariable("userId") Long userId){
        return null;
    }

    @RequestMapping("savePositionRoles")
    public ResultBean savePositionRoles(@RequestBody PositionRoleDto positionRoleDto){
        positionRoleService.addPositionRoles(positionRoleDto);
        ResultBean successResult = ResultBean.getSuccessResult();
        successResult.setId(positionRoleDto.getPositionId());
        return successResult;
    }

    @RequestMapping("getRolesByPositionId/{positionId}")
    public ResultBean getRolesByPositionId(@PathVariable("positionId") Long positionId){
        List<RolesDTO> rolesDTOS = positionRoleService.selectByPositionId(positionId);
        return ResultBean.getSuccessResult(rolesDTOS);
    }

    @RequestMapping("getModulesByPositionId/{positionId}")
    public ResultBean getModulesByPositionId(@PathVariable("positionId") Long positionId){
        List<Module> moduleList = positionRoleService.selectModulesByPositionId(positionId);
        return ResultBean.getSuccessResult(moduleList);
    }


    @RequestMapping("synchronizePositionByDeptId/{deptId}")
    public ResultBean synchronizePositionByDeptId(@PathVariable Long deptId){
        List<PositionVO> positionVOS = positionMapper.selectByCompanyId(null, null);
        Map<String, List<PositionVO>> collect = positionVOS.stream().collect(Collectors.groupingBy(positionVO -> positionVO.getPositionName()));
       int positionList = synchronizePositionService.synchronizePositionList(deptId,collect);
        return ResultBean.getSuccessResult(positionList);
    }

    @RequestMapping("synchronizePositionByPositionId/{positionId}")
    public ResultBean synchronizePositionByPositionId(@PathVariable Long positionId){
        PositionDto position = synchronizePositionService.getPositionById(positionId);
        return ResultBean.getSuccessResult(position);
    }
}
