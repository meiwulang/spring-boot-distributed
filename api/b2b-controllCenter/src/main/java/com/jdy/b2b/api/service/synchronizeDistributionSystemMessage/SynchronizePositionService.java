package com.jdy.b2b.api.service.synchronizeDistributionSystemMessage;

import com.jdy.b2b.api.model.position.Position;
import com.jdy.b2b.api.model.position.PositionVO;
import com.jdy.b2b.api.model.synchronizeDistributionSystem.Dept;
import com.jdy.b2b.api.model.synchronizeDistributionSystem.PositionDto;

import java.util.List;
import java.util.Map;

/**
 * Created by dugq on 2018/3/24.
 */
public interface SynchronizePositionService {
    List<PositionDto> getPositionList(Long id);
    PositionDto getPositionById(Long id);
    int synchronizePositionList(Long deptId,Map<String, List<PositionVO>> collect);
    int synchronizePositionById(Long id);
}
