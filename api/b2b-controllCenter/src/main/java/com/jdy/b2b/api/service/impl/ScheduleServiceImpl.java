package com.jdy.b2b.api.service.impl;

import cn.jdytrip.sp.data.warehouse.entity.ScheduleInfoVO;
import com.alibaba.fastjson.JSONObject;
import com.github.pagehelper.PageHelper;
import com.jdy.b2b.api.aop.SetUserIdToThreadLocalAOP;
import com.jdy.b2b.api.common.*;
import com.jdy.b2b.api.dao.CompanyMapper;
import com.jdy.b2b.api.dao.ScheduleMapper;
import com.jdy.b2b.api.dao.diy.ScheduleMapperDiy;
import com.jdy.b2b.api.dao.diy.ScheduleTicketMapperDiy;
import com.jdy.b2b.api.dao.product.ProductAssembleCompanyMapper;
import com.jdy.b2b.api.dao.product.ProductMapper;
import com.jdy.b2b.api.dao.schedule.ScheduleSettingMapper;
import com.jdy.b2b.api.dao.ticket.TicketMapper;
import com.jdy.b2b.api.dao.user.UserMapper;
import com.jdy.b2b.api.enums.ProductTypePymEnum;
import com.jdy.b2b.api.model.*;
import com.jdy.b2b.api.model.diy.*;
import com.jdy.b2b.api.model.front.ProductScheduleDto;
import com.jdy.b2b.api.model.front.ScheduleCalendarRequestParam;
import com.jdy.b2b.api.model.front.ScheduleListRequestParam;
import com.jdy.b2b.api.model.product.Product;
import com.jdy.b2b.api.model.schedule.ScheduleSetting;
import com.jdy.b2b.api.model.scheduleGroup.ScheduleGuestDO;
import com.jdy.b2b.api.model.scheduleplan.*;
import com.jdy.b2b.api.model.station.Departure;
import com.jdy.b2b.api.model.ticket.Ticket;
import com.jdy.b2b.api.model.user.User;
import com.jdy.b2b.api.service.BusService;
import com.jdy.b2b.api.service.ScheduleService;
import com.jdy.b2b.api.service.ScheduleSettingService;
import com.jdy.b2b.api.service.ScheduleTicketService;
import com.jdy.b2b.api.util.MQAssembleService;
import com.jdy.b2b.api.util.MQTransformationUtils;
import com.jdy.b2b.api.vo.schedule.ScheduleSaveVO;
import com.jdy.b2b.api.vo.schedule.ScheduleUpdateVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.task.TaskExecutor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Assert;
import org.springframework.util.CollectionUtils;

import java.lang.reflect.Field;
import java.text.ParseException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.apache.commons.lang3.StringUtils.split;
import static org.apache.commons.lang3.time.DateUtils.parseDate;
import static org.springframework.beans.BeanUtils.copyProperties;
import static org.springframework.util.CollectionUtils.isEmpty;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/7/18 14:43
 */
@Service
public class ScheduleServiceImpl extends BaseService implements ScheduleService {

    @Autowired
    ProductMapper productMapper;
    @Autowired
    ScheduleMapper scheduleMapper;
    @Autowired
    ScheduleMapperDiy scheduleMapperDiy;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    ScheduleTicketService scheduleTicketService;
    @Autowired
    ScheduleTicketMapperDiy scheduleTicketMapperDiy;
    @Autowired
    BusService busService;
    @Autowired
    private ScheduleSettingService scheduleSettingService;
    @Autowired
    TicketMapper ticketMapper;
    @Autowired
    ProductAssembleCompanyMapper productAssembleCompanyMapper;
    @Autowired
    private ScheduleSettingMapper scheduleSettingMapper;
    @Autowired
    CompanyMapper companyMapper;
    @Value("${product_notify_url}")
    private String productNotifyUrl;
    @Autowired
    TaskExecutor taskExecutor;

    @Autowired
    MQAssembleService mqAssembleService;

    @Override
    public List<ScheduleDTO> selectScheduleList(ScheduleQuery scheduleQuery) {
        return scheduleMapperDiy.selectScheduleList(scheduleQuery);
    }

    @Override
    public ScheduleWithTicketsDTO selectScheduleWithTickets(Long id,Integer flag) {
        Schedule schedule = scheduleMapper.selectByPrimaryKey(id);
        if (schedule == null) {
            return null;
        }
        ScheduleWithTicketsDTO scheduleDTO = new ScheduleWithTicketsDTO();
        copyProperties(schedule, scheduleDTO);

        Product p = productMapper.selectByPrimaryKey(schedule.getsProductId());
        BaseVO baseUserInfo = (BaseVO) ThreadLocalUtil.getData(SetUserIdToThreadLocalAOP.tl);

        ScheduleTicket rec = new ScheduleTicket();
        rec.setStProductId(schedule.getsProductId());
        rec.setStScheduleId(schedule.getId());
        rec.setSrcCompanyId(p.getCompanyId());
        //flag 1:集结产品列表  2:产品列表
        //如果是来自产品列表菜单,则companyId设置为产品所属公司
        //如果是集结产品菜单,则设置为当前公司
        if(Integer.valueOf(1).equals(flag)){
            rec.setDstCompanyId(baseUserInfo.getPcompanyId());
        }else{
            rec.setDstCompanyId(p.getCompanyId());
        }

        //如果团期里有设置 出发时间，以此为准。
        ScheduleSetting scheduleSetting = scheduleSettingMapper.selectByScheduleIdAndCompanyId(schedule.getId(), baseUserInfo.getPcompanyId());
        if(!Objects.isNull(scheduleSetting)){
            scheduleDTO.setsCalendar(LocalDateTimeUtils.LocalDateTime2Date(scheduleSetting.getStartDate()));
            if(Objects.nonNull(scheduleSetting.getMusterTime()))
                scheduleDTO.setsLeaveTime(LocalDateTimeUtils.LocalDateTime2Date(scheduleSetting.getMusterTime()));
        }

        List<TicketDTO> list = scheduleTicketService.selectTicketListUnionAll(rec,flag);
        if (isEmpty(list)) {
            return scheduleDTO;
        } else {
            TicketDTO t = list.get(0);
            Long cfdId;
            Long sfzId;
            if(t.gettFromTicketId() == null) {
                sfzId = t.getId();
                cfdId = sfzId;
            } else {
                cfdId = t.getId();
                sfzId = t.gettFromTicketId();
            }
            Ticket sfT = new Ticket();
            sfT.setId(sfzId);
            Departure s = ticketMapper.queryForOutTicketList(sfT).get(0).getDepartureList().get(0);
            scheduleDTO.setShifa(s.getdCity()+"-"+s.getdName());//始发站
            if(cfdId.equals(sfzId)) {
                scheduleDTO.setChufa(scheduleDTO.getShifa());//出发地
            } else {
                Ticket cfT = new Ticket();
                cfT.setId(cfdId);
                Departure c = ticketMapper.queryForOutTicketList(cfT).get(0).getDepartureList().get(0);
                scheduleDTO.setChufa(c.getdCity()+"-"+c.getdName());
            }
        }
        scheduleDTO.setTickets(list);

        return scheduleDTO;
    }

    /**
     * 批量保存班期信息，包含票的选择
     */
    @Transactional
    @Override
    public List<Long> batchSaveScheduleInfo(ScheduleSaveVO scheduleSaveVO) throws ParseException {
        Assert.isTrue(scheduleSaveVO.getId() == null, "班期保存参数错误");

        Product product = productMapper.selectByPrimaryKey(scheduleSaveVO.getsProductId());
        if (product == null) {
            throw new RuntimeException("指定的产品路线不存在！");
        }
        User user = userMapper.queryForUserByIdSingle(product.getCreateUser());
        ScheduleQuery scheduleQuery = new ScheduleQuery();
        scheduleQuery.setsProductId(scheduleSaveVO.getsProductId());
        scheduleQuery.setsScheduleNo(scheduleSaveVO.getsScheduleNo());
        List<ScheduleDTO> savedSchedules = scheduleMapperDiy.selectScheduleList(scheduleQuery);
        Optional s = savedSchedules.stream().filter(schedule -> scheduleSaveVO.getCalendars().contains(DateTime.date2Str(schedule.getsCalendar(), null))).findAny();
        if (s.isPresent()) {
            throw new RuntimeException("同班期编号该出发时间已经存在，请检查!");
        }

        List<String> cals = scheduleSaveVO.getCalendars();
        List<Schedule> schedules = new ArrayList<>(cals.size());
        Map<String,ScheduleNumDTO> existSameDateScheduleMap = new HashMap<>();
        if (cals != null && cals.size()>0){
            existSameDateScheduleMap = scheduleMapper.selectExistNumByDate(cals);
        }
        scheduleSaveVO.setsStatus(0);
        // 批量保存班期
        for (String cal : cals) {
            Schedule sch = new Schedule();
            copyProperties(scheduleSaveVO, sch);
            int groupOrderIndex = 1;
            if (existSameDateScheduleMap.containsKey(cal)){

                groupOrderIndex = existSameDateScheduleMap.get(cal).getNum()+1;
            }
            //由于集结 班期中的团号是不可靠的，不应该生成，且下单要从schedule_setting中获取团号才对
            //sch.setsGroupOrderNo(generateGroupOrderNo(ProductTypePymEnum.getDescByValue(product.getpType()), product.getpDestinationPym(),cal,groupOrderIndex,user.getuNo()));
            sch.setsCalendar(parseDate(cal, "yyyy-MM-dd"));
            sch.setsWeekDay(DateTime.dayForWeek(sch.getsCalendar()));
            // setScheduleTotalSeatHoldLock(sch, scheduleSaveVO);/** 设置座位总数、预留总数、锁定总数 */
            schedules.add(sch);
        }
        batchSetReturnCalendar(schedules);

        int res = scheduleMapperDiy.insertBatch(schedules);
        if (res != schedules.size()) {
            throw new RuntimeException("保存班期信息失败！");
        }
        //TODO 同步结团数据到数据仓库
        schedules.forEach(schedule -> {
            taskExecutor.execute(() -> mqAssembleService.getMQClinet().syncScheduleInfo(MQTransformationUtils.transScheuleInfo(scheduleSettingMapper.queryScheduleInfo(null, null, schedule.getId()))));
        });

        scheduleSettingService.createNewScheduleSettingBySchedules(schedules);
        if(Objects.equals(product.getAscription().toString(),"1")){
            scheduleSettingService.createNewScheduleOnAssemblyProduct(schedules,product.getId());
        }

        // 如果有关联票
        List<Ticket> tickets = scheduleSaveVO.getTickets();
        if (!isEmpty(tickets)) {
            //保存班期&票的关联关系
            scheduleTicketService.saveScheduleTicketInfo(schedules, tickets);
            //TODO 同步在集结了此产品的公司 插入班期票关联关系
            queryAndSaveNewScheduleTicketInfo(schedules,tickets);
        }

        // 批量保存车辆信息
        //busService.batchSaveBusDTOs(schedules, scheduleSaveVO.getBusDTOS());
        List<Long> ids = schedules.stream().map(schedule -> schedule.getId()).collect(Collectors.toList());
        taskExecutor.execute(()->productNotify(0,product.getId(),3));
        return ids;
    }

    public static void main(String[] args) {
        Field[] fields = ScheduleInfoVO.class.getDeclaredFields();
        System.out.println(fields.length);
        for (int i = 0; i < fields.length; i++) {
            Field field = fields[i];
            String name = field.getName();
            String methodName = name.substring(0,1).toUpperCase() +  name.substring(1);
            System.out.println("scheduleVO.set" + methodName + "(schedule.get" + methodName + "());");
        }
    }


    private void batchSetReturnCalendar(List<Schedule> schedules) {
        Integer days = null;
        OneTuple<Integer> tuple = new OneTuple(days);
        //查询days
        if(!CollectionUtils.isEmpty(schedules) && Objects.nonNull(schedules.get(0).getsProductId())){
            Product p = productMapper.selectByPrimaryKey(schedules.get(0).getsProductId());
            days = p.getpDays();
            tuple.setA(days-1);
        }
        if(days!=null){
            schedules.stream().forEach(s->{
                Calendar c = Calendar.getInstance();
                c.setTime(s.getsCalendar());
                c.add(Calendar.DAY_OF_MONTH,tuple.getA());
                s.setsReturnCalendar(c.getTime());
            });
        }
    }

    private String generateGroupOrderNo(String productTypePym,String destinationPym, String date , Integer index, String uNo){
        StringBuffer sb = new StringBuffer();
        //线路类型 - 目的地 -
        sb.append(productTypePym).append("-").append(destinationPym).append("-");
        //线路类型 - 目的地 - 班期时间
        LocalDate localDate = LocalDate.parse(date);
        sb.append(localDate.format(DateTimeFormatter.ofPattern("yyMMdd")));
        //线路类型 - 目的地 - 班期时间 出团顺序号 -
        if (index<10){
            sb.append("0").append(index).append("-");
        }else{
            sb.append(index).append("-");
        }
        //线路类型 - 目的地 - 班期时间 出团顺序号 - 发布产品的员工编号
        if(uNo != null && uNo.length() >4){
            sb.append(uNo.substring(uNo.length() - 4,uNo.length()));
        }else{
            sb.append(uNo);
        }
        return sb.toString();
    }



    /**
     * 设置座位总数、预留总数、锁定总数
     */
    private void setScheduleTotalSeatHoldLock(Schedule sch, ScheduleSaveVO saveVO) {
        if (isEmpty(saveVO.getBusDTOS())) {
            sch.setsSeatTotal(saveVO.getsCarNum() * saveVO.getsCarSeats());
            sch.setsSeatHold(0);
            sch.setsSeatLock(0);
        } else {
            List<BusDTO> buses = saveVO.getBusDTOS();
            sch.setsSeatTotal(buses.stream().mapToInt(Bus::getbSeatsNum).sum());
            sch.setsSeatLock(buses.stream().map(bus -> isBlank(bus.getbSeatsLock()) ? "" : bus.getbSeatsLock()).mapToInt(str -> split(str, ",").length).sum());
            sch.setsSeatHold(buses.stream().mapToInt(bus -> isEmpty(bus.getBusHolds()) ? 0 : bus.getBusHolds().stream().mapToInt(h -> h.getbSeat() == null ? 0 : split(h.getbSeat(), ",").length).sum()).sum());
        }
    }

    /**
     * 更新班期信息
     */
    @Transactional
    @Override
    public void updateScheduleInfo(ScheduleUpdateVO sch) {
        if (sch.getsCalendar() != null) {
            sch.setsWeekDay(DateTime.dayForWeek(sch.getsCalendar()));
        }
        Schedule s = scheduleMapper.selectByPrimaryKey(sch.getId());
        Product p = productMapper.selectByPrimaryKey(s.getsProductId());

        if (s == null) {
            throw new RuntimeException("找不到【" + sch.getId() + "】对应的班期信息！");
        }
        int i = scheduleMapper.updateByPrimaryKeySelective(sch);
        if (i != 1) {
            throw new RuntimeException("更新班期信息失败！");
        }
        sch.setsProductId(s.getsProductId());

        if (sch.getTicketsChanged() == null || !sch.getTicketsChanged()) {
            return;
        }

        BaseVO baseUserInfo = (BaseVO) ThreadLocalUtil.getData(SetUserIdToThreadLocalAOP.tl);
        ScheduleTicket st = new ScheduleTicket();
        st.setStProductId(sch.getsProductId());
        st.setStScheduleId(sch.getId());
        st.setDstCompanyId(baseUserInfo.getPcompanyId());

        scheduleTicketMapperDiy.deleteScheduleTicketRecords(st);//删除本公司的票班期关系（会有集结票）
        //TODO 1.修改班期时先删除,后插入  2.新增班期时插入新的  3.集结时插入新的

        //TODO 如果是更新的是区域产品,同时删除集结方旧的关系
        queryAnddeleteGatherScheduleTicketRecords(st);
        List<Ticket> tickets = sch.getTickets();
        if (!isEmpty(tickets)) {
            Schedule schedule = new Schedule();
            copyProperties(sch, schedule);
            List<Schedule> schedules = new ArrayList<>();
            schedules.add(schedule);
            //TODO 如果是来自集结flag 如果是集结方编辑某班期,不能选择 区域方此班期未关联的票
            if(!sch.getFromProductListMenu()){
                //不能选择多余的
                List<Long> newIds = tickets.stream().map(a -> a.getId()).collect(Collectors.toList());
                Map map = new HashMap();
                map.put("scheduleId", sch.getId());
                map.put("ticketIds", newIds);
                List<Ticket> newTickets = ticketMapper.selectListByIds(map);
                List<Long> fromIds = newTickets.stream().map(a->a.gettFromTicketId()).collect(Collectors.toList());
                //查询区域方此班期下选择的票
                List<Long> oldIds = ticketMapper.selectOldTicketIdsByCompanyIdAndScheduleId(p.getCompanyId(),sch.getId());
                if (!oldIds.containsAll(fromIds)) {
                    throw new RuntimeException("选择了区域产品没有选择的票!");
                }
            }
            // 重新保存班期&票的关联关系
            scheduleTicketService.saveScheduleTicketInfo(schedules, tickets);
            //TODO 如果是来自区域flag 将集结了此产品的公司,同步插入新的班期票关系
            if(sch.getFromProductListMenu()){
                queryAndSaveNewScheduleTicketInfo(schedules,tickets);
            }
        }
        taskExecutor.execute(()->productNotify(s.getsStatus(),s.getsProductId(),sch.getsStatus()==s.getsStatus()?2:sch.getsStatus()));
    }

    /**
     *
     * @param status  当前行为   0恢复有效 1置为无效 2更新班期 3新增
     */
    private void productNotify(Integer oldStatus,Long productId,Integer status) {
        Product product = productMapper.selectByPrimaryKey(productId);
        if (product.getpStatus() == 0 || product.getpStatus() == 3){
            // 有效班期+置为无效    有效班期+更新班期        有效班期+新增班期     无效班期+恢复有效    通知分销
            if ((oldStatus ==0 && status ==1 )||(oldStatus == 0 && status ==2 ) || (oldStatus == 0 && status == 3) ||(oldStatus != 0 && status == 0)) {//班期为 正常状态
                    ProductNotify notify = new ProductNotify();
                    Company company = companyMapper.selectByCompanyId(product.getCompanyId());
                    notify.setCompanyId(company.getId());
                    notify.setCompanyName(company.getcName());
                    List<Long> ids = new ArrayList<>();
                    ids.add(productId);
                    notify.setProductIds(ids);
                    notify.setAction(4);//1线路信息；2行程信息；3票价管理；4班期管理,5产品
                    notify.setStatus(20);//10 新增; 20 更新; 30 票无效; 40 产品无效;
                    JSONObject jsonObject = EncodingObjectWithMd5Utils.encoding(notify);
                    String url = productNotifyUrl + "/channels/sp/product/getProductAlterNotice.do";
                    logger.info("班期变化通知分销的信息:"+jsonObject.toString());
                    JSONObject result = HttpClientUtils.httpPost(url, (Map) jsonObject);
                    logger.info("通知分销后的结果:"+result.toString());
                    Integer code = (Integer) result.get("code");
                    if (200!=code) {
                        String msg = (String) result.get("msg");
                        logger.error(msg);
                    }
            }
        }
    }

    private void queryAndSaveNewScheduleTicketInfo(List<Schedule> schedules,List<Ticket> tickets) {
        //查询集结了此商品的公司
        List<Long> companyIds = productAssembleCompanyMapper.selectCompanyIdsByProductIdOK(schedules.get(0).getsProductId());
        //查询每个公司下的对应此班期的票列表
        if(companyIds!=null && companyIds.size()>0){
            companyIds.stream().forEach(s->{
                //查询每个公司下 ticket对应的票集合
                List<Ticket> list = queryGatherTicketsByCompanyIdAndFromTicketList(s,tickets);
                if(!CollectionUtils.isEmpty(list)){
                    scheduleTicketService.saveScheduleTicketInfo(schedules, list);
                }
            });
        }
    }

    private List<Ticket> queryGatherTicketsByCompanyIdAndFromTicketList(Long companyId, List<Ticket> tickets) {
        List<Long> ids = tickets.stream().map(s -> s.getId()).collect(Collectors.toList());
        if(!CollectionUtils.isEmpty(ids)){
            List<Ticket> list = ticketMapper.queryTicketListByCompanyId(companyId,ids);
            return list;
        }else{
            return null;
        }
    }

    private void queryAnddeleteGatherScheduleTicketRecords(ScheduleTicket st) {
        //查询集结了此商品的公司
        List<Long> companyIds = productAssembleCompanyMapper.selectCompanyIdsByProductIdOK(st.getStProductId());
        if(companyIds!=null && companyIds.size()>0){
            scheduleTicketMapperDiy.deleteGatherScheduleTicketRecords(st.getStScheduleId(),companyIds);
        }

    }

    /**
     * 清除自定义票价
     */
    @Transactional
    @Override
    public void clearCustomScheduleTickets(Long id) {
        scheduleTicketService.clearCustomScheduleTickets(id);
    }

    @Override
    public List<ProductScheduleDto> selectProductScheduleList(ScheduleListRequestParam param) {
        return scheduleMapper.selectProductScheduleList(param);
    }

    @Override
    public List<ProductScheduleDto> selectScheduleCalendarList(ScheduleCalendarRequestParam param) {
        return scheduleMapper.selectScheduleCalendarList(param);
    }

    @Override
    public List<DepartureWithStopsDTO> selectDeparturesWithStops(ScheduleDepartsSearchVO vo) {
        return scheduleMapperDiy.selectDeparturesWithStops(vo);
    }

    @Override
    public List<Departure> selectDepartures(ScheduleDepartsSearchVO vo) {
        return scheduleMapperDiy.selectDepartures(vo);
    }

    @Override
    public void createSGroupOrderNo() {
        List<CreateGroupOrderDTO> list = scheduleMapper.selectNoGroupOrderNoSch();
        Map<String,List<CreateGroupOrderDTO>> map = new HashMap<>();
        for (CreateGroupOrderDTO dto : list){
            if (map.containsKey(dto.getsCalendar())){
                map.get(dto.getsCalendar()).add(dto);
            }else{
                map.put(dto.getsCalendar(),new ArrayList<CreateGroupOrderDTO>(){
                    {
                        add(dto);
                    }
                });
            }
        }
        List<Schedule> updateList = new ArrayList<>();
        for (List<CreateGroupOrderDTO> oneList : map.values()){
            for (int i = 0 ; i < oneList.size() ; i++){
                CreateGroupOrderDTO scheduleDTO = oneList.get(i);
                Schedule sch = new Schedule();
                sch.setId(oneList.get(i).getId());
                sch.setsGroupOrderNo(generateGroupOrderNo(ProductTypePymEnum.getDescByValue(scheduleDTO.getpType()),scheduleDTO.getpDestinationPym(),scheduleDTO.getsCalendar(),i+1 ,scheduleDTO.getuNo()));
                updateList.add(sch);
            }
        }
        scheduleMapper.batchUpdateGroupOrderNo(updateList);


    }

    @Override
    public List<ScheduleGuestDO> guestList(Long productId) {
        return scheduleMapper.guestList(productId);
    }


    @Override
    public List<ScheduleManagerDO> queryScheduleManagerList(ScheduleManagerQueryDTO scheduleManagerQueryDTO) {
        if(scheduleManagerQueryDTO.getCurrPage() == null || scheduleManagerQueryDTO.getCurrPage() == 0){
            scheduleManagerQueryDTO.setCurrPage(1);
        }
        PageHelper.startPage(scheduleManagerQueryDTO.getCurrPage(),scheduleManagerQueryDTO.getPageSize());
        List<ScheduleManagerDO> scheduleManagerDOList = scheduleMapper.selectScheduleManagerList(scheduleManagerQueryDTO);
        if(scheduleManagerDOList != null && scheduleManagerDOList.size()>0) {
            for(ScheduleManagerDO scheduleManagerDO : scheduleManagerDOList) {
                if(Objects.equals(scheduleManagerDO.getDestination(), null) || Objects.equals(scheduleManagerDO.getDestination(), "")) {
                    continue;
                }
                scheduleManagerDO.setDestination(scheduleManagerDO.getDestination().split(",")[0]);
            }
        }
        return scheduleManagerDOList;
    }

    @Override
    public List<ScheduleTouristsDO> queryTouristsListByScheduleId(ScheduleTouristsQueryDTO dto) {
        if(!Boolean.TRUE.equals(dto.getExport())) {
            if (dto.getCurrPage() == null || dto.getCurrPage() == 0) {
                dto.setCurrPage(1);
            }
            PageHelper.startPage(dto.getCurrPage(), dto.getPageSize());
        }
        return scheduleMapper.selectTouristsListByScheduleId(dto);
    }

    @Override
    public int updateByPrimaryKeySelective(Schedule schedule) {
        int result = this.scheduleMapper.updateByPrimaryKeySelective(schedule);
        if (result > 0) {
            taskExecutor.execute(() -> mqAssembleService.getMQClinet().syncScheduleInfo(MQTransformationUtils.transScheuleInfo(scheduleSettingMapper.queryScheduleInfo(null, null, schedule.getId()))));
        }
        return result;
    }

    @Override
    public Schedule selectByPrimaryKey(Long id) {
        return this.scheduleMapper.selectByPrimaryKey(id);
    }
}
