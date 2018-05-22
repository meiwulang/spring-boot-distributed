package com.jdy.b2b.api.service.impl.synchronizeDistributionSystemMessage;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jdy.b2b.api.common.HttpClientUtils;
import com.jdy.b2b.api.dao.CompanyMapper;
import com.jdy.b2b.api.dao.DepartmentMapper;
import com.jdy.b2b.api.model.Company;
import com.jdy.b2b.api.model.Department;
import com.jdy.b2b.api.model.synchronizeDistributionSystem.Dept;
import com.jdy.b2b.api.service.synchronizeDistributionSystemMessage.SynchronizeCompanyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Created by dugq on 2018/3/24.
 */
@Service
public class SynchronizeCompanyServiceImpl implements SynchronizeCompanyService {
    @Value("${spring.distributionSystemUrl}")
    private String distributionSystemUrl;
    @Autowired
    private CompanyMapper companyMapper;
    @Autowired
    private DepartmentMapper departmentMapper;


    @Override
    public List<Dept> getCompanyList() {
        Map map = new HashMap();
        map.put("cloudId",2);
        JSONArray array = (JSONArray)sendRequest("/sm/dept/listAllOrgForInner", map);
        List<Dept> depts = JSON.parseArray(array.toJSONString(),Dept.class);
        depts = depts.stream().filter(dept -> dept.getIsCompany() == 1).collect(Collectors.toList());
        return depts;
    }

    @Override
    public Dept getCompanyById(Long id) {
        Map map = new HashMap();
        map.put("cloudId",2);
        map.put("deptId",id);
        JSONObject array = (JSONObject)sendRequest("/sm/dept/queryByDeptIdForInner", map);
        Dept dept = JSONObject.parseObject(array.toJSONString(),Dept.class);
        return dept;
    }

    @Override
    @Transactional
    public int synchronizeCompanyList() {
        try {
            List<Company> localList = companyMapper.selectCompanyAll(new Company());
            List<Dept> remoteList = getCompanyList();
            LinkedList<Long> remoteIds  = getReduce(remoteList,Dept.class.getDeclaredMethod("getDeptId"));
            LinkedList<Long> localIds = getReduce(localList,Company.class.getMethod("getId"));
            Map<Boolean, List<Dept>> collect = remoteList.stream().collect(Collectors.groupingBy(item -> localIds.contains(item.getDeptId())));
            List<Dept> updateList = collect.get(true);
            List<Dept> addList = collect.get(false);
            List<Long> removeIds = localIds.stream().filter(id -> !remoteIds.contains(id)).collect(Collectors.toList());
            if(!CollectionUtils.isEmpty(addList))
                companyMapper.insertDepts(addList);
            if(!CollectionUtils.isEmpty(updateList))
                updateList.forEach(company -> companyMapper.updateDept(company));
            if(!CollectionUtils.isEmpty(removeIds)){
//                companyMapper.deleteByIds(removeIds);
            }
            return remoteList.size();
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
            throw new RuntimeException("");
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



    @Override
    @Transactional
    public int synchronizeCompanyById(Long id) {
        Dept remoteCompany = getCompanyById(id);
        if(remoteCompany.getIsCompany() == 1){
            Company company = companyMapper.selectByCompanyId(id);
            if(Objects.isNull(company)){
                companyMapper.insertDept(remoteCompany);
            }else{
                companyMapper.updateDept(remoteCompany);
            }
        }else{
            Department department = departmentMapper.selectByPrimaryKey(id);
            if(Objects.isNull(department)){
                departmentMapper.insertDept(remoteCompany);
            }else{
                departmentMapper.updateDept(remoteCompany);
            }
        }

        return 1;
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
