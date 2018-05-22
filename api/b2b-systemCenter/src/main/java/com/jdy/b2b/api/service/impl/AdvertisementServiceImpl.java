package com.jdy.b2b.api.service.impl;

import com.jdy.b2b.api.common.BaseService;

import com.jdy.b2b.api.common.JSONUtil;
import com.jdy.b2b.api.dao.advertisement.AdverAreaMapper;
import com.jdy.b2b.api.dao.advertisement.AdvertisementMapper;
import com.jdy.b2b.api.dao.pic.AttachMapper;
import com.jdy.b2b.api.model.advertisement.*;
import com.jdy.b2b.api.model.pic.Attach;
import com.jdy.b2b.api.service.AdvertisementService;
import com.jdy.b2b.api.vo.advertisement.AdverAreaSaveOrUpdateVo;
import com.jdy.b2b.api.vo.advertisement.AdvertisementSaveOrUpdateVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by ASUS on 2017/7/3.
 */
@Service
public class AdvertisementServiceImpl extends BaseService implements AdvertisementService {
    @Autowired
    private AdvertisementMapper advertisementMapper;
    @Autowired
    private AdverAreaMapper adverAreaMapper;


    @Override
    public List<AdvertisementListDO> queryAdverListForPage(Advertisement adver) {
        return advertisementMapper.queryAdverListForPage(adver);
    }
    @Transactional
    @Override
    public int updateAdver(Advertisement adver,Long userId) {
        int result = advertisementMapper.updateByPrimaryKeySelective(adver);

        //删除之前的投放城市集合
        adverAreaMapper.deleteByAdverId(adver.getId());

       /* //如果是修改,保存投放城市表;如果是删除,则list集合为空,不执行保存
        List<AdverArea> areaList = adver.getAreaList();
        if(areaList.size()>0){
            for(AdverArea area:areaList){
                area.setAaAdverId(adver.getId());
                area.setUpdateTime(new Date());
                area.setUpdateUser(userId);
            }
            //批量保存adver_area表
            adverAreaMapper.saveAdverAreaBash(areaList);
        }*/
        return result;
    }
    @Transactional
    @Override
    public long saveAdver(Advertisement adver,Long userId) {
        long result = advertisementMapper.insert(adver);

        /*//保存投放城市表
        List<AdverArea> areaList = adver.getAreaList();
        for(AdverArea area:areaList){
            area.setAaAdverId(adver.getId());
            area.setCreateTime(new Date());
            area.setCreateUser(userId);
        }
        //批量保存adver_area表
            adverAreaMapper.saveAdverAreaBash(areaList);
        */

        return result;
    }

    @Override
    public AdvertisementDO queryForAdverById(Long id) {

        AdvertisementDO advertisement = advertisementMapper.selectByPrimaryKey(id);

        return advertisement;
    }

    @Override
    public int updateAdverOnly(Advertisement advertisement) {
        return advertisementMapper.updateByPrimaryKeySelective(advertisement);
    }

    /*@Override
    public Map<String,List<IndexAdverDO>> indexAdverList(String city_code) {
        List<IndexAdverDO> list = advertisementMapper.indexAdverList(city_code);
        Set<String> adPlaces = new HashSet<String>();
        Map<String,List<IndexAdverDO>> map = new HashMap();

        SimpleDateFormat format = new SimpleDateFormat("yyyyMMdd");
        //获取广告位置名称
        list.stream().forEach(a->{
            adPlaces.add(a.getAd_place());
            StringBuilder sb = new StringBuilder();
            a.getCitys().stream().forEach(c->{
                sb.append(c).append(",");
            });
            if(sb.toString().endsWith(",")){
                String areaStr = sb.toString().substring(0, sb.toString().length()-1);
                a.setAd_sarea(areaStr);
            }else{
                a.setAd_sarea(sb.toString());
            }
            a.setCitys(null);
            //将毫秒值转为固定格式
            a.setAd_stime(Integer.parseInt(format.format(a.getBeginDate())));
            a.setAd_etime(Integer.parseInt(format.format(a.getEndDate())));
            a.setBeginDate(null);
            a.setEndDate(null);
        });
        //将广告按位置分类放入map中
        adPlaces.stream().forEach(p->{
            List<IndexAdverDO> advers = new ArrayList<IndexAdverDO>();
            map.put(p,advers);
            list.stream().forEach(a->{
                if (a.getAd_place().equals(p)) {
                    advers.add(a);
                }
            });
        });
        return map;
    }*/

    @Override
    public List<IndexAdverDO> mobileAdverList(Long companyId) {
        List<IndexAdverDO> list = advertisementMapper.indexAdverList(companyId);
        SimpleDateFormat format = new SimpleDateFormat("yyyyMMdd");
        //获取广告位置名称
        list.stream().forEach(a->{
            StringBuilder sb = new StringBuilder();
            a.getCitys().stream().forEach(c->{
                sb.append(c).append(",");
            });
            if(sb.toString().endsWith(",")){
                String areaStr = sb.toString().substring(0, sb.toString().length()-1);
                a.setAd_sarea(areaStr);
            }else{
                a.setAd_sarea(sb.toString());
            }
            a.setCitys(null);
            //将毫秒值转为固定格式
            a.setAd_stime(Integer.parseInt(format.format(a.getBeginDate())));
            a.setAd_etime(Integer.parseInt(format.format(a.getEndDate())));
            a.setBeginDate(null);
            a.setEndDate(null);
        });

        return list;
    }


}
