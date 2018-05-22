package com.jdy.b2b.api.service.impl;

import com.jdy.b2b.api.common.BaseService;
import com.jdy.b2b.api.common.JSONUtil;
import com.jdy.b2b.api.dao.ScheduleTicketMapper;
import com.jdy.b2b.api.dao.factoryTicket.FactoryTicketMapper;
import com.jdy.b2b.api.dao.factoryTicket.TicketFactoryTicketMapper;
import com.jdy.b2b.api.dao.product.ProductAssembleCompanyMapper;
import com.jdy.b2b.api.dao.product.ProductMapper;
import com.jdy.b2b.api.dao.station.DepartureMapper;
import com.jdy.b2b.api.dao.ticket.TicketMapper;
import com.jdy.b2b.api.dao.ticketarea.TicketAreaMapper;
import com.jdy.b2b.api.dao.ticketdeparture.TicketDepartureMapper;
import com.jdy.b2b.api.dao.ticketset.TicketSetMapper;
import com.jdy.b2b.api.model.ScheduleTicket;
import com.jdy.b2b.api.model.product.Product;
import com.jdy.b2b.api.model.station.Departure;
import com.jdy.b2b.api.model.ticket.Ticket;
import com.jdy.b2b.api.model.ticket.TicketListDO;
import com.jdy.b2b.api.model.ticket.TicketSingleResult;
import com.jdy.b2b.api.model.ticketarea.TicketArea;
import com.jdy.b2b.api.model.ticketdeparture.TicketDeparture;
import com.jdy.b2b.api.model.ticketset.TicketSet;
import com.jdy.b2b.api.service.TicketService;
import com.jdy.b2b.api.util.DataSyncUtils;
import com.jdy.b2b.api.vo.ticket.CopyGatherTicketsVO;
import com.jdy.b2b.api.vo.ticket.TicketSaveOrUpdateVo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Created by yangcheng on 2017/7/3.
 */
@Service
public class TicketServiceImpl extends BaseService implements TicketService {
    @Autowired
    private TicketMapper ticketMapper;
    @Autowired
    private TicketSetMapper ticketSetMapper;
    @Autowired
    private TicketAreaMapper ticketAreaMapper;
    @Autowired
    private TicketDepartureMapper ticketDepartureMapper;
    @Autowired
    private DepartureMapper departureMapper;
    @Autowired
    private ScheduleTicketMapper scheduleTicketMapper;
    @Autowired
    private ProductAssembleCompanyMapper productAssembleCompanyMapper;
    @Autowired
    private ProductMapper productMapper;
    @Autowired
    private TicketFactoryTicketMapper ticketFactoryTicketMapper;
    @Autowired
    private FactoryTicketMapper factoryTicketMapper;


    @Override
    public List<TicketSingleResult> queryForOutTicketList(Ticket ticket) {
        List<TicketListDO> list = ticketMapper.queryForOutTicketList(ticket);
        List<TicketSingleResult> resultList = new ArrayList<>();
        Map<Integer,TicketSingleResult> map = new HashMap<>();
        //组装数据
        list.stream().forEach(s->{
            Integer gettType = s.gettType();
			if(map.get(gettType)==null){
                TicketSingleResult singleResult = new TicketSingleResult();
                List<TicketListDO> ticketList = new ArrayList<>();
                ticketList.add(s);

                singleResult.setGroupBy(gettType==1?"儿童票":"成人票");
                singleResult.setTickList(ticketList);
                singleResult.setAmount(ticketList.size());
                map.put(gettType,singleResult);
            }else{
                TicketSingleResult singleResult = map.get(gettType);
                singleResult.getTickList().add(s);
                singleResult.setAmount(singleResult.getTickList().size());
            }
        });

        map.keySet().stream().forEach(s->{
            resultList.add(map.get(s));
        });
        return resultList;
    }

    @Override
    public int updateTicket(Ticket ticket) {
        if(Objects.nonNull(ticket.getFactoryTicketIds())){
            ticketFactoryTicketMapper.bathDelete(ticket.getId());
            factoryTicketMapper.batchUpdateStatus(ticket.getFactoryTicketIds(), (byte) 1);
            ticketFactoryTicketMapper.bathInsert(ticket.getId(),ticket.getFactoryTicketIds());
        }
        int result = ticketMapper.updateByPrimaryKeySelective(ticket);
        DataSyncUtils.getInstance().syncTicketData(ticket);
        return result;
    }

    @Override
    public int saveTicket(Ticket ticket) {
        int insert = ticketMapper.insert(ticket);
        ticketFactoryTicketMapper.bathInsert(ticket.getId(),ticket.getFactoryTicketIds());

        DataSyncUtils.getInstance().syncTicketData(ticket);
        return insert;
    }

    @Override
    public int saveTicketBash(List<Ticket> ticketList) {
        return ticketMapper.saveTicketBash(ticketList);
    }

    @Override
    public Ticket queryForTicketById(Long id,Integer single) {
        return  ticketMapper.selectByPrimaryKey(id,single);
    }

    @Override
    public int saveTicketSetBash(List<TicketSet> list) {
        return ticketSetMapper.saveTicketSetBash(list);
    }

    @Override
    public int saveTicketAreaBash(List<TicketArea> ticketAreaList) {
        return ticketAreaMapper.saveTicketAreaBash(ticketAreaList);
    }

    @Override
    public int saveTicketDepartureBash(List<TicketDeparture> ticketDepartureList) {
        return ticketDepartureMapper.saveTicketDepartureBash(ticketDepartureList);
    }

    @Override
    public int deleteSetById(Long id) {
        return ticketSetMapper.deleteSetById(id);
    }

    @Override
    public int deleteAreaByTicketId(Long id) {
        return ticketAreaMapper.deleteByTicketId(id);
    }

    @Override
    public int deleteDepartureByTicketId(Long id) {
        return ticketDepartureMapper.deleteDepartureByTicketId(id);
    }

    @Override
    public Ticket queryForTicketOnly(Long id) {
        return ticketMapper.selectByIdOnly(id);
    }

    @Override
    public Long queryDefaultPrice(Long id) {
        return ticketMapper.queryDefaultPrice(id);
    }

    @Override
    public List<Ticket> getTicketList(Long productId) {
        return ticketMapper.getTicketList(productId);
    }

    @Override
    public List<TicketListDO> queryForTicketListForPage(Ticket ticket) {
        List<TicketListDO> list = ticketMapper.queryForOutTicketList(ticket);
        return list;
    }

    @Override
    @Transactional
    public int copyGatherTickets(List<Long> companyIds,CopyGatherTicketsVO vo) {

        //通过vo查询票列表
        Product p = productMapper.selectByPrimaryKey(vo.getProductId());
        if(!p.getpStatus().equals(Integer.valueOf(0))){
            return 0;
        }
        List<Ticket> list = ticketMapper.selectTicketListByProductId(vo.getProductId(),p.getCompanyId());

        List<Long> idList = new ArrayList<>();
        List<Ticket> newTicketList = new ArrayList<>();
        Set<Long> ids = new HashSet<>();

        //组装新的票列表并插入
        list.stream().forEach(s->{
            ids.add(s.getId());

            Ticket trans = JSONUtil.trans(s, Ticket.class);
            trans.setId(null);
            trans.settCompanyId(vo.getPcompanyId());
            trans.settStock(null);
            trans.settFromTicketId(s.getId());
            trans.setCreateUser(vo.getPuserId());
            trans.setUpdateUser(vo.getPuserId());
            trans.setCreateTime(new Date());
            trans.setUpdateTime(new Date());
            newTicketList.add(trans);
        });
        int num = ticketMapper.saveTicketBash(newTicketList);

        //旧票id列表
        ids.stream().forEach(s->{
            idList.add(s);
        });

        Map<Long,Long> ticketIdMap = new HashMap<>();
        newTicketList.stream().forEach(s->{
            ticketIdMap.put(s.gettFromTicketId(),s.getId());
        });

        //复制班期票关联关系
        copyScheduleTicket(vo, idList, ticketIdMap);
        copyDepartureTicketAndDeparture(vo.getPcompanyId(),null,vo, idList, ticketIdMap);

        //集结之后更新ct_product_assemble_company状态和用户
        int i = productAssembleCompanyMapper.updateProductAssembleCompany(vo.getProductId(), vo.getPuserId(),vo.getPcompanyId());

        return num;
    }

    @Transactional
    private void copyDepartureTicketAndDeparture(Long companyId,Ticket ticket,CopyGatherTicketsVO vo, List<Long> idList, Map<Long, Long> ticketIdMap) {
        //查询要复制的票对应的始发站
        List<Long> oldDepartureIdList  = new ArrayList<>();
        if(ticket ==null){
            oldDepartureIdList  = departureMapper.selectOldDepartureList(idList);
        }else{
            oldDepartureIdList = ticket.getTicketDepartureList().stream().map(s->s.getDepartueId()).collect(Collectors.toList());
        }
        List<Departure> oldDepartureList = departureMapper.selectListByIdList(oldDepartureIdList);

        List<String> distinctFromDepartureList  = new ArrayList<>();
        Map<String,Departure> strDepMap = new HashMap<>();
        oldDepartureList.stream().forEach(s->{
            distinctFromDepartureList.add(s.getdProvince()+","+s.getdCity()+","+s.getdArea()+","+s.getdName()+","+s.getdType());
            strDepMap.put(s.getdProvince()+","+s.getdCity()+","+s.getdArea()+","+s.getdName()+","+s.getdType(),s);
        });

        //查询集结发起公司的始发站
        List<Departure> departureList = departureMapper.selectNowDepartureList(companyId);

        List<String> distinctToDepartureList  = new ArrayList<>();
        departureList.stream().forEach(s->{
            distinctToDepartureList.add(s.getdProvince()+","+s.getdCity()+","+s.getdArea()+","+s.getdName()+","+s.getdType());
        });

        Map<Long,Long> departureIdMap  = new HashMap<>();
        distinctFromDepartureList.stream().forEach(s->{
            if(!distinctToDepartureList.contains(s)){
                Departure trans = JSONUtil.trans(strDepMap.get(s), Departure.class);
                trans.setId(null);
                trans.setCompanyId(companyId);
                departureMapper.insert(trans);
                departureIdMap.put(strDepMap.get(s).getId(),trans.getId());
            }else{
                //查询已存在的始发站
                String[] arr = s.split(",");
                Departure d = new Departure();
                d.setdProvince(arr[0]);
                d.setdCity(arr[1]);
                d.setdArea(arr[2]);
                d.setdName(arr[3]);
                d.setdType(Integer.valueOf(arr[4]));
                d.setCompanyId(companyId);
                Departure result = departureMapper.selectByEntity(d);

                departureIdMap.put(strDepMap.get(s).getId(),result.getId());
            }
        });

        //查询之前的关联关系列表
        //再将集结发起公司没有的始发站复制到始发站表,并创建departure_ticket关系
        List<TicketDeparture> oldTicketDepartureList = new ArrayList<>();
        if(ticket==null){
            oldTicketDepartureList = ticketDepartureMapper.selectOldTicketDepartureList(idList);
            //ticketDepartureMapper.deleteDepartureByTicketId(ticketIdMap.get(idList.get(0)));
        }else{
            oldTicketDepartureList = ticket.getTicketDepartureList();
            ticketDepartureMapper.deleteDepartureByTicketId(ticketIdMap.get(ticket.getId()));
        }

        List<TicketDeparture> newTicetDepartureList = new ArrayList<>();
        oldTicketDepartureList.stream().forEach(s->{
            if(departureIdMap.get(s.getDepartueId())!=null){
                s.setId(null);
                s.setTicketId(ticketIdMap.get(s.getTicketId()));
                s.setDepartueId(departureIdMap.get(s.getDepartueId()));
                s.setCreateUser(vo.getPuserId());
                newTicetDepartureList.add(s);
            }
        });
        if(newTicetDepartureList!=null && newTicetDepartureList.size()>0){
            ticketDepartureMapper.saveTicketDepartureBash(newTicetDepartureList);
        }
    }

    @Override
    @Transactional
    public int createAndCopyTicket(TicketSaveOrUpdateVo vo,Ticket ticket) {
        //查询那些公司集结了此产品
        List<Long> companyIds = productAssembleCompanyMapper.selectCompanyIdsByProductIdOK(ticket.gettProductId());
        if (companyIds==null || companyIds.size()==0) {
            return 0;
        }
        List<Ticket> newTicketList = new ArrayList<>();
        companyIds.stream().forEach(s->{

            if (!s.equals(vo.getPcompanyId())) {
                Ticket trans = JSONUtil.trans(ticket, Ticket.class);
                trans.setId(null);
                trans.settCompanyId(s);
                trans.settStock(null);
                trans.settFromTicketId(ticket.getId());
                trans.setCreateUser(vo.getPuserId());
                trans.setUpdateUser(vo.getPuserId());
                trans.setCreateTime(new Date());
                trans.setUpdateTime(new Date());

                newTicketList.add(trans);
            }
        });
        int num = ticketMapper.saveTicketBash(newTicketList);

        /*List<Long> idList = new ArrayList(){
            {add(ticket.getId());}
        };*/

        Map<Long,Long> ticketIdMap = new HashMap<>();
        newTicketList.stream().forEach(s->{
            ticketIdMap.put(s.gettFromTicketId(),s.getId());
        });

        //查询新增票对应的始发站
        //TODO 旧票的始发站不需要再查
        // List<Long> oldDepartureIdList = departureMapper.selectOldDepartureList(idList);
        List<Long> oldDepartureIdList = ticket.getTicketDepartureList().stream().map(s->s.getDepartueId()).collect(Collectors.toList());
        List<Departure> oldDepartureList = departureMapper.selectListByIdList(oldDepartureIdList);

        List<String> distinctFromDepartureList  = new ArrayList<>();
        Map<String,Departure> strDepMap = new HashMap<>();
        oldDepartureList.stream().forEach(s->{
            distinctFromDepartureList.add(s.getdProvince()+","+s.getdCity()+","+s.getdArea()+","+s.getdName()+","+s.getdType());
            strDepMap.put(s.getdProvince()+","+s.getdCity()+","+s.getdArea()+","+s.getdName()+","+s.getdType(),s);
        });


        //查询各个集结发起公司的始发站
        companyIds.stream().forEach(a->{

            List<Departure> departureList = departureMapper.selectNowDepartureList(a);

            List<String> distinctToDepartureList  = new ArrayList<>();
            departureList.stream().forEach(s->{
                distinctToDepartureList.add(s.getdProvince()+","+s.getdCity()+","+s.getdArea()+","+s.getdName()+","+s.getdType());
            });


            List<Long> nowIdList = new ArrayList<>();
            //此公司的始发站id集合
            departureList.stream().forEach(s->{
                nowIdList.add(s.getId());
            });

            Map<Long,Long> departureIdMap  = new HashMap<>();
            distinctFromDepartureList.stream().forEach(s->{
                if(!distinctToDepartureList.contains(s)){
                    //if (!s.getCompanyId().equals(vo.getPcompanyId())) {
                        Departure trans = JSONUtil.trans(strDepMap.get(s), Departure.class);
                        trans.setId(null);
                        trans.setCompanyId(a);
                        departureMapper.insert(trans);
                        //nowDepartureIdList.add(s.getId());
                        departureIdMap.put(strDepMap.get(s).getId(),trans.getId());
                }else{
                    //查询已存在的始发站
                    String[] arr = s.split(",");
                    Departure d = new Departure();
                    d.setdProvince(arr[0]);
                    d.setdCity(arr[1]);
                    d.setdArea(arr[2]);
                    d.setdName(arr[3]);
                    d.setdType(Integer.valueOf(arr[4]));
                    d.setCompanyId(a);
                    Departure result = departureMapper.selectByEntity(d);

                    departureIdMap.put(strDepMap.get(s).getId(),result.getId());
                }
            });

            //查询之前的关联关系列表
            //再将集结发起公司没有的始发站复制到始发站表,并创建departure_ticket关系
            List<TicketDeparture> oldTicketDepartureList = ticket.getTicketDepartureList();
            List<TicketDeparture> newTicetDepartureList = new ArrayList<>();
            oldTicketDepartureList.stream().forEach(s->{
                if(departureIdMap.get(s.getDepartueId())!=null){
                    s.setId(null);
                    s.setTicketId(ticketIdMap.get(s.getTicketId()));
                    s.setDepartueId(departureIdMap.get(s.getDepartueId()));
                    s.setCreateUser(vo.getPuserId());
                    newTicetDepartureList.add(s);
                }
            });
            if(newTicetDepartureList!=null && newTicetDepartureList.size()>0){
                ticketDepartureMapper.saveTicketDepartureBash(newTicetDepartureList);
            }
        });

        return num;
    }

    @Override
    public int deleteByFromTicketId(Long id) {
        return ticketMapper.deleteByFromTicketId(id);
    }

    @Override
    @Transactional
    public void synchroGatherTickets(Ticket ticket,TicketSaveOrUpdateVo vo) {
        //查询该票对应的集结票
        List<Ticket> list = ticketMapper.selectGatherTicketList(ticket.getId());
        Ticket t = ticketMapper.selectByIdOnly(ticket.getId());
        List<Ticket> newList = new ArrayList<>();
        list.stream().forEach(s->{
            Ticket trans = JSONUtil.trans(ticket, Ticket.class);
            trans.setId(s.getId());
            trans.settCompanyId(s.gettCompanyId());
            trans.settMarketPrice(null);
            newList.add(trans);
        });
        if(newList.size()>0){
            //updateBash
            int result = ticketMapper.updateTicketBash(newList);
        }

        //同步始发站,始发站,始发站票关联关系,班期票关联关系
        //复制班期票关联关系
        CopyGatherTicketsVO trans = JSONUtil.trans(vo, CopyGatherTicketsVO.class);
        trans.setProductId(t.gettProductId());
        list.stream().forEach(s->{
            //组装idlist和ticketIdMap
            List<Long> idList = new ArrayList<>();
            idList.add(t.getId());
            Map<Long,Long> ticketIdMap = new HashMap<>();
            ticketIdMap.put(t.getId(),s.getId());
            //复制departure和关联关系
            copyDepartureTicketAndDeparture(s.gettCompanyId(),ticket,trans, idList, ticketIdMap);
        });

    }

    private void copyScheduleTicket(CopyGatherTicketsVO vo, List<Long> idList, Map<Long, Long> ticketIdMap) {
        List<ScheduleTicket> scheduleTicketList = scheduleTicketMapper.selectOldScheduleTicektList(idList);
        //过滤班期已经过期的额票
        List<Long> sIdList =  scheduleTicketMapper.selectEffectScheduleIdList(idList);
        List<ScheduleTicket> filterList = scheduleTicketList.stream().filter(s -> sIdList.contains(s.getStScheduleId())).collect(Collectors.toList());
        filterList.stream().forEach(s->{
            s.setId(null);
            s.setStTicketId(ticketIdMap.get(s.getStTicketId()));
            s.setCreateUser(vo.getPuserId());
        });
        scheduleTicketMapper.insertBash(filterList);
    }


}
