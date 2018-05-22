package com.jdy.b2b.api.util;

import cn.jdytrip.sp.data.warehouse.entity.*;
import com.jdy.b2b.api.model.brand.Brand;
import com.jdy.b2b.api.model.product.Product;
import com.jdy.b2b.api.model.schedule.ScheduleInfo;
import com.jdy.b2b.api.model.user.User;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * MQ对象装换类
 * @author Darker on 2018/01/19
 */
public class MQTransformationUtils {

    private static final int STATUS_FINISH = 2;
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

    public static ProductVO transProduct(Product product, Brand brand){
        ProductVO productVO = new ProductVO();
        productVO.setId(product.getId());
        productVO.setCompanyId(product.getCompanyId());
        productVO.setpNo(product.getpNo());
        productVO.setpName(product.getpName());
        productVO.setpShortName(product.getpShortName());
        productVO.setpPym(product.getpPym());
        productVO.setpBrand(brand==null?null:brand.getbName());
        productVO.setpType(product.getpType()+"");
        productVO.setpSort(product.getpSort());
        productVO.setpFrom(product.getpFrom());
        productVO.setpStatus(product.getpStatus());
        productVO.setpPayWay(product.getpPayWay());
        productVO.setCreateTime(product.getCreateTime());
        productVO.setUpdateTime(product.getUpdateTime());
        productVO.setSource(1);
        return productVO;
    }

    public static ScheduleInfoVO transScheuleInfo(ScheduleInfo scheduleInfo){
        ScheduleInfoVO scheduleInfoVO = new ScheduleInfoVO();
        scheduleInfoVO.setId(scheduleInfo.getId());
        scheduleInfoVO.setProductId(scheduleInfo.getProductId());
        scheduleInfoVO.setScheduleNo(scheduleInfo.getScheduleNo());
        scheduleInfoVO.setScheduleName(scheduleInfo.getScheduleName());
        scheduleInfoVO.setGroupOrderNo(scheduleInfo.getGroupOrderNo());
        scheduleInfoVO.setCalendar(scheduleInfo.getCalendar());
        scheduleInfoVO.setProductName(scheduleInfo.getProductName());
        scheduleInfoVO.setCompanyName(scheduleInfo.getCompanyName());
        scheduleInfoVO.setUserName(scheduleInfo.getUserName());
        scheduleInfoVO.setUserPhone(scheduleInfo.getUserPhone());
        scheduleInfoVO.setAdultTouristsNum(scheduleInfo.getAdultTouristsNum());
        scheduleInfoVO.setChildTouristsNum(scheduleInfo.getChildTouristsNum());
        scheduleInfoVO.setStartDate(scheduleInfo.getStartDate());
        scheduleInfoVO.setReturnDate(scheduleInfo.getReturnDate());
        scheduleInfoVO.setStatus(1);
        scheduleInfoVO.setDepartureStatus(scheduleInfo.getDepartureStatus());
        scheduleInfoVO.setOrderAmount(scheduleInfo.getOrderAmount());
        scheduleInfoVO.setOrderNums(scheduleInfo.getOrderNums());
        scheduleInfoVO.setOrderTickets(scheduleInfo.getOrderTickets());
        scheduleInfoVO.setOrderVisitors(scheduleInfo.getOrderVisitors());
        if (STATUS_FINISH == scheduleInfo.getDepartureStatus()) {
            scheduleInfoVO.setCostAmt(scheduleInfo.getCostAmt());
            scheduleInfoVO.setCostTime(scheduleInfo.getCostTime());
            scheduleInfoVO.setCostUpdater(scheduleInfo.getCostUpdater());
        }
        scheduleInfoVO.setSource(1);
        return scheduleInfoVO;
    }

}
