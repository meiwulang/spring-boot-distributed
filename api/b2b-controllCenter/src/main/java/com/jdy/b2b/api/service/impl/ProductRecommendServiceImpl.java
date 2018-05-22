package com.jdy.b2b.api.service.impl;

import com.jdy.b2b.api.common.BaseService;
import com.jdy.b2b.api.dao.product.ProductMapper;
import com.jdy.b2b.api.model.scenicspot.ScenicSpot;
import com.jdy.b2b.api.model.ticketarea.TicketArea;
import com.jdy.b2b.api.service.ProductRecommendService;
import com.jdy.b2b.api.model.product.ProductRecommendDTO;
import com.jdy.b2b.api.model.product.ProductRecommendQueryVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.Collator;
import java.util.*;

/**
 * Created by yangcheng on 2017/8/14.
 */
@Service
public class ProductRecommendServiceImpl extends BaseService implements ProductRecommendService{
    @Autowired
    private ProductMapper productMapper;

    @Override
    public List<ProductRecommendDTO> queryProductRecommendListForPage(ProductRecommendQueryVo vo) {
        //查询产品列表,带有适用城市信息
        List<ProductRecommendDTO> products1 = productMapper.queryProductRecommendListForPage(vo);
        List<ProductRecommendDTO> result = new ArrayList<ProductRecommendDTO>();
        //设置使用城市
        if(products1.size()>0){
            for(ProductRecommendDTO product:products1){
                Set<String> appliCitys = product.getAppliStrList();
                List<TicketArea> areaList = product.getAreaList();
                if(areaList.size()>0){
                    for(TicketArea area : areaList){
                        if(!(Objects.isNull(area))){
                            appliCitys.add(area.getTaCity());
                        }
                    }
                    String[] newArray = appliCitys.toArray(new String[]{});
                    Comparator<Object> com= Collator.getInstance(java.util.Locale.CHINA);
                    Arrays.sort(newArray,com);
                    Set<String> tSet = new TreeSet<String>(Arrays.asList(newArray));
                    product.setAppliStrList(tSet);
                }
            }
        }
        //设置目的地
        List<ProductRecommendDTO> products2 = productMapper.queryDestCitys(products1);
        if(products2.size()>0){
            for(ProductRecommendDTO product:products2){
                Set<String> spots = product.getDestStrList();
                List<ScenicSpot> spotList = product.getSpots();
                if(spotList.size()>0){
                    for(ScenicSpot spot : spotList){
                        spots.add(spot.getsCustomPlace());
                    }

                    String[] newArray = spots.toArray(new String[]{});
                    Comparator<Object> com= Collator.getInstance(java.util.Locale.CHINA);
                    Arrays.sort(newArray,com);
                    Set<String> tSet = new TreeSet<String>(Arrays.asList(newArray));
                    product.setDestStrList(tSet);
                }
            }
        }
        //整合数据
        for(ProductRecommendDTO product1:products1){
            for(ProductRecommendDTO product2:products2){
                if(product1.getId().equals(product2.getId())){
                    product1.setDestStrList(product2.getDestStrList());
                }
            }
        }

        //如果查询条件有使用城市,过滤数据
        List<String> citys = vo.getCitys();
        List<String> notEmptyCitys = new ArrayList<String>();
        for(String c:citys){
            if(c.trim()!=""){
                notEmptyCitys.add(c.trim());
            }
        }

        if(notEmptyCitys!=null && notEmptyCitys.size()>0){
            for(ProductRecommendDTO product:products1){
                if(product.getAppliStrList()!=null && product.getAppliStrList().containsAll(notEmptyCitys)){
                    result.add(product);
                }
            }
            return result;
        }
        return products1;

    }
}
