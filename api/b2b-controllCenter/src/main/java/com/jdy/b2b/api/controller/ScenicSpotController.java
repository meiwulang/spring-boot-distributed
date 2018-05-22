package com.jdy.b2b.api.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jdy.b2b.api.common.*;
import com.jdy.b2b.api.model.hotel.Hotel;
import com.jdy.b2b.api.model.scenicspot.HotelOrScenicAreaDO;
import com.jdy.b2b.api.model.scenicspot.HotelOrScenicDO;
import com.jdy.b2b.api.model.scenicspot.ScenicSpot;
import com.jdy.b2b.api.model.scenicspot.ScenicSpotQueryDO;
import com.jdy.b2b.api.service.ScenicSpotService;
import com.jdy.b2b.api.vo.hotel.HotelOrScenicDTO;
import com.jdy.b2b.api.vo.scenicspot.ScenicQueryVo;
import com.jdy.b2b.api.vo.scenicspot.ScenicSaveOrUpdateVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * Created by yangcheng on 2017/7/7.
 * ok
 */
@RestController
@RequestMapping("scenic_spot")
public class ScenicSpotController extends BaseController{
    @Autowired
    private ScenicSpotService scenicService;

    /**
     * 根据id查询景点
     * new
     * @param id
     * @return
     */
    @RequestMapping(value="get/{id}",method = RequestMethod.GET)
    public ResultBean<ScenicSpotQueryDO> queryForScenicById(@PathVariable  Long id){
        return ResultBean.getSuccessResult(scenicService.queryForScenicById(id));
    }

    /**
     * 根据名称查询景点
     * new
     * @param name
     * @return
     */
    @RequestMapping(value="name/{name}",method = RequestMethod.GET)
    public ResultBean<ScenicSpot> queryForScenicByName(@PathVariable("name")  String name){
        return ResultBean.getSuccessResult(scenicService.queryForScenicByName(name));
    }

    /**
     * 查询景点列表 快速搜索(名称 拼音码)
     * new
     * @param vo
     * @return
     */
    @RequestMapping(value="list",method = RequestMethod.POST)
    public ResultBean queryScenicListForPage(@RequestBody ScenicQueryVo vo){
        if (vo.getCurrPage() != null && vo.getPageSize() != null) {
            PageHelper.startPage(vo.getCurrPage(), vo.getPageSize());
        }
        ScenicSpot scenic = JSONUtil.trans(vo, ScenicSpot.class);
        scenic.setsStatus(Constants.SCENIC_EFFECT_YES);
        List<ScenicSpot> list = scenicService.queryScenicListForPage(scenic);
        return ResultBean.getSuccessResult(new PageInfo(list));
    }

    /**
     * 新增 编辑 伪删除
     * new
     * @param vo
     * @return
     */
    @RequestMapping(value="saveOrUpdate",method=RequestMethod.POST)
    public ResultBean<Long> saveOrUpdateHotel(@RequestBody ScenicSaveOrUpdateVo vo){
        ScenicSpot scenic = JSONUtil.trans(vo, ScenicSpot.class);
        if(scenic!=null && scenic.getId()!=null){
            //执行update
            scenic.setUpdateTime(new Date());

            if(scenic.getUpdateUser()==null){
                scenic.setUpdateUser(vo.getPuserId());
            }

            Integer result = scenicService.updateScenic(scenic);
            if(result>0){
                return ResultBean.getSuccessResult((long)result);
            }else{
                return new ResultBean("-1","更新景点失败");
            }
        }else{
            //执行新增
            scenic.setCreateTime(new Date());
            scenic.setCreateUser(vo.getPuserId());
            scenic.setsStatus(Constants.SCENIC_EFFECT_YES);
            ResultBean<Long> successResult = scenicService.saveScenic(scenic);
            successResult.setId(scenic.getId());
            return successResult;
        }
    }

    /**
     * 传递公司类型 和 公司id ,如果是管理公司,查询所有数据
     * @param cType
     * @param companyId
     * @return
     */
    @RequestMapping(value="scenicList/{cType}/{companyId}",method=RequestMethod.GET)
    public ResultBean queryScenicListByArea(@PathVariable("cType") Integer cType, @PathVariable("companyId") Long companyId){
        ScenicSpot scenic = new ScenicSpot();
        scenic.setCompanyId(companyId);
        scenic.setsStatus(Constants.SCENIC_EFFECT_YES);
        List<ScenicSpot> allScenicList = scenicService.queryScenicList(scenic,cType);

        List list = new ArrayList();
        //获取数据 去重
        Set<String> provinceSet = new HashSet<String>();
        Set<String> citySet = new HashSet<String>();
        Set<String> hotelSet = new HashSet<String>();

        allScenicList.stream().forEach(s->{
            //省份去重
            provinceSet.add(s.getsProvince());
            //城市去重,作为map的key,value是所属省份
            citySet.add(s.getsCity()+"_"+s.getsProvince());
            //以城市和景点为key去重,去除同一城市中相同的景点名
            hotelSet.add(s.getsCity()+"_"+s.getsName());
        });

        //组装数据
        provinceSet.stream().forEach(p->{
            HotelOrScenicDTO province = new HotelOrScenicDTO();
            province.setName(p);
            province.setParent("0");
            //设置城市集合
            citySet.stream().forEach(c->{
                if(p.equals(c.split("_")[1])){
                    HotelOrScenicDTO cityChild = new HotelOrScenicDTO();
                    cityChild.setParent(p);
                    cityChild.setName(c.split("_")[0]);
                    //设置景点集合
                    hotelSet.stream().forEach(h->{
                        if(c.split("_")[0].equals(h.split("_")[0])){
                            HotelOrScenicDTO hotelChild = new HotelOrScenicDTO();
                            hotelChild.setParent(c.split("_")[0]);
                            hotelChild.setName(h.split("_")[1   ]);
                            hotelChild.setChildren(null);
                            cityChild.getChildren().add(hotelChild);
                        }
                    });
                    province.getChildren().add(cityChild);
                }
            });
            list.add(province);
        });


        return ResultBean.getSuccessResult(list);
    }
}
