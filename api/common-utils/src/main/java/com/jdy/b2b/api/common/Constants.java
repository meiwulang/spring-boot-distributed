package com.jdy.b2b.api.common;

import java.util.HashMap;
import java.util.LinkedHashMap;

/**
 * @Description 常量接口
 * @author 王斌
 * @date 2017年7月3日 下午2:49:05
 * @version V1.0
 */
public interface Constants {
	public final static Integer DESIGN_TYPE = 0;//方案类型
	public final static Integer REQUIRE_TYPE = 1;//需求类型

	public final static Integer USER_STYPE_SALE_NO = 0;//非销售员工
	public final static Integer USER_STYPE_SALE_YES = 1;//销售员工
	public final static Integer USER_STYPE_AGENT = 2;//签约代理人

	public final static String LOGIN_BY_VERIFYCODE = "LOGIN_BY_VERIFYCODE";// 根据用户名
	// 状态 0:处理中 1:已受理 2:已提现 3:已失败 4:已合并 5:已撤销
	public final static Integer WITHDRAWALS_HANDLING = 0;
	public final static Integer WITHDRAWALS_ACCEPTED = 1;
	public final static Integer WITHDRAWALS_CASHED = 2;
	public final static Integer WITHDRAWALS_FAILED = 3;
	public final static Integer WITHDRAWALS_MERGED = 4;
	public final static Integer WITHDRAWALS_REVOKED = 5;

	String DEFAULT_START_DATE = "10170914"; // 有效
	String DEFAULT_END_DATE = "10170914"; // 有效

	public final static Integer TRANSFER_FAILED = 0;
	public final static Integer TRANSFER_HANDLING = 1;
	public final static Integer TRANSFER_FINISHED = 2;
	public final static Integer TRANSFER_REVOKED = 3;

	public final static Boolean BOOLEAN_EFFECT_NO = true; // 不生效
	public final static Boolean BOOLEAN_EFFECT_YES = false; // 生效

	// 状态 0:未处理 1:已处理 2:已撤销
	public final static Integer INVOICE_NO_HANDLE = 0;
	public final static Integer INVOICE_HANDLED = 1;
	public final static Integer INVOICE_REVOKE = 2;

	public final static Boolean ORDER_REFUND_YES = true; // 已退款
	public final static Boolean ORDER_REFUND_NO = false; // 未退款

	public final static Boolean TICKET_DEFAULT_PRICE_YES = true; // 默认价格
	public final static Boolean TICKET_DEFAULT_PRICE_NO = false; // 非默认价格
	public final static Long COMPANY_DEFAULT_ROLE = 2l; // 有效
	public final static Integer PINYIN_LENGTH = 10; // 有效
	// 权限等级 数据级别0:用户级 1:部门级2:单位级3:系统级 4:默认
	public final static Integer DATA_LIMIT_UESR = 0;
	public final static Integer DATA_LIMIT_DEPT = 1;
	public final static Integer DATA_LIMIT_COM = 2;
	public final static Integer DATA_LIMIT_SYS = 3;

	//用户类型 用户区分0:供应商1:分销商2:管理公司 3:分销中心 4:默认类型
	public final static Integer USER_TYPE_SUPPLIER = 0;
	public final static Integer USER_TYPE_BUYER = 1;
	public final static Integer USER_TYPE_ADMIN = 2;
	public final static Integer USER_TYPE_DISTADMIN = 3;
	public final static Integer USER_TYPE_DEFAULT = 4;



	public final static Integer ALBUM_TYPE_HOTEL = 0;// 附件表类目名称:酒店
	public final static Integer ALBUM_TYPE_SCENIC = 1;// 附件表类目名称:景点

	Integer EFFECT_YES = 0; // 有效
	Integer EFFECT_NO = 1; // 无效
	// 0:有效 1:无效 2:删除
	Integer TICKET_EFFECT_YES = 0; // 票状态,有效
	Integer TICKET_EFFECT_NO = 1; // 票状态,无效
	Integer TICKET_DELETE = 2; // 删除

	Integer ROLE_EFFECT_YES = 0; // 角色状态,有效
	Integer ROLE_EFFECT_NO = 1; // 角色状态,无效
	// 状态 0:有效 1:无效 2:锁定
	Integer USER_EFFECT_YES = 0; // 标签分组状态,有效
	Integer USER_DELETE = 1; // 删除
	Integer USER_LOCK = 2; // 锁定

	Integer LABELGROUP_EFFECT_YES = 0; // 标签分组状态,有效
	Integer LABELGROUP_EFFECT_NO = 1; // 标签分组状态,无效

	Integer LABEL_EFFECT_YES = 0; // 标签状态,有效
	Integer LABEL_EFFECT_NO = 1; // 标签状态,无效

	Integer ADVER_EFFECT_YES = 0; // 广告状态,有效
	Integer ADVER_EFFECT_NO = 1; // 广告状态,无效

	Integer SCENIC_EFFECT_YES = 0; // 景点状态,有效
	Integer SCENIC_EFFECT_NO = 1; // 景点状态,无效

	Integer HOTEL_EFFECT_YES = 0; // 酒店状态,有效
	Integer HOTEL_EFFECT_NO = 1; // 酒店状态,无效

	Integer TICKET_SINGLE_YES = 0; // 票价类型:单票
	Integer TICKET_SINGLE_NO = 1; // 票价类型:套票

	class ProduceType {
		private static final String ALL_KEY = "0";
		private static final String ALL_VALUE = "全部类型";

		private static final String NEAR_KEY = "10";
		private static final String NEAR_VALUE = "周边短线";

		private static final String DOMESTIC_KEY = "11";
		private static final String DOMESTIC_VALUE = "国内长线";

		private static final String OFFSHORE_KEY = "20";
		private static final String OFFSHORE_VALUE = "出境长线";
		
		private static final String OFFSHORE_LONG_KEY = "21";
		private static final String OFFSHORE_LONG_VALUE = "出境短线";

		private static final String LINER_KEY = "30";
		private static final String LINER_VALUE = "邮轮";

		private static final String CHARACTERISTIC_KEY = "40";
		private static final String CHARACTERISTIC_VALUE = "特色游";

		private static final String SELF_HELP_KEY = "50";
		private static final String SELF_HELP_VALUE = "自由行";
		
		private static final String OFFSHORE_LAND_KEY = "51";
		private static final String OFFSHORE_LAND_VALUE = "出境海岛";
		
		private static final String DESIGN_TRAVEL_KEY = "52";
		private static final String DESIGN_TRAVEL_VALUE = "定制旅游";
		
		private static final String TEAM_MEET = "54";
		private static final String TEAM_MEET_VALUE = "团队会奖";
		
		private static final String SIGN_SERVER = "55";
		private static final String SIGN_SERVER_VALUE = "签证服务";
		
		private static final String AIRPORT_BOOK = "56";
		private static final String AIRPORT_BOOK_VALUE = "机票预订";
		
		private static final String HOTEL_BOOK = "57";
		private static final String HOTEL_BOOK_VALUE = "酒店预订";
		
		private static final String SINGLE_PART_AGENT = "58";
		private static final String SINGLE_PART_AGENT_VALUE = "单项委托";
		
		private static final String OTHER_SERVICE = "59";
		private static final String OTHER_SERVICE_VALUE = "其他服务";
		
		private static final String OUTSIDE_ACTIVITY = "60";
		private static final String OUTSIDE_ACTIVITY_VALUE = "户外拓展";
		
		private static final String STUDY_TRAVEL = "61";
		private static final String STUDY_TRAVEL_VALUE = "游学/研学";
		
		private static final String SELF_TRAVEL = "62";
		private static final String SELF_TRAVEL_VALUE = "自驾游";
		
		private static final String GLOBAL_TRAVEL = "63";
		private static final String GLOBAL_TRAVEL_VALUE = "全球旅拍";
		
		private static final String GLOBAL_FINANCE = "64";
		private static final String GLOBAL_FINANCE_VALUE = "旅游金融";
		
		private static final String TRAVEL_PROPERTY = "65";
		private static final String TRAVEL_PROPERTY_VALUE = "旅游地产";
		
		private static final String PARENTAL = "66";
		private static final String PARENTAL_VALUE = "亲子";
		private static final String SINGLE_PHOTO = "67";
		private static final String SINGLE_PHOTO_VALUE = "单一资源+拍";
		private static final String THEME_TRAVEL_KEY = "68";
		private static final String THEME_TRAVEL_VALUE = "主题游";
		public static final LinkedHashMap<String, String> POOL = new LinkedHashMap<String, String>();
		static {
			POOL.put(ALL_KEY, ALL_VALUE);
			POOL.put(NEAR_KEY, NEAR_VALUE);
			POOL.put(DOMESTIC_KEY, DOMESTIC_VALUE);
			POOL.put(OFFSHORE_KEY, OFFSHORE_VALUE);
			POOL.put(LINER_KEY, LINER_VALUE);
			POOL.put(CHARACTERISTIC_KEY, CHARACTERISTIC_VALUE);
			POOL.put(SELF_HELP_KEY, SELF_HELP_VALUE);
			POOL.put(OFFSHORE_LONG_KEY, OFFSHORE_LONG_VALUE);
			POOL.put(OFFSHORE_LAND_KEY,OFFSHORE_LAND_VALUE );
			POOL.put(DESIGN_TRAVEL_KEY, DESIGN_TRAVEL_VALUE);
			POOL.put(TEAM_MEET, TEAM_MEET_VALUE);
			POOL.put(SIGN_SERVER, SIGN_SERVER_VALUE);
			POOL.put(AIRPORT_BOOK, AIRPORT_BOOK_VALUE);
			POOL.put(HOTEL_BOOK, HOTEL_BOOK_VALUE);
			POOL.put(SINGLE_PART_AGENT, SINGLE_PART_AGENT_VALUE);
			POOL.put(OTHER_SERVICE, OTHER_SERVICE_VALUE);
			POOL.put(OUTSIDE_ACTIVITY, OUTSIDE_ACTIVITY_VALUE);
			POOL.put(STUDY_TRAVEL, STUDY_TRAVEL_VALUE);
			POOL.put(SELF_TRAVEL, SELF_TRAVEL_VALUE);
			POOL.put(GLOBAL_TRAVEL, GLOBAL_TRAVEL_VALUE);
			POOL.put(GLOBAL_FINANCE, GLOBAL_FINANCE_VALUE);
			POOL.put(TRAVEL_PROPERTY, TRAVEL_PROPERTY_VALUE);
			POOL.put(PARENTAL, PARENTAL_VALUE);
			POOL.put(SINGLE_PHOTO, SINGLE_PHOTO_VALUE);
			POOL.put(THEME_TRAVEL_KEY, THEME_TRAVEL_VALUE);
			
			
		}

	}

	class Result {
		public static final String RESULT_LIST = "resultList";
		public static final String TOTAL_NUM = "totalNum";
		public static final String TOTAL_INFO = "totalInfo";
	}

	class Fields {
		public static final String ATID = "aTid";
		public static final String SCENIC = "scenicspot";
		public static final String HOTEL = "hotel";
		public static final String HAVE_MEALS = "haveMeals";
		public static final String STID = "stId";
		public static final String ID = "id";
		public static final String TRIP_IDS = "tripIds";
		public static final String PRODUCT_KEYS = "productKeys";
		public static final String PRODUCT = "product";
		public static final String TRIP_CALENDAR = "tripCalendar";
		public static final String TRIP = "trip";
		public static final String TRIPS = "trips";
		public static final String ATTACH = "attach";
		public static final String ATTACHS = "attachs";
		public static final String PH_SCENICI_DS = "phScenicIds";
		public static final String PH_HOTELI_DS = "phHotelIds";
		public static final String LINE = "line";
		public static final String T_TITLE = "tTitle";
	}

	class Status {
		public static final String DEL = "del";
		public static final String OK = "ok";
		public static final String USEING = "发布";
		public static final String WAITING = "待审核";
		public static final String STOP = "停用";
		public static final int ENABLE = 0;
		public static final int DISABLE = 1;
		public static final int UNEFFECT = 2;
		public static final int EFFECTING = 3;
	}

	class Error {
		public static final String COMMON_ERROR_CODE = "-1";
		public static final String INSUFFICIENT_AUTHORITY = "操作权限不足或该数据不存在";
		public static final String EXITS_NAME = "该名称已存在";
		public static final String EXITS_DATE = "价格策略的有效日期冲突";
		public static final String ERROR_DATE = "开始时间不能大于结束时间";
		public static final String ERROR_ALBUM_SIZE = "1个相册限制10张图片";
		public static final String ERROR_TRIP_SIZE = "行程天数请和线路天数保持一致";
		public static final String ERROR_TRIP_TITLE = "补充行程标题不能为空";
		public static final String ERROR_TRIP_EXIST_DATE = "补充行程时间不能交叉";
		public static final String ERROR_TRIP_DATE = "补充行程时间不能为空";
		public static final String ERROR_DEFAULT_TRIP = "默认行程只能有一个";
		public static final String ERROR_ID = "id不能为空";
		public static final String ERROR_COMPANYID = "companyId不能为空";
		public static final String NOT_EXIST_KEYWORD = "该关键词已存在";
		public static final String EFFECT_DATE_CANNOT_NULL = "补充行程有效日期不能为空";
		public static final String ERROR_EFFECT_DATE = "补充行程有效日期开始时间不能大于结束时间";
		public static final String INSUFFICIENT_AUTHORITY_FOR_ACID = "操作权限不足";
		public static final String ERROR_ATTACH_SIZE = "请选择需要删除的文件";
		public static final String PROJECT_EXIST = "需求被已定制，定制失败";
		public static final String ERROR_LIFE_CYCLE = "生命周期结束时间不可小于开始时间";
	}

	class Query {
		public static final String FIELD = "field";// 字段
		public static final String DRCT = "drct";// 方向
		public static final String AES = "aes";// 升序
		public static final String DESC = "desc";// 降序
	}

	class StationType {
		public static final String START_STATION = "始发站";
		public static final Integer START_STATION_VALUE = 0;
		public static final String ALL = "全部";
		public static final Integer ALL_VALUE = 4;
		public static final String HALFWAY_STOP = "顺路站";
		public static final Integer HALFWAY_STOP_VALUE = 1;
		public static final String BUS_STOP = "班车站";
		public static final Integer BUS_STOP_VALUE = 2;
		public static final HashMap<String, Integer> TYPE_MAP = new HashMap<>();
		public static final HashMap<Integer, String> STATION_MAP = new HashMap<>();
		static {
			TYPE_MAP.put(START_STATION, 0);
			TYPE_MAP.put(HALFWAY_STOP, 1);
			TYPE_MAP.put(BUS_STOP, 2);
			STATION_MAP.put(START_STATION_VALUE, START_STATION);
			STATION_MAP.put(HALFWAY_STOP_VALUE, HALFWAY_STOP);
			STATION_MAP.put(BUS_STOP_VALUE, BUS_STOP);
		}
	}

	String CODE = "code"; // 接口调用返回标识
	String MESSAGE = "message"; // 返回信息
	String EXTMESSAGE = "extmessage";

	/** 日期格式 */
	// yyyy-MM-dd HH:mm:ss
	String DATE_FORMAT_YYYYMMDDHHMMSS = "yyyy-MM-dd HH:mm:ss";
	// yyyy-MM-dd HH:mm:ss
	String DATE_FORMAT_YYYYMMDDHHMMSSSSS = "yyyy-MM-dd HH:mm:ss.SSS";

	String HT_AGENRY_COMPANY_CODE_REDIS_KEY = "HT_AGENRY_COMPANY_CODE";

	String HT_SUPPLIER_COMPANY_CODE_REDIS_KEY = "HT_SUPPLIER_COMPANY_CODE";

	int HT_ETK_TYPE = 3;

	int HT_ETK_AGENRY_TYPE = 1;

	int HT_ETK_SUPPLIER_TYPE = 2;

	/** 字符集 */
	// UTF-8
	String CHARSET_UTF8 = "UTF-8";
	// GBK
	String CHARSET_GBK = "GBK";

	/** 数据格式 */
	// XML
	String DATA_PROTOCOL_TYPE_XML = "xml";
	// JSON
	String DATA_PROTOCOL_TYPE_JSON = "json";

	/** 签名方式 */
	// MD5
	String SIGN_TYPE_MD5 = "md5";

	/** 系统参数名 */
	// method
	String SYS_PARAM_METHOD = "method";
	// format
	String SYS_PARAM_FORMAT = "format";
	// session
	String SYS_PARAM_SESSION = "session";
	// timestamp
	String SYS_PARAM_TIMESTAMP = "timestamp";
	// app_key
	String SYS_PARAM_APP_KEY = "app_key";
	// sign
	String SYS_PARAM_SIGN = "sign";

	String ROP_CONST_ID = "ROP_CONST_ID";
	String ROP_PRODUCT_ID = "ROP_PRODUCT_ID";
	String APP_ROP_URL = "APP_ROP_URL";
	String APP_KEY = "APP_KEY";
	String APP_SECRET = "APP_SECRET";
	int STATUS_0 = 0;
	int STATUS_1 = 1;
	int STATUS_2 = 2;

	String ROP_PAY_URL = "ROP_PAY_URL";

	String PAGE_URL = "PAGE_URL";
	String NOTIFY_URL = "NOTIFY_URL";

	String MD5_KEY = "MD5_KEY";
	String USER_RELATE_ID = "USER_RELATE_ID";
	String ROP = "ROP";

	// 订单状态
	int ORDER_STATUS_1 = 1;// 待确认
	int ORDER_STATUS_2 = 2;// 已确认
	int ORDER_STATUS_3 = 3;// 已取消
	int ORDER_STATUS_4 = 4;// 已付款
	int ORDER_STATUS_5 = 5;// 未付款
	int ORDER_STATUS_6 = 6;// 已退款

	// Banner状态
	int BANNER_STATUS_1 = 0;// 激活
	int BANNER_STATUS_2 = 2;// 停用
	// 订单Redis的Key
	String ORDER_NO = "ORDER_NO";
	String PRODUCT_PRICE_RULE_DEFAULT_NAME = "产品售卖规则";
	String PRODUCT_PRICE_RULE_OPERTYPE = "1,2,3,4,5"; // 价格规则操作类型

	/** 酒店图片前缀 */
	String HOTEL_IMAGE_PREFIX = "HOTEL";
	/** 房型图片前缀 */
	String ROOM_IMAGE_PREFIX = "ROOM";
	/** 财务凭证图片前缀 */
	String FINANCE_IMAGE_PREFIX = "FINANCE";
	/** 宽带有线 */
	String ROOM_IS_LAN = "1";
	/** 宽带无线 */
	String ROOM_IS_WLAN = "2";
	/** 销售政策类型 1-酒店销售策略 */
	int INVENTROYSALEPOLICY_TYPE_HOTEL = 1;
	/** 销售政策类型 1-产品销售策略 */
	int INVENTROYSALEPOLICY_TYPE_PRODUCT = 2;

	/** 日志模块 */
	String BUSLOG_MODULE_SALES = "sales"; // 售卖管理模块

	String BUSLOG_OPERTABLE_POPRODUCT = "po_product";

	Integer BUSLOG_APP_ID_HT = 3;

	String BUSLOG_ACTION_UPDATE = "UPDATE";

	String BUSLOG_RESULT_SUCCESS = "SUCCESS";

	int HT_APP_SYS_AGENCY = 1; // 分销商应用编号

	int HT_APP_SYS_SUPPLIER = 2; // 供应商

	int HT_APP_SYS_HT_ETK = 3; // 会唐ETK

	int HT_APP_SYS_HT_ADMIN = 4; // 会唐管理

	/** 产品类型 */
	int PRODUCT_TYPE_ZY = 1;// 自营
	int PRODUCT_TYPE_WC = 2;// 外采

	/** 售卖状态 */
	int IS_SALE_ZS = 1; // 在售
	int IS_SALE_TS = 2; // 停售

	/** 售卖规则固定架 */
	int RULE_OPER_TYPE_FIXED = 3;

	/** 规则有效 */
	int RULE_STATUS_VALID = 1;

	/** 规则无效 */
	int RULE_STATUS_INVALID = 2;

	/** * 订单状态 */
	int ORDER_STATUS_SUBMIT = 1; // 待确认
	int ORDER_STATUS_CONFIRM = 2; // 已确认
	int ORDER_STATUS_CANCEL = 3; // 已取消
	int ORDER_STATUS_PAYMENT = 4; // 已付款
	int ORDER_STATUS_NOT_PAY = 5; // 未付款
	int ORDER_STATUS_REFUND = 6; // 已退款1;

	/** 酒店状态 */
	int HOTEL_STATUS_EDIT = 3; // 编辑中;

	/** 房型状态 */
	int ROOM_STATUS_EDIT = 3; // 编辑中;
	/** 无效 */
	int IS_WIFI_STATUS_INVALID = 9; // 编辑中;

	String REDIS_ROLE_KEY_PERFIX = "role_key";
	int MANAGER_COMPANY_ID = 1;// 管理公司编号

	class AttachType {
		public static final int ROUTE = 0;
		public static final int TRIP = 1;
		public static final int HOTEL = 2;
		public static final int SCENIC = 3;
		public static final int AD = 4;
		public static final int BRAND = 5;
		public static final int PRODUCT = 6;
	}
    class Visitor {
        public static final  String UACCOUNT="游客";
        public static final  String UPASSWORD="123456";
        public static final  String UREALNAME="游客";
        public static final  Long  COMPANYID=999999L;
        public static final  int UCHARGETYPE=0;//0：不是负责人，1：是负责人
        public static final  int  UDATALIMIT=0;
        public static final  Long UROLEID=0L;
        public static final  int UTYPE=2;//用户区分0:非销售类员工1:销售类员工2:游客
        public static final  int USTYPE=3;//用户销售类型 0:非销售类 1:销售类 2:签约人员 3:游客
        public static final  String UTEL="15790776226";
		public static final  String GNO="15125085666499PLOE7AF014XT2YMWP4V";
		public static final  int USTATUS=0;
    }

}
