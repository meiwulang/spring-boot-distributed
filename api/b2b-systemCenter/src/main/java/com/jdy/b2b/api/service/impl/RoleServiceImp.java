package com.jdy.b2b.api.service.impl;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.dao.role.RoleMapper;
import com.jdy.b2b.api.dao.roleModule.RoleModuleMapper;
import com.jdy.b2b.api.dao.userrole.UserRoleMapper;
import com.jdy.b2b.api.model.role.Roles;
import com.jdy.b2b.api.model.role.RolesVO;
import com.jdy.b2b.api.model.userrole.UserRole;
import com.jdy.b2b.api.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

/**
 * Created by strict on 2017/11/16.
 */
@Service
@Transactional
public class RoleServiceImp implements RoleService{

    @Autowired
    private RoleMapper roleMapper;
    @Autowired
    private RoleModuleMapper roleModuleMapper;
    @Autowired
    private UserRoleMapper userRoleMapper;

    @Override
    public ResultBean queryList(RolesVO rolesVO) {

        PageHelper.startPage(rolesVO.getCurrPage(),rolesVO.getPageSize());
        return ResultBean.getSuccessResult(new PageInfo<>(roleMapper.selectByName(rolesVO)));
    }

    @Override
    public ResultBean modifyRole(RolesVO rolesVO) {


        //根据角色名字搜索是否有重复的  在同一家公司下
        rolesVO.setKey(rolesVO.getrRoleName());
        List<Roles> rolesNameList = roleMapper.selectByName(rolesVO);
        if(rolesNameList != null && rolesNameList.size() == 1){
            Roles temp = rolesNameList.get(0);
            if (rolesVO.getId() == null){// 新增 ---->  搜到表示已有相同名字的
                return new ResultBean("-1","角色名称重复");
            }else{// 更新
                if (temp.getId() != rolesVO.getId()){ // 搜到的 和 此次目标 的id 不同  则表示不是修改此次目标，名字被占用
                    return new ResultBean("-1","角色名称重复");
                }
            }
        }else if (rolesNameList != null && rolesNameList.size() > 1){ // 此处理论上不可能
            return new ResultBean("-1","角色名称重复");
        }

        if (rolesVO.getId() != null && rolesVO.getId() != 0l){
            //更新
            rolesVO.setUpdateTime(new Date());
            rolesVO.setUpdateUser(rolesVO.getPuserId());
            int res = roleMapper.updateRoleBySelective(rolesVO);
            if (res == 0){
                return new ResultBean("-1","更新角色出错");
            }
            //  删除 原有 角色 - 模块 关联
            roleModuleMapper.deleteRelByRole(rolesVO);
        }else{
            //新增
            //rolesVO.setrCompanyId(rolesVO.getPcompanyId());
            rolesVO.setrType(0);
            rolesVO.setCreateTime(new Date());
            rolesVO.setCreateUser(rolesVO.getPuserId());
            int res = roleMapper.insertRoleBySelective(rolesVO);
            if (res == 0){
                return new ResultBean("-1","新增角色出错");
            }
        }
        //重新 生成  角色 - 模块  关联关系
        if (rolesVO.getCheckedKeys() != null && rolesVO.getCheckedKeys().size() > 0){
            Set<Long> set = new HashSet<>();
            rolesVO.getCheckedKeys().forEach(key -> {
                set.add(key);
            });
            rolesVO.setCheckedKeys(new ArrayList<Long>(set));
            roleModuleMapper.insertRelByRole(rolesVO);
        }
        return ResultBean.getSuccessResult();
    }

    @Override
    public ResultBean removeRoleId(Long roleId) {
        Roles roles = roleMapper.selectById(roleId);
        if (roles != null){
            List<UserRole> list  = userRoleMapper.selectUserRoleByRoleId(roleId);
            if (list != null && list.size() > 0){
                return new ResultBean("-1","该角色正在被人使用，不能删除");
            }
            roleMapper.deleteByRoleId(roleId);
            roleModuleMapper.deleteRelByRole(roles);
        }
        return ResultBean.getSuccessResult();
    }

}
