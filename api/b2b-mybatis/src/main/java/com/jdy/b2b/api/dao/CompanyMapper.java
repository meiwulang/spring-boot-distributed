package com.jdy.b2b.api.dao;

import com.jdy.b2b.api.common.BaseVO;
import com.jdy.b2b.api.model.Company;
import com.jdy.b2b.api.model.company.CompanyTreeDTO;
import com.jdy.b2b.api.model.company.CompanyVo;
import com.jdy.b2b.api.model.synchronizeDistributionSystem.Dept;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface CompanyMapper {
	int deleteByPrimaryKey(Long id);

	int insert(Company record);

	int insertSelective(Company record);

	CompanyVo selectByPrimaryKey(Long id);

	CompanyVo selectByNameAndPid(@Param("name") String name,
			@Param("pId") Long pId);

	CompanyVo selectByName(@Param("name") String name);

	int updateByPrimaryKeySelective(Company record);

	int updateByPrimaryKey(Company record);

	/**
	 * 单位搜索接口 确定条件：公司类型，公司所在地（城市），所属单位， 模糊条件：单位编号，单位名称，所属类型
	 * 
	 * @param type
	 *            所属类型
	 * @param city
	 *            城市
	 * @param pid
	 *            父级单位id
	 * @param fastSearchStr
	 *            快速搜索字符串
	 * @return
	 */
	List<Company> selectByTypeAndCityAndBhAndName(@Param("type") Integer type,
			@Param("city") String city, @Param("pid") Long pid,
			@Param("fastSearchStr") String fastSearchStr,@Param("searchType")Integer searchType);

	/**
	 * 根据名称获取顶级单位的集合
	 * 
	 * @param name
	 * @return
	 */
	List<Company> selectTopCompanyByName(@Param("name") String name);

	/**
	 * 根据名称获取顶级单位的集合 包括子单位属性
	 * 
	 * @param name
	 *            模糊搜索
	 * @return
	 */
	List<com.jdy.b2b.api.model.company.CompanyDto> selectAllCompanyWithTree(
			@Param("name") String name);

	/**
	 * 根据父级单位查询所有子单位
	 * 
	 * @param id
	 * @return
	 */
	List<Company> selectChildrenByParentId(Long id);

	Company selectByOrgName(@Param("name") String name, @Param("id") Long id);

	Company selectByOrgMob(@Param("tel") String orgMob,
			@Param("id") Long orgId);

	List<Company> selectChildrenById(@Param("id") Long orgId,
			@Param("fastSearchStr") String fastSearchStr);

	/**
	 * 根据单位审核状态和快速搜索字段查询需要单位
	 * 
	 * @param fastSearchStr
	 *            快速搜索字段
	 * @param status
	 *            单位状态的字符串
	 * @return 单位集合
	 */
	List<Company> selectAuditingCompanies(
			@Param("fastSearchStr") String fastSearchStr,
			@Param("status") Integer status);

	Company selectByNo(@Param("no") String no, @Param("id") Long companyId);

	/**
	 * 根据名称关键字 搜索 在订单中有过 收款记录的 单位
	 * 
	 * @param name
	 * @return
	 */
	List<Company> selectReceivablesCompany(@Param("name") String name);

	/**
	 * 根据 名称关键字 或 收款公司 ID 查找 与之对应的 付款单位
	 * 
	 * @param name
	 * @param salerCompany
	 * @return
	 */
	List<Company> selectPaymentCompany(@Param("name") String name,
			@Param("salerCompany") Long salerCompany);

	List<Map> selectCompanyListForUserRolePrivilegeByCompanyId(BaseVO baseVO);

	List<CompanyTreeDTO> selectAllCompanies();

    String selectPidsById(Long companyId);

    void updatePids();

	List<Company> selectCompanyAll(Company company);

    Company selectByCompanyId(Long companyId);

    int insertDepts(@Param("addList") List<Dept> addList);

    int insertDept(Dept addList);

    int updateDept(Dept dept);

    int deleteByIds(List ids);
}