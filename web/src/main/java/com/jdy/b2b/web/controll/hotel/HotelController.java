package com.jdy.b2b.web.controll.hotel;

import com.jdy.b2b.web.pojo.hotel.*;
import com.jdy.b2b.web.pojo.log.MyLog;
import com.jdy.b2b.web.pojo.scenicspot.HotelOrScenicAreaDO;
import com.jdy.b2b.web.pojo.scenicspot.HotelOrScenicDO;
import com.jdy.b2b.web.pojo.scenicspot.ScenicSpot;
import com.jdy.b2b.web.service.HotelService;
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
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;

/**
 * Created by yangcheng on 2017/7/12.
 */
@Api(value = "hotel", description = "操作酒店")
@RestController
@RequestMapping("hotel")
public class HotelController extends BaseController{
    @Autowired
    private HotelService hotelService;


    /**
     * 根据id查询酒店
     * @param id
     * @return
     */

    @ApiOperation(value = "根据id查询",notes = "")
    @RequestMapping(value="get/{id}",method = RequestMethod.GET)
    public ResultBean<HotelQueryDO> queryForHotelById(@PathVariable @NotNull @ApiParam(value = "酒店id",required = true,name = "id")Long id){
        return hotelService.queryForHotelById(id);
    }
    /**
     * 查询列表 快速搜索 sql中模糊搜索name 拼音
     * @param vo
     * @return
     */
    @ApiOperation(value = "查询列表/快速搜索",notes = "sql中模糊搜索name 拼音")
    @RequestMapping(value="list",method = RequestMethod.POST)
    public ResultBean queryHotelListForPage(@RequestBody @Validated HotelQueryVo vo){
        return hotelService.queryHotelListForPage(vo);
    }
    /**
     * 新增 前端传来国家
     * @param vo
     * @return
     */
    @MyLog
    @ApiOperation(value = "新增",notes = "前端传来国家")
    @RequestMapping(value="save",method = RequestMethod.POST)
    public ResultBean<Long> saveHotel(@RequestBody @Validated({Save.class}) HotelSaveOrUpdateVo vo){
        /*ResultBean<Hotel> hotelResultBean = hotelService.queryForHotelByName(vo.gethName());
        Hotel hotel = hotelResultBean.getParsedEnitity(Hotel.class);
        if(hotel!=null){
            return new ResultBean("-1","该酒店名称已存在");
        }*/

        String pinyin = PinyinUtil.getFirstSpell(vo.gethName());
        vo.sethPym(pinyin.length()>10?pinyin.substring(0,10):pinyin);
        return hotelService.saveOrUpdateHotel(vo);
    }
    /**
     * 编辑
     * @param vo
     * @return
     */
    @MyLog
    @ApiOperation(value = "编辑",notes = "前端传来国家")
    @RequestMapping(value="update",method = RequestMethod.POST)
    public ResultBean<Long> updateHotel(@RequestBody @Validated({Save.class, Update.class}) HotelSaveOrUpdateVo vo){
        //修改拼音码
        String pinyin = PinyinUtil.getFirstSpell(vo.gethName());
        vo.sethPym(pinyin.length()>10?pinyin.substring(0,10):pinyin);
        return hotelService.saveOrUpdateHotel(vo);
    }


    /**
     * 伪删除
     * @param id
     * @return
     */
    @MyLog
    @ApiOperation(value = "伪删除酒店")
    @RequestMapping(value="delete/{id}",method = RequestMethod.GET)
    public ResultBean<Long> deleteHotel(@NotNull @PathVariable("id")@ApiParam(value = "酒店id",required = true,name = "id") Long id){
        HotelSaveOrUpdateVo vo = new HotelSaveOrUpdateVo();
        vo.setId(id);
        vo.sethStatus(Constants.EFFECT_NO);
        if (getUser() != null) {
            vo.setUpdateUser(getUser().getUserId());
        }else{
            return new ResultBean("-1","未获取到用户信息");
        }
        return hotelService.saveOrUpdateHotel(vo);
    }

    @ApiOperation(value = "相册管理处查酒店条件列表")
    @RequestMapping(value="hotelList",method = RequestMethod.POST)
    public ResultBean queryHotelListByArea(@RequestBody @Validated HotelAreaQueryVo vo){
        return hotelService.queryHotelListByArea(vo.getPcType(),vo.getPcompanyId());
    }

}
