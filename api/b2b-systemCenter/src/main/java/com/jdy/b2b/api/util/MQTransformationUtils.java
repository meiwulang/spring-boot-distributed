package com.jdy.b2b.api.util;

import cn.jdytrip.sp.data.warehouse.entity.*;
import com.jdy.b2b.api.model.user.User;

import java.util.ArrayList;
import java.util.List;

/**
 * MQ对象装换类
 * @author Darker on 2018/01/19
 */
public class MQTransformationUtils {


//    public static List<CompanyVO>  transComapny(com.jdy.b2b.api.model.Company company){
//        List<CompanyVO> companies = new ArrayList<>();
//        CompanyVO c = new CompanyVO();
//        c.setId(company.getId());
//        c.setParentId(company.getcPid());
//        c.setName(company.getcName());
//        c.setType(company.getcType()+"");
//        companies.add(c);
//        return companies;
//    }

//    public static List<DepartmentVO> transDepartment(com.jdy.b2b.api.model.Department department){
//        List<DepartmentVO> departments = new ArrayList<>();
//        DepartmentVO d = new DepartmentVO();
//        d.setId(department.getId());
//        d.setCompanyId(department.getCompanyId().intValue());
//        d.setParentId(department.getdPid());
//        d.setName(department.getdName());
//        d.setNickName("");
//        d.setType(department.getdLevel()+"");
//        d.setdLeader(department.getLeader());
//        departments.add(d);
//        return departments;
//    }

//    public static List<UserVO> transSmUser(User user){
//        List<UserVO> smUsers = new ArrayList<>();
//        UserVO smUser = new UserVO();
//        smUser.setId(user.getId());
//        smUser.setuWxOpenid(user.getuWxOpenId());
//        smUser.setuWxName(user.getuWxname());
//        smUser.setuNo(user.getuNo());
//        smUser.setuLevel(user.getLevel()==null?null:(int)user.getLevel());
//        smUser.setuPid(user.getPid());
//        smUser.setuUid(user.getuUid());
//        smUser.setuPuserid(user.getuPuserid()==null?null:Long.parseLong(user.getuPuserid()));
//        smUser.setuRealName(user.getuRealName());
//        smUser.setuPym(user.getuPym());
//        smUser.setCompanyId(user.getuCompanyId());
//        smUser.setuDepartmentId(user.getuDepartmentId());
//        smUser.setuChargeType(user.getuChargeType());
//        smUser.setuDtype(user.getuDtype());
//        smUser.setuRoleId(user.getuRoleId());
//        smUser.setuType(user.getuType());
//        smUser.setuStype(user.getuStype());
//        smUser.setuPositionId(user.getuPositionId());
//        smUser.setuStatus(user.getuStatus());
//        smUser.setCreateTime(user.getCreateTime());
//        smUser.setUpdateTime(user.getUpdateTime());
//        smUsers.add(smUser);
//        return smUsers;
//    }

}
