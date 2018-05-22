package com.jdy.b2b.api.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jdy.b2b.api.common.*;
import com.jdy.b2b.api.model.label.Label;
import com.jdy.b2b.api.model.label.LabelDTO;
import com.jdy.b2b.api.service.LabelService;
import com.jdy.b2b.api.vo.label.LabelQueryVo;
import com.jdy.b2b.api.vo.label.LabelSaveOrUpdateVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

/**
 * Created by yangcheng on 2017/7/6.
 */
@RestController
@RequestMapping("label")
public class LabelController extends BaseController{
    @Autowired
    private LabelService labelService;

    /**
     * 根据id查询Label
     * new
     * @param id
     * @return
     */
    @RequestMapping(value="get/{id}",method = RequestMethod.GET)
    public ResultBean<Label> queryForLabelById(@PathVariable Long id){
        return ResultBean.getSuccessResult(labelService.queryForLabelById(id));
    }


    /**
     * 查询标签列表 根据l_parent l_org_id del 查询
     * new
     * @param vo
     * @return
     */
    @RequestMapping(value="list",method= RequestMethod.POST)
    public ResultBean getLabelListForPage(@RequestBody LabelQueryVo vo){
        if (vo.getCurrPage() != null && vo.getPageSize() != null) {
            PageHelper.startPage(vo.getCurrPage(), vo.getPageSize());
        }
        Label label = JSONUtil.trans(vo, Label.class);
        label.setlStatus(Constants.LABEL_EFFECT_YES);
        List<LabelDTO> list = labelService.getLabelListForPage(label);

        return ResultBean.getSuccessResult(new PageInfo(list));
    }

    /**
     * 新增/编辑/伪删除  分组/标签
     * new
     * @param vo
     * @return
     */
    @RequestMapping(value="saveOrUpdate",method=RequestMethod.POST)
    public ResultBean<Long> saveOrUpdateLabel(@RequestBody LabelSaveOrUpdateVo vo){
        Label label = JSONUtil.trans(vo, Label.class);
        if(label!=null && label.getId()!=null){
            //执行update
            label.setUpdateTime(new Date());
            if(vo.getUpdateUser()==null){
                label.setUpdateUser(vo.getPuserId());
            }
            Integer result = labelService.updateLabel(label);
            if(result>0){
                return ResultBean.getSuccessResult((long)result);
            }else{
                return new ResultBean<>("-1","更新标签失败");
            }
        }else{
            //执行新增  需要传递分类(为了保证数据库数据完整,优化可以去掉)
            label.setCreateUser(vo.getPuserId());
            label.setCreateTime(new Date());
            label.setlStatus(Constants.LABEL_EFFECT_YES);
            if(labelService.saveLabel(label)>0){
                ResultBean<Long> successResult = ResultBean.getSuccessResult(label.getId());
                successResult.setId(label.getId());
                return successResult;

            }else{
                return new ResultBean<>("-1","新增标签失败");
            }


        }
    }

}

