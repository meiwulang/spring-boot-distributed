package com.jdy.b2b.api.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.NumberFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.github.pagehelper.PageInfo;
import com.jdy.b2b.api.common.BaseService;
import com.jdy.b2b.api.common.OneTuple;
import com.jdy.b2b.api.dao.DictionariesMapper;
import com.jdy.b2b.api.dao.scheduleplan.SchedulePlanMapper;
import com.jdy.b2b.api.model.scheduleplan.CurrentPageTotalDO;
import com.jdy.b2b.api.model.scheduleplan.SchedulePlan;
import com.jdy.b2b.api.model.scheduleplan.SchedulePlanAllSumDO;
import com.jdy.b2b.api.model.scheduleplan.SchedulePlanCateExpendDO;
import com.jdy.b2b.api.model.scheduleplan.SchedulePlanCountDO;
import com.jdy.b2b.api.model.scheduleplan.SchedulePlanDO;
import com.jdy.b2b.api.model.scheduleplan.SchedulePlanDetailQueryDO;
import com.jdy.b2b.api.model.scheduleplan.SchedulePlanDetailQueryDTO;
import com.jdy.b2b.api.model.scheduleplan.SchedulePlanExportDO;
import com.jdy.b2b.api.model.scheduleplan.SchedulePlanExportProductCountDO;
import com.jdy.b2b.api.model.scheduleplan.SchedulePlanManage;
import com.jdy.b2b.api.model.scheduleplan.SchedulePlanManageCountDO;
import com.jdy.b2b.api.model.scheduleplan.SchedulePlanManageDO;
import com.jdy.b2b.api.model.scheduleplan.SchedulePlanManageDTO;
import com.jdy.b2b.api.model.scheduleplan.SchedulePlanManageResult;
import com.jdy.b2b.api.model.scheduleplan.SchedulePlanNewResult;
import com.jdy.b2b.api.model.scheduleplan.SchedulePlanPageSumDO;
import com.jdy.b2b.api.model.scheduleplan.SchedulePlanQueryDO;
import com.jdy.b2b.api.model.scheduleplan.SchedulePlanQueryDTO;
import com.jdy.b2b.api.model.scheduleplan.SchedulePlanResult;
import com.jdy.b2b.api.model.scheduleplan.SinglePayedSchedulePlan;
import com.jdy.b2b.api.model.scheduleplan.SingleReserveSchedulePlan;
import com.jdy.b2b.api.model.scheduleplan.TotalPageDO;
import com.jdy.b2b.api.service.SchedulePlanService;

/**
 * Created by yangcheng on 2017/12/5.
 */
@Service
public class SchedulePlanServiceImpl extends BaseService implements SchedulePlanService {
    @Autowired
    private SchedulePlanMapper schedulePlanMapper;
    @Autowired
    private DictionariesMapper dictionariesMapper;

    @Override
    public SchedulePlanNewResult newPlanList(SchedulePlanQueryDTO trans) {
        SchedulePlanNewResult result = new SchedulePlanNewResult();

        //查询基本信息
        List<SchedulePlanQueryDO> list = schedulePlanMapper.newPlanList(trans);
        if(list==null || list.size()==0){
            return result;
        }
        //统计本页查询的班期对应的scheduleId
        List<Long> ids = new ArrayList<>();
        list.stream().forEach(s->{
            ids.add(s.getScheduleId());
        });

        //查询每个班期列表数据对应的分类收入信息 根据班期id查询
        List<SchedulePlanCateExpendDO> cateList = schedulePlanMapper.getCateListOfEverySchedule(ids);

        Map<Long, List<SchedulePlanCateExpendDO>> scheduleMap = cateList.stream().collect(Collectors.groupingBy(SchedulePlanCateExpendDO::getScheduleId));

        //将map与基本信息对应
        //设置支出合计,毛利等需要计算的字段
        NumberFormat nf = NumberFormat.getPercentInstance();
        nf.setMaximumFractionDigits(2);//这个1的意识是保存结果到小数点后几位，但是特别声明：这个结果已经先＊100了。

        list.stream().forEach(s->{
            List<SchedulePlanCateExpendDO> cateExpendDOList  = scheduleMap.get(s.getScheduleId());
            s.setList(cateExpendDOList);
            OneTuple<BigDecimal> oneTuple = new OneTuple(BigDecimal.valueOf(0,2));
            if(cateExpendDOList!=null){
            	cateExpendDOList.stream().forEach(a->{
                    a.setStringCateExpend(a.getCateExpend().add(BigDecimal.valueOf(0,2)).toString());
                });
            }

            if(cateExpendDOList!=null && cateExpendDOList.size()>0){
                cateExpendDOList.stream().forEach(a->{
                    oneTuple.setA(oneTuple.getA().add(a.getCateExpend()));
                });
            }
            s.setStringhSystemIncome(s.getSystemIncome().toString());
            s.setStringExpendSum(oneTuple.getA().toString());
            s.setStringGrossProfit(s.getSystemIncome().subtract(oneTuple.getA()).toString());
            BigDecimal divide = (s.getSystemIncome().subtract(oneTuple.getA())).divide(s.getSystemIncome(),4, RoundingMode.HALF_UP);
            s.setGrossRate(nf.format(divide));
        });

        //TODO 组织统计数据
        SchedulePlanCountDO countDO = new SchedulePlanCountDO();
        OneTuple<Integer> oneTuple = new OneTuple(0);
        OneTuple<BigDecimal> incomSumTuple = new OneTuple(BigDecimal.valueOf(0,2));
        OneTuple<BigDecimal> expendSumTuple = new OneTuple(BigDecimal.valueOf(0,2));
        list.stream().forEach(s->{
            oneTuple.setA(oneTuple.getA()+s.getPeopleNum());
            incomSumTuple.setA(incomSumTuple.getA().add(s.getSystemIncome()));

            OneTuple<BigDecimal> singleExpend = new OneTuple(BigDecimal.valueOf(0,2));
            List<SchedulePlanCateExpendDO> list2 = s.getList();
			if(list2!=null){list2.stream().forEach(a->{
                singleExpend.setA(singleExpend.getA().add(a.getCateExpend()));
            });}
            expendSumTuple.setA(expendSumTuple.getA().add(singleExpend.getA()));
        });
        countDO.setPeopleNum(oneTuple.getA());
        countDO.setStringSystemIncome(incomSumTuple.getA().toString());
        countDO.setStringExpendSum(expendSumTuple.getA().toString());

        countDO.setStringGrossProfit(incomSumTuple.getA().subtract(expendSumTuple.getA()).toString());
        countDO.setGrossRate(nf.format((incomSumTuple.getA().subtract(expendSumTuple.getA())).divide(incomSumTuple.getA(),4,RoundingMode.HALF_UP)));

        //组装返回数据结构

        result.setCountDO(countDO);
        result.setList(list);

        return result;
    }


    @Override
    public List<SchedulePlanDetailQueryDO> planDetailList(SchedulePlanDetailQueryDTO trans) {
        List<SchedulePlanDetailQueryDO> list = null;
        Integer flag = trans.getFlag();
        if(flag==null){
            list = schedulePlanMapper.planDetailList(trans);
        } else if (flag.equals(Integer.valueOf(0))) {
            list = schedulePlanMapper.planDetailListReserve(trans);
        } else if (flag.equals(Integer.valueOf(1))) {
            list = schedulePlanMapper.planDetailListPayed(trans);
        }


        return list;
    }

    @Override
    public Map<String, Integer> getProductCountBeforeExport(SchedulePlanManageDTO trans) {
        Map<String,Integer> map = new HashMap<>();
        List<SchedulePlanExportProductCountDO> productCountList = schedulePlanMapper.getProductCountBeforeExport(trans);
        productCountList.stream().forEach(p->{
            map.put(p.getProductId().toString(),p.getProductCount());
        });
        return map;
    }



    @Override
    public SchedulePlanManageResult querySchedulePlanManageList(SchedulePlanManageDTO trans) {

        SchedulePlanManageResult result = new SchedulePlanManageResult();
        //构造pageinfo中的集合
        List<SchedulePlanManage> manageList = new ArrayList<>();
        //1.分页查询产品id--可能不足一页
        trans.calc();
        List<Long> pidsList = schedulePlanMapper.queryProductList(trans.getBeginDate(),trans.getEndDate(),  trans.getStartNum() ,trans.getPageSize(),trans.getCompanyId());
        Set<Long> pidsSet = new HashSet<>();
        pidsList.stream().forEach(pid->{pidsSet.add(pid);});
        ArrayList pids = new ArrayList();
        pidsSet.stream().forEach(pid->{pids.add(pid);});
        //如果商品不存在,返回空pageinfo
        if(pids==null || pids.size()==0){
            ArrayList cuList = new ArrayList();
            CurrentPageTotalDO cu = new CurrentPageTotalDO();
            cu.setPageTotalNums(0);
            cu.setPagePayed(0);
            cu.setPageReserve(0);
            cuList.add(cu);

            ArrayList toList = new ArrayList();
            TotalPageDO to = new TotalPageDO();
            to.setTotalNums(0);
            to.setTotalPayed(0);
            to.setTotalReserve(0);
            toList.add(to);

            result.setPageInfo(new PageInfo<>());
            result.setPageTotalInfo(new PageInfo<>(cuList));
            result.setTotalInfo(new PageInfo<>(toList));

            return result;
        }
        //2.以产品表为主表,查询未付款订单和已付款订单统计
        List<SchedulePlanManageDO> list =  schedulePlanMapper.querySchedulePlanManageList(pids,trans.getBeginDate(),trans.getEndDate());
        Map<Long,SchedulePlanManage> map = new HashMap<>();
        //获取列表数据
        list.stream().forEach(s->{
            SchedulePlanManage manage = map.get(s.getProductId());
            if(manage==null){
                manage = new SchedulePlanManage();
            }
            manage.setProductId(s.getProductId());
            manage.setpNO(s.getpNO());
            manage.setpName(s.getpName());
            manage.setpManager(s.getpManager());
            manage.setpDays(s.getpDays());
            if(s.getFlag().equals(Integer.valueOf(0))){
                manage.setReserveNums((s.getTotalNums()==null?0:s.getTotalNums())+(manage.getReserveNums()==null?0:manage.getReserveNums()));
                manage.setPayedNum(manage.getPayedNum()==null?0:manage.getPayedNum());
                s.setTotalNums(null);
            }else if(s.getFlag().equals(Integer.valueOf(1))){
                manage.setPayedNum((s.getTotalNums()==null?0:s.getTotalNums())+(manage.getPayedNum()==null?0:manage.getPayedNum()));
                manage.setReserveNums(manage.getReserveNums()==null?0:manage.getReserveNums());
                s.setTotalNums(null);

            }
            //manageList.add(manage);
            map.put(s.getProductId(),manage);
        });

        map.keySet().stream().forEach(pid->{manageList.add(map.get(pid));});
        /*manageList.stream().forEach(s->{s.setTotalNums(
                (s.getReserveNums()==null?0:s.getReserveNums())
                        +
                (s.getPayedNum()==null?0:s.getPayedNum()));
        });*/
        manageList.stream().forEach(s->{s.setTotalNums(s.getReserveNums()+s.getPayedNum());});

        Collections.sort(manageList, new Comparator<SchedulePlanManage>() {
            @Override
            public int compare(SchedulePlanManage o1, SchedulePlanManage o2) {
                return o2.getTotalNums().compareTo(o1.getTotalNums());
            }
        });



        Long productCount = schedulePlanMapper.queryProductCount(trans.getBeginDate(),trans.getEndDate(),trans.getCompanyId());
        //查询总数 总页数
        Integer total = productCount.intValue();
        PageInfo pageInfo = new PageInfo<SchedulePlanManage>(manageList);
        pageInfo.setTotal(total);
        pageInfo.setPageSize(trans.getPageSize());
        pageInfo.setPageNum(trans.getCurrPage()+1);// @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
        pageInfo.setStartRow(trans.getStartNum());//333333333333333333333
        pageInfo.setPages(total%trans.getPageSize()==0?total/trans.getPageSize():(total/trans.getPageSize()+1));
        result.setPageInfo(pageInfo);
        //获取每页合计
        int pageReserve = 0;
        int pagePayed = 0;
        int pageTotalNums  = 0;
        for(SchedulePlanManage m:manageList){
            pageReserve+=m.getReserveNums();
            pagePayed+=m.getPayedNum();
            pageTotalNums +=m.getTotalNums();
        }
        ArrayList cuList2 = new ArrayList();
        CurrentPageTotalDO cu2 = new CurrentPageTotalDO();
        cu2.setPageReserve(pageReserve);
        cu2.setPagePayed(pagePayed);
        cu2.setPageTotalNums(pageTotalNums);
        cuList2.add(cu2);
        result.setPageTotalInfo(new PageInfo<>(cuList2));

        //获取全部合计
        List<Long> allPidsList = schedulePlanMapper.queryAllProductIds(trans.getBeginDate(),trans.getEndDate(),trans.getCompanyId());
        Set<Long> allPidsSet = new HashSet<>();
        allPidsList.stream().forEach(pid->{allPidsSet.add(pid);});
        ArrayList allPids = new ArrayList();
        allPidsSet.stream().forEach(pid->{allPids.add(pid);});
        if(pids==null || pids.size()==0){
            ArrayList cuList3 = new ArrayList();
            CurrentPageTotalDO cu3 = new CurrentPageTotalDO();
            cu3.setPageTotalNums(0);
            cu3.setPagePayed(0);
            cu3.setPageReserve(0);
            cuList3.add(cu3);

            ArrayList toList2 = new ArrayList();
            TotalPageDO to2 = new TotalPageDO();
            to2.setTotalNums(0);
            to2.setTotalPayed(0);
            to2.setTotalReserve(0);
            toList2.add(to2);

            result.setPageInfo(new PageInfo<>());
            result.setPageTotalInfo(new PageInfo<>(cuList3));
            result.setTotalInfo(new PageInfo<>(toList2));

            return result;
        }
        List<SchedulePlanManageCountDO> countList = schedulePlanMapper.querySchedulePlanManageCountData(trans.getBeginDate(),trans.getEndDate(),trans.getCompanyId(),allPids);
        ArrayList toList4 = new ArrayList();
        TotalPageDO to = new TotalPageDO();
        countList.stream().forEach(c->{
            if(c.getFlag().equals(Integer.valueOf(0))){
                to.setTotalReserve(c.getTotalNums());
            }else if(c.getFlag().equals(Integer.valueOf(1))){
                to.setTotalPayed(c.getTotalNums());
            }
        });

        to.setTotalNums(to.getTotalReserve()+to.getTotalPayed());
        toList4.add(to);
        result.setTotalInfo(new PageInfo<>(toList4));
        return result;
    }

    @Override
    public List<SchedulePlanExportDO> queryBeforeExport(SchedulePlanManageDTO trans) {
        //SchedulePlanManageResult result = new SchedulePlanManageResult();
        //获取记录列表
        List<SchedulePlanExportDO> list = schedulePlanMapper.queryBeforeExport(trans);
        return list;
    }

    @Override
    public SchedulePlanResult getPlanList(SchedulePlanManageDTO trans) {
        SchedulePlanResult result = new SchedulePlanResult();
        trans.calc();
        trans.setBeginPageDate(trans.getBeginDate().plusDays(trans.getStartNum()));
        LocalDate computeDate = trans.getBeginPageDate().plusDays(trans.getPageSize());
        //trans.setEndPageDate(trans.getEndDate().compareTo(computeDate)<0?trans.getEndDate():computeDate);
        trans.setEndPageDate(computeDate);
        //查询20天的已付/未付 的 各种票的 游客人数
        //分页查询该产品下的班期
        List<LocalDate> calendarList =schedulePlanMapper.getCalendarList(trans.getProductId(),trans.getStartNum(),trans.getPageSize(),
                                                                        trans.getBeginDate(), trans.getEndDate());

        Long calendarCount =schedulePlanMapper.getCalendarCount(trans.getProductId(),trans.getBeginDate(), trans.getEndDate());

        //如果没有数据
        if(calendarList!=null && calendarList.size()==0){
            result.setPageInfo(new PageInfo<>());
            result.setPageTotalInfo(new PageInfo());
            result.setPageTotalInfo(new PageInfo<>());
            return result;
        }
        //TODO 产品列表增加状态过滤 票价名称改为票价列表
        List<SchedulePlanDO> list =  schedulePlanMapper.getPlanList(trans,calendarList.get(0),calendarList.get(calendarList.size()-1));

        //组装数据
        List<SchedulePlan> resultList =assembleData(calendarList,trans.getEndDate(),list,trans.getBeginPageDate(),trans.getEndPageDate(),trans.getProductId());
        PageInfo<SchedulePlan> pageInfo = new PageInfo<>(resultList);
        //查询总数
        //Long total = trans.getBeginDate().until(trans.getEndDate(), ChronoUnit.DAYS);
        Long total = calendarCount;
        pageInfo.setTotal(total);
        pageInfo.setPageSize(trans.getPageSize());
        pageInfo.setPageNum(trans.getCurrPage()+1);
        logger.error("########确认分页信息@@@@@@#########");
        pageInfo.setStartRow(trans.getStartNum());
        pageInfo.setPages((int)(total%trans.getPageSize()==0?total/trans.getPageSize():(total/trans.getPageSize()+1)));
        result.setPageInfo(pageInfo);



        //计算本页合计
        //先查询该产品由哪几种票
        //TODO 改为查询票价类目列表
        List<Long> ticketIdList  = schedulePlanMapper.getTicketIdList(trans.getProductId());
        List<SchedulePlanPageSumDO> sumDOList = new ArrayList<>();
        SchedulePlanPageSumDO sumDO = new SchedulePlanPageSumDO();

        ticketIdList.stream().forEach(tId->{


            final long[] reserveSum = {0};
            final long[] paySum = {0};
            resultList.forEach(r->{
                //统计该tid的票 的本页预定 统计
                SingleReserveSchedulePlan reservePlan = r.getReservePlan();
                if(reservePlan!=null && reservePlan.getTtmap()!=null){

                    reserveSum[0] +=(reservePlan.getTtmap().get(tId)==null?0:(reservePlan.getTtmap().get(tId)));
                }
                SinglePayedSchedulePlan payPlan = r.getPayPlan();
                if(payPlan!=null && payPlan.getTtmap()!=null){
                    paySum[0] +=(payPlan.getTtmap().get(tId)==null?0:(payPlan.getTtmap().get(tId)));
                }
            });

            Map<String,Long> innerMap = new HashMap();
            innerMap.put("reserve",reserveSum[0]);
            innerMap.put("payed",paySum[0]);
            innerMap.put("all",(reserveSum[0] + paySum[0]));


            sumDO.getSumMap().put(tId,innerMap);
        });


        Set<Long> ids = sumDO.getSumMap().keySet();
        Long pageTotalSum = 0L;
        Long pageReserveSum = 0L;
        Long pagePayedSum = 0L;
        for(Long id:ids){
            Long all = sumDO.getSumMap().get(id).get("all");
            Long reserve = sumDO.getSumMap().get(id).get("reserve");
            Long payed = sumDO.getSumMap().get(id).get("payed");
            pageTotalSum+=all;
            pageReserveSum+=reserve;
            pagePayedSum+=payed;
        }
        Map<String,Long> pageTotalMap = new HashMap<>();
        pageTotalMap.put("pageTotalSum",pageTotalSum);
        pageTotalMap.put("pageReserveSum",pageReserveSum);
        pageTotalMap.put("pagePayedSum",pagePayedSum);

        sumDO.getSumMap().put(0L,pageTotalMap);


        sumDOList.add(sumDO);
        //塞入统计数据   ############
        PageInfo currentPageInfo = new PageInfo<>(sumDOList);
        result.setPageTotalInfo(currentPageInfo);

//计算总计

        List<SchedulePlanPageSumDO> allSumDOList = new ArrayList<>();
        SchedulePlanPageSumDO pageSumDO = new SchedulePlanPageSumDO();
        //查询某票id的合计 已付/预约游客数
        List<SchedulePlanAllSumDO> allResult =  schedulePlanMapper.getAllSumDOList(trans);

        ticketIdList.stream().forEach(tId->{
            final int[] reserveSum = {0};
            final int[] paySum = {0};
            allResult.stream().forEach(r->{
                if(r.getFlag().equals(Integer.valueOf(0)) && r.getTicketId()!=null && tId.equals(r.getTicketId())){
                    reserveSum[0] +=r.getPeopleNum();
                }
                if(r.getFlag().equals(Integer.valueOf(1)) && r.getTicketId()!=null && tId.equals(r.getTicketId())){
                    paySum[0] +=r.getPeopleNum();
                }
            });
            Map<String,Long> innerMap = new HashMap();
            innerMap.put("reserve",(long) reserveSum[0]);
            innerMap.put("payed",(long) paySum[0]);
            innerMap.put("all",(long)(reserveSum[0] + paySum[0]));

            pageSumDO.getSumMap().put(tId,innerMap);
        });
        Set<Long> pageIds = pageSumDO.getSumMap().keySet();
        Long allTotalSum = 0L;
        Long allReserveSum = 0L;
        Long allPayedSum = 0L;
        for(Long id:pageIds){
            Long all = pageSumDO.getSumMap().get(id).get("all");
            Long reserve = pageSumDO.getSumMap().get(id).get("reserve");
            Long payed = pageSumDO.getSumMap().get(id).get("payed");
            allTotalSum+=all;
            allReserveSum+=reserve;
            allPayedSum+=payed;
        }
        Map<String,Long> allTotalMap = new HashMap<>();
        allTotalMap.put("allTotalSum",allTotalSum);
        allTotalMap.put("allReserveSum",allReserveSum);
        allTotalMap.put("allPayedSum",allPayedSum);

        pageSumDO.getSumMap().put(0L,allTotalMap);

        allSumDOList.add(pageSumDO);
        PageInfo allPageInfo = new PageInfo(allSumDOList);
        result.setTotalInfo(allPageInfo);

        return result;
    }



    private List<SchedulePlan> assembleData(List<LocalDate> calendarList,LocalDate endDate,List<SchedulePlanDO> list, LocalDate beginPageDate,LocalDate endPageDate,Long productId) {
        List<SchedulePlan> resultList = new ArrayList<>();
        List<String> dateStrList = new ArrayList<>();
        for(LocalDate date:calendarList){
            dateStrList.add(date.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        }
        //1.获取list中最大的日期  和  beginPageDate  组装日期集合
        /*LocalDate lastDate = null;
        if (list!=null && list.size()>0) {
            lastDate = Collections.max(list, Comparator.comparing(schedulePlanDO -> schedulePlanDO.getsCallendar())).getsCallendar();
            //lastDate = endDate;
        }*/
        /*
        LocalDate iDate  = null;
        if (lastDate!=null) {
            *//*for(iDate = beginPageDate;iDate.compareTo(lastDate)>0;iDate=iDate.plusDays(1)){
                dateStrList.add(iDate.format(DateTimeFormatter.ofPattern("yyyy/MM/dd")));
            }*//*

            iDate = beginPageDate;
            System.out.println(iDate.compareTo(lastDate)<=0);

            while(iDate.compareTo(lastDate)<=0){
                dateStrList.add(iDate.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
                iDate=iDate.plusDays(1);
            }

        }*/
        //logger.debug(dateStrList.get(dateStrList.size()-1)+"   ##############");

        //遍历日期,按日期去除list中的数据,组装到SchedulePlan中
        //先处理已付款的额数据,对应日期组装为数据



        dateStrList.stream().forEach(d->{
            SchedulePlan sp = new SchedulePlan();
            sp.setDateStr(d);
            SingleReserveSchedulePlan reservePlan = new SingleReserveSchedulePlan();
            SinglePayedSchedulePlan payPlan = new SinglePayedSchedulePlan();

            if(list==null || list.size()==0 ||(list.size()==1 && list.get(0)==null)){
                setDefaultPlan(sp);
            }

            list.stream().forEach(s->{
                sp.setReservePlan(reservePlan);
                sp.setPayPlan(payPlan);
                if((s.getsCallendar().compareTo(LocalDate.parse(d))==0) && (s.getFlag().equals(Integer.valueOf(0)))){
                    reservePlan.getTtmap().put(s.getOtTicketId(),s.getPeopleNum());
                }else if((s.getsCallendar().compareTo(LocalDate.parse(d))==0) && (s.getFlag().equals(Integer.valueOf(1)))){
                    payPlan.getTtmap().put(s.getOtTicketId(),s.getPeopleNum());
                }
            });



            resultList.add(sp);
        });

    //计算行尾合计游客人数
        resultList.stream().forEach(r->{
            if(r.getPayPlan()!=null){
                int sum = 0;
                Set<Long> longs = r.getPayPlan().getTtmap().keySet();
                for(Long k:longs){
                    sum+=r.getPayPlan().getTtmap().get(k);
                }
                r.getPayPlan().setSingleTotal(sum);
            }
            if(r.getReservePlan()!=null){
                int sum = 0;
                Set<Long> longs = r.getReservePlan().getTtmap().keySet();
                for(Long k:longs){
                    sum+=r.getReservePlan().getTtmap().get(k);
                }
                r.getReservePlan().setSingleTotal(sum);
            }

        });

        return resultList;
    }

/*    {
        "dateStr":"2017-12-15",
       "payPlan":{
        "sName":"已付",
                "ttmap":{},
        "singleTotal":0
    },
        "reservePlan":{
        "sName":"预约",
                "ttmap":{},
        "singleTotal":0
    }
    },*/



    private void setDefaultPlan(SchedulePlan sp) {
        SingleReserveSchedulePlan srsp =new SingleReserveSchedulePlan(){
            {
                setsName("预约");
                setTtmap(new HashMap<>());
                setSingleTotal(0);
            }
        };
        sp.setReservePlan(srsp);
        SinglePayedSchedulePlan spsp=  new SinglePayedSchedulePlan(){
            {
                setsName("已付");
                setTtmap(new HashMap<>());
                setSingleTotal(0);
            }
        };
        sp.setPayPlan(spsp);

    }
}
