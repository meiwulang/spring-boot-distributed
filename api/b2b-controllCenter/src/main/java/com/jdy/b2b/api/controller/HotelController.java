package com.jdy.b2b.api.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jdy.b2b.api.common.*;
import com.jdy.b2b.api.model.hotel.Hotel;
import com.jdy.b2b.api.model.hotel.HotelQueryDO;
import com.jdy.b2b.api.model.scenicspot.HotelOrScenicAreaDO;
import com.jdy.b2b.api.model.scenicspot.HotelOrScenicDO;
import com.jdy.b2b.api.model.scenicspot.ScenicSpot;
import com.jdy.b2b.api.service.HotelService;
import com.jdy.b2b.api.vo.hotel.HotelOrScenicDTO;
import com.jdy.b2b.api.vo.hotel.HotelQueryVo;
import com.jdy.b2b.api.vo.hotel.HotelSaveOrUpdateVo;
import com.jdy.b2b.api.vo.pic.AlbumVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * Created by yangcheng on 2017/7/7.
 * ok
 */
@RestController
@RequestMapping("hotel")
public class HotelController extends BaseController{
    @Autowired
    private HotelService hotelService;

    /**
     * 根据id查询
     * new
     * @param id
     * @return
     */
    @RequestMapping(value="get/{id}",method = RequestMethod.GET)
    public ResultBean<HotelQueryDO> queryForHotelById(@PathVariable Long id){
        return ResultBean.getSuccessResult(hotelService.queryForHotelById(id));
    }

    /**
     * 根据名称查询
     * new
     * @param name
     * @return
     */
    @RequestMapping(value="name/{name}",method = RequestMethod.GET)
    public ResultBean<Hotel> queryForHotelByName(@PathVariable("name")  String name){
        return ResultBean.getSuccessResult(hotelService.queryForHotelByName(name));
    }

    /**
     * 查询列表 快速搜索 sql中模糊搜索name 拼音
     * new
     * @param vo
     * @return
     */
    @RequestMapping(value="list",method = RequestMethod.POST)
    public ResultBean queryHotelListForPage(@RequestBody HotelQueryVo vo){
        if (vo.getCurrPage() != null && vo.getPageSize() != null) {
            PageHelper.startPage(vo.getCurrPage(), vo.getPageSize());
        }
        Hotel hotel = JSONUtil.trans(vo, Hotel.class);
        //设置status
        hotel.sethStatus(Constants.HOTEL_EFFECT_YES);
        List<Hotel> list = hotelService.queryHotelListForPage(hotel);

        return ResultBean.getSuccessResult(new PageInfo(list));
    }

    /**
     * 新增 编辑 伪删除
     * new
     * @param vo
     * @return
     */
    @RequestMapping(value="saveOrUpdate",method=RequestMethod.POST)
    public ResultBean<Long> saveOrUpdateHotel(@RequestBody HotelSaveOrUpdateVo vo){
        Hotel hotel = JSONUtil.trans(vo, Hotel.class);
        if(hotel!=null && hotel.getId()!=null){
            //执行update
            hotel.setUpdateTime(new Date());
            if(hotel.getUpdateUser()==null){
                hotel.setUpdateUser(vo.getPuserId());
            }
            int result = hotelService.updateHotel(hotel);
            if(result>0){
                ResultBean<Long> successResult = ResultBean.getSuccessResult((long) result);
                /*successResult.setId(hotel.getId());*/
                return successResult;
            }else{
                return new ResultBean("-1","更新酒店失败");
            }
        }else{
            //执行新增
            hotel.setCreateTime(new Date());
            hotel.setCreateUser(vo.getPuserId());
            hotel.sethStatus(Constants.HOTEL_EFFECT_YES);
            ResultBean<Long> successResult = hotelService.saveHotel(hotel);
            successResult.setId(hotel.getId());
            return successResult;
        }
    }
    /**
     * 根据orgid查询 供应商有酒店的省份 城市
     * new
     * @return
     */
    /*@RequestMapping(value="cityList/{cType}/{companyId}",method=RequestMethod.GET)
    public ResultBean<Map> queryForCityListByOrgId(@PathVariable("cType") Integer cType, @PathVariable("companyId") Long companyId){

        Map<String,List<String>> map = new HashMap<String,List<String>>();

        Map<String,HotelOrScenicAreaDO> provinceMap = new HashMap<String,HotelOrScenicAreaDO>();
        Map<String,HotelOrScenicAreaDO> cityMap = new HashMap<String,HotelOrScenicAreaDO>();

        List<HotelOrScenicAreaDO> list = hotelService.queryForCityListByOrgId(cType, companyId);

        list.stream().forEach(area->{
            //area.getFlag().equals(Integer.valueOf(1)) ? provinceMap.put(area.getProvince(),area) : cityMap.put(area.getCity(),area);
            HotelOrScenicAreaDO hotelOrScenicAreaDO = area.getFlag().equals(Integer.valueOf(1)) ? provinceMap.put(area.getProvince(), area) : cityMap.put(area.getCity(), area);
        });

        provinceMap.keySet().stream().forEach(p->{
            List<String> cityList = new ArrayList<String>();
            cityMap.keySet().stream().forEach(c->{
                HotelOrScenicAreaDO d = cityMap.get(c);
                if(d !=null && cityMap.get(c).getProvince().equals(provinceMap.get(p).getProvince())){
                    cityList.add(cityMap.get(c).getCity());
                }
            });
            map.put(p,cityList);

        });

        return ResultBean.getSuccessResult(map);
    }*/

    /**
     * 传递公司类型 和 公司id ,如果是管理公司,查询所有数据
     * @param cType
     * @param companyId
     * @return
     */
    @RequestMapping(value="hotelList/{cType}/{companyId}",method=RequestMethod.GET)
    public ResultBean queryHotelListByArea(@PathVariable("cType") Integer cType, @PathVariable("companyId") Long companyId){
        Hotel hotel = new Hotel();
        hotel.setCompanyId(companyId);
        hotel.sethStatus(Constants.HOTEL_EFFECT_YES);
        List<Hotel> allHotelList = hotelService.queryHotelList(hotel,cType);

        List list = new ArrayList();
        //获取数据 去重
        Set<String> provinceSet = new HashSet<String>();
        Set<String> citySet = new HashSet<String>();
        Set<String> hotelSet = new HashSet<String>();

        allHotelList.stream().forEach(h->{
            //省份去重
            provinceSet.add(h.gethProvince());
            //城市去重,作为map的key,value是所属省份
            citySet.add(h.gethCity()+"_"+h.gethProvince());
            //以城市和酒店为key去重,去除同一城市中相同的酒店或景点名
            hotelSet.add(h.gethCity()+"_"+h.gethName());
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
                    //设置酒店集合
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
