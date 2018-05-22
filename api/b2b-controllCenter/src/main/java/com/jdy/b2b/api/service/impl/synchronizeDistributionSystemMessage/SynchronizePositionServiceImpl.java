package com.jdy.b2b.api.service.impl.synchronizeDistributionSystemMessage;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.jdy.b2b.api.common.HttpClientUtils;
import com.jdy.b2b.api.dao.DepartmentMapper;
import com.jdy.b2b.api.dao.PositionMapper;
import com.jdy.b2b.api.dao.PositionRoleMapper;
import com.jdy.b2b.api.model.Department;
import com.jdy.b2b.api.model.position.Position;
import com.jdy.b2b.api.model.position.PositionRole;
import com.jdy.b2b.api.model.position.PositionRoleDto;
import com.jdy.b2b.api.model.position.PositionVO;
import com.jdy.b2b.api.model.synchronizeDistributionSystem.PositionDto;
import com.jdy.b2b.api.service.synchronizeDistributionSystemMessage.SynchronizePositionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Created by dugq on 2018/3/24.
 */
@Service
public class SynchronizePositionServiceImpl implements SynchronizePositionService {

    @Value("${spring.distributionSystemUrl}")
    private String distributionSystemUrl;
    @Autowired
    private PositionMapper positionMapper;
    @Autowired
    private DepartmentMapper departmentMapper;
    @Autowired
    private PositionRoleMapper positionRoleMapper;

    @Override
    public List<PositionDto> getPositionList(Long id) {
        Map map = new HashMap();
        map.put("cloudId",2);
        map.put("deptId",id);
        JSONArray array = (JSONArray)sendRequest("/sm/position/queryByDeptForInner", map);
        List<PositionDto> positions = JSONArray.parseArray(array.toJSONString(),PositionDto.class);
        return positions;
    }

    @Override
    public PositionDto getPositionById(Long id) {
        Map map = new HashMap();
        map.put("cloudId",2);
        map.put("positionId",id);
        JSONObject object = (JSONObject) sendRequest("/sm/position/detailForInner", map);
        PositionDto positionDto = JSONObject.parseObject(object.toJSONString(), PositionDto.class);
        return positionDto;
    }

    @Override
    @Transactional
    public int synchronizePositionList(Long id,Map<String, List<PositionVO>> collect) {
        List<PositionDto> positionList = getPositionList(id);
        List<Position> positions = positionMapper.selectByDepartmentId(null, null);

        if(CollectionUtils.isEmpty(positionList)){
            return 0;
        }
        if(CollectionUtils.isEmpty(positions)){
            positionMapper.bathInsert(positionList);
            return 0;
        }

        LinkedList<Long> oldIds = positions.stream().reduce(new LinkedList(), (acc, position) -> {
            acc.add(position.getId());
            return acc;
        }, (left, right) -> {
            left.addAll(right);
            return left;
        });

//        LinkedList<Long> newIds = positionList.stream().reduce(new LinkedList(), (acc, position) -> {
//            acc.add(position.getPositionId());
//            return acc;
//        }, (left, right) -> {
//            left.addAll(right);
//            return left;
//        });
        Map<Boolean, List<PositionDto>> oldMap = positionList.stream().collect(Collectors.groupingBy(position -> oldIds.contains(position.getPositionId())));
        List<PositionDto> addList = oldMap.get(false);
        List<PositionDto> updateList = oldMap.get(true);

       if(!CollectionUtils.isEmpty(updateList)){
           updateList.forEach(position->{
               Department department = departmentMapper.selectByPrimaryKey(position.getDeptId());
               if(Objects.nonNull(department)){
                   position.setDepartmentId(department.getId());
                   position.setCompanyId(department.getCompanyId());
               }else{
                   position.setCompanyId(position.getDeptId());
               }
               positionMapper.update(position);
           });
       }
//        List<Long> removeList = newIds.stream().reduce(new LinkedList<>(),(acc,newId)->{
//            if(!oldIds.contains(newId))
//                acc.add(newId);
//            return acc;
//        },(left,right)->{
//            left.addAll(right);
//            return left;
//        });
//        if(!CollectionUtils.isEmpty(removeList))
//            positionMapper.bathDelete(removeList);
        if(!CollectionUtils.isEmpty(addList)){
            addList.forEach(position->{
                Department department = departmentMapper.selectByPrimaryKey(position.getDeptId());
                if(Objects.nonNull(department)){
                    position.setDepartmentId(department.getId());
                    position.setCompanyId(department.getCompanyId());
                }else{
                    position.setCompanyId(position.getDeptId());
                }
            });
            positionMapper.bathInsert(addList);
            addList.forEach(position -> {
                List<PositionVO> positionVOS = collect.get(position.getPositionName());
                if(!CollectionUtils.isEmpty(positionVOS) && !CollectionUtils.isEmpty(positionVOS.get(0).getRoleIds())){
                    PositionRoleDto positionRole = new PositionRoleDto();
                    positionRole.setPositionId(position.getPositionId());
                    positionRole.setDataLimit(positionVOS.get(0).getDataLimit());
                    positionRole.setRoleIds(positionVOS.get(0).getRoleIds());
                    positionRoleMapper.bathInsert(positionRole);
                }
            });
        }
        return 0;
    }

    @Override
    @Transactional
    public int synchronizePositionById(Long id) {
        PositionDto positionDto = getPositionById(id);
        Position position = positionMapper.selectByPrimaryKey(id);
        if(Objects.isNull(position)){
            positionMapper.insertDto(positionDto);
        }else{
            positionMapper.update(positionDto);
        }
        return 0;
    }

    public Object sendRequest(String url, Map params){
        url = distributionSystemUrl+url;
        JSONObject jsonObject = HttpClientUtils.httpPost(url, params);
        if(Objects.equals(jsonObject.get("code").toString(),"200")){
            return jsonObject.get("data");
        }else{
            throw new RuntimeException("http error");
        }
    }

    public String getDistributionSystemUrl() {
        return distributionSystemUrl;
    }

    public void setDistributionSystemUrl(String distributionSystemUrl) {
        this.distributionSystemUrl = distributionSystemUrl;
    }
}
