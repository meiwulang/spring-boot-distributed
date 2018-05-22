package com.jdy.b2b.web.controll.label;

import com.jdy.b2b.web.pojo.label.Label;
import com.jdy.b2b.web.pojo.label.LabelDTO;
import com.jdy.b2b.web.pojo.label.LabelQueryVo;
import com.jdy.b2b.web.pojo.label.LabelSaveOrUpdateVo;
import com.jdy.b2b.web.pojo.log.MyLog;
import com.jdy.b2b.web.service.LabelService;
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

import javax.validation.constraints.NotNull;

/**
 * Created by yangcheng on 2017/7/12.
 */
@Api(value = "hotel", description = "操作标签")
@RestController
@RequestMapping("label")
public class LabelController extends BaseController{
    @Autowired
    private LabelService labelService;

    /**
     * 根据id查询label
     * @param id
     * @return
     */
    @ApiOperation(value = "根据id查询",notes = "")
    @RequestMapping(value="get/{id}",method = RequestMethod.GET)
    public ResultBean<Label> queryForLabelById(@PathVariable @NotNull @ApiParam(value = "标签id",required = true,name = "id") Long id){
        return labelService.queryForLabelById(id);
    }

    /**
     * 分页查询列表 根据pid companyId status 查询
     * @param vo
     * @return
     */
    @ApiOperation(value = "分页查询列表",notes = "根据pid companyId status 查询")
    @RequestMapping(value="list",method = RequestMethod.POST)
    public ResultBean queryLabelListForPage(@RequestBody @Validated LabelQueryVo vo){
        return labelService.queryLabelListForPage(vo);
    }

    /**
     * 新增 标签
     * @param vo
     * @return
     */
    @MyLog
    @ApiOperation(value = "新增",notes = "")
    @RequestMapping(value="save",method = RequestMethod.POST)
    public ResultBean<Long> saveLabel(@RequestBody @Validated({Save.class}) LabelSaveOrUpdateVo vo){

        return labelService.saveOrUpdateLabel(vo);
    }

    /**
     * 编辑 标签
     * @param vo
     * @return
     */
    @MyLog
    @ApiOperation(value = "编辑",notes = "")
    @RequestMapping(value="update",method = RequestMethod.POST)
    public ResultBean<Long> updateLabel(@RequestBody @Validated({Save.class, Update.class}) LabelSaveOrUpdateVo vo){
        return labelService.saveOrUpdateLabel(vo);
    }

    /**
     * 伪删除  标签
     * @param id
     * @return
     */
    @MyLog
    @ApiOperation(value = "伪删除")
    @RequestMapping(value="delete/{id}",method = RequestMethod.GET)
    public ResultBean<Long> deleteLabel(@NotNull @PathVariable("id") @ApiParam(value = "标签id",required = true,name = "id") Long id){
        LabelSaveOrUpdateVo vo = new LabelSaveOrUpdateVo();
        vo.setId(id);
        vo.setlStatus(Constants.EFFECT_NO);
        if (getUser() != null) {
            vo.setUpdateUser(getUser().getUserId());
        }else{
            return new ResultBean("-1","未获取到用户信息");
        }
        return labelService.saveOrUpdateLabel(vo);
    }


}
