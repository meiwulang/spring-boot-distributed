package com.jdy.b2b.api.controller;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.jdy.b2b.api.common.BaseController;
import com.jdy.b2b.api.common.Constants;
import com.jdy.b2b.api.common.JSONUtil;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.dao.pic.AttachMapper;
import com.jdy.b2b.api.model.advertisement.Advertisement;
import com.jdy.b2b.api.model.advertisement.AdvertisementDO;
import com.jdy.b2b.api.model.advertisement.AdvertisementListDO;
import com.jdy.b2b.api.model.advertisement.IndexAdverDO;
import com.jdy.b2b.api.model.pic.Attach;
import com.jdy.b2b.api.service.AdvertisementService;
import com.jdy.b2b.api.vo.advertisement.AdvertisementQueryVo;
import com.jdy.b2b.api.vo.advertisement.AdvertisementSaveOrUpdateVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created by yangcheng on 2017/7/5.
 */
@RestController
@RequestMapping(value = "advertisement")
public class AdvertisementController extends BaseController {
    @Autowired
    private AdvertisementService advertisementService;
    @Autowired
    private AttachMapper attachMapper;
    /**
     * 根据id查询
     * new
     * @param id
     * @return
     */
    @RequestMapping(value = "get/{id}", method = RequestMethod.GET)
    public ResultBean<AdvertisementDO> queryForAdverById(@PathVariable Long id) {
        return ResultBean.getSuccessResult(advertisementService.queryForAdverById(id));
    }

    /**
     * 条件查询广告列表  搜索
     * new
     * @param vo
     * @return
     */
    @RequestMapping(value = "list", method = RequestMethod.POST)
    public ResultBean queryUserListForPage(@RequestBody AdvertisementQueryVo vo) {
        PageHelper.startPage(vo.getCurrPage(), vo.getPageSize());

        Advertisement adver = JSONUtil.trans(vo, Advertisement.class);
        //如果是总公司,查询所有数据
        if(adver.getCompanyId().equals(Long.valueOf(0))){
            adver.setCompanyId(null);
        }
        adver.setaStatus(Constants.ADVER_EFFECT_YES);
        List<AdvertisementListDO> adverList = advertisementService.queryAdverListForPage(adver);
        return ResultBean.getSuccessResult(new PageInfo(adverList));
    }

    /**
     * 新增 编辑 伪删除
     * new
     * @param vo
     * @return
     */
    @Transactional
    @RequestMapping(value = "saveOrUpdate", method = RequestMethod.POST)
    public ResultBean<Long> saveOrUpdateAdver(@RequestBody AdvertisementSaveOrUpdateVo vo) {
        Advertisement adver = JSONUtil.trans(vo, Advertisement.class);

        Long userId = vo.getPuserId();
        if (adver != null && adver.getId() != null) {
            //执行修改
            adver.setUpdateTime(new Date());
            adver.setUpdateUser(vo.getPuserId());

            int result = advertisementService.updateAdver(adver,userId);

            //修改之前的附件ossname
            Attach attach = new Attach();
            attach.setId(vo.getAttachId());
            attach.setpOssName(vo.getAttachUrl());
            int attachResult = attachMapper.updateByPrimaryKeySelective(attach);

            if (result > 0 && attachResult>0) {
                return ResultBean.getSuccessResult((long) result);
            } else {
                return new ResultBean("-1", "更新广告失败");
            }
        } else {
            //执行新增
            adver.setCreateTime(new Date());
            adver.setCreateUser(vo.getPuserId());
            adver.setaStatus(Constants.ADVER_EFFECT_YES);
            long result = advertisementService.saveAdver(adver,userId);
            //新增广告图片X
            Attach attach = new Attach();
            attach.setpType(Integer.valueOf(4));
            attach.setpPid(adver.getId());
            attach.setpAlbumId(0L);
            attach.setpRealName("");
            attach.setpOssName(vo.getAttachUrl());
            attach.setpSize(1L);
            attach.setpPicType("");
            attach.setCreateUser(vo.getPuserId());
            attach.setCreateTime(new Date());
            int attachResult = attachMapper.insert(attach);

            if (result>0 && attachResult>0) {
                ResultBean<Long> successResult = ResultBean.getSuccessResult(adver.getId());
                successResult.setId(adver.getId());
                return successResult;
            } else {
                return new ResultBean("-1", "新增广告失败");
            }
        }
    }

    /**
     * 更新单表
     * @param vo
     * @return
     */
    @RequestMapping(value = "updateAdverOnly", method = RequestMethod.POST)
    public ResultBean<Long> updateAdverOnly(@RequestBody AdvertisementSaveOrUpdateVo vo){
        Advertisement advertisement = JSONUtil.trans(vo, Advertisement.class);
        return ResultBean.getSuccessResult((long)advertisementService.updateAdverOnly(advertisement));
    }

    /**
     * 前台接口  不分页
     */
    /*@GetMapping("indexAdverList")
    public ResultBean indexAdverList(String city_code){
        Map<String,List<IndexAdverDO>> map= advertisementService.indexAdverList(city_code);
        return ResultBean.getIndexSuccessResult(map);
    }*/

    /**
     * 手机接口  不分页
     */
    @GetMapping("mobileAdverList")
    public ResultBean mobileAdverList(@RequestParam("companyId") Long companyId){
        List<IndexAdverDO> list = advertisementService.mobileAdverList(companyId);
        return ResultBean.getIndexSuccessResult(list);
    }
}
