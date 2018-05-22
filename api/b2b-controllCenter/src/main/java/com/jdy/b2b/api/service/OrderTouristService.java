package com.jdy.b2b.api.service;

import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.model.TouristCancelVO;

/**
 * Created by strict on 2018/1/30.
 */
public interface OrderTouristService {
    ResultBean batchCancelTourist(TouristCancelVO touristCancelVO);
}
