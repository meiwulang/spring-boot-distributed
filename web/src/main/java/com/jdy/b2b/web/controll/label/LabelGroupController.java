package com.jdy.b2b.web.controll.label;

import com.jdy.b2b.web.pojo.label.LabelGroup;
import com.jdy.b2b.web.pojo.label.LabelGroupQueryVo;
import com.jdy.b2b.web.pojo.label.LabelGroupSaveOrUpdateVo;
import com.jdy.b2b.web.pojo.label.LabelSaveOrUpdateVo;
import com.jdy.b2b.web.pojo.log.MyLog;
import com.jdy.b2b.web.service.LabelGroupService;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.Constants;
import com.jdy.b2b.web.util.ResultBean;
import com.jdy.b2b.web.util.annotations.Save;
import com.jdy.b2b.web.util.annotations.Update;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.annotations.ApiIgnore;

import javax.validation.constraints.NotNull;

/**
 * Created by yangcheng on 2017/7/12.
 */
@Api(value = "label_group", description = "操作标签分组")
@Controller
@RequestMapping("label_group")
public class LabelGroupController extends BaseController{
    @Autowired
    private LabelGroupService labelGroupService;

    /**
     * 根据id查询label
     * @param id
     * @return
     */
    @ApiIgnore
    @ResponseBody
    @RequestMapping(value="get/{id}",method = RequestMethod.GET)
    public ResultBean<LabelGroup> queryForLabelById(@PathVariable @NotNull Long id){
        return labelGroupService.queryForLabelGroupById(id);
    }

    /**
     * 分页查询列表 根据l_parent l_org_id del 查询
     * @param vo
     * @return
     */
    @ApiOperation(value = "分页查询列表",notes = "根据l_parent l_org_id del 查询")
    @ResponseBody
    @RequestMapping(value="list",method = RequestMethod.POST)
    public ResultBean<LabelGroup> queryLabelGroupList(@RequestBody @Validated LabelGroupQueryVo vo){
        return labelGroupService.queryForLabelGroupList(vo);
    }

    /**
     * 新增分组  如果需要,传递category parent orgid
     * @param vo
     * @return
     */
    @MyLog
    @ApiOperation(value = "新增分组",notes = "如果需要,传递category parent orgid")
    @ResponseBody
    @RequestMapping(value="save",method = RequestMethod.POST)
    public ResultBean<Long> saveLabelGroup(@RequestBody @Validated({Save.class}) LabelGroupSaveOrUpdateVo vo){

        return labelGroupService.saveOrUpdateLabelGroup(vo);
    }

    /**
     * 编辑  分组
     * @param vo
     * @return
     */
    @MyLog
    @ApiOperation(value = "编辑/伪删除分组",notes = "")
    @ResponseBody
    @RequestMapping(value="update",method = RequestMethod.POST)
    public ResultBean<Long> updateLabelGroup(@RequestBody @Validated({Save.class, Update.class}) LabelGroupSaveOrUpdateVo vo){
        return labelGroupService.saveOrUpdateLabelGroup(vo);
    }

    /**
     * 伪删除  分组
     * @param id
     * @return
     */
    @MyLog
    @ApiOperation(value = "伪删除分组",notes = "")
    @ResponseBody
    @RequestMapping(value="delete/{id}",method = RequestMethod.GET)
    public ResultBean<Long> deleteLabelGroup(@NotNull @PathVariable("id")@ApiParam(value = "标签分组id",required = true,name = "id") Long id){
        LabelGroupSaveOrUpdateVo vo = new LabelGroupSaveOrUpdateVo();
        vo.setId(id);
        vo.setLgStatus(Constants.EFFECT_NO);
        if (getUser() != null) {
            vo.setUpdateUser(getUser().getUserId());
        }else{
            return new ResultBean("-1","未获取到用户信息");
        }
        return labelGroupService.saveOrUpdateLabelGroup(vo);
    }


}
