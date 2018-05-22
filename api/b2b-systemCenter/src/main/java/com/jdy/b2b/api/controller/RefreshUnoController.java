package com.jdy.b2b.api.controller;

import com.jdy.b2b.api.common.OneTuple;
import com.jdy.b2b.api.common.ResultBean;
import com.jdy.b2b.api.common.TwoTuple;
import com.jdy.b2b.api.dao.OrderMapper;
import com.jdy.b2b.api.dao.ScheduleMapper;
import com.jdy.b2b.api.dao.user.UserMapper;
import com.jdy.b2b.api.model.user.UserNoDTO;
import com.jdy.b2b.api.service.UserService;
import com.sun.corba.se.impl.resolver.INSURLOperationImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 1.将用户表中ustype为0或1的数据的用户编号置为null
 * 2.调用refreshOldUserNO方法,生成新的编号
 * 3.修改新增员工接口和修改接口的编号生成规则,以8开头,从100开始
 *
 * 1.将用户表中ustype为2的数据的用户编号置为null
 * 2.调用refreshOldDistUserNO方法,生成新的编号
 * 3.修改同步代理人接口,添加设置员工编号规则,以5开头
 *
 * 1.调用refreshOrderGroupNO接口,更新班期表和订单表中的团号
 * @return
 */
@RestController
@RequestMapping("refreshUno")
public class RefreshUnoController {

    @Autowired
    private UserService userService;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private ScheduleMapper scheduleMapper;
    @Autowired
    private OrderMapper orderMapper;


    //TODO  传播行为
    @GetMapping("handleUno")
    public ResultBean handleUno(){
        //1.查询老的ustype为0或1的用户的编号
        List<Map<String,Object>> oldData = userService.selectOldUnoById();
        //将数据处理为id oldNo 的形式,存入oldIdNoList中
        List<UserNoDTO> oldIdNoList = new ArrayList<>();
        List<Long> oldIds = new ArrayList<>();
        oldData.stream().forEach(s->{
            oldIds.add((Long)s.get("id"));
            oldIdNoList.add(new UserNoDTO(){
                {
                    setId((Long)s.get("id"));
                    setuNo((String)s.get("uNo"));
                }
            });
        });

        //2.将所有用户编号置为null
        userMapper.updateAllUnoNull();

        //3.为已存在的ustype为0或1的数据生成新的员工编号,返回新的用户编号
        List<UserNoDTO> newIdNoList = refreshOldUserNO(oldIds);


        //查询所有代理人的id集合
        List<Long> distIdList = userMapper.selectAllDistIds();
        //4.为已存在的代理人数据生成新的员工编号
        refreshOldDistUserNO(distIdList);
        //5.处理班期和订单表中的团号数据
        refreshOrderGroupNO(oldIdNoList,newIdNoList);

        return ResultBean.getSuccessResult();
    }


    private List<UserNoDTO> refreshOldUserNO(List<Long> oldIds){
        List<UserNoDTO> idNoList = new ArrayList<>();
        //设置初始值
        Long iNo = 80000100L;
        OneTuple<Long> tuple = new OneTuple(iNo);
        oldIds.stream().forEach(s->{
            idNoList.add(new UserNoDTO(){
                {
                    String maxNOStr =(tuple.getA()+1L)+"";
                    setId(s);
                    setuNo(maxNOStr);
                }
            });
            tuple.setA(tuple.getA()+1L);
        });
        //批量更新
        userMapper.updateAllUno(idNoList);
        return idNoList;
    }


    private void refreshOldDistUserNO(List<Long> distIdList){
        List<UserNoDTO> idNoList = new ArrayList<>();
        Long iNo = 50000000L;
        OneTuple<Long> tuple = new OneTuple(iNo);
        distIdList.stream().forEach(s->{
            idNoList.add(new UserNoDTO(){
                {
                    setId(s);
                    tuple.setA(tuple.getA()+1L);
                    setuNo(tuple.getA()+"");
                }
            });
        });
        //TODO 批量更新
        int result = userMapper.updateAllUno(idNoList);
    }


    private void refreshOrderGroupNO(List<UserNoDTO> oldIdNoList,List<UserNoDTO> newIdNoList){
        Map oldNewMap = new HashMap();
        oldIdNoList.stream().forEach(s->{
            newIdNoList.stream().forEach(a->{
                if(s.getId().equals(a.getId()) && s.getuNo()!=null){
                    oldNewMap.put(s.getuNo(),a.getuNo());
                }
            });
        });

        //查询所有的班期和订单中的id,团号 替换到以前的团号
        List<UserNoDTO> schIdNoList = scheduleMapper.selectOldSchIdNOList();
        //TODO 判断是否是null
        schIdNoList.stream().forEach(s->{
            if(s.getuNo()!=null && s.getuNo().lastIndexOf("-")>0){
                String oldNo = s.getuNo().substring(s.getuNo().lastIndexOf("-")+1,s.getuNo().length());
                if(oldNewMap.get(oldNo)!=null){
                    String newNo = s.getuNo().substring(0,s.getuNo().lastIndexOf("-")+1)+oldNewMap.get(oldNo);
                    s.setuNo(newNo);
                }
            }
        });
        //TODO  执行更新
        scheduleMapper.updateGroupOrderNoBash(schIdNoList);

        List<UserNoDTO> orderIdNoList = orderMapper.selectOldOrderIdNoList();
        orderIdNoList.stream().forEach(s->{
            if(s.getuNo()!=null && s.getuNo().lastIndexOf("-")>0){
                String oldNo = s.getuNo().substring(s.getuNo().lastIndexOf("-")+1,s.getuNo().length());
                if(oldNewMap.get(oldNo)!=null){
                    String newNo = s.getuNo().substring(0,s.getuNo().lastIndexOf("-")+1)+oldNewMap.get(oldNo);
                    s.setuNo(newNo);
                }
            }
        });

        orderMapper.updateGroupOrderNoBash(orderIdNoList);
    }

}
