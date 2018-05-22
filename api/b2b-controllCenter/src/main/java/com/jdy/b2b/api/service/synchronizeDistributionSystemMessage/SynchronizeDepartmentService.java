package com.jdy.b2b.api.service.synchronizeDistributionSystemMessage;

import com.jdy.b2b.api.model.synchronizeDistributionSystem.Dept;

import java.util.List;

/**
 * Created by dugq on 2018/3/24.
 */
public interface SynchronizeDepartmentService {
    List<Dept> getDepartmentList(Long id);
    int synchronizeDepartmentList(Long companyId);
}
