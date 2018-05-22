package com.jdy.b2b.api.dao;

import java.util.List;
import java.util.Map;

import com.jdy.b2b.api.model.department.DepartmentTreeDTO;
import com.jdy.b2b.api.model.synchronizeDistributionSystem.Dept;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.jdy.b2b.api.model.Department;

@Mapper
public interface DepartmentMapper {
	int deleteByPrimaryKey(Long id);

	int insert(Department record);

	int insertSelective(Department record);

	Department selectByPrimaryKey(Long id);

	int updateByPrimaryKeySelective(Department record);

	int updateByPrimaryKey(Department record);

	List<Department> selectByCompanyId(@Param("companyId") Long companyId,
			@Param("fastSearchStr") String fastSearchStr,
			@Param("departmentLevel") Integer departmentLevel);

	Department selectByIdAndName(@Param("name") String name,
			@Param("id") Long id, @Param("companyId") Long companyId,
			@Param("departmentPid") Long departmentPid);

	Department selectByIdAndNo(@Param("no") String no, @Param("id") Long id,
			@Param("companyId") Long companyId,
			@Param("departmentPid") Long departmentPid);

	Department selectMaxDepartmentCode(@Param("companyId") Long companyId,
			@Param("departmentPid") Long departmentPid,
			@Param("status") Integer status);

	List<Department> selectChildDepartmentByPid(
			@Param("companyId") Long companyId,
			@Param("departmentPid") Long departmentPid,
			@Param("status") Integer status,
			@Param("fastSearchStr") String fastSearchStr);

	List<Department> selectAllParentDepartment(
			@Param("companyId") Long companyId,
			@Param("departmentId") Long departmentId,
			@Param("status") Integer status);

	List<Long> queryChildDepartmentIdsByDepartmentIds(List<Long> departmentIds);

	Department selectByNameAndCompanyId(@Param("name") String departmentName,
			@Param("companyId") Long companyId);

	List<Map> selectDepartmentListForUserRolePrivilegeByCompanyIdList(@Param("companyIdList") List<Long> companyIdList);

	List<DepartmentTreeDTO> selectAllDepartments();

    String selectPidsById(Long departmentId);

    void updatePids();

	List<Department>  selectDepartmentAll(Department department);

	int deleteByIds(List<Long> ids);

	int insertDepts(@Param("addList") List<Dept> addList);

	int updateDept(Dept company);

	int insertDept(Dept remoteCompany);
}