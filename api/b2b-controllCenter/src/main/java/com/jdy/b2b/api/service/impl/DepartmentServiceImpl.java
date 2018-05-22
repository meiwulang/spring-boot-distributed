package com.jdy.b2b.api.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import com.jdy.b2b.api.util.MQAssembleService;
import com.jdy.b2b.api.util.MQTransformationUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.task.TaskExecutor;
import org.springframework.stereotype.Service;

import com.github.pagehelper.PageHelper;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.dao.DepartmentMapper;
import com.jdy.b2b.api.dao.user.UserMapper;
import com.jdy.b2b.api.model.Department;
import com.jdy.b2b.api.model.user.User;
import com.jdy.b2b.api.service.DepartmentService;

/**
 * Created by dugq on 2017/7/17.
 */
@Service
public class DepartmentServiceImpl implements DepartmentService {
    @Autowired
    private DepartmentMapper departmentMapper;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    TaskExecutor taskExecutor;
    @Autowired
    MQAssembleService mqAssembleService;

    @Override
    public int deleteByPrimaryKey(Long id) {
        int i = departmentMapper.deleteByPrimaryKey(id);
        departmentMapper.updatePids();
        return i;
    }

    @Override
    public int insert(Department record) {
        int insert = departmentMapper.insert(record);
        departmentMapper.updatePids();
//        taskExecutor.execute(() -> mqAssembleService.getMQClinet().syncDepartments(MQTransformationUtils.transDepartment(departmentMapper.selectByPrimaryKey(record.getId()))));
        return insert;
    }

    @Override
    public ResultBean insertSelective(Department record) {
        ResultBean resultBean;
        Department department = departmentMapper.selectMaxDepartmentCode(record.getCompanyId(), record.getdPid(), 0);
        if(!Objects.equals(department.getdCode(), null)) {
            String dCode = department.getdCode().toString();
            String prefix = dCode.substring(0, dCode.length()-2);
            dCode = dCode.substring(dCode.length()-2);
            if(Integer.parseInt(dCode) == 99) {
                List<Department> departmentList = departmentMapper.selectChildDepartmentByPid(record.getCompanyId(), record.getdPid(), 0, null);
                if(departmentList.size() == 99) {
                    return ResultBean.getErrorResult("部门数已到上限");
                }
                String suffix = getNotUsedDepartmentId(departmentList)+"";
                if(suffix.length() < 2) {
                    suffix = "0"+suffix;
                }
                record.setdCode(Long.parseLong(prefix+suffix));
            } else {
                record.setdCode(department.getdCode()+1);
            }
        } else {
            Department departmentByPid = departmentMapper.selectByPrimaryKey(record.getdPid());
            if(record.getdLevel().intValue() == 1) {
                record.setdCode(101L);
            } else {
                record.setdCode(Long.parseLong(departmentByPid.getdCode()+"01"));
            }
        }
        int result = departmentMapper.insertSelective(record);
        departmentMapper.updatePids();
//        taskExecutor.execute(() -> mqAssembleService.getMQClinet().syncDepartments(MQTransformationUtils.transDepartment(departmentMapper.selectByPrimaryKey(record.getId()))));
        if(result <=0 ){
            resultBean = new ResultBean("-1","error");
        }else{
            resultBean = ResultBean.getSuccessResult(record);
            resultBean.setId(record.getId());
        }
        return resultBean;
    }

    @Override
    public Department selectByPrimaryKey(Long id) {
        return departmentMapper.selectByPrimaryKey(id);
    }

    @Override
    public int updateByPrimaryKeySelective(Department record) {
        int resultCount = departmentMapper.updateByPrimaryKeySelective(record);
//        taskExecutor.execute(() -> mqAssembleService.getMQClinet().syncDepartments(MQTransformationUtils.transDepartment(departmentMapper.selectByPrimaryKey(record.getId()))));
        return resultCount;
    }

    @Override
    public int updateByPrimaryKey(Department record) {
        int resultCount = departmentMapper.updateByPrimaryKey(record);
//        taskExecutor.execute(() -> mqAssembleService.getMQClinet().syncDepartments(MQTransformationUtils.transDepartment(departmentMapper.selectByPrimaryKey(record.getId()))));
        return resultCount;
    }

    @Override
    public List<Department> selectByCompanyId(Long companyId, String fastSearchStr, Integer departmentLevel, Integer pageIndex) {
        PageHelper.startPage(pageIndex,15);
        return departmentMapper.selectByCompanyId(companyId,fastSearchStr, departmentLevel);
    }

    @Override
    public Department selectByIdAndName(String name, Long id,Long companyId, Long departmentPid) {
        return departmentMapper.selectByIdAndName(name,id,companyId,departmentPid);
    }

    @Override
    public Department selectByIdAndNo(String no, Long id,Long companyId, Long departmentPid) {
        return departmentMapper.selectByIdAndNo(no,id,companyId,departmentPid);
    }

    @Override
    public ResultBean logicallyDeleteDepartmentById(Long departmentId) {
        List<Department> departmentList = departmentMapper.selectChildDepartmentByPid(null,departmentId, 0, null);
        //部门下若有子部门则不删除
        if(!Objects.equals(departmentList, null) && departmentList.size() > 0) {
            return ResultBean.getErrorResult("该部门下存在子部门，不允许删除");
        }

        List<User> userList = userMapper.selectUserListByDepartmentId(departmentId, 1);
        //部门下若有用户则不删除
        if(!Objects.equals(userList, null) && userList.size() > 0) {
            return ResultBean.getErrorResult("该部门下存在用户，不允许删除");
        }

        //逻辑删除部门
        Department department = new Department();
        department.setId(departmentId);
        department.setdStatus(1);
        departmentMapper.updateByPrimaryKeySelective(department);
//        taskExecutor.execute(() -> mqAssembleService.getMQClinet().syncDepartments(MQTransformationUtils.transDepartment(departmentMapper.selectByPrimaryKey(department.getId()))));
        return ResultBean.getSuccessResult();
    }

    @Override
    public List<Department> queryChildDepartmentByPid(Long companyId, Long departmentPid, Integer status, String fastSearchStr, Integer pageIndex, Integer pageSize) {
        PageHelper.startPage(pageIndex,pageSize);
        return departmentMapper.selectChildDepartmentByPid(companyId, departmentPid, status, fastSearchStr);
    }

    @Override
    public List<Department> queryAllParentDepartment(Long companyId, Long departmentId, Integer status) {
        return departmentMapper.selectAllParentDepartment(companyId, departmentId, status);
    }

    @Override
    public List<Department> selectDepartmentAll(Department department) {
        return departmentMapper.selectDepartmentAll(department);
    }

    private Integer getNotUsedDepartmentId(List<Department> departments) {
        Map<Integer, Integer> map = new HashMap<>();
        for(Department department : departments) {
            String dCode = department.getdCode().toString();
            dCode = dCode.substring(dCode.length()-2);
            map.put(Integer.parseInt(dCode), 0);
        }
        for(int i=1; i<=99; i++) {
            if(Objects.equals(map.get(i), null)) {
                return i;
            }
        }
        return null;
    }
}
