package com.jdy.b2b.web.service;

import com.jdy.b2b.web.pojo.company.CompanySetting;
import com.jdy.b2b.web.pojo.company.CompanyBasicInfoVo;
import com.jdy.b2b.web.util.ResultBean;

/**
 * Created by dugq on 2017/7/12.
 */
public interface CompanyService {
    /**
     * 根据条件查询单位列表
     * 确定条件：公司类型，公司所在地（城市），所属单位，  模糊条件：单位编号，单位名称，所属类型
     * @param company
     * @param fastSearchStr
     * @return
     */
    ResultBean selectByConditions(CompanyBasicInfoVo company, String fastSearchStr, Integer pageIndex);
    /**
     * 添加新单位
     * @param company
     * @return
     */
    ResultBean save(CompanyBasicInfoVo company);
    /**
     * @param company 参数信息，不修改的为null即可
     * @return
     */
    <T> ResultBean update(T company);
    /**
     * 操作：开户：org_id: id  org_licence_code:营业执照  org_finaccount ：付款是否开通 ,org_receipt_account ：收款是否开通 0 : 未开通 1：开通
     *
     * @param id
     * @return
     */
    ResultBean entityAccount(Long id);
    /**
     * 删除单位
     * @param id
     * @return
     */
    ResultBean del(Long id);
    /**
     * 根据名称查询所有顶级单位
     * @param name 为空查询所有
     * @return
     */
    ResultBean selectAllTopCompany(String name, Integer pageIndex);
    /**
     * 根据名称查询所有顶级单位 附带子公司属性
     * @param name 为空查询所有
     * @return
     */
    ResultBean selectAllCompanyWithTree(String name, Integer pageIndex);
    /**
     * 根据单位id获取单位列表
     * @param id
     * @param fastSearchStr
     * @return pageInfo
     */
    ResultBean selectChildrenById(Long id, String fastSearchStr, Integer pageIndex);
    /**
     * 查询未审核的单位列表
     * @param fastSearchStr 快速搜索字符串
     * @param pageIndex 当前页
     * @return   page.body:单位集合
     */
    ResultBean selectAuditingCompanies(String fastSearchStr, Integer pageIndex);
    /**
     * 修改单位状态
     * @param id 单位id
     * @param status 单位状态
     * @return 1成功，0失败 >1 数据重复
     */
    ResultBean modifyAuditStatus(Long id, Integer status,String reason);

    /**
     * 保存单位设置
     * @param companyVo
     * @return
     */
    ResultBean saveCompanySetting(CompanySetting companyVo);

    /**
     * 查询单位设置
     * @param companyId
     * @return
     */
    ResultBean selectCompanySetting(Long companyId);

    /**
     * 根据单位id查询单位信息
     * @param companyId
     * @return
     */
    ResultBean selectCompany(Long companyId);

    /**
     * 同步组织信息到礼品卡
     * @return
     */
    ResultBean selectSyncCompanyAll(CompanyBasicInfoVo company);
}
