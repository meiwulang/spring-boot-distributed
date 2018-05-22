package com.jdy.b2b.web.controll.scenicspot;

import com.jdy.b2b.web.pojo.hotel.HotelAreaQueryVo;
import com.jdy.b2b.web.pojo.log.MyLog;
import com.jdy.b2b.web.pojo.scenicspot.*;
import com.jdy.b2b.web.service.ScenicService;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.Constants;
import com.jdy.b2b.web.util.PinyinUtil;
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
import java.util.List;
import java.util.Map;

/**
 * Created by yangcheng on 2017/7/12.
 */
@Api(value = "scenic_spot", description = "操作景点")
@Controller
@RequestMapping("scenic_spot")
public class ScenicSpotController extends BaseController{
    @Autowired
    private ScenicService scenicService;

    /**
     * 根据id查询景点
     * @param id
     * @return
     */
    @ApiOperation(value = "根据id查询",notes = "")
    @ResponseBody
    @RequestMapping(value="getById/{id}",method = RequestMethod.GET)
    public ResultBean<ScenicSpotQueryDO> queryForScenicById(@PathVariable("id") @NotNull @ApiParam(value = "标签分组id",required = true,name = "id")Long id){
        return scenicService.queryForScenicById(id);
    }

    /**
     * 根据名称查询景点
     * @param name
     * @return
     */
    @ApiOperation(value = "根据名称查询",notes = "")
    @ResponseBody
    @RequestMapping(value="get/{name}",method = RequestMethod.GET)
    public ResultBean<ScenicSpot> queryForScenicById(@PathVariable("name") @NotNull @ApiParam(value = "景点名称",required = true,name = "name") String name){
        return scenicService.queryForScenicByName(name);
    }
    /**
     * 查询景点列表 快速搜索(名称 拼音码)
     * @param vo
     * @return
     */
    @ApiOperation(value = "查询景点列表/快速搜索",notes = "模糊搜索(名称 拼音码)")
    @ResponseBody
    @RequestMapping(value="list",method = RequestMethod.POST)
    public ResultBean queryScenicListForPage(@RequestBody @Validated ScenicSpotQueryVo vo){
        return scenicService.queryScenicListForPage(vo);
    }
    /**
     * 新增 (注意坐标及尺寸的参数非空校验是否要去掉)
     * @param vo
     * @return
     */
    @MyLog
    @ApiOperation(value = "新增",notes = "")
    @ResponseBody
    @RequestMapping(value="save",method = RequestMethod.POST)
    public ResultBean<Long> saveScenic(@RequestBody @Validated({Save.class}) ScenicSpotSaveOrUpdateVo vo){
        /*ResultBean<ScenicSpot> scenicSpotResultBean = scenicService.queryForScenicByName(vo.getsName());
        ScenicSpot spot = scenicSpotResultBean.getParsedEnitity(ScenicSpot.class);
        if(spot!=null){
            return new ResultBean("-1","该景点名称已存在");
        }*/
        String pinyin = PinyinUtil.getFirstSpell(vo.getsName());
        vo.setsPym(pinyin.length()>10?pinyin.substring(0,10):pinyin);
        ResultBean<Long> result = scenicService.saveOrUpdateScenic(vo);
        return result;
    }
    /**
     * 编辑
     * @param vo
     * @return
     */
    @MyLog
    @ApiOperation(value = "编辑",notes = "")
    @ResponseBody
    @RequestMapping(value="update",method = RequestMethod.POST)
    public ResultBean<Long> updateScenic(@RequestBody @Validated({Save.class, Update.class}) ScenicSpotSaveOrUpdateVo vo){
        /*ResultBean<ScenicSpot> scenicSpotResultBean = scenicService.queryForScenicByName(vo.getsName());
        ScenicSpot spot = scenicSpotResultBean.getParsedEnitity(ScenicSpot.class);
        if(spot!=null){
            return new ResultBean("-1","该景点名称已存在");
        }*/

        String pinyin = PinyinUtil.getFirstSpell(vo.getsName());
        vo.setsPym(pinyin.length()>10?pinyin.substring(0,10):pinyin);
        return scenicService.saveOrUpdateScenic(vo);
    }

    /**
     * 伪删除
     * @param id
     * @return
     */
    @MyLog
    @ApiOperation(value = "伪删除",notes = "")
    @ResponseBody
    @RequestMapping(value="delete/{id}",method = RequestMethod.GET)
    public ResultBean<Long> deleteScenic(@NotNull @PathVariable("id") Long id){
        ScenicSpotSaveOrUpdateVo vo = new ScenicSpotSaveOrUpdateVo();
        vo.setId(id);
        vo.setsStatus(Constants.EFFECT_NO);
        if (getUser() != null) {
            vo.setUpdateUser(getUser().getUserId());
        }else{
            return new ResultBean("-1","未获取到用户信息");
        }
        return scenicService.saveOrUpdateScenic(vo);
    }

    @ApiOperation(value = "相册管理处查景点条件列表")
    @ResponseBody
    @RequestMapping(value="scenicList",method = RequestMethod.POST)
    public ResultBean queryScenicListByArea(@RequestBody @Validated ScenicAreaQueryVo vo){
        return scenicService.queryScenicListByArea(vo.getPcType(),vo.getPcompanyId());
    }
}
