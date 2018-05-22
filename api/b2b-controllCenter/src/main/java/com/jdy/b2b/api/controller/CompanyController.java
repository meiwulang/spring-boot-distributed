package com.jdy.b2b.api.controller;

import com.github.pagehelper.PageInfo;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.Company;
import com.jdy.b2b.api.model.company.AuditEnum;
import com.jdy.b2b.api.model.company.CompanyVo;
import com.jdy.b2b.api.model.company.ProductTypeEnum;
import com.jdy.b2b.api.service.CompanyService;
import com.jdy.b2b.api.model.company.CompanyDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Date;
import java.util.List;
import java.util.Objects;

/**
 * Created by dugq on 2017/7/4.
 */
@Controller
@RequestMapping("Company")
public class CompanyController {
    @Autowired
    private CompanyService companyService;

    @RequestMapping("test")
    @ResponseBody
    public String index(){
        return "hello~";
    }

    /**
     * 根据条件查询单位列表
     * 确定条件：公司类型，公司所在地（城市），所属单位，  模糊条件：单位编号，单位名称，所属类型
     * @param company
     * @param fastSearchStr
     * @return
     */
    @RequestMapping("index")
    @ResponseBody
    public ResultBean<PageInfo> selectByConditions(Company company,String fastSearchStr,Integer pageIndex,Integer searchType){
        List<Company> companies = companyService.selectByTypeAndCityAndBhAndName(company.getcType(), company.getcCity(), company.getcPid(), fastSearchStr,pageIndex,searchType);
        PageInfo page = new PageInfo(companies);
        ResultBean successResult = ResultBean.getSuccessResult(page);
        return successResult;
    }

    /**
     * 添加新单位
     * @param company
     * @return
     */
    @RequestMapping("add")
    @ResponseBody
    public ResultBean<Company> addCompany(@RequestBody Company company){
        ResultBean result ;
        company.setcStatus(AuditEnum.PASS.getValue());
        Company company1 = companyService.selectByOrgName(company.getcName(),null);
        Company company2 = companyService.selectByOrgMob(company.getcTel(),null);
        Company company3 = companyService.selectByNo(company.getcNo(),null);
        if(company1 != null){
            return new ResultBean("-1","名称重复~");
        }
        if(company2 !=null){
            return new ResultBean("-1","负责人电话不能重复~");
        }
        if(company3 !=null){
            return new ResultBean("-1","编号不能重复~");
        }
        if(Objects.isNull(company.getcPid())){
            company.setcPid((long) 0);
        }
        int i = companyService.insertSelective(company);
        if(i>0){
            result = ResultBean.getSuccessResult();
            result.setBody(company);
            result.setId(company.getId());
        }else{
            result = new ResultBean("-1","error");
        }
        return result;
    }

    /**
     * @param company 参数信息，不修改的为null即可
     * @return
     */
    @RequestMapping("save")
    @ResponseBody
    public ResultBean<Company> updateCompany(@RequestBody Company company){
        ResultBean result ;
        Company company1 = companyService.selectByOrgName(company.getcName(),company.getId());
        Company company2 = companyService.selectByOrgMob(company.getcTel(),company.getId());
        Company company3 = companyService.selectByNo(company.getcNo(),company.getId());
        if(company1 != null){
            return new ResultBean("-1","名称重复~");
        }
        if(company2 !=null){
            return new ResultBean("-1","负责人电话不能重复~");
        }
        if(company3 !=null){
            return new ResultBean("-1","编号不能重复~");
        }
        result = doUpdate(company);
        return result;
    }

    /**
     * 更新的具体操作
     * @param company
     * @return
     */
    private ResultBean doUpdate(Company company) {
        ResultBean result;
        if(company.getId()!=null && company.getId()<=0){
            result = new ResultBean("-1","error id");
        }else{
            int i = companyService.updateByPrimaryKeySelective(company);
            if(i>0){
                result = ResultBean.getSuccessResult();
            }else{
                result = new ResultBean("-1","操作失败，单位可能已经不存在了~");
            }
        }
        return result;
    }

    /**
     * 操作：开户：org_id: id  org_licence_code:营业执照  org_finaccount ：付款是否开通 ,org_receipt_account ：收款是否开通 0 : 未开通 1：开通
     *
     * @param id
     * @return
     */
    @RequestMapping("entityAccount")
    @ResponseBody
    public ResultBean<Company> entityAccount(Long id){
        ResultBean result;
        if(id!=null && id <=0){
            result = new ResultBean("-1","error id");
        }else{
            result = companyService.entityAccount(id);
        }
        return result;
    }


    /**
     * 删除单位
     * @param id
     * @return
     */
    @RequestMapping("del")
    @ResponseBody
    public ResultBean<Company> deleteCompany(Long id){
        ResultBean result ;
        int i = 0;
        try {
            i = companyService.deleteByPrimaryKey(id);
        } catch (Exception e) {
            result = new ResultBean("-1","error");
            e.printStackTrace();
        }
        if(i>0){
            result = ResultBean.getSuccessResult();
        }else{
            result = new ResultBean("-1","error");
        }
        return result;
    }

    /**
     * 余额查询
     * @param company
     * @return
     */
    @RequestMapping("rsBalance")
    @ResponseBody
    public ResultBean<Company> rsBalance(Company company){
        ResultBean result ;
        result = new ResultBean("-1","暂未开放 ~");
        return result;
    }

    /**
     * 根据名称查询所有顶级单位
     * @param name 为空查询所有
     * @return
     */
    @RequestMapping("selectAllTopCompany")
    @ResponseBody
    public ResultBean<PageInfo> selectAllTopCompany(String name,Integer pageIndex){
        List<Company> companies = companyService.selectTopCompanyByName(name,pageIndex);
        PageInfo page = new PageInfo(companies);
        return ResultBean.getSuccessResult(page);
    }

    /**
     * 根据名称查询所有顶级单位 附带子公司属性
     * @param name 为空查询所有
     * @return
     */
    @RequestMapping("selectAllCompanyWithTree")
    @ResponseBody
    public ResultBean<PageInfo> selectAllCompanyWithTree(String name,Integer pageIndex){
        List<CompanyDto> companies = companyService.selectAllCompanyWithTree(name,pageIndex);
        PageInfo page = new PageInfo(companies);
        return ResultBean.getSuccessResult(page);
    }

    /**
     * 根据单位id获取单位列表
     * @param id
     * @param fastSearchStr
     * @return pageInfo
     */
    @ResponseBody
    @RequestMapping("selectChildrenById")
    public ResultBean selectChildrenById(Long id,String fastSearchStr,Integer pageIndex){
        List<Company> companies = companyService.selectChildrenById(id,fastSearchStr,pageIndex);
        PageInfo page = new PageInfo(companies);
        return ResultBean.getSuccessResult(page);
    }

    /**
     * 查询未审核的单位列表
     * @param fastSearchStr 快速搜索字符串
     * @param pageIndex 当前页
     * @return   page.body:单位集合
     */
    @ResponseBody
    @RequestMapping("selectAuditingCompanies")
    public ResultBean selectAuditingCompanies(String fastSearchStr,Integer pageIndex){
        List<Company> companies = companyService.selectAuditingCompanies(fastSearchStr,pageIndex, AuditEnum.WATING_AUDIT);
        PageInfo page = new PageInfo(companies);
        return ResultBean.getSuccessResult(page);
    }

    /**
     * 修改单位状态
     * @param id 单位id
     * @param status 单位状态
     * @return 1成功，0失败 >1 数据重复
     */
    @ResponseBody
    @RequestMapping("modifyAuditStatus")
    public ResultBean modifyAuditStatus(Long id,Integer status,String reason){
        Integer result = companyService.modifyAuditStatus(id,AuditEnum.ofValue(status),reason);
        return ResultBean.getSuccessResult(result);
    }

    @ResponseBody
    @RequestMapping("selectCompany")
    public ResultBean selectCompany(Long companyId){
        CompanyVo company = companyService.selectByPrimaryKey(companyId);
        if(Objects.isNull(company)){
            return new ResultBean("-1","单位不存在~");
        }
        company.setcProductType(ProductTypeEnum.getDescriptionsOfCOdes(company.getcProductType()));
        return ResultBean.getSuccessResult(company);
    }


    /**
     * 同步组织信息到礼品卡
     * @return   page.body:单位集合
     */
    @ResponseBody
    @RequestMapping("syncCompanyAll")
    public ResultBean syncCompanyAll(@RequestBody Company company){
        List<Company> companies = companyService.selectCompanyAll(company);
        return ResultBean.getSuccessResult(companies);
    }
}
