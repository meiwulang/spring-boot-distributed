package com.jdy.b2b.web.util;

import java.util.LinkedHashMap;

/**
 * @Description 常量接口
 * @author 王斌
 * @date 2017年7月3日 下午2:49:05
 * @version V1.0
 */
public interface Constants {
	//授权回调接口状态 0:正常登陆,1:跳注册页面,2:跳等待页面
	public final static String TO_LOGIN = "0";
	public final static String TO_REGISTER_PAGE = "1";
	public final static String TO_WAIT_PAGE = "2";

	// ShiroRealm中的表示 判断是否是验证码登录

	public final static String LOGIN_BY_OPENID = "LOGIN_BY_OPENID";// 根据OPENID
	public final static String LOGIN_BY_VERIFYCODE = "LOGIN_BY_VERIFYCODE";// 根据用户名

	// 手机端登录查询用户信息
	public final static Integer QUERY_BY_UNAME = 1;// 根据用户名
	public final static Integer QUERY_BY_MOBILE = 2;// 根据手机号

	public final static Boolean BANKMANAGE_EFFECT_YES = false; // 有效
	public final static Boolean BANKMANAGE_EFFECT_NO = true; // 无效

	public final static Boolean TICKET_DEFAULT_PRICE_YES = true; // 默认价格
	public final static Boolean TICKET_DEFAULT_PRICE_NO = false; // 非默认价格

	// 0:用户级 1:部门级2:单位级3:系统级
	public final static Integer DATA_LIMIT_UESR = 0;
	public final static Integer DATA_LIMIT_DEPT = 1;
	public final static Integer DATA_LIMIT_COM = 2;
	public final static Integer DATA_LIMIT_SYS = 3;

	public final static Integer PINYIN_LENGTH = 10; // 有效

	public final static Integer EFFECT_YES = 0; // 有效
	public final static Integer EFFECT_NO = 1; // 无效

	public final static Integer USER_LOCK = 2; // 无效

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

	public static class Result {
		public static final String RESULT_LIST = "resultList";
		public static final String TOTAL_NUM = "totalNum";
	}

	public static class Query {
		public static final String FIELD = "field";// 字段
		public static final String DRCT = "drct";// 方向
		public static final String AES = "aes";// 升序
		public static final String DESC = "desc";// 降序
	}

	public final static String CODE = "code"; // 接口调用返回标识
	public final static String MESSAGE = "message"; // 返回信息
	public final static String EXTMESSAGE = "extmessage";

	/** 日期格式 */
	// yyyy-MM-dd HH:mm:ss
	public static final String DATE_FORMAT_YYYYMMDDHHMMSS = "yyyy-MM-dd HH:mm:ss";
	// yyyy-MM-dd HH:mm:ss
	public static final String DATE_FORMAT_YYYYMMDDHHMMSSSSS = "yyyy-MM-dd HH:mm:ss.SSS";

	public static final String HT_AGENRY_COMPANY_CODE_REDIS_KEY = "HT_AGENRY_COMPANY_CODE";

	public static final String HT_SUPPLIER_COMPANY_CODE_REDIS_KEY = "HT_SUPPLIER_COMPANY_CODE";

	public static final int HT_ETK_TYPE = 3;

	public static final int HT_ETK_AGENRY_TYPE = 1;

	public static final int HT_ETK_SUPPLIER_TYPE = 2;

	/** 字符集 */
	// UTF-8
	public static final String CHARSET_UTF8 = "UTF-8";
	// GBK
	public static final String CHARSET_GBK = "GBK";

	/** 数据格式 */
	// XML
	public static final String DATA_PROTOCOL_TYPE_XML = "xml";
	// JSON
	public static final String DATA_PROTOCOL_TYPE_JSON = "json";

	/** 签名方式 */
	// MD5
	public static final String SIGN_TYPE_MD5 = "md5";

	/** 系统参数名 */
	// method
	public static final String SYS_PARAM_METHOD = "method";
	// format
	public static final String SYS_PARAM_FORMAT = "format";
	// session
	public static final String SYS_PARAM_SESSION = "session";
	// timestamp
	public static final String SYS_PARAM_TIMESTAMP = "timestamp";
	// app_key
	public static final String SYS_PARAM_APP_KEY = "app_key";
	// sign
	public static final String SYS_PARAM_SIGN = "sign";

	public static final String ROP_CONST_ID = "ROP_CONST_ID";
	public static final String ROP_PRODUCT_ID = "ROP_PRODUCT_ID";
	public static final String APP_ROP_URL = "APP_ROP_URL";
	public static final String APP_KEY = "APP_KEY";
	public static final String APP_SECRET = "APP_SECRET";
	public static final int STATUS_0 = 0;
	public static final int STATUS_1 = 1;
	public static final int STATUS_2 = 2;

	public static final String ROP_PAY_URL = "ROP_PAY_URL";

	public static final String PAGE_URL = "PAGE_URL";
	public static final String NOTIFY_URL = "NOTIFY_URL";

	public static final String MD5_KEY = "MD5_KEY";
	public static final String USER_RELATE_ID = "USER_RELATE_ID";
	public static final String ROP = "ROP";

	// 订单状态
	public static final int ORDER_STATUS_1 = 1;// 待确认
	public static final int ORDER_STATUS_2 = 2;// 已确认
	public static final int ORDER_STATUS_3 = 3;// 已取消
	public static final int ORDER_STATUS_4 = 4;// 已付款
	public static final int ORDER_STATUS_5 = 5;// 未付款
	public static final int ORDER_STATUS_6 = 6;// 已退款

	// Banner状态
	public static final int BANNER_STATUS_1 = 0;// 激活
	public static final int BANNER_STATUS_2 = 2;// 停用
	// 订单Redis的Key
	public static final String ORDER_NO = "ORDER_NO";
	public static final String PRODUCT_PRICE_RULE_DEFAULT_NAME = "产品售卖规则";
	public static final String PRODUCT_PRICE_RULE_OPERTYPE = "1,2,3,4,5"; // 价格规则操作类型

	/** 酒店图片前缀 */
	public static final String HOTEL_IMAGE_PREFIX = "HOTEL";
	/** 房型图片前缀 */
	public static final String ROOM_IMAGE_PREFIX = "ROOM";
	/** 财务凭证图片前缀 */
	public static final String FINANCE_IMAGE_PREFIX = "FINANCE";
	/** 宽带有线 */
	public static final String ROOM_IS_LAN = "1";
	/** 宽带无线 */
	public static final String ROOM_IS_WLAN = "2";
	/** 销售政策类型 1-酒店销售策略 */
	public static final int INVENTROYSALEPOLICY_TYPE_HOTEL = 1;
	/** 销售政策类型 1-产品销售策略 */
	public static final int INVENTROYSALEPOLICY_TYPE_PRODUCT = 2;

	/** 日志模块 */
	public static final String BUSLOG_MODULE_SALES = "sales"; // 售卖管理模块

	public static final String BUSLOG_OPERTABLE_POPRODUCT = "po_product";

	public static final Integer BUSLOG_APP_ID_HT = 3;

	public static final String BUSLOG_ACTION_UPDATE = "UPDATE";

	public static final String BUSLOG_RESULT_SUCCESS = "SUCCESS";

	public final static int HT_APP_SYS_AGENCY = 1; // 分销商应用编号

	public final static int HT_APP_SYS_SUPPLIER = 2; // 供应商

	public final static int HT_APP_SYS_HT_ETK = 3; // 会唐ETK

	public final static int HT_APP_SYS_HT_ADMIN = 4; // 会唐管理

	/** 产品类型 */
	public final static int PRODUCT_TYPE_ZY = 1;// 自营
	public final static int PRODUCT_TYPE_WC = 2;// 外采

	/** 售卖状态 */
	public final static int IS_SALE_ZS = 1; // 在售
	public final static int IS_SALE_TS = 2; // 停售

	/** 售卖规则固定架 */
	public final static int RULE_OPER_TYPE_FIXED = 3;

	/** 规则有效 */
	public final static int RULE_STATUS_VALID = 1;

	/** 规则无效 */
	public final static int RULE_STATUS_INVALID = 2;

	/** * 订单状态 */
	public final static int ORDER_STATUS_SUBMIT = 1; // 待确认
	public final static int ORDER_STATUS_CONFIRM = 2; // 已确认
	public final static int ORDER_STATUS_CANCEL = 3; // 已取消
	public final static int ORDER_STATUS_PAYMENT = 4; // 已付款
	public final static int ORDER_STATUS_NOT_PAY = 5; // 未付款
	public final static int ORDER_STATUS_REFUND = 6; // 已退款1;

	/** 酒店状态 */
	public final static int HOTEL_STATUS_EDIT = 3; // 编辑中;

	/** 房型状态 */
	public final static int ROOM_STATUS_EDIT = 3; // 编辑中;
	/** 无效 */
	public final static int IS_WIFI_STATUS_INVALID = 9; // 编辑中;

	public static final String REDIS_ROLE_KEY_PERFIX = "role_key";
	public static final String CITY_INFO = "{\"code\":200,\"message\":\"ok\",\"data\":{\"location\":null,\"letterList\":[\"A\",\"B\",\"C\",\"D\",\"E\",\"F\",\"G\",\"H\",\"I\",\"J\",\"K\",\"L\",\"M\",\"N\",\"O\",\"P\",\"Q\",\"R\",\"S\",\"T\",\"U\",\"V\",\"W\",\"X\",\"Y\",\"Z\"],\"currentCity\":{\"name\":\"杭州\",\"code\":\"330100\"},\"cityList\":{\"A\":[{\"id\":\"74\",\"code\":\"210300\",\"name\":\"鞍山\",\"ename\":\"anshan\",\"fename\":\"A\",\"pid\":\"6\",\"area\":\"0412\",\"istop\":\"0\",\"first_letter\":\"A\"}],\"B\":[{\"id\":\"36\",\"code\":\"110100\",\"name\":\"北京\",\"ename\":\"beijing\",\"fename\":\"B\",\"pid\":\"1\",\"area\":\"010\",\"istop\":\"0\",\"first_letter\":\"B\"},{\"id\":\"43\",\"code\":\"130600\",\"name\":\"保定\",\"ename\":\"baoding\",\"fename\":\"B\",\"pid\":\"3\",\"area\":\"0312\",\"istop\":\"0\",\"first_letter\":\"B\"},{\"id\":\"137\",\"code\":\"340300\",\"name\":\"蚌埠\",\"ename\":\"bengbu\",\"fename\":\"B\",\"pid\":\"12\",\"area\":\"0552\",\"istop\":\"0\",\"first_letter\":\"B\"},{\"id\":\"308\",\"code\":\"530500\",\"name\":\"保山\",\"ename\":\"baoshan\",\"fename\":\"B\",\"pid\":\"25\",\"area\":\"0875\",\"istop\":\"0\",\"first_letter\":\"B\"}],\"C\":[{\"id\":\"45\",\"code\":\"130800\",\"name\":\"承德\",\"ename\":\"chengde\",\"fename\":\"C\",\"pid\":\"3\",\"area\":\"0314\",\"istop\":\"0\",\"first_letter\":\"C\"},{\"id\":\"46\",\"code\":\"130900\",\"name\":\"沧州\",\"ename\":\"cangzhou\",\"fename\":\"C\",\"pid\":\"3\",\"area\":\"0317\",\"istop\":\"0\",\"first_letter\":\"C\"},{\"id\":\"113\",\"code\":\"320400\",\"name\":\"常州\",\"ename\":\"changzhou\",\"fename\":\"C\",\"pid\":\"10\",\"area\":\"0519\",\"istop\":\"0\",\"first_letter\":\"C\"},{\"id\":\"144\",\"code\":\"341100\",\"name\":\"滁州\",\"ename\":\"chuzhou\",\"fename\":\"C\",\"pid\":\"12\",\"area\":\"0550\",\"istop\":\"0\",\"first_letter\":\"C\"},{\"id\":\"275\",\"code\":\"510100\",\"name\":\"成都\",\"ename\":\"chengdu\",\"fename\":\"C\",\"pid\":\"23\",\"area\":\"028\",\"istop\":\"0\",\"first_letter\":\"C\"},{\"id\":\"313\",\"code\":\"532300\",\"name\":\"楚雄彝族自治州\",\"ename\":\"chuxiong\",\"fename\":\"C\",\"pid\":\"25\",\"area\":\"0878\",\"istop\":\"0\",\"first_letter\":\"C\"}],\"D\":[{\"id\":\"73\",\"code\":\"210200\",\"name\":\"大连\",\"ename\":\"dalian\",\"fename\":\"D\",\"pid\":\"6\",\"area\":\"0411\",\"istop\":\"0\",\"first_letter\":\"D\"},{\"id\":\"317\",\"code\":\"532900\",\"name\":\"大理白族自治州\",\"ename\":\"dali\",\"fename\":\"D\",\"pid\":\"25\",\"area\":\"0872\",\"istop\":\"0\",\"first_letter\":\"D\"},{\"id\":\"318\",\"code\":\"533100\",\"name\":\"德宏傣族景颇族自治州\",\"ename\":\"dehong\",\"fename\":\"D\",\"pid\":\"25\",\"area\":\"0692\",\"istop\":\"0\",\"first_letter\":\"D\"},{\"id\":\"320\",\"code\":\"533400\",\"name\":\"迪庆藏族自治州\",\"ename\":\"deqen\",\"fename\":\"D\",\"pid\":\"25\",\"area\":\"0887\",\"istop\":\"0\",\"first_letter\":\"D\"}],\"F\":[{\"id\":\"151\",\"code\":\"350100\",\"name\":\"福州\",\"ename\":\"fuzhou\",\"fename\":\"F\",\"pid\":\"13\",\"area\":\"0591\",\"istop\":\"0\",\"first_letter\":\"F\"}],\"H\":[{\"id\":\"66\",\"code\":\"150700\",\"name\":\"呼伦贝尔\",\"ename\":\"hulunber\",\"fename\":\"H\",\"pid\":\"5\",\"area\":\"0470\",\"istop\":\"0\",\"first_letter\":\"H\"},{\"id\":\"96\",\"code\":\"230100\",\"name\":\"哈尔滨\",\"ename\":\"harbin\",\"fename\":\"H\",\"pid\":\"8\",\"area\":\"0451\",\"istop\":\"0\",\"first_letter\":\"H\"},{\"id\":\"117\",\"code\":\"320800\",\"name\":\"淮安\",\"ename\":\"huaian\",\"fename\":\"H\",\"pid\":\"10\",\"area\":\"0517\",\"istop\":\"0\",\"first_letter\":\"H\"},{\"id\":\"123\",\"code\":\"330100\",\"name\":\"杭州\",\"ename\":\"hangzhou\",\"fename\":\"H\",\"pid\":\"11\",\"area\":\"0571\",\"istop\":\"0\",\"first_letter\":\"H\"},{\"id\":\"127\",\"code\":\"330500\",\"name\":\"湖州\",\"ename\":\"huzhou\",\"fename\":\"H\",\"pid\":\"11\",\"area\":\"0572\",\"istop\":\"0\",\"first_letter\":\"H\"},{\"id\":\"135\",\"code\":\"340100\",\"name\":\"合肥\",\"ename\":\"hefei\",\"fename\":\"H\",\"pid\":\"12\",\"area\":\"0551\",\"istop\":\"0\",\"first_letter\":\"H\"},{\"id\":\"314\",\"code\":\"532500\",\"name\":\"红河哈尼族彝族自治州\",\"ename\":\"honghe\",\"fename\":\"H\",\"pid\":\"25\",\"area\":\"0873\",\"istop\":\"0\",\"first_letter\":\"H\"},{\"id\":\"334\",\"code\":\"610700\",\"name\":\"汉中\",\"ename\":\"hanzhong\",\"fename\":\"H\",\"pid\":\"27\",\"area\":\"0916\",\"istop\":\"0\",\"first_letter\":\"H\"}],\"J\":[{\"id\":\"126\",\"code\":\"330400\",\"name\":\"嘉兴\",\"ename\":\"jiaxing\",\"fename\":\"J\",\"pid\":\"11\",\"area\":\"0573\",\"istop\":\"0\",\"first_letter\":\"J\"},{\"id\":\"129\",\"code\":\"330700\",\"name\":\"金华\",\"ename\":\"jinhua\",\"fename\":\"J\",\"pid\":\"11\",\"area\":\"0579\",\"istop\":\"0\",\"first_letter\":\"J\"},{\"id\":\"171\",\"code\":\"370100\",\"name\":\"济南\",\"ename\":\"jinan\",\"fename\":\"J\",\"pid\":\"15\",\"area\":\"0531\",\"istop\":\"0\",\"first_letter\":\"J\"}],\"K\":[{\"id\":\"305\",\"code\":\"530100\",\"name\":\"昆明\",\"ename\":\"kunming\",\"fename\":\"K\",\"pid\":\"25\",\"area\":\"0871\",\"istop\":\"0\",\"first_letter\":\"K\"}],\"L\":[{\"id\":\"47\",\"code\":\"131000\",\"name\":\"廊坊\",\"ename\":\"langfang\",\"fename\":\"L\",\"pid\":\"3\",\"area\":\"0316\",\"istop\":\"0\",\"first_letter\":\"L\"},{\"id\":\"116\",\"code\":\"320700\",\"name\":\"连云港\",\"ename\":\"lianyungang\",\"fename\":\"L\",\"pid\":\"10\",\"area\":\"0518\",\"istop\":\"0\",\"first_letter\":\"L\"},{\"id\":\"133\",\"code\":\"331100\",\"name\":\"丽水\",\"ename\":\"lishui\",\"fename\":\"L\",\"pid\":\"11\",\"area\":\"0578\",\"istop\":\"0\",\"first_letter\":\"L\"},{\"id\":\"183\",\"code\":\"371300\",\"name\":\"临沂\",\"ename\":\"linyi\",\"fename\":\"L\",\"pid\":\"15\",\"area\":\"0539\",\"istop\":\"0\",\"first_letter\":\"L\"},{\"id\":\"310\",\"code\":\"530700\",\"name\":\"丽江\",\"ename\":\"lijiang\",\"fename\":\"L\",\"pid\":\"25\",\"area\":\"0888\",\"istop\":\"0\",\"first_letter\":\"L\"},{\"id\":\"312\",\"code\":\"530900\",\"name\":\"临沧\",\"ename\":\"lincang\",\"fename\":\"L\",\"pid\":\"25\",\"area\":\"0883\",\"istop\":\"0\",\"first_letter\":\"L\"}],\"M\":[{\"id\":\"139\",\"code\":\"340500\",\"name\":\"马鞍山\",\"ename\":\"maanshan\",\"fename\":\"M\",\"pid\":\"12\",\"area\":\"0555\",\"istop\":\"0\",\"first_letter\":\"M\"},{\"id\":\"280\",\"code\":\"510700\",\"name\":\"绵阳\",\"ename\":\"mianyang\",\"fename\":\"M\",\"pid\":\"23\",\"area\":\"0816\",\"istop\":\"0\",\"first_letter\":\"M\"}],\"N\":[{\"id\":\"110\",\"code\":\"320100\",\"name\":\"南京\",\"ename\":\"nanjing\",\"fename\":\"N\",\"pid\":\"10\",\"area\":\"025\",\"istop\":\"0\",\"first_letter\":\"N\"},{\"id\":\"115\",\"code\":\"320600\",\"name\":\"南通\",\"ename\":\"nantong\",\"fename\":\"N\",\"pid\":\"10\",\"area\":\"0513\",\"istop\":\"0\",\"first_letter\":\"N\"},{\"id\":\"124\",\"code\":\"330200\",\"name\":\"宁波\",\"ename\":\"ningbo\",\"fename\":\"N\",\"pid\":\"11\",\"area\":\"0574\",\"istop\":\"0\",\"first_letter\":\"N\"},{\"id\":\"157\",\"code\":\"350700\",\"name\":\"南平\",\"ename\":\"nanping\",\"fename\":\"N\",\"pid\":\"13\",\"area\":\"0599\",\"istop\":\"0\",\"first_letter\":\"N\"},{\"id\":\"159\",\"code\":\"350900\",\"name\":\"宁德\",\"ename\":\"ningde\",\"fename\":\"N\",\"pid\":\"13\",\"area\":\"0593\",\"istop\":\"0\",\"first_letter\":\"N\"},{\"id\":\"319\",\"code\":\"533300\",\"name\":\"怒江傈僳族自治州\",\"ename\":\"nujiang\",\"fename\":\"N\",\"pid\":\"25\",\"area\":\"0886\",\"istop\":\"0\",\"first_letter\":\"N\"}],\"P\":[{\"id\":\"153\",\"code\":\"350300\",\"name\":\"莆田\",\"ename\":\"putian\",\"fename\":\"P\",\"pid\":\"13\",\"area\":\"0594\",\"istop\":\"0\",\"first_letter\":\"P\"},{\"id\":\"311\",\"code\":\"530800\",\"name\":\"普洱\",\"ename\":\"puer\",\"fename\":\"P\",\"pid\":\"25\",\"area\":\"0879\",\"istop\":\"0\",\"first_letter\":\"P\"}],\"Q\":[{\"id\":\"40\",\"code\":\"130300\",\"name\":\"秦皇岛\",\"ename\":\"qinhuangdao\",\"fename\":\"Q\",\"pid\":\"3\",\"area\":\"0335\",\"istop\":\"0\",\"first_letter\":\"Q\"},{\"id\":\"130\",\"code\":\"330800\",\"name\":\"衢州\",\"ename\":\"quzhou\",\"fename\":\"Q\",\"pid\":\"11\",\"area\":\"0570\",\"istop\":\"0\",\"first_letter\":\"Q\"},{\"id\":\"172\",\"code\":\"370200\",\"name\":\"青岛\",\"ename\":\"qingdao\",\"fename\":\"Q\",\"pid\":\"15\",\"area\":\"0532\",\"istop\":\"0\",\"first_letter\":\"Q\"},{\"id\":\"306\",\"code\":\"530300\",\"name\":\"曲靖\",\"ename\":\"qujing\",\"fename\":\"Q\",\"pid\":\"25\",\"area\":\"0874\",\"istop\":\"0\",\"first_letter\":\"Q\"}],\"S\":[{\"id\":\"38\",\"code\":\"130100\",\"name\":\"石家庄\",\"ename\":\"shijiazhuang\",\"fename\":\"S\",\"pid\":\"3\",\"area\":\"0311\",\"istop\":\"0\",\"first_letter\":\"S\"},{\"id\":\"72\",\"code\":\"210100\",\"name\":\"沈阳\",\"ename\":\"shenyang\",\"fename\":\"S\",\"pid\":\"6\",\"area\":\"024\",\"istop\":\"0\",\"first_letter\":\"S\"},{\"id\":\"109\",\"code\":\"310100\",\"name\":\"上海\",\"ename\":\"shanghai\",\"fename\":\"S\",\"pid\":\"9\",\"area\":\"021\",\"istop\":\"0\",\"first_letter\":\"S\"},{\"id\":\"114\",\"code\":\"320500\",\"name\":\"苏州\",\"ename\":\"suzhou\",\"fename\":\"S\",\"pid\":\"10\",\"area\":\"0512\",\"istop\":\"0\",\"first_letter\":\"S\"},{\"id\":\"122\",\"code\":\"321300\",\"name\":\"宿迁\",\"ename\":\"suqian\",\"fename\":\"S\",\"pid\":\"10\",\"area\":\"0527\",\"istop\":\"0\",\"first_letter\":\"S\"},{\"id\":\"128\",\"code\":\"330600\",\"name\":\"绍兴\",\"ename\":\"shaoxing\",\"fename\":\"S\",\"pid\":\"11\",\"area\":\"0575\",\"istop\":\"0\",\"first_letter\":\"S\"},{\"id\":\"154\",\"code\":\"350400\",\"name\":\"三明\",\"ename\":\"sanming\",\"fename\":\"S\",\"pid\":\"13\",\"area\":\"0598\",\"istop\":\"0\",\"first_letter\":\"S\"}],\"T\":[{\"id\":\"37\",\"code\":\"120100\",\"name\":\"天津\",\"ename\":\"tianjin\",\"fename\":\"T\",\"pid\":\"2\",\"area\":\"022\",\"istop\":\"0\",\"first_letter\":\"T\"},{\"id\":\"121\",\"code\":\"321200\",\"name\":\"泰州\",\"ename\":\"taizhou\",\"fename\":\"T\",\"pid\":\"10\",\"area\":\"0523\",\"istop\":\"0\",\"first_letter\":\"T\"},{\"id\":\"132\",\"code\":\"331000\",\"name\":\"台州\",\"ename\":\"taizhou\",\"fename\":\"T\",\"pid\":\"11\",\"area\":\"0576\",\"istop\":\"0\",\"first_letter\":\"T\"}],\"W\":[{\"id\":\"68\",\"code\":\"150900\",\"name\":\"乌兰察布\",\"ename\":\"ulanqab\",\"fename\":\"U\",\"pid\":\"5\",\"area\":\"0474\",\"istop\":\"0\",\"first_letter\":\"W\"},{\"id\":\"111\",\"code\":\"320200\",\"name\":\"无锡\",\"ename\":\"wuxi\",\"fename\":\"W\",\"pid\":\"10\",\"area\":\"0510\",\"istop\":\"0\",\"first_letter\":\"W\"},{\"id\":\"125\",\"code\":\"330300\",\"name\":\"温州\",\"ename\":\"wenzhou\",\"fename\":\"W\",\"pid\":\"11\",\"area\":\"0577\",\"istop\":\"0\",\"first_letter\":\"W\"},{\"id\":\"136\",\"code\":\"340200\",\"name\":\"芜湖\",\"ename\":\"wuhu\",\"fename\":\"W\",\"pid\":\"12\",\"area\":\"0551\",\"istop\":\"0\",\"first_letter\":\"W\"},{\"id\":\"177\",\"code\":\"370700\",\"name\":\"潍坊\",\"ename\":\"weifang\",\"fename\":\"W\",\"pid\":\"15\",\"area\":\"0536\",\"istop\":\"0\",\"first_letter\":\"W\"},{\"id\":\"180\",\"code\":\"371000\",\"name\":\"威海\",\"ename\":\"weihai\",\"fename\":\"W\",\"pid\":\"15\",\"area\":\"0631\",\"istop\":\"0\",\"first_letter\":\"W\"},{\"id\":\"315\",\"code\":\"532600\",\"name\":\"文山壮族苗族自治州\",\"ename\":\"wenshan\",\"fename\":\"W\",\"pid\":\"25\",\"area\":\"0876\",\"istop\":\"0\",\"first_letter\":\"W\"}],\"X\":[{\"id\":\"70\",\"code\":\"152500\",\"name\":\"锡林郭勒盟\",\"ename\":\"xilingol\",\"fename\":\"X\",\"pid\":\"5\",\"area\":\"0479\",\"istop\":\"0\",\"first_letter\":\"X\"},{\"id\":\"112\",\"code\":\"320300\",\"name\":\"徐州\",\"ename\":\"xuzhou\",\"fename\":\"X\",\"pid\":\"10\",\"area\":\"0516\",\"istop\":\"0\",\"first_letter\":\"X\"},{\"id\":\"316\",\"code\":\"532800\",\"name\":\"西双版纳傣族自治州\",\"ename\":\"xishuangbanna\",\"fename\":\"X\",\"pid\":\"25\",\"area\":\"0691\",\"istop\":\"0\",\"first_letter\":\"X\"},{\"id\":\"328\",\"code\":\"610100\",\"name\":\"西安\",\"ename\":\"xian\",\"fename\":\"X\",\"pid\":\"27\",\"area\":\"029\",\"istop\":\"0\",\"first_letter\":\"X\"}],\"Y\":[{\"id\":\"118\",\"code\":\"320900\",\"name\":\"盐城\",\"ename\":\"yancheng\",\"fename\":\"Y\",\"pid\":\"10\",\"area\":\"0515\",\"istop\":\"0\",\"first_letter\":\"Y\"},{\"id\":\"119\",\"code\":\"321000\",\"name\":\"扬州\",\"ename\":\"yangzhou\",\"fename\":\"Y\",\"pid\":\"10\",\"area\":\"0514\",\"istop\":\"0\",\"first_letter\":\"Y\"},{\"id\":\"176\",\"code\":\"370600\",\"name\":\"烟台\",\"ename\":\"yantai\",\"fename\":\"Y\",\"pid\":\"15\",\"area\":\"0635\",\"istop\":\"0\",\"first_letter\":\"Y\"},{\"id\":\"307\",\"code\":\"530400\",\"name\":\"玉溪\",\"ename\":\"yuxi\",\"fename\":\"Y\",\"pid\":\"25\",\"area\":\"0877\",\"istop\":\"0\",\"first_letter\":\"Y\"}],\"Z\":[{\"id\":\"44\",\"code\":\"130700\",\"name\":\"张家口\",\"ename\":\"zhangjiakou\",\"fename\":\"Z\",\"pid\":\"3\",\"area\":\"0313\",\"istop\":\"0\",\"first_letter\":\"Z\"},{\"id\":\"120\",\"code\":\"321100\",\"name\":\"镇江\",\"ename\":\"zhenjiang\",\"fename\":\"Z\",\"pid\":\"10\",\"area\":\"0511\",\"istop\":\"0\",\"first_letter\":\"Z\"},{\"id\":\"174\",\"code\":\"370400\",\"name\":\"枣庄\",\"ename\":\"zaozhuang\",\"fename\":\"Z\",\"pid\":\"15\",\"area\":\"0632\",\"istop\":\"0\",\"first_letter\":\"Z\"},{\"id\":\"309\",\"code\":\"530600\",\"name\":\"昭通\",\"ename\":\"zhaotong\",\"fename\":\"Z\",\"pid\":\"25\",\"area\":\"0870\",\"istop\":\"0\",\"first_letter\":\"Z\"}]}},\"user\":{\"login\":0}}";

	public final static int JOINT_ORDER_NO_LENGTH = 6;

	//add by dengbo 2018/1/5
	public final static String PERSONAL_BAK_POSTER_URL = "shp_poster_template_personal";//个人喜报背景图-key
	public final static String GROUP_BAK_POSTER_URL = "shp_poster_template_group";//销售组喜报背景图-key
	public final static String COMPANY_BAK_POSTER_URL = "shp_poster_template_company";//公司喜报背景图-key


	class OaAgent {
		public static final  String UACCOUNT="OA代理人";
		public static final  String UPASSWORD="123456";
		public static final  String UREALNAME="OA代理人";
		public static final  Long  COMPANYID=999999L;
		public static final  int UCHARGETYPE=0;//0：不是负责人，1：是负责人
		public static final  int  UDATALIMIT=0;
		public static final  Long UROLEID=0L;
		public static final  int UTYPE=3;//用户区分0:非销售类员工1:销售类员工2:游客3:oa代理人
		public static final  int USTYPE=2;//用户销售类型 0:非销售类 1:销售类 2:签约人员 3:游客 4:oa代理人
		public static final  String UTEL="123456";
		public static final  int USTATUS=0;
	}
}
