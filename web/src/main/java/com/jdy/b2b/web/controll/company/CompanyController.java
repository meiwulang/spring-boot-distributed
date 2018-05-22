package com.jdy.b2b.web.controll.company;

import com.jdy.b2b.web.pojo.company.*;
import com.jdy.b2b.web.pojo.log.MyLog;
import com.jdy.b2b.web.service.CompanyService;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ResultBean;
import com.jdy.b2b.web.util.annotations.Save;
import com.jdy.b2b.web.util.annotations.Update;
import io.swagger.annotations.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.StringUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotNull;
import javax.validation.groups.Default;
import java.util.Objects;

/**
 * @Description company controller
 * @Author yyf
 * @DateTime 2017/7/10 15:38
 */
@RestController
@RequestMapping("Company")
@Api(value = "/Company",description = "单位模块相关操作")
public class CompanyController extends BaseController {

    @Autowired
    CompanyService companyService;


    @RequestMapping(value = "index",method = RequestMethod.POST)
    @ResponseBody
    @ApiOperation(value = "单位模块首页，根据条件查询所有单位",notes = "查询条件有多个，可随意组合，不需要的不传即可。返回根据条件查询到的结果。",httpMethod = "POST")
    @ApiImplicitParams(value = {@ApiImplicitParam(name = "pageIndex" ,paramType = "query" ,dataType = "int",value = "分页信息，需要查询的页码。从1开始" ,required = true),
            @ApiImplicitParam(value = "单位类型信息 ：0:供应商,1:分销商,2:管理公司", allowableValues = "0,1,2",name = "type",paramType = "query"),
            @ApiImplicitParam(name = "city",value = "条件城市。",paramType = "query"),
            @ApiImplicitParam(name = "pid",value = "根据父级单位查询子单位",paramType = "query"),
            @ApiImplicitParam(name = "fastSearchStr",value = "快速查询输入框中的值。 可根据字符串模糊匹配",paramType = "query")})
    @ApiResponses(value = {@ApiResponse(code = 200,message = "数据存于body中。body{pageNum: 当前页,pageSize: 每页总数,size: 当前页数量,total: 总行数,pages: 总页数,list:companyVo的数组}" ,response = CompanyVo.class)})
    public ResultBean index(Integer type,String city,Long pid,String fastSearchStr,@NotNull(message = "请输入分页信息")Integer pageIndex,Integer searchType){
        CompanyBasicInfoVo company = new CompanyBasicInfoVo();
        company.setcType(type);
        company.setcCity(city);
        company.setcPid(pid);
        company.setSearchType(searchType);
        return companyService.selectByConditions(company, fastSearchStr, pageIndex);
    }

    @ApiOperation(value = "保存单位",notes = "保存单位的基本信息，id不传",httpMethod = "POST",response = ResultBean.class)
    @ResponseBody
    @RequestMapping(value = "add",method = RequestMethod.POST)
    @MyLog
    public ResultBean save( @RequestBody @Validated(value = {Save.class, Default.class}) CompanyBasicInfoVo company){
        if(!Objects.isNull(company.getId()) && company.getId() > 0){
            return companyService.update(company);
        }
        return   companyService.save(company);
    }

    @ApiOperation(value = "跟新单位基本信息",notes = "跟新单位的基本信息，id不可为空",httpMethod = "POST",response = ResultBean.class)
    @ResponseBody
    @RequestMapping(value = "update",method = RequestMethod.POST)
    @MyLog
    public ResultBean update(@RequestBody @Validated(value = {Update.class, Default.class}) CompanyBasicInfoVo company){
        return companyService.update(company);
    }

    @ApiOperation(value = "保存单位附件",notes = "保存单位的附件信息",httpMethod = "POST",response = ResultBean.class)
    @ResponseBody
    @RequestMapping(value = "saveAttach",method = RequestMethod.POST)
    @MyLog(SuccessInfo = "保存附件成功",ErrorInfo = "保存附件失败",Operation = "update")
    public ResultBean saveAttach(@RequestBody @Validated({CompanyBasicInfoVo.Attach.class}) CompanyAttachInfoVo company){
       return companyService.update(company);
    }


    @ApiOperation(value = "删除单位",notes = "根据id删除单位",httpMethod = "POST",response = ResultBean.class)
    @ApiImplicitParams(value = {@ApiImplicitParam(name = "id" ,paramType = "query" , value = "单位id" ,required = true)})
    @ResponseBody
    @RequestMapping(value = "del",method = RequestMethod.POST)
    @MyLog
    public ResultBean delete(@NotNull(message = "请选择单位") Long id){
        return companyService.del(id);
    }


    @ApiOperation(value = "查询单位设置",notes = "根据单位id查询单位设置信息",httpMethod = "POST" )
    @ApiImplicitParams(value = {@ApiImplicitParam(name = "companyId" ,paramType = "query" , value = "单位id" ,required = true)})
    @ApiResponses(value = {@ApiResponse(code = 200,message = "数据存于body中。body{pageNum: 当前页,pageSize: 每页总数,size: 当前页数量,total: 总行数,pages: 总页数,list:CompanySetting的数组}" ,response = CompanySetting.class)})
    @ResponseBody
    @RequestMapping(value = "selectCompanySetting",method = RequestMethod.POST)
    public ResultBean selectCompanySetting(@NotNull(message = "请选择单位。") Long companyId){
        return companyService.selectCompanySetting(companyId);
    }

    @ApiOperation(value = "保存单位设置",notes = "保存单位设置信息",httpMethod = "POST" )
    @ResponseBody
    @RequestMapping(value = "saveCompanySetting",method = RequestMethod.POST)
    @MyLog(SuccessInfo = "保存部门设置成功",ErrorInfo = "保存部门设置失败",Obj="CompanySetting.csCompanyId")
    public ResultBean saveCompanySetting(@RequestBody @Validated CompanySetting companySetting){
        return companyService.saveCompanySetting(companySetting);
    }

    @ApiOperation(value = "单位开户设置",notes = "单位开户设置信息",httpMethod = "POST" )
    @ApiImplicitParams(value = {@ApiImplicitParam(name = "companyId" ,paramType = "query" , value = "单位id" ,required = true)})
    @ResponseBody
    @RequestMapping(value = "openAccount")
    @MyLog(SuccessInfo = "开户成功",ErrorInfo = "开户失败")
    public ResultBean openAccount(@NotNull(message = "请选择单位") Long companyId){
        return companyService.entityAccount(companyId);
    }
    @ApiResponses(value = {@ApiResponse(code = 200,message = "数据存于body中。body{pageNum: 当前页,pageSize: 每页总数,size: 当前页数量,total: 总行数,pages: 总页数,list:CompanySetting的数组}" ,response = CompanyVo.class)})
    @ApiOperation(value = "获取所有顶级单位",notes = "获取所有顶级单位，可根据name模糊查询",httpMethod = "POST" )
    @ApiImplicitParams(value = {@ApiImplicitParam(name = "name" ,paramType = "query" , value = "单位名称"),@ApiImplicitParam(name = "pageIndex" ,paramType = "query" , value = "分页信息",required = true)})
    @RequestMapping(value = "selectAllTopCompany",method = RequestMethod.POST)
    @ResponseBody
    public ResultBean selectAllTopCompany(String name,@NotNull(message = "请选择分页") Integer pageIndex){
        return companyService.selectAllTopCompany(name,pageIndex);
    }

    @ApiResponses(value = {@ApiResponse(code = 200,message = "数据存于body中。body{pageNum: 当前页,pageSize: 每页总数,size: 当前页数量,total: 总行数,pages: 总页数,list:CompanySetting的数组}" ,response = CompanyTreeVo.class)})
    @ApiOperation(value = "获取所有顶级单位",notes = "获取所有顶级单位，包括了子单位，可根据name模糊查询",httpMethod = "POST" )
    @ApiImplicitParams(value = {@ApiImplicitParam(name = "name" ,paramType = "query" , value = "单位名称"),@ApiImplicitParam(name = "pageIndex" ,paramType = "query" , value = "分页信息",required = true)})
    @RequestMapping(value = "selectAllCompanyWithTree",method = RequestMethod.POST)
    @ResponseBody
    public ResultBean selectAllCompanyWithTree(String name,@NotNull(message = "请选择分页") Integer pageIndex){
        return companyService.selectAllCompanyWithTree(name,pageIndex);
    }

    @ApiOperation(value = "获取所有顶级单位",notes = "获取所有顶级单位，包括了子单位，可根据name模糊查询",httpMethod = "POST" )
    @ApiImplicitParams(value = {@ApiImplicitParam(name = "fastSearchStr" ,paramType = "query" , value = "快速搜索字符串"),@ApiImplicitParam(name = "id" ,paramType = "query" , value = "单位id"),@ApiImplicitParam(name = "pageIndex" ,paramType = "query" , value = "分页信息",required = true)})
    @RequestMapping(value = "selectChildrenById",method = RequestMethod.POST)
    @ResponseBody
    public ResultBean selectChildrenById( Long id, String fastSearchStr, @NotNull(message = "请选择分页") Integer pageIndex){
        return companyService.selectChildrenById(id,fastSearchStr,pageIndex);
    }

    @ApiResponses(value = {@ApiResponse(code = 200,message = "数据存于body中。body{pageNum: 当前页,pageSize: 每页总数,size: 当前页数量,total: 总行数,pages: 总页数,list:CompanySetting的数组}" ,response = CompanyVo.class)})
    @ApiOperation(value = "获取需要审核的单位",notes = "获取需要审核的单位",httpMethod = "POST" )
    @ApiImplicitParams(value = {@ApiImplicitParam(name = "fastSearchStr" ,paramType = "query" , value = "快速搜索字符串"),@ApiImplicitParam(name = "pageIndex" ,paramType = "query" , value = "分页信息",required = true)})
    @RequestMapping(value = "selectAuditingCompanies",method = RequestMethod.POST)
    @ResponseBody
    public ResultBean selectAuditingCompanies(String fastSearchStr,@NotNull(message = "请选择分页") Integer pageIndex){
        return companyService.selectAuditingCompanies(fastSearchStr,pageIndex);
    }

    @ApiOperation(value = "审核的单位",notes = "审核的单位",httpMethod = "POST" ,response = ResultBean.class)
    @ApiImplicitParams(value = {@ApiImplicitParam(name = "id" ,paramType = "query" , value = "单位id",required = true),@ApiImplicitParam(name = "status" ,paramType = "query" , value = "审核状态1:审核通过 2:审核不通过 3： del",required = true,allowableValues = "1,2,3"),@ApiImplicitParam(name="reason",paramType = "query",value = "审核失败原因")})
    @RequestMapping(value = "audit",method = RequestMethod.POST)
    @ResponseBody
    public ResultBean modifyAuditStatus(@NotNull(message = "请选择单位") Long id, @NotNull(message = "请选择状态。") Integer status,String reason){
        if(status == 2 && StringUtils.isEmpty(reason)){
            return new ResultBean("-1","请输入回退原因~");
        }
        if(reason.length()>500){
            return new ResultBean("-1","原因最多500个字~");
        }
        return companyService.modifyAuditStatus(id, AuditEnum.ofValue(status).getValue(),reason);
    }


    @ApiOperation(value = "获取单位信息",notes = "获取单位信息",httpMethod = "POST" ,response = ResultBean.class)
    @ApiImplicitParams(value = {@ApiImplicitParam(name = "companyId" ,paramType = "query" , value = "单位id",required = true)})
    @RequestMapping(value = "/selectCompany",method = RequestMethod.POST)
    @ResponseBody
    public ResultBean selectCompany(@NotNull(message = "请选择单位")Long companyId){
        return companyService.selectCompany(companyId);
    }


    @ApiOperation(value = "获取单位信息",notes = "获取单位信息",httpMethod = "POST" ,response = ResultBean.class)
    @RequestMapping(value = "/syncCompanyAll",method = RequestMethod.POST)
    @ResponseBody
    public ResultBean syncCompanyAll(@RequestBody CompanyBasicInfoVo company){
        return companyService.selectSyncCompanyAll(company);
    }
}
