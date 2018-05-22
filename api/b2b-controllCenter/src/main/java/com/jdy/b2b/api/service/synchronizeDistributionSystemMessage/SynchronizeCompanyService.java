package com.jdy.b2b.api.service.synchronizeDistributionSystemMessage;

import com.jdy.b2b.api.model.synchronizeDistributionSystem.Dept;

import java.util.List;

/**
 * Created by dugq on 2018/3/24.
 */
public interface SynchronizeCompanyService {
    List<Dept>  getCompanyList();
    Dept getCompanyById(Long id);
    int synchronizeCompanyList();
    int synchronizeCompanyById(Long id);
}
