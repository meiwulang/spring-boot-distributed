package com.jdy.b2b.api.service.impl;

import com.jdy.b2b.api.common.BaseService;
import com.jdy.b2b.api.common.Constants;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.dao.hotel.HotelMapper;
import com.jdy.b2b.api.dao.scenicspot.ScenicSpotMapper;
import com.jdy.b2b.api.model.scenicspot.HotelOrScenicAreaDO;
import com.jdy.b2b.api.model.scenicspot.HotelOrScenicDO;
import com.jdy.b2b.api.model.scenicspot.ScenicSpot;
import com.jdy.b2b.api.model.scenicspot.ScenicSpotQueryDO;
import com.jdy.b2b.api.service.AttachService;
import com.jdy.b2b.api.service.ScenicSpotService;
import com.jdy.b2b.api.vo.pic.AlbumVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * Created by yangcheng on 2017/7/7.
 */
@Service
public class ScenicSpotServiceImpl extends BaseService implements ScenicSpotService {
    @Autowired
    private ScenicSpotMapper scenicSpotMapper;
    @Autowired
    private AttachService attachService;
//    @Value("${attach.cover.scenic.url}")
//    private String defaultScenicAlbumCover;

    @Override
    public List<ScenicSpot> queryScenicListForPage(ScenicSpot scenic) {
        return scenicSpotMapper.queryScenicListForPage(scenic);
    }

    @Override
    public int updateScenic(ScenicSpot scenic) {
        return scenicSpotMapper.updateByPrimaryKeySelective(scenic);
    }

    @Override
    @Transactional
    public ResultBean<Long> saveScenic(ScenicSpot scenic) {
        int result = scenicSpotMapper.insert(scenic);


        /*新增景点的同时创建相册*/
        Long id = scenic.getId();
        AlbumVO vo = new AlbumVO();
        vo.setaType(Constants.ALBUM_TYPE_SCENIC);
        vo.setaPid(id);
        vo.setaName(scenic.getsName());
        //默认封面
//        vo.setpOssName(defaultScenicAlbumCover);
        //景点city
        vo.setaCity(scenic.getsCity());
        vo.setCompanyId(scenic.getCompanyId());

        vo.setpSize(1L);
        ResultBean<Map<String, Object>> mapResultBean = attachService.saveAlbum(vo);
        Long albumId = (Long)mapResultBean.getBody().get(Constants.Fields.ID);

        if(result>0 && albumId!=null){
            return ResultBean.getSuccessResult(albumId);

        }else{
            throw new RuntimeException("保存景点失败");
        }
    }

    @Override
    public ScenicSpotQueryDO queryForScenicById(Long id) {
        return  scenicSpotMapper.selectByPrimaryKey(id);
    }

    @Override
    public List<HotelOrScenicAreaDO> queryForCityListByOrgId(Integer cType, Long orgId) {
        return scenicSpotMapper.queryForCityListByOrgId(cType,orgId);
    }

    @Override
    public ScenicSpot queryForScenicByName(String name) {
        return scenicSpotMapper.selectByName(name);
    }

    @Override
    public List<ScenicSpot> queryScenicList(ScenicSpot scenic,Integer cType) {
        return scenicSpotMapper.queryScenicList(scenic,cType);
    }
}
