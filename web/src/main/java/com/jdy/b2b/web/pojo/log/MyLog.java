package com.jdy.b2b.web.pojo.log;
import java.lang.annotation.*;
import java.lang.annotation.ElementType;

@Target({ElementType.METHOD})
    @Retention(RetentionPolicy.RUNTIME)
    @Documented
public @interface MyLog{
    /*操作成功的描述字符串 默认为空时  SuccessInfo = Module + Operation + “成功”*/
    public String SuccessInfo() default "";
    public String ErrorInfo() default "";

    /*返回统一为ResultBean.class  操作成功 的标志位。 默认为 ”0“*/
    public String SuccessCode() default "0";
    public String ErrorCode() default "-1";

    /*操作名称  默认根据方法名确定（save* : 保存，delete* : 删除，update* 更新，其他操作）*/
    public String Operation() default "";

    /*  模块名称。 默认为 controller 名称，截取掉结尾的'controller'  */
    public String Module() default "";

    /**
     * 目的：
     *   日志与记录是相关的，所以需要一个记录的id，填充数据库pid字段， 查询日志时pid和module一起作为查询条件
     *  获取id的方式：
     *  根据操作的不同， 插入（新建）操作 id是生成的，无法获取到，只能通过ResultBean.id 字段返回。 当插入操作完成后，需要将新增记录的id放入ResultBean的id中。 特殊情况 不使用新增id，而是别的已有字段，可以使用obj定位
     *
     *  其他操作两种方式：1. 此字段表示出id的坐标。 例如： Company.id  表示方法入参的Company 类的id 属性 可以多层镶嵌，但不能是集合
     *                 2. 默认取 方法参数列表的第一个参数 。 例如 Long id， 或者 对象。 注意对象不可镶嵌。只尝试取对象的id属性，失败则生成日志失败
     *                   注意不能使用参数名，理由：入参参数名被jvm抹掉了。
     *
     **/
    public String Obj() default "";
}