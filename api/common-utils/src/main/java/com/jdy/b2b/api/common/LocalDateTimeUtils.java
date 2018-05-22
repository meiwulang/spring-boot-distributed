package com.jdy.b2b.api.common;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.chrono.ChronoLocalDateTime;
import java.util.Date;

/**
 * Created by dugq on 2018/3/1.
 */
public class LocalDateTimeUtils {


    //将Date转换成LocalDateTime
    public static LocalDateTime dateToLocalDateTime(Date date) {
        return LocalDateTime.ofInstant(date.toInstant(), ZoneId.systemDefault());
    }
    //将Date转换成LocalDateTime
    public static LocalDate date2LocalDate(Date date) {
        return dateToLocalDateTime(date).toLocalDate();
    }
    //将Date转换成LocalDateTime
    public static LocalTime date2LocalTime(Date date) {
        return dateToLocalDateTime(date).toLocalTime();
    }

    //LocalDateTime转换为Date
    public static Date LocalDateTime2Date(LocalDateTime time) {
        return Date.from(time.atZone(ZoneId.systemDefault()).toInstant());
    }

    //LocalDate转换为Date
    public static Date LocalDate2Date(LocalDate time) {
        return Date.from(time.atStartOfDay().atZone(ZoneId.systemDefault()).toInstant());
    }

        //获取指定日期的毫秒
    public static Long getMilliByTime(LocalDateTime time) {
        return time.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
    }


}
