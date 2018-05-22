package com.jdy.b2b.api.controller;

import com.github.pagehelper.PageInfo;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.Company;
import com.jdy.b2b.api.model.Department;
import com.jdy.b2b.api.service.CompanyService;
import com.jdy.b2b.api.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

/**
 * Created by dugq on 2017/7/5.
 */
@Controller
@RequestMapping("department")
public class DepartmentController {
    @Autowired
    private DepartmentService departmentService;
    @Autowired
    private CompanyService companyService;

    @RequestMapping("test")
    @ResponseBody
    public String index(){
        return "hello~";
    }

    /**
     * 根据公司搜索部门列表 支持快速搜索
     * @param companyId 公司id
     * @param fastSearchStr 快速搜索字符串
     */
    @RequestMapping("index")
    @ResponseBody
    public ResultBean<PageInfo> selectAllDepartmentByCompanyId(Long companyId, String fastSearchStr, Integer departmentLevel, Integer pageIndex){
        List<Department> groups =  departmentService.selectByCompanyId(companyId,fastSearchStr, departmentLevel, pageIndex);
        PageInfo pageInfo = new PageInfo(groups);
        return ResultBean.getSuccessResult(pageInfo);
    }

    /**
     * 创建一个新部门
     * @param department id为空自动生成，其他有值得添加，为null的为默认值
     *  @return
     */
    @RequestMapping("add")
    @ResponseBody
    public ResultBean<Department> createNewDepartment(@RequestBody Department department){
        Company company = companyService.selectByPrimaryKey(department.getCompanyId());
        if(company == null){
            return new ResultBean("-1","单位不存在~");
        }
        Department department1 = departmentService.selectByIdAndName(department.getdName(),null,department.getCompanyId(),department.getdPid());
        Department department2 = departmentService.selectByIdAndNo(department.getdNo(),null,department.getCompanyId(),department.getdPid());
        if(department1 != null){
            return new ResultBean("-1","部门名称重复~");
        }
        if(department2 !=null){
            return new ResultBean("-1","部门编号重复~");
        }
        return departmentService.insertSelective(department);
    }

    /**
     * 根据id修改部门 id为null或者id不存在时，修改失败
     * @param department 修改的部门，
     * @return
     */
    @RequestMapping("edit")
    @ResponseBody
    public ResultBean updateDepartment(@RequestBody Department department){
        ResultBean resultBean = null;
        Department department1 = departmentService.selectByIdAndName(department.getdName(),department.getId(),department.getCompanyId(),department.getdPid());
        Department department2 = departmentService.selectByIdAndNo(department.getdNo(),department.getId(),department.getCompanyId(),department.getdPid());
        if(department1 != null){
            return new ResultBean("-1","部门名称重复~");
        }
        if(department2 !=null){
            return new ResultBean("-1","部门编号重复~");
        }
        int result = departmentService.updateByPrimaryKeySelective(department);
        if(result <=0 ){
            resultBean = new ResultBean("-1","error");
        }else{
            resultBean = ResultBean.getSuccessResult();
        }
        return resultBean;
    }


    /**
     * 根据id删除部门 id为null或者id不存在时，直接返回成功
     * @param id 修改的部门，
     * @return
     */
    @RequestMapping("del")
    @ResponseBody
    public ResultBean deleteDepartmentById(Long id){
        ResultBean resultBean = null;
        int result = departmentService.deleteByPrimaryKey(id);
        if(result <=0 ){
            resultBean = new ResultBean("-1","error");
        }else{
            resultBean = ResultBean.getSuccessResult();
        }
        return resultBean;
    }

    /**
     * 根据departmentId逻辑删除部门
     * @param departmentId 修改的部门，
     * @return
     */
    @RequestMapping("logicallyDeleteDepartment")
    @ResponseBody
    public ResultBean logicallyDeleteDepartmentById(Long departmentId){
        return departmentService.logicallyDeleteDepartmentById(departmentId);
    }

    @RequestMapping("queryChildDepartmentByPid")
    @ResponseBody
    public ResultBean<PageInfo> queryChildDepartmentByPid(Long companyId, Long departmentPid, Integer status, String fastSearchStr, Integer pageIndex, Integer pageSize) {
        List<Department> departmentList = departmentService.queryChildDepartmentByPid(companyId, departmentPid, status, fastSearchStr, pageIndex, pageSize);
        PageInfo pageInfo = new PageInfo(departmentList);
        return ResultBean.getIndexSuccessResult(pageInfo);
    }

    @RequestMapping("queryAllParentDepartment")
    @ResponseBody
    public ResultBean<List<Department>> queryAllParentDepartment(Long companyId, Long departmentId, Integer status) {
        List<Department> departmentList = departmentService.queryAllParentDepartment(companyId, departmentId, status);
        return ResultBean.getIndexSuccessResult(departmentList);
    }

    @RequestMapping("queryDepartmentById/{id}")
    @ResponseBody
    public ResultBean queryDepartmentById(@PathVariable("id") Long id){
        Department department = departmentService.selectByPrimaryKey(id);
        return ResultBean.getSuccessResult(department);
    }


    @RequestMapping("syncDepartment")
    @ResponseBody
    public ResultBean syncDepartment(@RequestBody Department department){
        List<Department> departmentList = departmentService.selectDepartmentAll(department);
        return ResultBean.getSuccessResult(departmentList);
    }
}
