package com.jdy.b2b.web.service.impl;

import com.jdy.b2b.web.pojo.department.DepartmentSaleCountVO;
import com.jdy.b2b.web.pojo.department.DepartmentVo;
import com.jdy.b2b.web.service.DepartmentService;
import com.jdy.b2b.web.util.BaseService;
import com.jdy.b2b.web.util.ResultBean;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import javax.annotation.PostConstruct;
import java.util.Objects;

/**
 * Created by dugq on 2017/7/12.
 */
@Service
public class DepartmentServiceImpl extends BaseService implements DepartmentService {
    private static String indexUrl;
    private static String addUrl;
    private String updateUrl;
    private String delUrl;
    private String logicallyDeleteUrl;
    private String queryDepartmentSaleCountUrl;
    private String queryChildDepartmentByPid;
    private String queryAllParentDepartment;
    private String queryDepartmentByIdUrl;
    private String syncDepartmentUrl;

    @PostConstruct
    private void initUrl() {
        indexUrl = controllCenterUrl +  "/department/index";
        addUrl = controllCenterUrl +"/department/add";
        updateUrl = controllCenterUrl + "/department/edit";
        delUrl = controllCenterUrl +"/department/del?id=";
        logicallyDeleteUrl = controllCenterUrl +"/department/logicallyDeleteDepartment?departmentId=";
        queryDepartmentSaleCountUrl = reportsCenterUrl + "departmentSale/m/querySaleCount";
        queryChildDepartmentByPid = controllCenterUrl + "/department/queryChildDepartmentByPid";
        queryAllParentDepartment = controllCenterUrl + "/department/queryAllParentDepartment";
        queryDepartmentByIdUrl = controllCenterUrl + "department/queryDepartmentById/";
        syncDepartmentUrl=controllCenterUrl + "department/syncDepartment/";
    }

    @Override
    public ResultBean selectAllDepartmentByCompanyId(Long companyId, String fastSearchStr, Integer departmentLevel, Integer pageIndex){
        MultiValueMap map = buildMultiValueMap(new String[]{"companyId", "fastSearchStr", "departmentLevel", "pageIndex"},new String[]{companyId.toString(),fastSearchStr, Objects.toString(departmentLevel, null), Objects.toString(pageIndex,"1")});
        return restTemplate.postForObject(indexUrl,map,ResultBean.class);
    }

    @Override
    public ResultBean createDepartmentGroup(DepartmentVo workgroup){
        return restTemplate.postForEntity(addUrl,workgroup,ResultBean.class).getBody();
    }

    @Override
    public ResultBean updateDepartment(DepartmentVo workgroup){
        return restTemplate.postForEntity(updateUrl,workgroup,ResultBean.class).getBody();
    }

    @Override
    public ResultBean deleteDepartment(Long id){
        return restTemplate.getForObject(delUrl + id,ResultBean.class);
    }

    @Override
    public ResultBean logicallyDeleteDepartment(Long departmentId){
        return restTemplate.getForObject(logicallyDeleteUrl + departmentId,ResultBean.class);
    }

    @Override
    public ResultBean queryDepartmentSaleCount(DepartmentSaleCountVO departmentSaleCountVO) {
        return restTemplate.postForObject(queryDepartmentSaleCountUrl,departmentSaleCountVO,ResultBean.class);
    }

    @Override
    public ResultBean queryChildDepartmentByPid(Long companyId, Long departmentPid, Integer status, String fastSearchStr, Integer pageIndex, Integer pageSize) {
        MultiValueMap map = buildMultiValueMap(new String[]{"companyId", "departmentPid", "status", "fastSearchStr", "pageIndex", "pageSize"},new String[]{companyId.toString(), departmentPid.toString(), status.toString(), fastSearchStr, pageIndex.toString(), pageSize.toString()});
        return restTemplate.postForObject(queryChildDepartmentByPid,map,ResultBean.class);
    }

    @Override
    public ResultBean queryAllParentDepartment(Long companyId, Long departmentId, Integer status) {
        MultiValueMap map = buildMultiValueMap(new String[]{"companyId", "departmentId", "status"},new String[]{companyId.toString(), departmentId.toString(), status.toString()});
        return restTemplate.postForObject(queryAllParentDepartment,map,ResultBean.class);
    }

    @Override
    public ResultBean queryDepartmentById(Long id) {

        return restTemplate.getForObject(queryDepartmentByIdUrl + id,ResultBean.class);
    }

    @Override
    public ResultBean syncDepartment(DepartmentVo departmentVo) {

        return restTemplate.postForEntity(syncDepartmentUrl,departmentVo,ResultBean.class).getBody();
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
