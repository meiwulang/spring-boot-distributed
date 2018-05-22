package com.jdy.b2b.api.service.Impl;

import com.jdy.b2b.api.dao.SalesPerformanceMapper;
import com.jdy.b2b.api.model.salesperformance.SalesPerformanceDTO;
import com.jdy.b2b.api.service.SalesPerformanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by zhangfofa on 2017/11/10.
 */
@Service
public class SalesPerformanceServiceImpl implements SalesPerformanceService {

    @Autowired
    private SalesPerformanceMapper salesPerformanceMapper;

    @Override
    public Map<String, List> queryDaysOfOrderAmount(Long companyId) {
        Map<String, List> resultMap = new HashMap<>();
        List<Map> datalist = salesPerformanceMapper.selectDaysOfOrderAmount(companyId);
        List<String> dateStrCompareList = getDayStrList(new Date(), "yyyy-MM-dd", 29);
        List<String> dateStrResultList = getDayStrList(new Date(), "MM.dd", 29);
        List<Long> orderAmountList = new ArrayList<>();
        List<BigDecimal> orderMoneyList = new ArrayList<>();
        List<BigDecimal> incomeAmountList = new ArrayList<>();
        dataHandle(datalist, dateStrCompareList, orderAmountList, orderMoneyList, incomeAmountList);
        resultMap.put("dateStrList", dateStrResultList);
        resultMap.put("orderAmountList", orderAmountList);
        resultMap.put("orderMoneyList", orderMoneyList);
        resultMap.put("incomeAmountList", incomeAmountList);
        return resultMap;
    }

    @Override
    public Map<String, List> queryDaysOfOrderAmountByDepartmentId(Long departmentId) {
        Map<String, List> resultMap = new HashMap<>();
        List<Map> datalist = salesPerformanceMapper.selectDaysOfOrderAmountByDepartmentId(departmentId);
        List<String> dateStrCompareList = getDayStrList(new Date(), "yyyy-MM-dd", 29);
        List<String> dateStrResultList = getDayStrList(new Date(), "MM.dd", 29);
        List<Long> orderAmountList = new ArrayList<>();
        List<BigDecimal> orderMoneyList = new ArrayList<>();
        List<BigDecimal> incomeAmountList = new ArrayList<>();
        dataHandle(datalist, dateStrCompareList, orderAmountList, orderMoneyList, incomeAmountList);
        resultMap.put("dateStrList", dateStrResultList);
        resultMap.put("orderAmountList", orderAmountList);
        resultMap.put("orderMoneyList", orderMoneyList);
        resultMap.put("incomeAmountList", incomeAmountList);
        return resultMap;
    }

    @Override
    public Map<String, List> querySalesPerformanceByIdAndDateType(SalesPerformanceDTO salesPerformanceDTO) {
        Map<String, List> resultMap = new HashMap<>();
        List<String> timeStrResultList = new ArrayList<>();
        List<Long> orderAmountList = new ArrayList<>();
        List<BigDecimal> orderMoneyList = new ArrayList<>();
        List<BigDecimal> incomeAmountList = new ArrayList<>();
        if(salesPerformanceDTO.getDateType().intValue() == 1) {
            if(salesPerformanceDTO.getDataLevel().intValue() == 3) {
                String ids = queryAllUserId(salesPerformanceDTO.getId());
                salesPerformanceDTO.setIds(ids);
            }
            List<Map> datalist = salesPerformanceMapper.selectSalesPerformanceByIdAndDateType(salesPerformanceDTO);
            List<String> timeStrCompareList = getTimeStrList(salesPerformanceDTO.getDateStrBegin(), 1);
            dataHandle(datalist, timeStrCompareList, orderAmountList, orderMoneyList, incomeAmountList);
            timeStrResultList = getTimeStrList(salesPerformanceDTO.getDateStrBegin(), 2);
        } else if (salesPerformanceDTO.getDateType().intValue() == 2) {
            if(salesPerformanceDTO.getDataLevel().intValue() == 3) {
                String ids = queryAllUserId(salesPerformanceDTO.getId());
                salesPerformanceDTO.setIds(ids);
            }
            List<Map> datalist = salesPerformanceMapper.selectSalesPerformanceByIdAndDateType(salesPerformanceDTO);
            List<String> timeStrCompareList = getWeekOfDateStrList(salesPerformanceDTO.getDateStrBegin(), salesPerformanceDTO.getDateStrEnd(), 1);
            dataHandle(datalist, timeStrCompareList, orderAmountList, orderMoneyList, incomeAmountList);
            timeStrResultList = getWeekOfDateStrList(salesPerformanceDTO.getDateStrBegin(), salesPerformanceDTO.getDateStrEnd(), 2);
        } else if (salesPerformanceDTO.getDateType().intValue() == 3) {
            if(salesPerformanceDTO.getDataLevel().intValue() == 3) {
                String ids = queryAllUserId(salesPerformanceDTO.getId());
                salesPerformanceDTO.setIds(ids);
            }
            Date dt = new Date();
            Calendar cal = Calendar.getInstance();
            cal.setTime(dt);
            int w = cal.get(Calendar.DAY_OF_MONTH);

            SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd");
            try {
                Date dtBegin = sdf1.parse(salesPerformanceDTO.getDateStrBegin());
                Calendar calendar = Calendar.getInstance();
                calendar.setTime(dtBegin);
                calendar.set(Calendar.DAY_OF_MONTH, 1);
                calendar.add(Calendar.MONTH, 1);
                calendar.add(Calendar.DAY_OF_MONTH, -1);
                Date dtEnd = calendar.getTime();
                salesPerformanceDTO.setDateStrEnd(sdf1.format(dtEnd));
                if(!(dt.getTime()>=dtBegin.getTime() && dt.getTime()<=dtEnd.getTime())) {
                    dt = sdf1.parse(salesPerformanceDTO.getDateStrEnd());
                    w = Integer.parseInt(salesPerformanceDTO.getDateStrEnd().substring(8, 10));
                }
            } catch (ParseException e) {
                e.printStackTrace();
            }

            List<Map> datalist = salesPerformanceMapper.selectSalesPerformanceByIdAndDateType(salesPerformanceDTO);
            List<String> timeStrCompareList = getDayStrList(dt, "yyyy-MM-dd", w-1);
            dataHandle(datalist, timeStrCompareList, orderAmountList, orderMoneyList, incomeAmountList);
            timeStrResultList = getDayStrList(dt, "MM.dd", w-1);
        } else if (salesPerformanceDTO.getDateType().intValue() == 4) {
            if(salesPerformanceDTO.getDataLevel().intValue() == 3) {
                String ids = queryAllUserId(salesPerformanceDTO.getId());
                salesPerformanceDTO.setIds(ids);
            }
            List<Map> datalist = salesPerformanceMapper.selectSalesPerformanceByIdAndDateType(salesPerformanceDTO);
            List<String> timeStrCompareList = getMonthStrListBySeason(salesPerformanceDTO.getDateStrBegin(), salesPerformanceDTO.getDateStrEnd(), 1);
            dataHandle(datalist, timeStrCompareList, orderAmountList, orderMoneyList, incomeAmountList);
            timeStrResultList = getMonthStrListBySeason(salesPerformanceDTO.getDateStrBegin(), salesPerformanceDTO.getDateStrEnd(), 2);
        } else if (salesPerformanceDTO.getDateType().intValue() == 5) {
            if(salesPerformanceDTO.getDataLevel() == 3) {
                String ids = queryAllUserId(salesPerformanceDTO.getId());
                salesPerformanceDTO.setIds(ids);
            }
            List<Map> datalist = salesPerformanceMapper.selectSalesPerformanceByIdAndDateType(salesPerformanceDTO);
            List<String> timeStrCompareList = getSeasonStrList(1);
            dataHandle(datalist, timeStrCompareList, orderAmountList, orderMoneyList, incomeAmountList);
            timeStrResultList = getSeasonStrList(2);
        }
        resultMap.put("dateStrList", timeStrResultList);
        resultMap.put("orderAmountList", orderAmountList);
        resultMap.put("orderMoneyList", orderMoneyList);
        resultMap.put("incomeAmountList", incomeAmountList);
        return resultMap;

    }

    private void dataHandle(List<Map> dataList, List<String> dateStrList, List<Long> orderAmountList, List<BigDecimal> orderMoneyList, List<BigDecimal> incomeAmountList) {
        for(String dateStr : dateStrList) {
            int index = 0;
            boolean flag = false;
            for(Map map : dataList) {
                if(Objects.equals(dateStr, map.get("dateStr"))) {
                    flag = true;
                    orderAmountList.add((long)map.get("orderAmount"));
                    orderMoneyList.add(((BigDecimal) map.get("orderMoney")).divide(new BigDecimal(1000),0, RoundingMode.HALF_UP));
                    incomeAmountList.add(((BigDecimal) map.get("incomeAmount")).divide(new BigDecimal(1000),0, RoundingMode.HALF_UP));
                    dataList.remove(index);
                    break;
                }
                index++;
            }
            if(!flag) {
                orderAmountList.add(0L);
                orderMoneyList.add(BigDecimal.valueOf(0));
                incomeAmountList.add(BigDecimal.ZERO);
            }
        }

    }

    private List<String> getTimeStrList(String dateStr, Integer type) {
        List<String> timeStrList = new ArrayList<>();

        Date date = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("HH");
        int index = Integer.parseInt(sdf.format(date));

        SimpleDateFormat sdf2 = new SimpleDateFormat("yyyy-MM-dd");
        String currentDateStr = sdf2.format(date);
        if(!Objects.equals(currentDateStr, dateStr)) {
            index = 23;
        }

        if(type.intValue() == 1) {
            for(int i=0; i<=index; i++) {
                if(i < 10) {
                    timeStrList.add("0"+i);
                }  else {
                    timeStrList.add(i+"");
                }

            }
            return timeStrList;
        }
        for(int i=0; i<=index; i++) {
            timeStrList.add(i+":00");
        }
        return timeStrList;
    }

    private List<String> getDayStrList(Date maxDate, String dateFormat, Integer index) {
        List<String> dateStrList = new ArrayList<>();
        SimpleDateFormat sdf  = new SimpleDateFormat(dateFormat);
        Calendar calc = Calendar.getInstance();
        try {
            for(int i=index;i>=0;i--){
                calc.setTime(sdf.parse(sdf.format(maxDate)));
                calc.add(calc.DATE, -i);
                Date minDate = calc.getTime();
                dateStrList.add(sdf.format(minDate));
            }
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return dateStrList;
    }

    private List<String> getWeekOfDateStrList(String dateStrBegin, String dateStrEnd, Integer type){
        List<String> weekStrList = new ArrayList<>();

        String[] weekOfDay = {"", "周一", "周二", "周三", "周四", "周五", "周六", "周日"};

        Date dt = new Date();
        Calendar cal = Calendar.getInstance();
        cal.setTime(dt);
        int w = cal.get(Calendar.DAY_OF_WEEK) - 1;

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        try {
            Date dtBegin = sdf.parse(dateStrBegin+" 00:00:00");
            Date dtEnd = sdf.parse(dateStrEnd+" 23:59:59");
            if(!(dt.getTime()>=dtBegin.getTime() && dt.getTime()<=dtEnd.getTime())) {
                w=0;
                dt=dtEnd;
            }
        } catch (ParseException e) {
            e.printStackTrace();
        }

        if(type.intValue() == 1) {
            if (w == 0) {
                weekStrList = getDayStrList(dt, "yyyy-MM-dd", 6);
            }else {
                weekStrList = getDayStrList(dt, "yyyy-MM-dd", w-1);
            }
            return weekStrList;
        }
        if(w == 0) {
            w = 7;
        }
        for(int i=1; i<=w; i++) {
            weekStrList.add(weekOfDay[i]);
        }
        return weekStrList;
    }

    private List<String> getMonthStrListBySeason(String dateStrBegin, String dateStrEnd, Integer type) {
        Date dt = new Date();

        SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        try {
            Date dtBegin = sdf1.parse(dateStrBegin+" 00:00:00");
            Date dtEnd = sdf1.parse(dateStrEnd+" 23:59:59");
            if(!(dt.getTime()>=dtBegin.getTime() && dt.getTime()<=dtEnd.getTime())) {
                SimpleDateFormat sdf2 = new SimpleDateFormat("yyyy-MM-dd");
                dt = sdf2.parse(dateStrEnd);
            }
        } catch (ParseException e) {
            e.printStackTrace();
        }

        SimpleDateFormat sdf = new SimpleDateFormat("MM");
        String monthStr = sdf.format(dt);
        int month = Integer.parseInt(monthStr);
        if(month>=1 && month<=3) {
            return getMonthStrList(1, month, type);
        } else if (month>=4 && month<=6) {
            return getMonthStrList(4, month, type);
        } else if (month>=7 && month <= 9) {
            return getMonthStrList(7, month, type);
        } else {
            return getMonthStrList(10, month, type);
        }
    }

    private List<String> getMonthStrList(Integer begin, Integer end, Integer type) {
        List<String> monthStrList = new ArrayList<>();
        if(type.intValue() == 1) {
            for(int i=begin.intValue(); i<=end.intValue(); i++) {
                monthStrList.add(i+"");
            }
            return monthStrList;
        }
        for(int i=begin.intValue(); i<=end.intValue(); i++) {
            monthStrList.add(i+"月");
        }
        return monthStrList;
    }

    private List<String> getSeasonStrList(int type) {
        return type == 1 ? Arrays.asList("1,2,3,4".split(",")) : Arrays.asList("第一季度,第二季度,第三季度,第四季度".split(","));
    }

    private String queryAllUserId(Long id) {
        String openId = salesPerformanceMapper.selectPidById(id);
        List<Long> returnIdList = new ArrayList<>();
        List<String> queryOpenIdList = new ArrayList<>();
        List<Map> maplist;
        returnIdList.add(id);
        queryOpenIdList.add(openId);
        boolean flag = true;
        while (flag) {
            maplist = salesPerformanceMapper.selectIdListByPid(queryOpenIdList);
            queryOpenIdList.clear();
            if(!Objects.equals(maplist, null) && maplist.size()>0) {
                for(Map map : maplist) {
                    queryOpenIdList.add(map.get("openId").toString());
                    returnIdList.add((long)map.get("userId"));
                }
            } else {
                flag = false;
            }
        }
        return returnIdList.toString().replace("[", "").replace("]", "");
    }
}
