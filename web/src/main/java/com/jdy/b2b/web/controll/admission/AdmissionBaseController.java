package com.jdy.b2b.web.controll.admission;

import com.jdy.b2b.web.pojo.admission.AdmissionBase;
import com.jdy.b2b.web.pojo.admission.AdmissionBaseDto;
import com.jdy.b2b.web.pojo.admission.AdmissionBaseListParam;
import com.jdy.b2b.web.pojo.admission.AdmissionBaseWithBLOBs;
import com.jdy.b2b.web.pojo.city.CityDTO;
import com.jdy.b2b.web.service.AdmissionService;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ResultBean;
import io.swagger.annotations.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.Objects;

/**
 * Created by dugq on 2018/4/17.
 */
@RestController
@RequestMapping("admission/base")
@Api(value = "/admission/base",description = "门票产品")
public class AdmissionBaseController extends BaseController{
    @Autowired
    private AdmissionService admissionService;

    @ApiOperation(value = "保存门票产品基本信息",notes = "保存门票产品基本信息",httpMethod = "POST",response = ResultBean.class)
    @PostMapping("saveAdmissionBase")
        public ResultBean save(@RequestBody AdmissionBaseWithBLOBs admissionBase){
        if(Objects.isNull(admissionBase.getId())){
            admissionBase.setCreaterTime(new Date());
            admissionBase.setCreaterUser(getUser().getUserId());
        }
        return admissionService.saveBase(admissionBase);
    }

    @ApiOperation(value = "获取门票产品基本信息列表",notes = "获取门票产品基本信息列表",httpMethod = "POST",response = ResultBean.class)
    @ApiResponses(value = {@ApiResponse(code = 200, message = "门票产品对象", response = AdmissionBaseDto.class)})
    @PostMapping("/list")
    public ResultBean list(@RequestBody AdmissionBaseListParam param){
        return admissionService.listBase(param);
    }

    @ApiOperation(value = "删除门票产品",notes = "删除门票产品",httpMethod = "GET",response = ResultBean.class)
    @ApiImplicitParam(name = "id", value = "门票ID", required = true, dataType = "Long" ,paramType = "path")
    @GetMapping("deleteAdmissionBase/{id}")
    public ResultBean delete(@PathVariable("id") Long id){
        return admissionService.modifyAdmissionBaseStatus(id, (byte) -1);
    }

    @ApiOperation(value = "上架",notes = "上架",httpMethod = "GET",response = ResultBean.class)
    @ApiImplicitParam(name = "id", value = "门票ID", required = true, dataType = "Long" ,paramType = "path")
    @GetMapping("startSales/{id}")
    public ResultBean startSales(@PathVariable("id") Long id){
        return admissionService.modifyAdmissionBaseStatus(id, (byte) 4);
    }

    @ApiOperation(value = "下架",notes = "上架",httpMethod = "GET",response = ResultBean.class)
    @ApiImplicitParam(name = "id", value = "门票ID", required = true, dataType = "Long" ,paramType = "path")
    @GetMapping("stopSales/{id}")
    public ResultBean stopSales(@PathVariable("id") Long id){
        return admissionService.modifyAdmissionBaseStatus(id, (byte) 3);
    }

    @ApiOperation(value = "入库",notes = "入库",httpMethod = "GET",response = ResultBean.class)
    @ApiImplicitParam(name = "id", value = "门票ID", required = true, dataType = "Long" ,paramType = "path")
    @GetMapping("enterStore/{id}")
    public ResultBean enterStore(@PathVariable("id") Long id){
        return admissionService.modifyAdmissionBaseStatus(id, (byte) 3);
    }

    @ApiOperation(value = "出库",notes = "出库",httpMethod = "GET",response = ResultBean.class)
    @ApiImplicitParam(name = "id", value = "门票ID", required = true, dataType = "Long" ,paramType = "path")
    @GetMapping("outStore/{id}")
    public ResultBean outStore(@PathVariable("id") Long id){
        return admissionService.modifyAdmissionBaseStatus(id, (byte) 2);
    }

    @ApiOperation(value = "申报确认",notes = "申报确认",httpMethod = "GET",response = ResultBean.class)
    @ApiImplicitParam(name = "id", value = "门票ID", required = true, dataType = "Long" ,paramType = "path")
    @GetMapping("confirm/{id}")
    public ResultBean confirm(@PathVariable("id") Long id){
        return admissionService.modifyAdmissionBaseStatus(id, (byte) 2);
    }

    @ApiOperation(value = "提交门票",notes = "提交门票，设置完成",httpMethod = "GET",response = ResultBean.class)
    @ApiImplicitParam(name = "id", value = "门票ID", required = true, dataType = "Long" ,paramType = "path")
    @GetMapping("commit/{id}")
    public ResultBean commit(@PathVariable("id") Long id){
        return admissionService.modifyAdmissionBaseStatus(id, (byte) 1);
    }



    @ApiOperation(value = "获取门票产品",notes = "获取门票产品",httpMethod = "GET",response = ResultBean.class)
    @ApiImplicitParam(name = "id", value = "门票ID", required = true, dataType = "Long" ,paramType = "path")
    @ApiResponses(value = {@ApiResponse(code = 200, message = "门票产品对象", response = AdmissionBaseDto.class)})
    @GetMapping("getAdmissionBase/{id}")
    public ResultBean getAdmissionBase(@PathVariable("id") Long id){
        return admissionService.getAdmissionBase(id);
    }
}
