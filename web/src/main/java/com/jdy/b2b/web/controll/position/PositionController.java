package com.jdy.b2b.web.controll.position;

import com.jdy.b2b.web.pojo.distributionSystemEntity.PositionListParam;
import com.jdy.b2b.web.pojo.distributionSystemEntity.PositionRoleDto;
import com.jdy.b2b.web.pojo.user.UserResultDTO;
import com.jdy.b2b.web.util.BaseController;
import com.jdy.b2b.web.util.ResultBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.Objects;


/**
 * Created by dugq on 2018/3/24.
 */
@RestController
@RequestMapping("position")
public class PositionController extends BaseController{
    @Autowired
    @Qualifier("customRestTemplate")
    protected RestTemplate restTemplate;


    @RequestMapping("positionList")
    public ResultBean positionListByCompanyId(@RequestBody PositionListParam param){
     if(Objects.isNull(param.getCompanyId())){
         UserResultDTO user = getUser();
         Long deptId ;
         if(user.getuDataLimit()==3 || Objects.equals(user.getuAccount(),"admin")){
             deptId = null;
         }else{
             deptId = user.getDistributionSystemDTO().getDept().getOrgChart().getDeptId();
         }
//        Long deptId = 18l;
         param.setCompanyId(deptId);
     }
        if (Objects.isNull(param.getPageIndex())){
            param.setPageIndex(1);
        }
        return restTemplate.postForEntity(controllCenterUrl+"position/positionListByCompanyId",param,ResultBean.class).getBody();
    }

    @RequestMapping("savePositionRoles")
    public ResultBean savePositionRoles(@RequestBody PositionRoleDto positionRoleDto){
        return restTemplate.postForEntity(controllCenterUrl+"position/savePositionRoles",positionRoleDto,ResultBean.class).getBody();
    }

    @RequestMapping("getRolesByPositionId/{positionId}")
    public ResultBean getRolesByPositionId(@PathVariable("positionId") Long positionId){
        return restTemplate.getForEntity(controllCenterUrl+"position/getRolesByPositionId/"+positionId,ResultBean.class).getBody();
    }

}
