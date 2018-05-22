package com.jdy.b2b.web.controll.advertisement;

import com.jdy.b2b.web.pojo.advertisement.Advertisement;
import com.jdy.b2b.web.pojo.advertisement.AdvertisementDO;
import com.jdy.b2b.web.pojo.advertisement.AdvertisementQueryVo;
import com.jdy.b2b.web.pojo.advertisement.AdvertisementSaveOrUpdateVo;
import com.jdy.b2b.web.pojo.log.MyLog;
import com.jdy.b2b.web.service.AdvertisementService;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.Constants;
import com.jdy.b2b.web.util.ResultBean;
import com.jdy.b2b.web.util.annotations.Delete;
import com.jdy.b2b.web.util.annotations.Save;
import com.jdy.b2b.web.util.annotations.Update;
import io.swagger.annotations.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;

/**
 * Created by yangcheng on 2017/7/5.
 */
@Api(value = "advertisement", description = "操作广告")
@RestController
@RequestMapping(value = "advertisement")
public class AdvertisementController extends BaseController {
    @Autowired
    private AdvertisementService advertisementService;

    /**
     * 根据id查询
     * @param id
     * @return
     */
    @MyLog
    @ApiOperation(value = "根据id查询", notes = "查询广告同时,关联adverarea表查询列表,一并返回,")
    @RequestMapping(value = "get/{id}", method = RequestMethod.GET)
    public ResultBean<AdvertisementDO> queryForAdverById(@PathVariable @NotNull @ApiParam(value = "广告id", required = true, name = "id") Integer id) {
        return advertisementService.queryForAdverById(id);
    }

    /**
     * 条件查询广告列表  搜索
     * @param vo
     * @return
     */
    @MyLog
    @ApiOperation(value = "条件查询广告列表/快速搜索", notes = "分页查询广告列表/快速搜索,默认查询未删除的广告,可传递城市限定查询区域范围.")
    @RequestMapping(value = "list", method = RequestMethod.POST)
    public ResultBean queryUserList(@RequestBody @Validated AdvertisementQueryVo vo) {
        vo.setCompanyId(vo.getPcompanyId());
        logger.error(vo.getPuAccount()+"____________________________");
        return advertisementService.queryAdverListForPage(vo);
    }

    /**
     * 新增
     *
     * @param vo
     * @return
     */
    @MyLog
    @ApiOperation(value = "新增广告", notes = "新增广告的同时,保存投放城市关系集合到adverarea")
    @RequestMapping(value = "save", method = RequestMethod.POST)
    public ResultBean<Long> saveAdver(@RequestBody @Validated({Save.class}) AdvertisementSaveOrUpdateVo vo) {
        return advertisementService.saveOrUpdateAdvertisement(vo);
    }

    /**
     * 编辑
     *
     * @param vo
     * @return
     */
    @MyLog
    @ApiOperation(value = "编辑广告", notes = "编辑广告,同时编辑投放城市,投放城市")
    @RequestMapping(value = "update", method = RequestMethod.POST)
    public ResultBean<Long> updateAdver(@RequestBody @Validated({Save.class, Update.class}) AdvertisementSaveOrUpdateVo vo) {
        return advertisementService.saveOrUpdateAdvertisement(vo);
    }

    /**
     * 伪删除
     *
     * @param id
     * @return
     */
    @MyLog
    @ApiOperation(value = "伪删除广告", notes = "删除广告和投放城市表的信息,前者伪删除,后者真删除")
    @RequestMapping(value = "delete/{id}", method = RequestMethod.GET)
    public ResultBean<Long> deleteAdver(@NotNull @PathVariable("id") @ApiParam(value = "广告id", required = true, name = "id") Long id) {
        AdvertisementSaveOrUpdateVo vo = new AdvertisementSaveOrUpdateVo();
        vo.setaStatus(Constants.EFFECT_NO);
        vo.setId(id);
        if (getUser() != null) {
            vo.setUpdateUser(getUser().getUserId());
        }else{
            return new ResultBean("-1","未获取到用户信息");
        }
        return advertisementService.updateAdverOnly(vo);
    }






}
