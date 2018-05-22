package com.jdy.b2b.api.service;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.Company;
import com.jdy.b2b.api.model.company.AuditEnum;
import com.jdy.b2b.api.model.company.CompanyDto;
import com.jdy.b2b.api.model.company.CompanyVo;

import java.util.List;

/**
 * Created by dugq on 2017/7/4.
 */
public interface CompanyService {
    int deleteByPrimaryKey(Long id);

    int insert(Company record);

    int insertSelective(Company record);

    CompanyVo selectByPrimaryKey(Long id);

    int updateByPrimaryKeySelective(Company record);

    int updateByPrimaryKey(Company record);

    /**
     * 单位搜索接口
     * 确定条件：公司类型，公司所在地（城市），所属单位，  模糊条件：单位编号，单位名称，所属类型
     * @param orgType 所属类型
     * @param orgCity 城市
     * @param orgPid 父级单位id
     * @param fastSearchStr  快速搜索字符串
     * @return
     */
    List<Company> selectByTypeAndCityAndBhAndName(Integer orgType, String orgCity, Long orgPid,String fastSearchStr,Integer pageIndex,Integer searchType);

    /**
     * 根据名称查询所有顶级单位
     * @param name 为空查询所有
     * @return
     */
    List<Company> selectTopCompanyByName(String name,Integer pageIndex);

    /**
     * 根据名称查询所有顶级单位 附带子公司属性
     * @param name 为空查询所有
     * @return
     */
    List<CompanyDto> selectAllCompanyWithTree(String name,Integer pageIndex);

    List<Company> selectChildrenByParentId(Long id);

    ResultBean entityAccount(Long id);

    /**
     * 根据单位名称查询单位
     * @param orgName
     * @return
     */
    Company selectByOrgName(String orgName,Long id);

    /**
     * 根据负责人电话查询单位
     * @param orgMob 负责人电话
     * @return 单位
     */
    Company selectByOrgMob(String orgMob,Long id);

    /**
     * 获取子集单位包括自己
     * @param id 父单位的id
     * @param fastSearchStr
     * @return 单位集合，包括父单位和所有的子单位
     */
    List<Company> selectChildrenById(Long id, String fastSearchStr, Integer pageIndex);

    /**
     * 根据单位审核状态和快速搜索字段查询需要单位
     * @param fastSearchStr 快速搜索字段
     * @param pageIndex 分页 当前页
     * @param status 单位状态
     * @return 单位集合
     */
    List<Company> selectAuditingCompanies(String fastSearchStr, Integer pageIndex, AuditEnum status);

    /**
     * 修改单位状态
     * @param id 单位id
     * @param auditEnum 修改的状态
     * @return >1 成功 0 失败
     */
    Integer modifyAuditStatus(Long id, AuditEnum auditEnum,String reason);

    Company selectByNo(String no, Long companyId);


    /**
     * 同步组织架构到礼品卡
     * @param
     * @return
     */
    List<Company> selectCompanyAll(Company company);

    Company selectByCompanyId(Long companyId);
}
