package com.jdy.b2b.api.service.impl;

import com.jdy.b2b.api.common.BaseService;
import com.jdy.b2b.api.common.LocalDateTimeUtils;
import com.jdy.b2b.api.dao.ScheduleMapper;
import com.jdy.b2b.api.dao.diy.OrderMapperDiy;
import com.jdy.b2b.api.dao.diy.ScheduleMapperDiy;
import com.jdy.b2b.api.dao.product.ProductAssembleCompanyMapper;
import com.jdy.b2b.api.dao.product.ProductMapper;
import com.jdy.b2b.api.dao.schedule.ScheduleFlightMapper;
import com.jdy.b2b.api.dao.schedule.ScheduleSettingMapper;
import com.jdy.b2b.api.dao.user.UserMapper;
import com.jdy.b2b.api.enums.ProductTypePymEnum;
import com.jdy.b2b.api.model.Schedule;
import com.jdy.b2b.api.model.ScheduleNumDTO;
import com.jdy.b2b.api.model.diy.OrderGroupConfirmation;
import com.jdy.b2b.api.model.diy.OrderTripDTO;
import com.jdy.b2b.api.model.diy.ScheduleDTO;
import com.jdy.b2b.api.model.diy.ScheduleQuery;
import com.jdy.b2b.api.model.product.Product;
import com.jdy.b2b.api.model.product.ProductAssembleCompany;
import com.jdy.b2b.api.model.schedule.ScheduleFlight;
import com.jdy.b2b.api.model.schedule.ScheduleSetting;
import com.jdy.b2b.api.model.schedule.ScheduleSettingDto;
import com.jdy.b2b.api.model.user.User;
import com.jdy.b2b.api.util.MQAssembleService;
import com.jdy.b2b.api.util.MQTransformationUtils;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.task.TaskExecutor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

import static org.apache.commons.lang3.time.DateFormatUtils.format;
import static org.springframework.util.CollectionUtils.isEmpty;

/**
 * Created by dugq on 2018/1/30.
 */
@Service
public class ScheduleSettingServiceImpl extends BaseService implements com.jdy.b2b.api.service.ScheduleSettingService {
    @Autowired
    private ScheduleSettingMapper scheduleSettingMapper;
    @Autowired
    private ScheduleFlightMapper scheduleFlightMapper;
    @Autowired
    private ScheduleMapper scheduleMapper;
    @Autowired
    private ScheduleMapperDiy scheduleMapperDiy;
    @Autowired
    private ProductMapper productMapper;
    @Autowired
    private OrderMapperDiy orderMapperDiy;
    @Autowired
    MQAssembleService mqAssembleService;
    @Autowired
    TaskExecutor taskExecutor;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private ProductAssembleCompanyMapper productAssembleCompanyMapper;

    private static ZoneId zoneId = ZoneId.systemDefault();

    @Override
    public int deleteByPrimaryKey(Long id) {
        return scheduleSettingMapper.deleteByPrimaryKey(id);
    }

    @Override
    public int insert(ScheduleSetting record) {
        int result = scheduleSettingMapper.insert(record);
        return result;
    }

    @Override
    public int insertSelective(ScheduleSetting record) {
        return scheduleSettingMapper.insertSelective(record);
    }

    @Override
    public ScheduleSetting selectByPrimaryKey(Long id) {
        return scheduleSettingMapper.selectByPrimaryKey(id);
    }

    @Override
    public int updateByPrimaryKeySelective(ScheduleSetting record) {
        int result = scheduleSettingMapper.updateByPrimaryKeySelective(record);
        this.syncScheduleInfo2DataWH(record.getId());
        return result;
    }

    @Override
    public int updateByPrimaryKey(ScheduleSetting record) {
        return scheduleSettingMapper.updateByPrimaryKey(record);
    }

    @Override
    @Transactional
    public int updateScheduleSetting(ScheduleSettingDto scheduleSettingDto) {
        int result = 0;
        ScheduleSetting scheduleSetting = scheduleSettingDto.getScheduleSetting();
        if(Objects.isNull(scheduleSetting.getId())){
            throw new RuntimeException("......");
        }
        List<ScheduleFlight> scheduleFlightList = scheduleSettingDto.getScheduleFlightList();
        Schedule schedule = scheduleMapper.selectByPrimaryKey(scheduleSetting.getScheduleId());
        if(Objects.isNull(schedule)){
            throw new RuntimeException("no such schedule");
        }

        //modify UnSupport Modify Filed
        scheduleSetting.setStartDate(schedule.getsCalendar().toInstant().atZone(zoneId).toLocalDateTime());
        scheduleSetting.setGroupNo(schedule.getsGroupOrderNo());
        modifyStartTime(schedule,scheduleFlightList,scheduleSetting);
        modifyArrivalTime(schedule, scheduleFlightList,scheduleSetting);

        scheduleFlightMapper.deleteByScheduleSettingId(scheduleSetting.getId());
        scheduleSettingMapper.updateByPrimaryKey(scheduleSetting);

        this.syncScheduleInfo2DataWH(scheduleSetting.getId());

        //insert flightList
        if(!CollectionUtils.isEmpty(scheduleFlightList)){
            for (ScheduleFlight scheduleFlight : scheduleFlightList){
                scheduleFlight.setScheduleSettingId(scheduleSetting.getId());
                scheduleFlightMapper.insertSelective(scheduleFlight);
            }
        }
        return result;
    }

    private void syncScheduleInfo2DataWH(Long id) {
        //TODO 同步结团数据到数据仓库
        taskExecutor.execute(() -> mqAssembleService.getMQClinet().syncScheduleInfo(MQTransformationUtils.transScheuleInfo(scheduleSettingMapper.queryScheduleInfo(id, null, null))));
    }

    @Override
    public ScheduleSettingDto selectScheduleSetting(Long scheduleSettingId) {
        ScheduleSetting scheduleSetting = scheduleSettingMapper.selectByPrimaryKey(scheduleSettingId);
        if(Objects.isNull(scheduleSetting)){
            throw new RuntimeException("no such Group!");
        }
        ScheduleSettingDto scheduleSettingDto = new ScheduleSettingDto();
        Schedule schedule = scheduleMapper.selectByPrimaryKey(scheduleSetting.getScheduleId());
        OrderGroupConfirmation product = scheduleSettingMapper.selectProductById(schedule.getsProductId());
        List<ScheduleFlight> scheduleFlights = scheduleFlightMapper.selectByScheduleSettingId(scheduleSettingId);
        scheduleSettingDto.setScheduleFlightList(scheduleFlights);
        if(CollectionUtils.isEmpty(scheduleSettingDto.getScheduleFlightList())){
            scheduleSettingDto.setScheduleFlightList(Collections.emptyList());
        }
        buildScheduleSettingDTO(scheduleSettingDto, schedule, product, scheduleSetting);
        return scheduleSettingDto;
    }

    private void buildScheduleSettingDTO(ScheduleSettingDto scheduleSettingDto, Schedule schedule, OrderGroupConfirmation product, ScheduleSetting scheduleSetting) {
        setToursitNum(schedule, scheduleSetting);
        List<OrderTripDTO> trips = getTrips(schedule.getsProductId(), schedule.getsCalendar());
        scheduleSettingDto.setScheduleSetting(scheduleSetting);
        scheduleSettingDto.setsCalendar(schedule.getsCalendar());
        scheduleSettingDto.setTrips(trips);
        scheduleSettingDto.setpCostExclude(product.getpCostExclude());
        scheduleSettingDto.setpCostInclude(product.getpCostInclude());
        scheduleSettingDto.setpDays(product.getpDays());
        scheduleSettingDto.setpNotes(product.getpNotes());
        scheduleSettingDto.setpSpecial(product.getpSpecial());
    }

    @Override
    @Transactional
    public List<ScheduleSetting> createNewScheduleSettingBySchedules(List<Schedule> schedules) {
        OrderGroupConfirmation product = scheduleSettingMapper.selectProductById(schedules.get(0).getsProductId());
        List<ScheduleSetting> scheduleSettings = new LinkedList<>();
        schedules.forEach(schedule -> {
            ScheduleSetting scheduleSetting = buildScheduleSetting(schedule, product,null);
            scheduleSettingMapper.insertSelective(scheduleSetting);
            scheduleSettings.add(scheduleSetting);
        });
        return scheduleSettings;
    }

    @Override
    public List<ScheduleSetting> createNewScheduleSettingByProductIdAndCompanyId(Long productId, Long companyId) {
        List scheduleSettingList  = new ArrayList();
        OrderGroupConfirmation product = scheduleSettingMapper.selectProductById(productId);
        ProductAssembleCompany productAssembleCompany = productAssembleCompanyMapper.selectByProductIdAndCompanyId(productId, companyId);
        ScheduleQuery param = new ScheduleQuery();
        param.setsProductId(productId);
        List<ScheduleDTO> scheduleList = scheduleMapperDiy.selectScheduleList(param);
        scheduleList.forEach(scheduleDTO -> {
            ScheduleSetting scheduleSetting = buildScheduleSetting(scheduleDTO, product,productAssembleCompany.getAssembleUser());
            scheduleSettingList.add(scheduleSetting);
            scheduleSettingMapper.insertSelective(scheduleSetting);
        });
        return scheduleSettingList;
    }

    @Override
    @Transactional
    public ScheduleSetting createNewScheduleSettingByScheduleIdAndCompanyId(Long  scheduleId, Long companyId) {
        Schedule schedule = scheduleMapper.selectByPrimaryKey(scheduleId);
        OrderGroupConfirmation product = scheduleSettingMapper.selectProductById(schedule.getsProductId());
        ProductAssembleCompany productAssembleCompany = productAssembleCompanyMapper.selectByProductIdAndCompanyId(schedule.getsProductId(), companyId);
        ScheduleSetting scheduleSetting = buildScheduleSetting(schedule, product,productAssembleCompany.getAssembleUser());
        scheduleSettingMapper.insertSelective(scheduleSetting);
        return scheduleSetting;
    }

    @Override
    @Transactional
    public int updateDepartureStatus(ScheduleSetting scheduleSetting) {
        int i = scheduleSettingMapper.updateDepartureStatus(scheduleSetting);
        this.syncScheduleInfo2DataWH(scheduleSetting.getId());
        return i;
    }

    @Override
    public int findReturnSchedulesAndModify() {
        List<ScheduleSetting> scheduleSettings = scheduleSettingMapper.selectAllStartedSchedule();
        if(!CollectionUtils.isEmpty(scheduleSettings)){
            LocalDateTime now = LocalDateTime.now();
          scheduleSettings.forEach(scheduleSetting -> {
                if (scheduleSetting.getReturnDate().isBefore(now)) {
                    scheduleSetting.setDepartureStatus((byte) 3);
                    scheduleSettingMapper.updateByPrimaryKeySelective(scheduleSetting);
                }
            });
        }
        return 0;
    }

    @Override
    public int createNewScheduleOnAssemblyProduct(List<Schedule> schedules,long productId) {
        List<ProductAssembleCompany> productAssembleCompanies = productAssembleCompanyMapper.selectByProductId(productId);
        OrderGroupConfirmation product = scheduleSettingMapper.selectProductById(productId);
        productAssembleCompanies.forEach(productAssembleCompany -> schedules.forEach(schedule -> {
            ScheduleSetting scheduleSetting = buildScheduleSetting(schedule, product,productAssembleCompany.getAssembleUser());
            scheduleSettingMapper.insertSelective(scheduleSetting);
        }));
        return schedules.size();
    }

    /**
     *
     * @param schedule 班期
     * @param product 产品信息
     * @param userId 创建人
     * @return
     */
    private ScheduleSetting buildScheduleSetting(Schedule schedule, OrderGroupConfirmation product,Long userId) {
        String date = DateFormatUtils.format(schedule.getsCalendar(),"yyyy-MM-dd");
        List cals = new LinkedList();
        cals.add(date);
        Product product1 = productMapper.selectByPrimaryKey(schedule.getsProductId());
        if (product == null) {
            throw new RuntimeException("指定的产品路线不存在！");
        }
        User user = userMapper.queryForUserByIdSingle(Objects.isNull(userId)?product1.getCreateUser():userId);
        Map<String,ScheduleNumDTO> existSameDateScheduleMap = scheduleMapper.selectExistNumByDate(cals);
        ScheduleSetting scheduleSetting;
        scheduleSetting = new ScheduleSetting();
        scheduleSetting.setCompanyId(user.getuCompanyId());
        scheduleSetting.setCompanyName(product.getoSalerCompanyName());
        scheduleSetting.setProductName(product.getpName());
        scheduleSetting.setScheduleId(schedule.getId());
        scheduleSetting.setStartDate(schedule.getsCalendar().toInstant().atZone(zoneId).toLocalDateTime());
        LocalDateTime returnDate = schedule.getsCalendar().toInstant().atZone(zoneId).toLocalDateTime().plusDays(product.getpDays()).minusSeconds(1);
        scheduleSetting.setReturnDate(returnDate);
        scheduleSetting.setUserPhone(product.getSalerPhone());
        scheduleSetting.setUserName(product.getoSalerName());

        int groupOrderIndex = 1;
        if (existSameDateScheduleMap.containsKey(date)){

            groupOrderIndex = existSameDateScheduleMap.get(date).getNum()+1;
        }
        scheduleSetting.setGroupNo(generateGroupOrderNo(ProductTypePymEnum.getDescByValue(product.getpType()), product1.getpDestinationPym(),date,groupOrderIndex,user.getuNo()));
        scheduleSetting.setDepartureStatus((byte) -1);
        return scheduleSetting;
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
        if (uNo!= null && uNo.length() > 4){
            sb.append(uNo.substring(uNo.length() - 4,uNo.length()));
        }else{
            sb.append(uNo);
        }
        return sb.toString();
    }

    private void setToursitNum(Schedule schedule, ScheduleSetting scheduleSetting) {
        List<Map> list = orderMapperDiy.selectTouristNum(schedule.getId());
        int adult = 0;
        int child = 0;
        for (Map map : list){
            if ((int)map.get("order_type") == 0){
                adult = Integer.valueOf(map.get("num").toString());
            }
            if ((int)map.get("order_type") == 1){
                child = Integer.valueOf(map.get("num").toString());
            }
        }
        scheduleSetting.setAdultTouristsNum(adult);
        scheduleSetting.setChildTouristsNum(child);
    }


    private List<OrderTripDTO> getTrips(Long productId,Date sCalendar){
        List<OrderTripDTO> trips = scheduleSettingMapper.selectTripsByProductId(productId);
        if(CollectionUtils.isEmpty(trips)){
            return Collections.emptyList();
        }
        List<OrderTripDTO> nTrips = trips.stream().filter(t -> {
            String calendar = format(sCalendar, "yyyy-MM-dd");
            return t.gettType() == 1
                    && t.getTcStartDay().compareTo(calendar) <= 0
                    && t.getTcEndDay().compareTo(calendar) >= 0;
        }).collect(Collectors.toList());// 判断是否存在生效的补充行程
        List<OrderTripDTO> collect = trips.stream().filter(t -> t.gettType() == 0)
                .collect(Collectors.toList());
        if (!isEmpty(nTrips)) {// 如果存在则使用该系列补充行程
            return nTrips;
        } else {// 如果不存在则使用默认行程
           return collect;
        }
    }

    //修改回团日期，根据交通信息返回日期判断
    private void modifyArrivalTime(Schedule schedule, List<ScheduleFlight> scheduleFlightList,ScheduleSetting scheduleSetting) {
        if(CollectionUtils.isEmpty(scheduleFlightList)){
            return;
        }
        scheduleFlightList.sort(Comparator.comparing(scheduleFlight -> scheduleFlight.getArrivalTime()));
        ScheduleFlight lastScheduleFlight = scheduleFlightList.get(scheduleFlightList.size() - 1);
        if(Objects.equals(lastScheduleFlight.getLineType(),(byte)2)){
            LocalDateTime arrivalDate = lastScheduleFlight.getArrivalTime();
            scheduleSetting.setReturnDate(arrivalDate);
        }else{
            Product product = productMapper.selectByPrimaryKey(schedule.getsProductId());
            LocalDateTime returnDate = LocalDateTimeUtils.dateToLocalDateTime(schedule.getsCalendar()).plusDays(product.getpDays()-1);
            scheduleSetting.setReturnDate(returnDate);
        }
    }

    private void modifyStartTime(Schedule schedule, List<ScheduleFlight> scheduleFlightList,ScheduleSetting scheduleSetting) {
        if(CollectionUtils.isEmpty(scheduleFlightList)){
            return;
        }
        scheduleFlightList.sort(Comparator.comparing(scheduleFlight -> scheduleFlight.getArrivalTime()));
        ScheduleFlight firstScheduleFlight = scheduleFlightList.get(0);
        if(Objects.equals(firstScheduleFlight.getLineType(),(byte)0)){
            LocalDateTime startDate = firstScheduleFlight.getFlightTime();
            scheduleSetting.setStartDate(startDate);
        }else{
            LocalDateTime oldStartDate = schedule.getsCalendar().toInstant().atZone(zoneId).toLocalDateTime();
            scheduleSetting.setStartDate(oldStartDate);
        }
    }
    @Scheduled(initialDelay = 1000 * 60, fixedDelay = 1000 * 60*5)//时间间隔5分钟
    public void autoFinishScheduleSetting(){
        findReturnSchedulesAndModify();
    }
}
