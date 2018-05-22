package com.jdy.b2b.api.service.impl;

import com.github.pagehelper.PageHelper;
import com.jdy.b2b.api.dao.admission.AdmissionBaseMapper;
import com.jdy.b2b.api.dao.admission.AdmissionSalePriceMapper;
import com.jdy.b2b.api.model.admission.*;
import org.apache.commons.lang3.ArrayUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

/**
 * Created by dugq on 2018/4/17.
 */
@Service
@Transactional
public class AdmissionBaseServiceImpl implements com.jdy.b2b.api.service.AdmissionBaseService {
    @Autowired
    private AdmissionBaseMapper admissionBaseMapper;
    @Autowired
    private AdmissionSalePriceMapper admissionSalePriceMapper;


    @Override
    public int deleteByPrimaryKey(Long id) {
        return admissionBaseMapper.deleteByPrimaryKey(id);
    }

    @Override
    public int insert(AdmissionBaseWithBLOBs record) {
        return admissionBaseMapper.insert(record);
    }

    @Override
    public int insertSelective(AdmissionBaseWithBLOBs record) {
        return admissionBaseMapper.insertSelective(record);
    }

    @Override
    public AdmissionBaseWithBLOBs selectByPrimaryKey(Long id) {
        return admissionBaseMapper.selectByPrimaryKey(id);
    }

    @Override
    public int updateByPrimaryKeySelective(AdmissionBaseWithBLOBs record) {
        return admissionBaseMapper.updateByPrimaryKeySelective(record);
    }

    @Override
    public int updateByPrimaryKeyWithBLOBs(AdmissionBaseWithBLOBs record) {
        return admissionBaseMapper.updateByPrimaryKeyWithBLOBs(record);
    }

    @Override
    public int updateByPrimaryKey(AdmissionBase record) {
        return admissionBaseMapper.updateByPrimaryKey(record);
    }

    @Override
    public List<AdmissionBaseDto> selectByParam(AdmissionBaseListParam param) {
       if(Objects.nonNull(param.getPageIndex())){
           PageHelper.startPage(param.getPageIndex(),20);
       }
        if(ArrayUtils.isEmpty(param.getStatus())){
            param.setStatus(null);
        }
        return admissionBaseMapper.selectByParam(param);
    }

    @Override
    public int updateAdmissionBaseStatus(Long baseId,Byte status) {
        if(status == 1 && !isAdmissionComplete(baseId)){
            throw new RuntimeException("未完成出厂价设置");
        }else if(status == 2 && !isSalesPriceComplete(baseId)){
            throw new RuntimeException("未完成销售价格配置");
        }
        return admissionBaseMapper.updateAdmissionBaseStatus(baseId,status);
    }

    @Override
    public int completeAdmission(Long baseId) {
        AdmissionBaseWithBLOBs admissionBaseWithBLOBs = admissionBaseMapper.selectByPrimaryKey(baseId);
        if(Objects.equals(admissionBaseWithBLOBs.getAdmissionStatus().intValue(),0)){
            boolean admissionComplete = admissionBaseMapper.isAdmissionComplete(baseId);
            if(admissionComplete){
                return admissionBaseMapper.updateAdmissionBaseStatus(baseId, (byte) 1);
            }
        }
        return 0;
    }

    @Override
    public boolean isAdmissionComplete(Long id) {
        return admissionBaseMapper.isAdmissionComplete(id);
    }

    public boolean isSalesPriceComplete(Long id){
        Map param = new HashMap();
        param.put("pid",id);
        param.put("startNum",0);
        param.put("pageSize",100);
        List<AdmissionSalePrice> priceInfoByPid = admissionSalePriceMapper.getPriceInfoByPid(param);
        Double x = 0.00;
       for (AdmissionSalePrice admissionSalePrice : priceInfoByPid){
           String[] suitRegion = admissionSalePrice.getSuitRegion().split("");
           if(suitRegion[0].equals("1") && admissionSalePrice.getWorkdaySalePrice().doubleValue()==x){
                return false;
           }else if(suitRegion[1].equals("1") && admissionSalePrice.getWeekendSalePrice().doubleValue()==x){
               return false;
           }else if(suitRegion[2].equals("1") && admissionSalePrice.getFestivalSalePrice().doubleValue()==x){
               return false;
           }
       }
       return true;
    }

}
