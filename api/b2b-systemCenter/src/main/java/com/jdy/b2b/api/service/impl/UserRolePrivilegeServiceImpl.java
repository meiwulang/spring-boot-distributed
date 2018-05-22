package com.jdy.b2b.api.service.impl;

import com.github.pagehelper.PageHelper;
import com.jdy.b2b.api.common.BaseVO;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.dao.CompanyMapper;
import com.jdy.b2b.api.dao.DepartmentMapper;
import com.jdy.b2b.api.dao.module.ModuleMapper;
import com.jdy.b2b.api.dao.role.RoleMapper;
import com.jdy.b2b.api.dao.user.UserMapper;
import com.jdy.b2b.api.dao.userrole.UserRoleMapper;
import com.jdy.b2b.api.model.organizationalstructure.Node;
import com.jdy.b2b.api.model.role.Roles;
import com.jdy.b2b.api.model.userrole.*;
import com.jdy.b2b.api.service.UserRolePrivilegeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

/**
 * Created by zhangfofa on 2017/11/15.
 */
@Service
public class UserRolePrivilegeServiceImpl implements UserRolePrivilegeService {
    @Autowired
    private CompanyMapper companyMapper;

    @Autowired
    private DepartmentMapper departmentMapper;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private UserRoleMapper userRoleMapper;

    @Autowired
    private ModuleMapper moduleMapper;

    @Autowired
    private RoleMapper roleMapper;

    @Override
    public String queryOrganizationalStructure(BaseVO baseVO) {
        if(baseVO.getPuDataLimit().intValue() == 3) {
            baseVO.setPcompanyId(0L);
        }
        List<Map> resultList = companyMapper.selectCompanyListForUserRolePrivilegeByCompanyId(baseVO);
        List<Long> companyIdList = new ArrayList<>();
        for(Map map : resultList) {
            companyIdList.add((Long)map.get("companyId"));
        }
        List<Map> departmentList = departmentMapper.selectDepartmentListForUserRolePrivilegeByCompanyIdList(companyIdList);
        resultList.addAll(departmentList);
        String resultStr =  multipleTree(resultList);
        return "["+resultStr +"]";
    }

    @Override
    public List<UserForUserRolePrivilegeDO> queryUserByDepartmentIdList(UserForUserRolePrivilegeDTO userForUserRolePrivilegeDTO) {
        PageHelper.startPage(userForUserRolePrivilegeDTO.getCurrPage(),userForUserRolePrivilegeDTO.getPageSize());
        return userMapper.selectUserForUserRolePrivilegeByDepartmentIdList(userForUserRolePrivilegeDTO);
    }

    @Override
    public UserRolePrivilegeDO queryUserRolePrivilegeByUserId(Long userId, Integer type) {
        UserRolePrivilegeDO userRolePrivilegeDO =  userRoleMapper.selectUserRolePrivilegeByUserId(userId);
        if(type.intValue() == 2 && userRolePrivilegeDO.getRolePrivilegeList() != null && userRolePrivilegeDO.getRolePrivilegeList().size()>0) {
            List<Long> roleIdList = new ArrayList<>();
            for(UserRoleDO userRoleDO : userRolePrivilegeDO.getRolePrivilegeList()) {
                roleIdList.add(userRoleDO.getRoleId());
            }

            Map map = new HashMap();
            map.put("id", 0);
            map.put("text", "根节点");
            map.put("parentId", "");
            List<Map> moduleList = moduleMapper.selectModuleListByRoleIdList(roleIdList);
            moduleList.add(map);
            String moduleStr = multipleTree(moduleList);
            userRolePrivilegeDO.setModuleStr(moduleStr);
        }
        return userRolePrivilegeDO;
    }

    @Override
    @Transactional
    public ResultBean editUserRolePrivilege(UserRoleEditDO userRoleEditDO) {
        //修改用户数据权限
        userMapper.updateDataPrivilegeByUserId(userRoleEditDO.getPrivilegeLevel(), userRoleEditDO.getUserId());

        //修改用户角色
        userRoleMapper.deleteByUserId(userRoleEditDO.getUserId());
        List<Roles> rolesList = roleMapper.selectRolesByRoleIdList(userRoleEditDO.getRoleIdList());
        List<UserRole> userRoleList = new ArrayList<>();
        for(Roles role : rolesList) {
            UserRole userRole = new UserRole();
            userRole.setUrRoleId(role.getId());
            userRole.setUrUserId(userRoleEditDO.getUserId());
            userRole.setUrRoleName(role.getrRoleName());
            userRole.setUrRoleContent("");
            userRole.setUrRoleContentArray("");
            userRole.setCreateTime(new Date());
            userRole.setCreateUser(userRoleEditDO.getPuserId());
            userRole.setUrStatus(0);
            userRoleList.add(userRole);
        }
        userRoleMapper.insertUserRoleBatch(userRoleList);
        return ResultBean.getSuccessResultForMessage("修改成功！");
    }

    @Override
    public List<Map> queryRoleListByUserId(Long userId) {
        return roleMapper.selectRoleListByUserId(userId);
    }

    private String multipleTree(List<Map> dataList) {
        // 节点列表（散列表，用于临时存储节点对象）
        HashMap nodeList = new HashMap();
        // 根节点
        Node root = null;
        // 根据结果集构造节点列表（存入散列表）
        for (Iterator it = dataList.iterator(); it.hasNext();) {
            Map dataRecord = (Map) it.next();
            Node node = new Node();
            node.setId(Objects.toString(dataRecord.get("id"), ""));
            node.setText(Objects.toString(dataRecord.get("text"), ""));
            node.setParentId(Objects.toString(dataRecord.get("parentId"), ""));
            node.setCompanyId(Objects.toString(dataRecord.get("companyId"), ""));
            node.setPersonInCharge(Objects.toString(dataRecord.get("personInCharge"), ""));
            if(Objects.toString(dataRecord.get("id")).startsWith("d")){
                node.setDepartmentType(Byte.valueOf(dataRecord.get("departmentType").toString()));
                node.setLeaderName(Objects.toString(dataRecord.get("leaderName"),""));
            }
            nodeList.put(node.getId(), node);
        }
        // 构造无序的多叉树
        Set entrySet = nodeList.entrySet();
        for (Iterator it = entrySet.iterator(); it.hasNext();) {
            Node node = (Node) ((Map.Entry) it.next()).getValue();
            if (Objects.equals(node.getParentId(), "null") || Objects.equals(node.getParentId(), null) || Objects.equals(node.getParentId(), "")) {
                root = node;
            } else {
                ((Node) nodeList.get(node.getParentId())).addChild(node);
            }
        }

        //对多叉树进行横向排序
        root.sortChildren();
        return root.toString();
    }
}
