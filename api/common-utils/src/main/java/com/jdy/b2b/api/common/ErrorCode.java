package com.jdy.b2b.api.common;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Administrator on 2017/3/21.
 */
public class ErrorCode {

    //正常返回码
    public static final String ERR_CODE_0 ="0" ;
    public static final String ERR_CODE_0_MSG = "success";

    //验证码错误
    public static final String ERR_CODE_VERCODE_WRONG="107";

    //未知错误
    public static final String ERR_CODE_UNKNOWN="109";

    //验证码过期
    public static final String ERR_CODE_VERCODE_INVALID="108";

    public final static String PARAM_ISNULL = "101";
    public final static String PARAM_ERROR = "102";
    public final static String INTERNAL_ERROR = "103";
    public final static String DATA_NOT_FOUND="104";
    public final static String PERMISSION_DENIED="105";
    public final static String DATA_EXISTS="106";

    /**
     * 用户返回码 200-299
     */

    /*begin 订单api 统一返回码 300-399**/
    public static final String ERR_CODE_ORDER_FAIL = "300";
    public static final String ERR_CODE_ORDER_FAIL_MSG = "调用订单api失败";

    public static final String ERR_CODE_ORDER_PARAM_NULL = "301";
    public static final String ERR_CODE_ORDER_PARAM_NULL_MSG = "参数为空";

    public static final String ERR_CODE_ORDER_CREATE_FAIL = "302";
    public static final String ERR_CODE_ORDER_CREATE_FAIL_MSG = "创建订单失败";

    public static final String ERR_CODE_ORDER_UPDATE_FAIL = "303";
    public static final String ERR_CODE_ORDER_UPDATE_FAIL_MSG = "更新订单失败";

    public static final String ERR_CODE_ORDERITEM_CREATE_FAIL = "304";
    public static final String ERR_CODE_ORDERITEM_CREATE_FAIL_MSG = "创建订单详情失败";

    public static final String ERR_CODE_ORDERITEM_UPDATE_FAIL = "305";
    public static final String ERR_CODE_ORDERITEM_UPDATE_FAIL_MSG = "更新订单详情失败";

    public static final String ERR_CODE_ORDERITEM_NULL_FAIL = "311";
    public static final String ERR_CODE_ORDERITEM_NULL_FAIL_MSG = "创建订单详情失败";

    public static final String ERR_CODE_ORDER_STATUS_FAIL = "306";
    public static final String ERR_CODE_ORDER_STATUS_FAIL_MSG = "更新订单状态失败";

    public static final String ERR_CODE_ORDER_DELETE_FAIL = "307";
    public static final String ERR_CODE_ORDER_DELETE_FAIL_MSG = "删除订单失败";

    public static final String ERR_CODE_ORDERITEM_DELETE_FAIL = "308";
    public static final String ERR_CODE_ORDERITEM_DELETE_FAIL_MSG = "删除订单详情失败";

    public static final String ERR_CODE_ORDER_QUERY_NULL = "309";
    public static final String ERR_CODE_ORDER_QUERY_NULL_MSG = "未查询到订单";

    public static final String ERR_CODE_ORDER_INVAILD_PARAM = "310";
    public static final String ERR_CODE_ORDER_INVAILD_PARAM_MSG = "无效参数";
    /*end 订单api 统一返回码 **/

    /*begin 产品api 统一返回码 400-499**/
    /**openDate参数无效*/
    public static final String ERR_CODE_PRODUCT_INVAILD_OPENDATE = "400";
    /**refurbishDate参数无效*/
    public static final String ERR_CODE_PRODUCT_INVAILD_REFURBISHDATE = "401";
    /**酒店基本信息保存异常*/
    public static final String ERR_CODE_PRODUCT_HOTEL_SAVE_ERROR = "402";
    /**酒店联系人保存异常*/
    public static final String ERR_CODE_PRODUCT_HOTEL_CONTACTS_SAVE_ERROR = "403";
    /**酒店联系人删除*/
    public static final String ERR_CODE_PRODUCT_HOTEL_CONTACTS_DEL_ERROR = "404";
    /**酒店联系人查询异常*/
    public static final String ERR_CODE_PRODUCT_HOTEL_CONTACTS_QUERY_ERROR = "405";
    /**酒店扩展保存异常*/
    public static final String ERR_CODE_PRODUCT_HOTEL_EXTEND_ERROR = "406";
    /**酒店图片上传异常*/
    public static final String ERR_CODE_PRODUCT_HOTEL_FILE_UPLOAD_ERROR = "407";
    /**酒店申请记录查询异常*/
    public static final String ERR_CODE_PRODUCT_HOTEL_APPLY_QUERY_ERROR = "408";
    /**酒店审核异常*/
    public static final String ERR_CODE_PRODUCT_HOTEL_AUDIT_ERROR = "409";
    /**酒店文件上传失败*/
    public static final String ERR_CODE_PRODUCT_HOTEL_FILE_UPLOAD_FAILURE = "410";
    /**产品保存异常*/
    public static final String ERR_CODE_PRODUCT_PRODUCT_SAVE_FAILURE = "411";
    /**产品查询异常*/
    public static final String ERR_CODE_PRODUCT_PRODUCT_QUERY_FAILURE = "412";
    /**房型基本信息保存异常*/
    public static final String ERR_CODE_PRODUCT_ROOM_SAVE_FAILURE = "413";
    /**房型申请记录查询异常*/
    public static final String ERR_CODE_PRODUCT_ROOM_APPLY_QUERY_FAILURE = "414";
    /**房型审核异常*/
    public static final String ERR_CODE_PRODUCT_ROOM_AUDIT_FAILURE = "415";
    /**文件删除失败*/
    public static final String ERR_CODE_PRODUCT_HOTEL_FILE_DELETE_FAILURE = "416";
    /**checkInDate参数无效*/
    public static final String ERR_CODE_HOTEL_INVAILD_CHECKINDATE = "417";
    /**checkOutDate参数无效*/
    public static final String ERR_CODE_HOTEL_INVAILD_CHECKOUTDATE = "418";
    /**酒店搜索异常*/
    public static final String ERR_CODE_HOTEL_SEARCH_FAILURE = "419";
    /**酒店首页推荐异常*/
    public static final String ERR_CODE_HOTEL_RECOMMEND_FAILURE = "420";
    /**酒店查询异常*/
    public static final String ERR_CODE_HOTEL_LIST_FAILURE = "421";
    /**checkInDate参数不能为空*/
    public static final String ERR_CODE_HOTEL_ISNULL_CHECKINDATE = "422";
    /**酒店详情查询异常*/
    public static final String ERR_CODE_HOTEL_DETAILS_FAILURE = "423";
    /**酒店房型搜索异常*/
    public static final String ERR_CODE_HOTEL_ROOM_SEARCH_FAILURE = "424";
    /**更新酒店售卖状态异常*/
    public static final String ERR_CODE_HOTEL_SALE_UPDATE_FAILURE = "425";
    /**房型图片上传异常*/
    public static final String ERR_CODE_ROOM_FILE_UPLOAD_FAILURE = "426";
    /**房型详情查询异常*/
    public static final String ERR_CODE_PRODUCT_ROOM_DETAILS_FAILURE = "427";
    /**查询酒店下房型异常*/
    public static final String ERR_CODE_PRODUCT_ROOM_QUERY_FAILURE = "428";
    /**查询酒店下房型列表异常*/
    public static final String ERR_CODE_PRODUCT_ROOM_NAME_QUERY_FAILURE = "429";
    /**查询产品详情异常*/
    public static final String ERR_CODE_PRODUCT_PRODUCT_DETAILS_FAILURE = "430";
    /**产品编辑异常*/
    public static final String ERR_CODE_PRODUCT_PRODUCT_EDIT_FAILURE = "431";
    /**获取省份异常*/
    public static final String ERR_CODE_REGION_PROVINCE_FAILURE = "432";
    /**获取城市异常*/
    public static final String ERR_CODE_REGION_CITY_FAILURE = "433";
    /**获取区域异常*/
    public static final String ERR_CODE_REGION_REGION_FAILURE = "434";
    /**首页城市推荐异常*/
    public static final String ERR_CODE_INDEX_RECOMMEND_FAILURE = "435";
    /**设施查询异常*/
    public static final String ERR_CODE_FACILITIES_QUERY_FAILURE = "436";
    /**已选设施查询异常*/
    public static final String ERR_CODE_FACILITIES_HAVING_QUERY_FAILURE = "437";
    /**新增设施异常*/
    public static final String ERR_CODE_FACILITIES_ADD_FAILURE = "438";
    /**移除设施异常*/
    public static final String ERR_CODE_FACILITIES_REMOVE_FAILURE = "439";
    /**首页城市提示异常*/
    public static final String ERR_CODE_INDEX_CITY_TIPS_FAILURE = "440";
    /**首页区域提示异常*/
    public static final String ERR_CODE_INDEX_REGION_TIPS_FAILURE = "441";
    /**酒店基本信息查询异常*/
    public static final String ERR_CODE_PRODUCT_HOTEL_QUERY_ERROR = "442";
    /**酒店图片查询异常*/
    public static final String ERR_CODE_PRODUCT_HOTEL_FILE_QUERY_ERROR = "443";
    /**修改设施选项异常*/
    public static final String ERR_CODE_FACILITIES_OPTION_FAILURE = "444";
    /**设施分页查询异常*/
    public static final String ERR_CODE_FACILITIES_PAGE_QUERY_FAILURE = "445";
    /**删除设施异常*/
    public static final String ERR_CODE_FACILITIES_DELETE_FAILURE = "446";
    /**设施保存异常*/
    public static final String ERR_CODE_FACILITIES_SAVE_FAILURE = "447";
    /**酒店详情保存异常*/
    public static final String ERR_CODE_HOTEL_DETAILS_SAVE_FAILURE = "448";

    /*end   产品api 统一返回码 400-499**/

    /*begin banner/news api 统一返回码 500-599**/
    public static final String ERR_CODE_BANNER_FAIL = "500";
    public static final String ERR_CODE_BANNER_FAIL_MSG = "调用BANNER Api失败";

    public static final String ERR_CODE_BANNER_PARAM_NULL = "501";
    public static final String ERR_CODE_BANNER_PARAM_NULL_MSG = "参数为空";

    public static final String ERR_CODE_BANNER_CREATE_FAIL = "502";
    public static final String ERR_CODE_BANNER_CREATE_FAIL_MSG = "创建BANNER失败";

    public static final String ERR_CODE_BANNER_UPDATE_FAIL = "503";
    public static final String ERR_CODE_BANNER_UPDATE_FAIL_MSG = "更新BANNER失败";

    public static final String ERR_CODE_NEWS_CREATE_FAIL = "504";
    public static final String ERR_CODE_NEWS_CREATE_FAIL_MSG = "创建NEWS失败";

    public static final String ERR_CODE_NEWS_UPDATE_FAIL = "505";
    public static final String ERR_CODE_NEWS_UPDATE_FAIL_MSG = "更新NEWS失败";

    public static final String ERR_CODE_BANNER_STATUS_FAIL = "506";
    public static final String ERR_CODE_BANNER_STATUS_FAIL_MSG = "活动Banner超限，停用Banner";

    public static final String ERR_CODE_BANNER_DELETE_FAIL = "507";
    public static final String ERR_CODE_BANNER_DELETE_FAIL_MSG = "删除BANNER失败";

    public static final String ERR_CODE_NEWS_DELETE_FAIL = "508";
    public static final String ERR_CODE_NEWS_DELETE_FAIL_MSG = "删除NEWS失败";

    public static final String ERR_CODE_NEWS_STATUS_FAIL = "509";
    public static final String ERR_CODE_NEWS_STATUS_FAIL_MSG = "更新BANNER状态失败";

    public static final String ERR_CODE_BANNER_QUERY_NULL = "510";
    public static final String ERR_CODE_BANNER_QUERY_NULL_MSG = "未查询到BANNER";

    public static final String ERR_CODE_BANNER_INVAILD_PARAM = "511";
    public static final String ERR_CODE_BANNER_INVAILD_PARAM_MSG = "无效参数";

    public static final String ERR_CODE_NEWS_QUERY_NULL = "512";
    public static final String ERR_CODE_NEWS_QUERY_NULL_MSG = "未查询到NEWS";

    public static final String ERR_CODE_NEWS_INVAILD_PARAM = "513";
    public static final String ERR_CODE_NEWS_INVAILD_PARAM_MSG = "无效参数";

    public static final String ERR_CODE_NEWS_PARAM_NULL = "514";
    public static final String ERR_CODE_NEWS_PARAM_NULL_MSG = "参数为空";

    public static final String ERR_CODE_NEWS_FAIL = "515";
    public static final String ERR_CODE_NEWS_FAIL_MSG = "调用NEWS Api失败";
    /*end 订单api 统一返回码 **/

    /*start 售卖api 统一返回码 **/
    public static final String ERR_CODE_PRICE_LESSTHAN_MINPRICE = "600";
    /*end 售卖api 统一返回码 **/

    /*start 财务api 统一回复码 700-799***/
    public static final String ERR_CODE_BILL_CREATE_FAIL = "700";
    public static final String ERR_CODE_BILL_CREATE_FAIL_MSG = "创建账单失败";

    public static final String ERR_CODE_BILL_ORDER_RELA_CREATE_FAIL = "701";
    public static final String ERR_CODE_BILL_ORDER_RELA_CREATE_FAIL_MSG = "创建账单订单关系失败";

    public static final String ERR_CODE_BILL_ORDER_PARAM_NULL = "702";
    public static final String ERR_CODE_BILL_ORDER_PARAM_NULL_MSG = "创建账单订单关联参数缺失";
    /*end 财务api 统一回复码 700-799***/


    public static Map<String,String> msgMap = new HashMap<String, String>();
    static{
        msgMap.put(ERR_CODE_0,"成功");
        msgMap.put(PARAM_ISNULL,"缺少必要参数");
        msgMap.put(PARAM_ERROR,"请求参数不合法");
        msgMap.put(INTERNAL_ERROR,"未知错误或系统忙");
    }
}
