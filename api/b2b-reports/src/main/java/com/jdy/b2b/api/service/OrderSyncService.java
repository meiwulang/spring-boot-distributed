package com.jdy.b2b.api.service;

import com.jdy.b2b.api.model.OrderSync.OrderSyncDTO;

/**
 * Created by Darker on 2018/01/20.
 */
public interface OrderSyncService {
    void save (OrderSyncDTO orderSyncDTO);
}
