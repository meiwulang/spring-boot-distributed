package com.jdy.b2b.api.controller;

import com.github.pagehelper.PageInfo;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.admission.AdmissionBase;
import com.jdy.b2b.api.model.admission.AdmissionBaseDto;
import com.jdy.b2b.api.model.admission.AdmissionBaseListParam;
import com.jdy.b2b.api.model.admission.AdmissionBaseWithBLOBs;
import com.jdy.b2b.api.service.AdmissionBaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

/**
 * Created by dugq on 2018/4/17.
 */
@RestController
@RequestMapping("admission/base")
public class AdmissionBaseController {
    @Autowired
    private AdmissionBaseService admissionBaseService;

    @PostMapping("saveAdmissionBase")
    public ResultBean save(@RequestBody AdmissionBaseWithBLOBs admissionBase){
        admissionBase.setAdmissionStatus(null);
        if(Objects.isNull(admissionBase.getId())){
            admissionBaseService.insertSelective(admissionBase);
        }else{
            admissionBaseService.updateByPrimaryKeySelective(admissionBase);
        }
        ResultBean successResult = ResultBean.getSuccessResult();
        successResult.setId(admissionBase.getId());
        return successResult;
    }

    @PostMapping("/list")
    public ResultBean list(@RequestBody AdmissionBaseListParam param){
        List<AdmissionBaseDto> admissionBaseWithBLOBs = admissionBaseService.selectByParam(param);
        PageInfo pageInfo = new PageInfo(admissionBaseWithBLOBs);
        return ResultBean.getSuccessResult(pageInfo);
    }

    @GetMapping("modifyAdmissionBaseStatus/{id}/{status}")
    public ResultBean delete(@PathVariable("id") Long id,@PathVariable("status") Byte status){
        if(status>0){
            AdmissionBaseWithBLOBs admissionBaseWithBLOBs = admissionBaseService.selectByPrimaryKey(id);
            if(Objects.isNull(admissionBaseWithBLOBs) || admissionBaseWithBLOBs.getAdmissionStatus().intValue() == -1){
                return ResultBean.getErrorResult("不存在的产品~");
            }
            else if((admissionBaseWithBLOBs.getAdmissionStatus().intValue()==4 && status == 3 ) || (admissionBaseWithBLOBs.getAdmissionStatus().intValue()==3 && status == 2 )){

            }
            else if(admissionBaseWithBLOBs.getAdmissionStatus().intValue() >= status){
                return ResultBean.getErrorResult("已完成");
            }
            else if(admissionBaseWithBLOBs.getAdmissionStatus().intValue() < status-1){
                return ResultBean.getErrorResult("请先完成上一步~");
            }
        }
        admissionBaseService.updateAdmissionBaseStatus(id, status);
        return ResultBean.getSuccessResult();
    }


    @GetMapping("getAdmissionBase/{id}")
    public ResultBean getAdmissionBase(@PathVariable("id") Long id){
        AdmissionBaseWithBLOBs admissionBaseWithBLOBs = admissionBaseService.selectByPrimaryKey(id);
        return ResultBean.getSuccessResult(admissionBaseWithBLOBs);
    }
}
