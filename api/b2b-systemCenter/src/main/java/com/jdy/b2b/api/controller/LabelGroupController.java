package com.jdy.b2b.api.controller;

import com.jdy.b2b.api.common.Constants;
import com.jdy.b2b.api.common.JSONUtil;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.labelgroup.LabelGroup;
import com.jdy.b2b.api.service.LabelGroupService;
import com.jdy.b2b.api.vo.labelgroup.LabelGroupQueryVo;
import com.jdy.b2b.api.vo.labelgroup.LabelGroupSaveOrUpdateVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;

/**
 * Created by yangcheng on 2017/7/14.
 */
@RestController
@RequestMapping("label_group")
public class LabelGroupController {
    @Autowired
    private LabelGroupService labelGroupService;


    /**
     * 根据pid查列表
     * new
     */
    @RequestMapping(value="list",method = RequestMethod.POST)
    public ResultBean queryForLabelGroupList(@RequestBody LabelGroupQueryVo vo){

        LabelGroup labelGroup = JSONUtil.trans(vo,LabelGroup.class);
        labelGroup.setLgStatus(Constants.EFFECT_YES);
        return ResultBean.getSuccessResult(labelGroupService.queryForLabelGroupList(labelGroup));
    }


    /**
     * 新增 编辑 伪删除
     * new
     * @param vo
     * @return
     */
    @RequestMapping(value="saveOrUpdate",method = RequestMethod.POST)
    public ResultBean<Long> saveOrUpdateLabelGroup(@RequestBody LabelGroupSaveOrUpdateVo vo){
        LabelGroup labelGroup = JSONUtil.trans(vo,LabelGroup.class);
        if(labelGroup!=null && labelGroup.getId()!=null){
            //执行修改
            labelGroup.setUpdateTime(new Date());
            if(vo.getUpdateUser()==null){
                labelGroup.setUpdateUser(vo.getPuserId());
            }

            Integer result = labelGroupService.updateLabelGroup(labelGroup);
            if(result>0){
                return ResultBean.getSuccessResult((long)result);
            }else{
                return new ResultBean<>("-1","更新标签分组失败");
            }
        }else{
            //执行新增
            labelGroup.setCreateTime(new Date());
            labelGroup.setCreateUser(vo.getPuserId());
            labelGroup.setLgStatus(Constants.LABELGROUP_EFFECT_YES);

            if(labelGroupService.saveLabelGroup(labelGroup)>0){
                ResultBean<Long> successResult = ResultBean.getSuccessResult(labelGroup.getId());
                successResult.setId(labelGroup.getId());
                return successResult;
            }else{
                return new ResultBean<>("-1","新建标签分组失败");
            }

        }
    }


}
