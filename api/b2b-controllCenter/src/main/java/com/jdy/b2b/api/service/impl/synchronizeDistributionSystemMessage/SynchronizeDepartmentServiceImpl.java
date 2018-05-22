package com.jdy.b2b.api.service.impl.synchronizeDistributionSystemMessage;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jdy.b2b.api.common.HttpClientUtils;
import com.jdy.b2b.api.dao.DepartmentMapper;
import com.jdy.b2b.api.model.Company;
import com.jdy.b2b.api.model.Department;
import com.jdy.b2b.api.model.synchronizeDistributionSystem.Dept;
import com.jdy.b2b.api.service.synchronizeDistributionSystemMessage.SynchronizeDepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Created by dugq on 2018/3/24.
 */
@Service
public class SynchronizeDepartmentServiceImpl implements SynchronizeDepartmentService {
    @Value("${spring.distributionSystemUrl}")
    private String distributionSystemUrl;
    @Autowired
    private DepartmentMapper departmentMapper;

    @Override
    public List<Dept> getDepartmentList(Long id) {
        Map map = new HashMap();
        map.put("cloudId",2);
        map.put("deptId",id);
        JSONArray array = (JSONArray)sendRequest("/sm/dept/listAllForInner", map);
        List<Dept> depts = JSON.parseArray(array.toJSONString(),Dept.class);
        return depts;
    }


    @Override
    @Transactional
    public int synchronizeDepartmentList(Long companyId) {
        try {
            List<Department> localList = departmentMapper.selectByCompanyId(null,null,null);
            List<Dept> remoteList = getDepartmentList(companyId);
            Map<Long,Dept> deptMap = remoteList.stream().collect(Collectors.toMap(dept->dept.getDeptId(),dept->dept));
            remoteList = remoteList.stream().filter(dept -> dept.getIsCompany()==0).collect(Collectors.toList());
            LinkedList<Long> remoteIds  = getReduce(remoteList,Dept.class.getDeclaredMethod("getDeptId"));
            LinkedList<Long> localIds = getReduce(localList,Department.class.getMethod("getId"));
            Map<Boolean, List<Dept>> collect = remoteList.stream().collect(Collectors.groupingBy(item -> localIds.contains(item.getDeptId())));
            List<Dept> updateList = collect.get(true);
            List<Dept> addList = collect.get(false);
            List<Long> removeIds = localIds.stream().filter(id -> !remoteIds.contains(id)).collect(Collectors.toList());
            if(!CollectionUtils.isEmpty(addList)){
                addList.stream().forEach(dept -> setCompanyAndParent(dept,deptMap));
                departmentMapper.insertDepts(addList);
            }
            if(!CollectionUtils.isEmpty(updateList)){
                updateList.forEach(dept -> {
                    setCompanyAndParent(dept,deptMap);
                    departmentMapper.updateDept(dept);
                });
            }
            if(!CollectionUtils.isEmpty(removeIds)){
//                departmentMapper.deleteByIds(removeIds);
            }
            return remoteList.size();
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
            throw new RuntimeException("");
        }
    }

    public void setCompanyAndParent(Dept dept,Map<Long,Dept> deptMap){
        if(Objects.isNull(dept.getOrgChart()) || Objects.isNull(dept.getOrgChart().getfDeptId())){
            throw new RuntimeException("no companyId with this department named "+dept.getDeptName());
        }
        Dept dept1 = deptMap.get(dept.getOrgChart().getfDeptId());
        if( Objects.nonNull(dept1) && dept1.getIsCompany()==0){
            Dept dept2 = deptMap.get(dept1.getOrgChart().getfDeptId());
            if(dept2.getIsCompany() == 0){
                setCompanyAndParent(dept1,deptMap);
            }
            dept.setCompanyId(dept2.getDeptId());
            dept.setParentId(dept1.getDeptId());
        }else{
            dept.setCompanyId(dept1.getDeptId());
        }
    }

    private <T> LinkedList<Long> getReduce(List<T> companyList, Method method) {
        return companyList.stream().reduce(new LinkedList<Long>(), (acc, company) -> {
            try {
                acc.add((Long)method.invoke(company));
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            } catch (InvocationTargetException e) {
                e.printStackTrace();
            }
            return acc;
        }, (left, right) -> {
            left.addAll(right);
            return left;
        });
    }


    public Object sendRequest(String url, Map params){
        url = distributionSystemUrl+url;
        JSONObject jsonObject = HttpClientUtils.httpPost(url, params);
        if(Objects.equals(jsonObject.get("code").toString(),"200")){
            return jsonObject.get("data");
        }else{
            throw new RuntimeException("http error");
        }
    }
}
