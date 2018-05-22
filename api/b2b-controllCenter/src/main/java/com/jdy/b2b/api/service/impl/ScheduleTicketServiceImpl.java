package com.jdy.b2b.api.service.impl;

import com.jdy.b2b.api.common.BaseService;
import com.jdy.b2b.api.dao.ScheduleTicketMapper;
import com.jdy.b2b.api.dao.diy.ScheduleTicketMapperDiy;
import com.jdy.b2b.api.dao.product.ProductMapper;
import com.jdy.b2b.api.dao.ticket.TicketMapper;
import com.jdy.b2b.api.model.Schedule;
import com.jdy.b2b.api.model.ScheduleTicket;
import com.jdy.b2b.api.model.diy.TicketDTO;
import com.jdy.b2b.api.model.product.Product;
import com.jdy.b2b.api.model.ticket.Ticket;
import com.jdy.b2b.api.service.ScheduleTicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static org.springframework.util.CollectionUtils.isEmpty;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/19 15:01
 */
@Service
public class ScheduleTicketServiceImpl extends BaseService implements ScheduleTicketService {

    @Autowired
    ScheduleTicketMapperDiy scheduleTicketMapperDiy;
    @Autowired
    ScheduleTicketMapper scheduleTicketMapper;
    @Autowired
    TicketMapper ticketMapper;
    @Autowired
    private ProductMapper productMapper;

    /**
     * 产品所属票列表和该班期选中的票 合并处理
     */
    @Override
    public List<TicketDTO> selectTicketListUnionAll(ScheduleTicket rec,Integer flag) {
        //flag 1:集结 2:产品列表
        List<TicketDTO> list = scheduleTicketMapperDiy.selectTicketListUnionAll(rec);
        //TODO 如果是来自集结列表 则只显示区域已经勾选的票
        if (Integer.valueOf(1).equals(flag)) {
            Product p = productMapper.selectByPrimaryKey(rec.getStProductId());
            List<Long> areaTicketIds = scheduleTicketMapperDiy.selectTicketListByCompanyIdAndScheduleId(p.getCompanyId(),rec.getStScheduleId());
            list = list.stream().filter(s -> areaTicketIds.contains(s.gettFromTicketId())).collect(Collectors.toList());
        }

        List<TicketDTO> chosenList = list.stream().filter(ticketDTO -> ticketDTO.getChosen() == 1).collect(Collectors.toList());
        List<TicketDTO> notChosenList = list.stream().filter(ticketDTO -> ticketDTO.getChosen() != 1).collect(Collectors.toList());
        List<Long> chosenIds = new ArrayList<>();
        chosenList.forEach(t -> {
            chosenIds.add(t.getId());
            chosenIds.add(t.gettSourceId());
        });
        //判断sourceId，如果不为空，则说明它是处理逻辑添加的新增票，用sourceId覆盖它的id，因为它不是实际存在的票，避免前台跟新时把该虚拟票作为实际票回传回来
        chosenList.forEach(ticket -> {
            if (!Objects.isNull(ticket.gettSourceId())) ticket.setId(ticket.gettSourceId());
        });
        List<TicketDTO> filtered = notChosenList.stream().filter(t -> !chosenIds.contains(t.getId())).collect(Collectors.toList());
        chosenList.addAll(filtered);
        return chosenList;
    }

    /**
     * 保存班期和票的关联关系
     */
    @Transactional
    @Override
    public void saveScheduleTicketInfo(List<Schedule> schedules, List<Ticket> tickets) {
        List<ScheduleTicket> stList = new ArrayList<>(tickets.size());
        for (Schedule sch : schedules) {
            for (Ticket t : tickets) {
                // 班期指向源票
                addTicketToScheduleTicketList(sch, t, stList);
            }
        }

        // 批量保存班期&票对应信息
        int i = scheduleTicketMapperDiy.insertBatch(stList);
        if (i != stList.size()) {
            throw new RuntimeException("批量保存班期和票关系失败！");
        }
    }

    /**
     * 清除自定义票价
     */
    @Transactional
    @Override
    public void clearCustomScheduleTickets(Long id) {
        List<Map> relations = scheduleTicketMapperDiy.selectScheduleTicketIdRelations(id);
        if (isEmpty(relations)) {
            return;
        }
        for (Map map : relations) {
            if (map.get("t_source_id") != null) {
                int i = ticketMapper.deleteByPrimaryKey((Long) map.get("t_id"));
                if (i != 1) {
                    throw new RuntimeException("删除自定义票价记录失败，id=" + map.get("t_id"));
                }
                ScheduleTicket st = new ScheduleTicket();
                st.setId((Long) map.get("st_id"));
                st.setStTicketId((Long) map.get("t_source_id"));
                int j = scheduleTicketMapper.updateByPrimaryKeySelective(st);
                if (j != 1) {
                    throw new RuntimeException("更新班期票的关系记录失败！");
                }
            }
        }

    }

    private void addTicketToScheduleTicketList(Schedule sch, Ticket t, List<ScheduleTicket> stList) {
        ScheduleTicket st = new ScheduleTicket();
        st.setStProductId(sch.getsProductId());
        st.setStScheduleId(sch.getId());
        st.setStTicketId(t.getId());
        st.settMarketPrice(t.gettMarketPrice());
        st.settStock(t.gettStock());
        st.setUpdateTime(t.getUpdateTime());
        st.setUpdateUser(t.getUpdateUser());
        stList.add(st);
    }
}
