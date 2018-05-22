package com.jdy.b2b.api.model.product;

import com.jdy.b2b.api.model.city.MobileProvinceConditionDO;
import com.jdy.b2b.api.model.company.MobileCompanyConditionDO;
import com.jdy.b2b.api.model.scenicspot.ScenicListConditionDO;
import com.jdy.b2b.api.model.scenicspot.ScenicSpot;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by yangcheng on 2017/9/23.
 */
public class MobileListConditionDO {
    private Long pId;
    private Integer pDays;// 1
    //resultMap拼接
    private MobileCompanyConditionDO company = new MobileCompanyConditionDO(); //1
    private List<ScenicListConditionDO> spots = new ArrayList<ScenicListConditionDO>(); //每个产品对应多个景点,查询附加属性和景点名称
    //组装
    private List<MobileProvinceConditionDO> hotProvinces = new ArrayList<MobileProvinceConditionDO>();

    public Long getpId() {
        return pId;
    }

    public void setpId(Long pId) {
        this.pId = pId;
    }

    public Integer getpDays() {
        return pDays;
    }

    public void setpDays(Integer pDays) {
        this.pDays = pDays;
    }

    public List<ScenicListConditionDO> getSpots() {
        return spots;
    }

    public void setSpots(List<ScenicListConditionDO> spots) {
        this.spots = spots;
    }

    public MobileCompanyConditionDO getCompany() {
        return company;
    }

    public void setCompany(MobileCompanyConditionDO company) {
        this.company = company;
    }

    public List<MobileProvinceConditionDO> getHotProvinces() {
        return hotProvinces;
    }

    public void setHotProvinces(List<MobileProvinceConditionDO> hotProvinces) {
        this.hotProvinces = hotProvinces;
    }
}
