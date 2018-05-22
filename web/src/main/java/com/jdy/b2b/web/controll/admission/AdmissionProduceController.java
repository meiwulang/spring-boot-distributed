package com.jdy.b2b.web.controll.admission;

import com.jdy.b2b.web.pojo.admission.*;
import com.jdy.b2b.web.service.AdmissionService;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ResultBean;
import io.swagger.annotations.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

/**
 * Created by dugq on 2018/4/17.
 */
@RestController
@RequestMapping("admission/produce")
@Api(value = "/admission/produce",description = "门票生产记录")
public class AdmissionProduceController extends BaseController {
    @Autowired
    private AdmissionService admissionService;

    @ApiOperation(value = "生产记录列表",notes = "生产记录列表",httpMethod = "POST",response = ResultBean.class)
    @ApiResponses(value = {@ApiResponse(code = 200, message = "生产记录", response = AdmissionBaseDto.class),@ApiResponse(code = 200, message = "生产记录", response = AdmissionProduceDto.class)})
    @PostMapping("list")
    public ResultBean list(@RequestBody AdmissionProduceListParam param){
        return admissionService.listProduceDto(param);
    }

    @ApiOperation(value = "生产记录保存",notes = "生产记录保存",httpMethod = "POST",response = ResultBean.class)
    @PostMapping("save")
    public ResultBean save(@RequestBody AdmissionProduce produce){
        produce.setCreateTime(new Date());
        produce.setCreateUser(getUser().getUserId());
        produce.setUpdateTime(new Date());
        produce.setUpdateUser(getUser().getUserId());
        return admissionService.saveProduce(produce);
    }

    @ApiImplicitParam(name = "id", value = "生产记录ID", required = true, dataType = "Long" ,paramType = "path")
    @ApiOperation(value = "获取生产记录",notes = "获取生产记录",httpMethod = "GET",response = ResultBean.class)
    @ApiResponses(value = {@ApiResponse(code = 200, message = "生产记录", response = AdmissionProduce.class)})
    @GetMapping("get/{id}")
    public ResultBean get(@PathVariable Long id){
        return admissionService.getProduce(id);
    }

    @ApiOperation(value = "修改生产记录生产状态 0:正常 1:暂停 2:已删除",notes = "修改生产记录生产状态 0:正常 1:暂停 2:已删除",httpMethod = "POST",response = ResultBean.class)
    @PostMapping("modifyProduceStatus")
    public ResultBean modifyProduceStatus(@RequestBody ModifyAdmissionProduceStatusParam param){
        return admissionService.modifyProduceStatus(param);
    }

    @ApiOperation(value = "修改生产记录销售状态 0:已上架 1:已下架",notes = "修改生产记录销售状态 0:已上架 1:已下架",httpMethod = "POST",response = ResultBean.class)
    @PostMapping("modifySalesStatus")
    public ResultBean modifySalesStatus(@RequestBody ModifyAdmissionProduceStatusParam param){
        return admissionService.modifySalesStatus(param);
    }



}
