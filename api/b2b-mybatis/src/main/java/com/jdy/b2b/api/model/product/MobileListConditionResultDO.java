package com.jdy.b2b.api.model.product;

import java.util.ArrayList;
import java.util.List;

import com.jdy.b2b.api.model.city.MobileProvinceConditionDO;
import com.jdy.b2b.api.model.company.MobileCompanyConditionDO;
import com.jdy.b2b.api.model.scenicspot.ScenicSpot;

/**
 * Created by yangcheng on 2017/9/23.
 */
public class MobileListConditionResultDO {
    private List<String> province = new ArrayList<String>();
    private List<String> city = new ArrayList<String>();
    private List<Integer> days = new ArrayList<>();
    private List<String> attribute = new ArrayList<String>();
    private List<String> scenic = new ArrayList<>();


}
