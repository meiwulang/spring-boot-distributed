/*
Navicat MySQL Data Transfer

Source Server         : 47.96.30.236-1
Source Server Version : 50637
Source Host           : 47.96.30.236:3306
Source Database       : sp_db

Target Server Type    : MYSQL
Target Server Version : 50637
File Encoding         : 65001

Date: 2018-05-28 16:56:44
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for cm_attach
-- ----------------------------
DROP TABLE IF EXISTS `cm_attach`;
CREATE TABLE `cm_attach` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `p_type` int(11) NOT NULL COMMENT '类型 0:线路 1:行程 2:酒店 3:景点4:广告5:品牌 6:产品',
  `p_pid` bigint(20) NOT NULL COMMENT '图片所属项目ID.例如：线路ID,行程ID等',
  `p_album_id` bigint(20) DEFAULT NULL COMMENT '相册ID',
  `p_real_name` varchar(80) DEFAULT NULL COMMENT '文件名称',
  `p_oss_name` varchar(200) NOT NULL COMMENT 'oss文件名称',
  `p_size` bigint(12) DEFAULT NULL COMMENT '文件大小',
  `p_pic_type` varchar(10) DEFAULT NULL COMMENT '文件类型',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_pid` (`p_pid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=8650 DEFAULT CHARSET=utf8 COMMENT='附件表';

-- ----------------------------
-- Table structure for cm_bank_city
-- ----------------------------
DROP TABLE IF EXISTS `cm_bank_city`;
CREATE TABLE `cm_bank_city` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(30) COLLATE utf8_unicode_ci NOT NULL DEFAULT '' COMMENT '名称',
  `ename` varchar(40) COLLATE utf8_unicode_ci NOT NULL DEFAULT '' COMMENT '拼音全拼',
  `pid` int(11) NOT NULL DEFAULT '0' COMMENT '父id',
  `level` int(3) NOT NULL DEFAULT '0' COMMENT '1:省 2:市 3:县',
  `orders` tinyint(4) NOT NULL DEFAULT '0' COMMENT '排序',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否启用',
  PRIMARY KEY (`id`),
  KEY `name` (`name`,`ename`,`pid`,`status`)
) ENGINE=InnoDB AUTO_INCREMENT=3222 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Table structure for cm_base
-- ----------------------------
DROP TABLE IF EXISTS `cm_base`;
CREATE TABLE `cm_base` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(45) NOT NULL COMMENT '查询key',
  `item_id` int(2) NOT NULL COMMENT 'ID',
  `item_value` varchar(45) NOT NULL COMMENT '内容',
  `status` tinyint(1) NOT NULL COMMENT '状态 0:有效 1:无效',
  PRIMARY KEY (`id`),
  KEY `index_name` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COMMENT='基础表';

-- ----------------------------
-- Table structure for cm_city
-- ----------------------------
DROP TABLE IF EXISTS `cm_city`;
CREATE TABLE `cm_city` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `type` varchar(20) DEFAULT 'CN' COMMENT '国际域名缩写',
  `code` varchar(10) DEFAULT NULL COMMENT '城市编码',
  `name` varchar(30) NOT NULL DEFAULT '' COMMENT '城市名称',
  `ename` varchar(40) NOT NULL DEFAULT '' COMMENT '城市字母',
  `fename` varchar(2) NOT NULL DEFAULT '' COMMENT '城市首字母',
  `pid` int(11) NOT NULL DEFAULT '0' COMMENT '父级省市',
  `level` int(3) NOT NULL DEFAULT '0' COMMENT '城市等级：1省，2市，3区/县',
  `map_x` varchar(50) NOT NULL DEFAULT '' COMMENT 'x座标',
  `map_y` varchar(50) NOT NULL DEFAULT '' COMMENT 'y座标',
  `map_z` varchar(5) NOT NULL DEFAULT '' COMMENT 'z座标',
  `istop` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否推荐',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否启用',
  `area` varchar(10) NOT NULL COMMENT '城市区号',
  `isopen` tinyint(1) DEFAULT '0' COMMENT '城市是否开放:0不开放，1开放',
  `group_id` varchar(30) DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `index_pid` (`pid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=10715 DEFAULT CHARSET=utf8 COMMENT='国家城市区域表';

-- ----------------------------
-- Table structure for cm_position
-- ----------------------------
DROP TABLE IF EXISTS `cm_position`;
CREATE TABLE `cm_position` (
  `id` bigint(20) NOT NULL DEFAULT '0',
  `position_name` varchar(255) DEFAULT NULL COMMENT '名称',
  `code` varchar(50) DEFAULT NULL COMMENT '编码',
  `position_desc` varchar(100) DEFAULT NULL COMMENT '描述',
  `company_id` bigint(20) DEFAULT NULL COMMENT '公司ID',
  `department_id` bigint(20) DEFAULT NULL COMMENT '部门ID',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `data_limit` tinyint(1) NOT NULL DEFAULT '2',
  PRIMARY KEY (`id`),
  KEY `cm_position_position_name_index` (`position_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='职位';

-- ----------------------------
-- Table structure for cm_verification
-- ----------------------------
DROP TABLE IF EXISTS `cm_verification`;
CREATE TABLE `cm_verification` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `v_code` varchar(45) NOT NULL COMMENT '验证码',
  `v_phone` varchar(45) NOT NULL,
  `v_type` int(1) NOT NULL COMMENT '类型 0:登陆1:注册 2:找回密码 3:订单通知 4:开户通知',
  `v_md5` varchar(45) NOT NULL COMMENT '加密验证码',
  `create_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COMMENT='验证码表';

-- ----------------------------
-- Table structure for ct_admission_base
-- ----------------------------
DROP TABLE IF EXISTS `ct_admission_base`;
CREATE TABLE `ct_admission_base` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '门票产品id',
  `ticket_product_code` varchar(20) DEFAULT NULL COMMENT '编码',
  `ticket_product_name` varchar(20) DEFAULT NULL COMMENT '门票产品名称',
  `ticket_product_type` tinyint(1) DEFAULT NULL COMMENT '1:成人票 0：儿童票',
  `picture` varchar(500) DEFAULT NULL COMMENT '图片地址',
  `product_manager` bigint(20) DEFAULT NULL COMMENT '产品经理id',
  `admissions` text COMMENT '入园须知',
  `cost_include` varchar(300) DEFAULT NULL COMMENT '费用包含',
  `reservation_rule` varchar(300) DEFAULT NULL COMMENT '预定规则',
  `refund_rules` varchar(300) DEFAULT NULL COMMENT '退票规则',
  `explanation` varchar(300) DEFAULT NULL COMMENT '补充说明',
  `Attractions` text COMMENT '景点介绍',
  `admission_status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0:无效（未完成设置） 1：设置完成(待申报) 2：申报确认（已完成） 3：入库（未上架） 4：上架  -1：删除',
  `creater_time` datetime DEFAULT NULL,
  `creater_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8 COMMENT='门票产品基本信息';

-- ----------------------------
-- Table structure for ct_admission_contract_template
-- ----------------------------
DROP TABLE IF EXISTS `ct_admission_contract_template`;
CREATE TABLE `ct_admission_contract_template` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `pid` bigint(20) NOT NULL COMMENT '门票id',
  `t_id` bigint(20) NOT NULL COMMENT '合同模板id',
  `create_user` bigint(20) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_pid` (`pid`) USING BTREE,
  KEY `idx_tid` (`t_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=108 DEFAULT CHARSET=utf8 COMMENT='门票和合同模板关系表';

-- ----------------------------
-- Table structure for ct_admission_price
-- ----------------------------
DROP TABLE IF EXISTS `ct_admission_price`;
CREATE TABLE `ct_admission_price` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `supplier` varchar(30) NOT NULL DEFAULT '' COMMENT '供应商',
  `supplier_tel` varchar(30) NOT NULL DEFAULT '' COMMENT '供应商电话',
  `cost_price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '成本价',
  `factory_price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '出厂价',
  `life_end_date` date DEFAULT NULL COMMENT '生效日期',
  `life_start_date` date DEFAULT NULL COMMENT '失效日期',
  `remark` varchar(30) NOT NULL DEFAULT '' COMMENT '说明',
  `pid` bigint(20) NOT NULL COMMENT '门票id',
  `create_user` bigint(20) DEFAULT NULL COMMENT '创建者',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `update_user` bigint(20) DEFAULT NULL COMMENT '更新者',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COMMENT='门票价格信息';

-- ----------------------------
-- Table structure for ct_admission_produce
-- ----------------------------
DROP TABLE IF EXISTS `ct_admission_produce`;
CREATE TABLE `ct_admission_produce` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `produce_no` varchar(50) NOT NULL DEFAULT '' COMMENT '生产批次号:',
  `produce_num` int(11) NOT NULL DEFAULT '0' COMMENT '数量',
  `life_end_date` date DEFAULT NULL COMMENT '生效日期',
  `life_start_date` date DEFAULT NULL COMMENT '失效日期',
  `remark` varchar(30) NOT NULL DEFAULT '' COMMENT '说明',
  `pid` bigint(20) NOT NULL COMMENT '门票id',
  `a_status` int(1) NOT NULL DEFAULT '0' COMMENT '生产状态 0:正常 1:暂停 2:已删除',
  `p_status` int(1) NOT NULL DEFAULT '0' COMMENT '销售状态 0:已上架 1:已下架',
  `create_user` bigint(20) DEFAULT NULL COMMENT '创建者',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `update_user` bigint(20) DEFAULT NULL COMMENT '更新者',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='门票生产记录';

-- ----------------------------
-- Table structure for ct_admission_sale_price
-- ----------------------------
DROP TABLE IF EXISTS `ct_admission_sale_price`;
CREATE TABLE `ct_admission_sale_price` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `pid` bigint(20) NOT NULL COMMENT '门票id',
  `ap_name` varchar(30) NOT NULL DEFAULT '' COMMENT '票价名称',
  `ap_type` int(1) DEFAULT '0' COMMENT '票价类型 0:单票,1:套票',
  `suit_region` varchar(3) DEFAULT '100' COMMENT '用三位数字字符标识票价时段,每位可选值0,1，其中 0表示未选中，1表示选中;\n3位依次标识:平日,周末,节假日；例如 111表示三个都选中',
  `workday_cost_price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '平日成本价 ',
  `workday_sale_price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '平日销售价 ',
  `weekend_cost_price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '周末成本价 ',
  `weekend_sale_price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '周末销售价 ',
  `festival_cost_price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '节假日成本价 ',
  `festival_sale_price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '节假日销售价 ',
  `ap_stock` int(6) NOT NULL DEFAULT '-1' COMMENT '库存',
  `life_end_date` date DEFAULT NULL COMMENT '生效日期',
  `life_start_date` date DEFAULT NULL COMMENT '失效日期',
  `remark` varchar(120) NOT NULL DEFAULT '' COMMENT '说明',
  `supplier` varchar(30) NOT NULL DEFAULT '' COMMENT '供应商',
  `supplier_tel` varchar(30) NOT NULL DEFAULT '' COMMENT '供应商电话',
  `ad_status` int(1) DEFAULT '0' COMMENT '0:有效,1:无效',
  `create_user` bigint(20) DEFAULT NULL COMMENT '创建者',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `update_user` bigint(20) DEFAULT NULL COMMENT '更新者',
  `workday_factory_price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '平日出厂价 ',
  `weekend_factory_price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '周末出厂价 ',
  `festival_factory_price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '节假日出厂价 ',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8 COMMENT='门票销售价格信息';

-- ----------------------------
-- Table structure for ct_bus
-- ----------------------------
DROP TABLE IF EXISTS `ct_bus`;
CREATE TABLE `ct_bus` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `b_no` int(2) NOT NULL COMMENT '当前车号',
  `b_schedule_id` bigint(20) NOT NULL COMMENT '班期ID',
  `b_seats_num` int(2) NOT NULL COMMENT '座位数',
  `b_seats_lock` varchar(1000) DEFAULT NULL COMMENT '锁定位置，逗号分隔',
  `b_status` int(1) NOT NULL COMMENT '状态 0:有效 1:无效',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_name` (`b_schedule_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2381 DEFAULT CHARSET=utf8 COMMENT='车辆信息管理表';

-- ----------------------------
-- Table structure for ct_bus_hold
-- ----------------------------
DROP TABLE IF EXISTS `ct_bus_hold`;
CREATE TABLE `ct_bus_hold` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `b_bus_id` bigint(20) NOT NULL,
  `b_company_id` bigint(20) NOT NULL COMMENT '预留单位ID',
  `b_seat` varchar(1000) NOT NULL COMMENT '预留位置，逗号分隔',
  `b_account` varchar(20) NOT NULL,
  `b_hold_hours` int(2) NOT NULL COMMENT '预留小时',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_name` (`b_bus_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='车辆位置预留表';

-- ----------------------------
-- Table structure for ct_design
-- ----------------------------
DROP TABLE IF EXISTS `ct_design`;
CREATE TABLE `ct_design` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `last_r_id` bigint(20) DEFAULT NULL COMMENT '此次定制最新的需求 id',
  `last_p_id` bigint(20) DEFAULT NULL COMMENT '此次定制的最新的方案 id',
  `create_user` bigint(20) DEFAULT NULL COMMENT '提出此次定制的销售人员 ID',
  `create_time` datetime DEFAULT NULL COMMENT '提交时间',
  `answer_time` datetime DEFAULT NULL COMMENT '接单时间',
  `manager_id` bigint(20) DEFAULT NULL COMMENT '定制人员的 id',
  `d_status` int(1) DEFAULT NULL COMMENT '定制状态 1待受理 2定制中 3已反馈 4已确认',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=304 DEFAULT CHARSET=utf8 COMMENT='定制游';

-- ----------------------------
-- Table structure for ct_design_product
-- ----------------------------
DROP TABLE IF EXISTS `ct_design_product`;
CREATE TABLE `ct_design_product` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `design_id` bigint(20) NOT NULL COMMENT '订制游idn',
  `product_id` bigint(20) NOT NULL COMMENT '产品id',
  `status` tinyint(4) DEFAULT '0' COMMENT '标识该绑定是否有效 0：有效，1无效',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for ct_design_project
-- ----------------------------
DROP TABLE IF EXISTS `ct_design_project`;
CREATE TABLE `ct_design_project` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `design_id` bigint(20) DEFAULT NULL COMMENT '定制 ID',
  `r_id` bigint(20) DEFAULT NULL COMMENT '需求ID',
  `dp_company_id` bigint(20) DEFAULT NULL COMMENT '所属公司id',
  `dp_line_name` varchar(150) DEFAULT NULL COMMENT '方案名称',
  `dp_order_amount` text COMMENT '订单报价',
  `dp_core_scenic` text COMMENT '核心景点',
  `dp_standard_accommodation` text COMMENT '住宿标准',
  `dp_min_clustering_num` text COMMENT '最低成团人数',
  `create_time` datetime DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `status` int(1) NOT NULL DEFAULT '1' COMMENT '0:可展示，1:编辑中',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=218 DEFAULT CHARSET=utf8 COMMENT='定制游 方案线路行程表';

-- ----------------------------
-- Table structure for ct_factory_ticket
-- ----------------------------
DROP TABLE IF EXISTS `ct_factory_ticket`;
CREATE TABLE `ct_factory_ticket` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) DEFAULT NULL,
  `type` tinyint(1) DEFAULT NULL COMMENT '票价类型 0:成人票 1:儿童票',
  `ticket_name` varchar(20) DEFAULT NULL COMMENT '票价名称',
  `suitable_start_time` date DEFAULT NULL COMMENT '适用开始日期',
  `suitable_end_time` date DEFAULT NULL COMMENT '适用结束日期',
  `price` decimal(10,2) DEFAULT NULL COMMENT '出厂价',
  `introduction` varchar(500) DEFAULT NULL COMMENT '票价简介',
  `ticket_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '0:无效 1：正常 2：最新修改',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `create_user` bigint(20) DEFAULT NULL,
  `p_cost_title_id` bigint(4) DEFAULT NULL COMMENT 'ct_product_costing_title 的id',
  PRIMARY KEY (`id`),
  KEY `ct_factory_ticket_product_id_index` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8 COMMENT='出厂价';

-- ----------------------------
-- Table structure for ct_factory_ticket_departure
-- ----------------------------
DROP TABLE IF EXISTS `ct_factory_ticket_departure`;
CREATE TABLE `ct_factory_ticket_departure` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `factory_ticket_id` bigint(20) DEFAULT NULL COMMENT '出厂票价id',
  `departure_id` bigint(20) DEFAULT NULL COMMENT '始发站id',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ct_factory_ticket_departure_factory_ticket_id_index` (`factory_ticket_id`)
) ENGINE=InnoDB AUTO_INCREMENT=184 DEFAULT CHARSET=utf8 COMMENT='出厂价绑定始发站';

-- ----------------------------
-- Table structure for ct_position_role
-- ----------------------------
DROP TABLE IF EXISTS `ct_position_role`;
CREATE TABLE `ct_position_role` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `role_id` bigint(20) DEFAULT NULL,
  `position_id` bigint(20) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ct_position_role_position_id_role_id_index` (`position_id`,`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1543 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for ct_product
-- ----------------------------
DROP TABLE IF EXISTS `ct_product`;
CREATE TABLE `ct_product` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `company_id` bigint(20) NOT NULL COMMENT '所属公司ID',
  `p_no` varchar(20) NOT NULL COMMENT '产品编号',
  `p_name` varchar(50) NOT NULL COMMENT '产品名称',
  `p_short_name` varchar(20) DEFAULT NULL COMMENT '产品简称',
  `p_pym` varchar(50) DEFAULT NULL COMMENT '拼音码',
  `p_destination` varchar(100) DEFAULT NULL COMMENT '产品目的地',
  `p_destination_pym` varchar(45) DEFAULT NULL COMMENT '产品目的地拼音码',
  `p_destination_location` int(1) NOT NULL DEFAULT '0' COMMENT '0:国内，1国外',
  `p_destination_region` varchar(30) DEFAULT NULL COMMENT '省/洲',
  `p_destination_area` varchar(30) DEFAULT NULL COMMENT '市/国家',
  `p_brand` int(11) NOT NULL COMMENT '所属品牌ID',
  `p_type` int(2) NOT NULL COMMENT '产品类型ID',
  `p_contacts_en` varchar(20) NOT NULL DEFAULT '' COMMENT '产品经理英文',
  `p_contacts` bigint(20) DEFAULT NULL COMMENT '联系人ID',
  `p_creative_officer_cn` varchar(20) NOT NULL DEFAULT '' COMMENT '创意总监中文',
  `p_creative_officer_en` varchar(20) NOT NULL DEFAULT '' COMMENT '创意总监英文',
  `p_topic_cn` varchar(100) NOT NULL DEFAULT '' COMMENT '主题中文',
  `p_topic_en` varchar(100) NOT NULL DEFAULT '' COMMENT '主题英文',
  `p_days` int(2) NOT NULL COMMENT '行程天数',
  `p_qq` varchar(20) DEFAULT NULL COMMENT 'qq',
  `p_phone` varchar(20) DEFAULT NULL COMMENT '电话',
  `p_special` longtext COMMENT '线路特色',
  `p_cost_include` longtext COMMENT '费用包含',
  `p_cost_exclude` longtext COMMENT '费用不包含',
  `p_notes` longtext COMMENT '预定须知',
  `p_visa` longtext COMMENT '签证信息',
  `p_recommend` tinyint(1) NOT NULL COMMENT '推荐 0:不推荐  1:推荐普通 2:推荐精选',
  `p_confirm` tinyint(1) NOT NULL COMMENT '是否确认0:需要确认 1:无需确认',
  `p_sort` int(11) DEFAULT NULL COMMENT '排序',
  `p_brokerage1` decimal(10,2) DEFAULT NULL COMMENT '一级分佣',
  `p_brokerage2` decimal(10,2) DEFAULT NULL COMMENT '二级分佣',
  `p_brokerage3` decimal(10,2) DEFAULT NULL COMMENT '三级分佣',
  `p_from` int(1) DEFAULT NULL COMMENT '来源 0:自营研发 1:散拼 2:自营定制 3：单项资源 4：途艺旅拍',
  `p_from_name` varchar(100) DEFAULT NULL COMMENT '非自营来源名称',
  `p_status` int(1) NOT NULL DEFAULT '0' COMMENT '状态 0:发布 1:无效 2:待入库（已提交） 3:入库 4:待提交',
  `p_pay_way` int(1) DEFAULT '0' COMMENT '支付方法，0-全款，1-首款',
  `p_firstpay_type` int(1) DEFAULT NULL COMMENT '首付款类型 1:固定金额(每人) 2:百分比(订单总额)',
  `p_pay_amount` decimal(10,2) DEFAULT NULL COMMENT '如果是首付款情况，这里保存首付比例。',
  `p_ascription` int(3) NOT NULL DEFAULT '0' COMMENT '0:本地 1：区域',
  `p_area_flg` int(1) DEFAULT '0' COMMENT '0:普通产品 1:特殊产品',
  `p_group` bigint(20) DEFAULT NULL COMMENT '大区',
  `offline_sign_status` tinyint(4) DEFAULT '0' COMMENT '合同是否线下签署0：非线下签署；1：线下签署',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  `life_end_date` date DEFAULT NULL,
  `life_start_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_company_id` (`company_id`) USING BTREE,
  KEY `index_p_type` (`p_type`) USING BTREE,
  KEY `index_p_no` (`p_no`) USING BTREE,
  KEY `index_brand` (`p_brand`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=939 DEFAULT CHARSET=utf8 COMMENT='产品线路表';

-- ----------------------------
-- Table structure for ct_product_assemble_company
-- ----------------------------
DROP TABLE IF EXISTS `ct_product_assemble_company`;
CREATE TABLE `ct_product_assemble_company` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) DEFAULT NULL COMMENT '产品id',
  `company_id` bigint(20) DEFAULT NULL COMMENT '单位id',
  `assemble_status` tinyint(3) NOT NULL DEFAULT '0' COMMENT '是否已集结 0：没集结，1：已集结',
  `assemble_user` bigint(20) DEFAULT NULL COMMENT '操作集结人',
  `assemble_link_user` bigint(20) DEFAULT NULL COMMENT '集结产品的客服',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ct_product_assemble_company_product_id_index` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=544 DEFAULT CHARSET=utf8 COMMENT='产品集结公司';

-- ----------------------------
-- Table structure for ct_product_contract_template
-- ----------------------------
DROP TABLE IF EXISTS `ct_product_contract_template`;
CREATE TABLE `ct_product_contract_template` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `pid` bigint(20) NOT NULL COMMENT '产品id',
  `t_id` bigint(20) NOT NULL COMMENT '合同模板id',
  `create_user` bigint(20) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_pid` (`pid`) USING BTREE,
  KEY `idx_tid` (`t_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=112 DEFAULT CHARSET=utf8 COMMENT='产品和合同模板关系表';

-- ----------------------------
-- Table structure for ct_product_costing_category_detail
-- ----------------------------
DROP TABLE IF EXISTS `ct_product_costing_category_detail`;
CREATE TABLE `ct_product_costing_category_detail` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `product_costing_title_id` bigint(20) NOT NULL COMMENT '成本标题表id',
  `category_id` bigint(20) NOT NULL COMMENT '类目id',
  `content` varchar(255) DEFAULT NULL COMMENT '项目内容',
  `amount` int(11) NOT NULL DEFAULT '0' COMMENT '数量',
  `unit` tinyint(4) DEFAULT NULL COMMENT '单位(1:人;2:团)',
  `unit_price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '单价',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `create_user` bigint(255) DEFAULT NULL COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_user` bigint(20) DEFAULT NULL COMMENT '修改人',
  `update_time` datetime DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3100 DEFAULT CHARSET=utf8 COMMENT='产品成本类目详细表';

-- ----------------------------
-- Table structure for ct_product_costing_title
-- ----------------------------
DROP TABLE IF EXISTS `ct_product_costing_title`;
CREATE TABLE `ct_product_costing_title` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `rel_id` bigint(20) NOT NULL COMMENT '关联id',
  `type` tinyint(4) NOT NULL COMMENT '类型(1:产品; 2:班期)',
  `people_num` int(11) DEFAULT NULL COMMENT '核算人数',
  `people_num_explain` varchar(255) DEFAULT NULL COMMENT '核算人数说明',
  `is_exempt` tinyint(4) DEFAULT NULL COMMENT '领队/全陪是否免(0:否;1:是)',
  `is_exempt_explain` varchar(255) DEFAULT NULL COMMENT '领队/全陪是否免说明',
  `begin_time` datetime DEFAULT NULL COMMENT '价格适用期开始时间',
  `end_time` datetime DEFAULT NULL COMMENT '价格适用期结束时间',
  `percentage` smallint(6) DEFAULT NULL COMMENT '保底成本增加比例',
  `product_type` tinyint(4) NOT NULL DEFAULT '1' COMMENT '产品类型(1:非集结产品;2:集结产品)',
  `company_id` bigint(20) DEFAULT NULL COMMENT '产品公司id',
  `create_user` bigint(20) DEFAULT NULL COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_user` bigint(20) DEFAULT NULL COMMENT '修改人',
  `update_time` datetime DEFAULT NULL COMMENT '修改时间',
  `status` int(1) DEFAULT '0',
  `remark` varchar(600) DEFAULT NULL,
  `cost_name` varchar(50) DEFAULT NULL COMMENT '预算成本名称',
  `cost_desc` varchar(600) DEFAULT NULL COMMENT '预算成本解释说明',
  `cost_stnum` int(8) DEFAULT NULL COMMENT '标准团人数',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1517 DEFAULT CHARSET=utf8 COMMENT='产品成本标题表';

-- ----------------------------
-- Table structure for ct_product_experience
-- ----------------------------
DROP TABLE IF EXISTS `ct_product_experience`;
CREATE TABLE `ct_product_experience` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `pos_id` int(1) unsigned NOT NULL COMMENT '岗位：1-销售总，2-销售总监，3-销售经理，4签约代理人，5非销售岗',
  `pid` bigint(20) NOT NULL COMMENT '产品id',
  `create_user` bigint(20) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `c_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_pid` (`pid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for ct_product_extends
-- ----------------------------
DROP TABLE IF EXISTS `ct_product_extends`;
CREATE TABLE `ct_product_extends` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `pe_product_id` bigint(20) NOT NULL,
  `pe_start_day` date NOT NULL,
  `pe_end_day` date NOT NULL,
  `pe_special` longtext CHARACTER SET ucs2 COMMENT '线路特色',
  `pe_cost_include` longtext CHARACTER SET ucs2 COMMENT '费用包含',
  `pe_cost_exclude` longtext CHARACTER SET ucs2 COMMENT '费用不包含',
  `pe_notes` longtext CHARACTER SET ucs2 COMMENT '预定须知',
  `pe_visa` longtext CHARACTER SET ucs2 COMMENT '签证信息',
  `pe_retiree` longtext COMMENT '退休人员',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  `pe_professional` longtext COMMENT '自由职业者',
  `pe_preschool` longtext COMMENT '学前儿童',
  `pe_student` longtext COMMENT '在校学生',
  `pe_jobless` longtext COMMENT '无业人员',
  `pe_staff` longtext COMMENT '在职员工',
  `pe_cost_remark` longtext COMMENT '费用说明',
  PRIMARY KEY (`id`),
  KEY `index` (`pe_product_id`,`pe_start_day`,`pe_end_day`)
) ENGINE=InnoDB AUTO_INCREMENT=939 DEFAULT CHARSET=utf8 COMMENT='产品信息扩展';

-- ----------------------------
-- Table structure for ct_product_group
-- ----------------------------
DROP TABLE IF EXISTS `ct_product_group`;
CREATE TABLE `ct_product_group` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `p_no` bigint(20) DEFAULT NULL COMMENT '产品ID',
  `g_no` varchar(50) DEFAULT '' COMMENT '虚拟分组编号',
  `t_id` bigint(20) DEFAULT NULL COMMENT '票id',
  `t_category_id` bigint(20) DEFAULT NULL COMMENT '票价类目id',
  `company_id` bigint(20) DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `brokerage_type` int(1) DEFAULT NULL,
  `brokerage1` decimal(9,2) DEFAULT NULL,
  `brokerage2` decimal(9,2) DEFAULT NULL,
  `brokerage3` decimal(9,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5829 DEFAULT CHARSET=utf8 COMMENT='产品-虚拟分组表';

-- ----------------------------
-- Table structure for ct_product_user
-- ----------------------------
DROP TABLE IF EXISTS `ct_product_user`;
CREATE TABLE `ct_product_user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `uid` varchar(50) DEFAULT NULL COMMENT '分销用户的 id',
  `p_no` bigint(20) DEFAULT NULL COMMENT '产品 id',
  `t_id` bigint(20) DEFAULT NULL COMMENT '票 id',
  `t_categroy_id` bigint(20) DEFAULT NULL COMMENT '票类目 id',
  `t_company_id` bigint(20) DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_user` bigint(20) DEFAULT NULL,
  `update_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `brokerage1` decimal(9,2) DEFAULT NULL,
  `brokerage2` decimal(9,2) DEFAULT NULL,
  `brokerage3` decimal(9,2) DEFAULT NULL,
  `brokerage_type` int(1) DEFAULT NULL COMMENT '返佣类型  固定1   比例0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for ct_require
-- ----------------------------
DROP TABLE IF EXISTS `ct_require`;
CREATE TABLE `ct_require` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `d_id` bigint(20) DEFAULT NULL COMMENT '定制 ID',
  `require_no` varchar(10) NOT NULL COMMENT '需求编号',
  `r_company_id` bigint(20) DEFAULT NULL COMMENT '公司id',
  `r_type` int(1) DEFAULT NULL COMMENT '出游类型 0个人 1企业',
  `r_start_city` varchar(50) DEFAULT NULL COMMENT '出发城市',
  `r_destination_citys` varchar(150) DEFAULT NULL COMMENT '多个目的地城市 逗号分隔',
  `r_start_date_head` int(8) DEFAULT NULL COMMENT '出发时间 头',
  `r_start_date_tail` int(8) DEFAULT NULL COMMENT '出发时间 尾',
  `r_play_days_min` int(3) DEFAULT NULL COMMENT '出游天数 最少天数',
  `r_play_days_max` int(3) DEFAULT NULL COMMENT '出游天数 最多天数',
  `r_adult_num` int(3) DEFAULT NULL COMMENT '出游成人数',
  `r_child_num` int(3) DEFAULT NULL COMMENT '出游儿童数',
  `r_baby_num` int(3) DEFAULT NULL COMMENT '出游婴儿数',
  `r_per_budget` int(3) DEFAULT NULL COMMENT '人均预算',
  `r_optional_services` varchar(80) DEFAULT NULL COMMENT '可选服务',
  `r_other_require` varchar(2000) DEFAULT NULL COMMENT '其他需求',
  `r_head_name` varchar(30) DEFAULT NULL COMMENT '负责人姓名',
  `r_head_sex` int(1) DEFAULT NULL COMMENT '性别',
  `r_head_phone` varchar(20) DEFAULT NULL COMMENT '手机号',
  `r_head_wx` varchar(50) DEFAULT NULL COMMENT '微信号',
  `r_head_email` varchar(50) DEFAULT NULL COMMENT '邮箱',
  `create_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=304 DEFAULT CHARSET=utf8 COMMENT='定制游 需求表';

-- ----------------------------
-- Table structure for ct_schedule
-- ----------------------------
DROP TABLE IF EXISTS `ct_schedule`;
CREATE TABLE `ct_schedule` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `s_product_id` bigint(20) NOT NULL COMMENT '线路ID',
  `s_schedule_no` varchar(20) NOT NULL COMMENT '班级编号',
  `s_schedule_name` varchar(20) DEFAULT NULL COMMENT '班期名称',
  `s_group_order_no` varchar(100) DEFAULT NULL COMMENT '团号',
  `s_calendar` date NOT NULL COMMENT '开始时间',
  `s_return_calendar` date DEFAULT NULL COMMENT '回团日期',
  `s_week_day` int(1) NOT NULL COMMENT '周几1:星期一2:星期二',
  `s_car_num` int(3) NOT NULL COMMENT '车辆数',
  `s_car_seats` int(3) NOT NULL COMMENT '每车座位数',
  `s_leave_time` time DEFAULT NULL COMMENT '出发时分',
  `s_stop_sale` int(2) NOT NULL COMMENT '停售时间',
  `s_stop_type` int(1) NOT NULL COMMENT '停售类型 0:分钟 1:小时 2:天数',
  `s_sham_num` int(3) DEFAULT NULL COMMENT '虚拟已售数',
  `s_print` tinyint(1) DEFAULT NULL COMMENT '是否打印0:打印 1:不打印',
  `s_sit_type` int(1) DEFAULT NULL COMMENT '入座方式 0:不对号入座 1:对号入座(系统随机) 2:对号入座(人工选择)',
  `s_group_num` int(3) DEFAULT NULL COMMENT '成团人数',
  `s_seat_hold` int(11) DEFAULT NULL COMMENT '所有车辆座位预留数',
  `s_seat_lock` int(11) DEFAULT NULL COMMENT '所有车辆座位锁定数',
  `s_seat_sold` int(11) DEFAULT NULL COMMENT '座位已售数',
  `s_seat_total` int(11) DEFAULT NULL COMMENT '所有车辆总座位数',
  `s_status` int(1) NOT NULL COMMENT '状态 0:正常 1:暂停 2:删除',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_name` (`s_product_id`),
  KEY `index_calendar` (`s_calendar`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2436 DEFAULT CHARSET=utf8 COMMENT='班期';

-- ----------------------------
-- Table structure for ct_schedule_flight
-- ----------------------------
DROP TABLE IF EXISTS `ct_schedule_flight`;
CREATE TABLE `ct_schedule_flight` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `schedule_id` bigint(20) DEFAULT NULL COMMENT '班期id',
  `line_type` tinyint(4) DEFAULT NULL COMMENT '交通类型：0：出团，1：中转，2：回团',
  `flight_type` tinyint(4) DEFAULT NULL COMMENT '交通类型：1：飞机，2：火车，3：邮轮，4：汽车',
  `schedule_setting_id` bigint(20) DEFAULT NULL COMMENT '出团设置id',
  `sort_day` tinyint(4) DEFAULT NULL COMMENT '第几天',
  `flight_num` varchar(50) DEFAULT NULL COMMENT '航班信息',
  `departure_place` varchar(50) DEFAULT NULL COMMENT '出发地',
  `destination` varchar(50) DEFAULT NULL COMMENT '目的地',
  `flight_time` datetime DEFAULT NULL COMMENT '起飞时间',
  `arrival_time` datetime DEFAULT NULL COMMENT '到达时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COMMENT='交通信息';

-- ----------------------------
-- Table structure for ct_schedule_setting
-- ----------------------------
DROP TABLE IF EXISTS `ct_schedule_setting`;
CREATE TABLE `ct_schedule_setting` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `schedule_id` bigint(20) NOT NULL,
  `group_no` varchar(50) DEFAULT NULL COMMENT '团号',
  `product_name` varchar(50) DEFAULT NULL COMMENT '线路名称',
  `company_id` bigint(20) DEFAULT NULL,
  `company_name` varchar(20) DEFAULT NULL COMMENT '组团社名称',
  `user_name` varchar(50) DEFAULT NULL COMMENT '组团社联系人',
  `user_phone` varchar(20) DEFAULT NULL COMMENT '组团社联系人手机',
  `adult_tourists_num` int(11) DEFAULT NULL COMMENT '成人游客数',
  `child_tourists_num` int(11) DEFAULT NULL COMMENT '小孩游客数',
  `start_date` datetime DEFAULT NULL COMMENT '出团日期',
  `return_date` datetime DEFAULT NULL COMMENT '回团日期',
  `banner` varchar(50) DEFAULT NULL COMMENT '接团旗号',
  `tourist_guide` varchar(50) DEFAULT NULL COMMENT '导游姓名及电话',
  `muster_time` datetime DEFAULT NULL COMMENT '集合时间',
  `muster_place` varchar(100) DEFAULT NULL COMMENT '集合地点',
  `emergency_call` varchar(20) DEFAULT NULL COMMENT '紧急电话',
  `emergency_contact` varchar(20) DEFAULT NULL COMMENT '紧急联系人',
  `status` tinyint(4) DEFAULT '0' COMMENT '0:有效 1：无效',
  `departure_status` tinyint(4) DEFAULT '-1' COMMENT '出发状态：-1：待确认出行 0:待发团 1：发团中 2：已结团 3：已回团 4：已取消',
  `cancel_time` datetime DEFAULT NULL COMMENT '取消时间',
  `confirm_time` datetime DEFAULT NULL,
  `cancel_user` bigint(20) DEFAULT NULL COMMENT '取消者',
  `cancel_comment` varchar(200) DEFAULT NULL COMMENT '取消原因',
  PRIMARY KEY (`id`),
  KEY `index_order_id` (`group_no`),
  KEY `index_schedule_id` (`schedule_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6512 DEFAULT CHARSET=utf8 COMMENT='出团设置';

-- ----------------------------
-- Table structure for ct_schedule_ticket
-- ----------------------------
DROP TABLE IF EXISTS `ct_schedule_ticket`;
CREATE TABLE `ct_schedule_ticket` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `st_product_id` bigint(20) NOT NULL,
  `st_schedule_id` bigint(20) NOT NULL,
  `st_ticket_id` bigint(20) NOT NULL,
  `t_market_price` decimal(10,2) DEFAULT NULL COMMENT '门市价',
  `t_stock` int(4) DEFAULT NULL COMMENT '库存',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_name` (`st_product_id`),
  KEY `index_name2` (`st_schedule_id`),
  KEY `ticket_index` (`st_ticket_id`) USING BTREE,
  KEY `st_index` (`st_schedule_id`,`st_ticket_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6657 DEFAULT CHARSET=ucs2 COMMENT='班期与票关联表';

-- ----------------------------
-- Table structure for ct_ticket
-- ----------------------------
DROP TABLE IF EXISTS `ct_ticket`;
CREATE TABLE `ct_ticket` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `t_company_id` bigint(20) NOT NULL,
  `t_product_id` bigint(20) NOT NULL COMMENT '产品线路ID',
  `t_ticket_type` int(1) NOT NULL COMMENT '票类型0:单票 1:套票',
  `t_type` int(1) DEFAULT NULL COMMENT '票价类型 0:成人票 1:儿童票',
  `t_name` varchar(20) NOT NULL COMMENT '票价名称',
  `t_limit_type` int(1) DEFAULT NULL COMMENT '限制类型 0:无限制 1:实名票 2:限制性别 3:限制年龄',
  `t_limit_condition` varchar(20) DEFAULT NULL COMMENT '限制条件',
  `t_category` varchar(20) DEFAULT NULL COMMENT '票价类目',
  `t_traffic` int(1) DEFAULT NULL COMMENT '交通类别 0:飞机 1:火车 2:汽车 3:邮轮',
  `t_market_price` decimal(10,2) NOT NULL COMMENT '门市价',
  `t_peer_price` decimal(10,2) NOT NULL COMMENT '同行价',
  `t_gather_price` decimal(10,2) DEFAULT NULL COMMENT '内部集结价',
  `factory_price` decimal(10,2) DEFAULT NULL COMMENT '出厂价',
  `t_price_add` decimal(10,2) DEFAULT NULL COMMENT '补房差',
  `t_price_reduce` decimal(10,2) DEFAULT NULL COMMENT '退房差',
  `t_stock` int(4) DEFAULT NULL COMMENT '库存',
  `t_effect_week` varchar(7) NOT NULL COMMENT '周几有效0000000',
  `t_introduction` varchar(500) DEFAULT NULL COMMENT '票价简介',
  `t_source_id` bigint(20) DEFAULT NULL COMMENT '源票价ID',
  `t_from_ticket_id` bigint(20) DEFAULT NULL COMMENT '集结原始票id',
  `t_default_price` tinyint(1) NOT NULL COMMENT '默认票价 0:非默认 1:默认票价',
  `t_adult_num` int(4) DEFAULT NULL COMMENT '成人数',
  `t_child_num` int(4) DEFAULT NULL COMMENT '儿童数',
  `t_status` int(1) NOT NULL DEFAULT '0' COMMENT '状态 0:有效 1:无效 2:删除',
  `suitable_start_time` date DEFAULT NULL COMMENT '适用开始时间',
  `suitable_end_time` date DEFAULT NULL COMMENT '适用结束时间',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_comany_id` (`t_company_id`) USING BTREE,
  KEY `index_product_id` (`t_product_id`) USING BTREE,
  KEY `index_source_id` (`t_source_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1737 DEFAULT CHARSET=utf8 COMMENT='票价表';

-- ----------------------------
-- Table structure for ct_ticket_area
-- ----------------------------
DROP TABLE IF EXISTS `ct_ticket_area`;
CREATE TABLE `ct_ticket_area` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `ta_ticket_id` bigint(20) NOT NULL,
  `ta_country` varchar(45) NOT NULL COMMENT '国家',
  `ta_province` varchar(45) NOT NULL COMMENT '省份',
  `ta_city` varchar(45) NOT NULL COMMENT '城市',
  `ta_area` varchar(45) DEFAULT NULL COMMENT '区域',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_name` (`ta_ticket_id`),
  KEY `index_city` (`ta_city`)
) ENGINE=InnoDB AUTO_INCREMENT=16126 DEFAULT CHARSET=utf8 COMMENT='票价投放市场表';

-- ----------------------------
-- Table structure for ct_ticket_departure
-- ----------------------------
DROP TABLE IF EXISTS `ct_ticket_departure`;
CREATE TABLE `ct_ticket_departure` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `ticket_id` bigint(20) NOT NULL COMMENT '票ID',
  `departue_id` bigint(20) NOT NULL COMMENT '始发站ID',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_departure_id` (`departue_id`) USING BTREE,
  KEY `index_ticket_id` (`ticket_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3063 DEFAULT CHARSET=utf8 COMMENT='票价始发站关联表';

-- ----------------------------
-- Table structure for ct_ticket_factory_ticket
-- ----------------------------
DROP TABLE IF EXISTS `ct_ticket_factory_ticket`;
CREATE TABLE `ct_ticket_factory_ticket` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `ticket_id` bigint(20) DEFAULT NULL COMMENT '票id',
  `factory_ticket_id` bigint(20) DEFAULT NULL COMMENT '出厂价票id',
  PRIMARY KEY (`id`),
  KEY `ct_ticket_factory_ticket_ticket_id_index` (`ticket_id`)
) ENGINE=InnoDB AUTO_INCREMENT=266 DEFAULT CHARSET=utf8 COMMENT='出厂价票和售卖票关联关系';

-- ----------------------------
-- Table structure for ct_ticket_set
-- ----------------------------
DROP TABLE IF EXISTS `ct_ticket_set`;
CREATE TABLE `ct_ticket_set` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `ts_set_id` bigint(20) NOT NULL COMMENT '套票ID',
  `ts_single_id` bigint(20) NOT NULL,
  `ts_seats` int(3) NOT NULL,
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_name` (`ts_set_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COMMENT='套票单票关联表';

-- ----------------------------
-- Table structure for ct_trip
-- ----------------------------
DROP TABLE IF EXISTS `ct_trip`;
CREATE TABLE `ct_trip` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `t_product_id` bigint(20) NOT NULL COMMENT '产品ID',
  `t_title` varchar(100) NOT NULL DEFAULT '默认行程' COMMENT '行程标题',
  `t_type` int(1) NOT NULL COMMENT '类型 0:默认行程 1:补充行程',
  `t_from_to` varchar(100) NOT NULL COMMENT '出发地目的地',
  `t_meals` varchar(3) DEFAULT NULL COMMENT '用餐情况 100:早餐 010:午餐 011:晚餐',
  `t_meals_remark` varchar(45) DEFAULT NULL COMMENT '用餐情况备注',
  `t_hotel_remark` varchar(45) DEFAULT NULL COMMENT '住宿酒店备注',
  `t_simple_trip` varchar(500) DEFAULT NULL COMMENT '简易行程',
  `t_detail_trip` longtext COMMENT '详细行程',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_name` (`t_type`),
  KEY `index_product_id` (`t_product_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=13652 DEFAULT CHARSET=utf8 COMMENT='行程表';

-- ----------------------------
-- Table structure for ct_trip_calendar
-- ----------------------------
DROP TABLE IF EXISTS `ct_trip_calendar`;
CREATE TABLE `ct_trip_calendar` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `tc_product_id` bigint(20) NOT NULL COMMENT '线路ID',
  `tc_trip_id` bigint(20) NOT NULL COMMENT '行程ID',
  `tc_start_day` date NOT NULL COMMENT '补充行程开始时间',
  `tc_end_day` date NOT NULL COMMENT '补充行程结束日期',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_name` (`tc_start_day`),
  KEY `index_product_id` (`tc_product_id`) USING BTREE,
  KEY `index_trip_id` (`tc_trip_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='补充行程日期';

-- ----------------------------
-- Table structure for ct_trip_hotel
-- ----------------------------
DROP TABLE IF EXISTS `ct_trip_hotel`;
CREATE TABLE `ct_trip_hotel` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `ph_pid` bigint(20) DEFAULT NULL COMMENT '产品ID',
  `ph_trip_id` bigint(20) NOT NULL,
  `ph_hotel_id` bigint(20) NOT NULL,
  `ph_trip_type` int(1) NOT NULL COMMENT '类型 0默认行程1补充行程',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_ph_pid` (`ph_pid`) USING BTREE,
  KEY `index_trip_id_hotel_id` (`ph_trip_id`,`ph_hotel_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5625 DEFAULT CHARSET=utf8 COMMENT='线路关联酒店表';

-- ----------------------------
-- Table structure for ct_trip_scenic
-- ----------------------------
DROP TABLE IF EXISTS `ct_trip_scenic`;
CREATE TABLE `ct_trip_scenic` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `ph_pid` bigint(20) DEFAULT NULL COMMENT '产品ID',
  `ph_trip_id` bigint(20) NOT NULL,
  `ph_scenic_id` bigint(20) NOT NULL,
  `ph_trip_type` int(1) NOT NULL COMMENT '类型 0默认行程1补充行程',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_ph_pid` (`ph_pid`) USING BTREE,
  KEY `index_trip_id_scenic_id` (`ph_trip_id`,`ph_scenic_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=120 DEFAULT CHARSET=utf8 COMMENT='行程景点';

-- ----------------------------
-- Table structure for fn_bank_manage
-- ----------------------------
DROP TABLE IF EXISTS `fn_bank_manage`;
CREATE TABLE `fn_bank_manage` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `b_company_id` bigint(20) NOT NULL COMMENT '公司单位ID',
  `b_company_name` varchar(45) NOT NULL COMMENT '公司名称',
  `b_short_name` varchar(45) NOT NULL COMMENT '公司简称',
  `b_bbid` bigint(20) NOT NULL COMMENT '银行分行ID',
  `b_bank_name` varchar(45) NOT NULL COMMENT '银行名称',
  `b_bank_no` varchar(45) NOT NULL COMMENT '银行卡号',
  `b_bank_people` varchar(45) NOT NULL COMMENT '持卡人',
  `b_type` tinyint(1) NOT NULL COMMENT '0:对公 1对私',
  `b_licence_type` int(1) NOT NULL COMMENT '证件类型 0:身份证 1:营业执照',
  `b_lincese` varchar(45) NOT NULL COMMENT '证件信息',
  `b_currency` varchar(45) NOT NULL COMMENT '币种:0:CNY',
  `b_status` tinyint(1) NOT NULL COMMENT '0:生效 1:无效',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=ucs2 COMMENT='银行卡表';

-- ----------------------------
-- Table structure for fn_bill
-- ----------------------------
DROP TABLE IF EXISTS `fn_bill`;
CREATE TABLE `fn_bill` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `b_bill_pid` bigint(20) DEFAULT NULL COMMENT '父账单ID',
  `b_bill_no` varchar(45) NOT NULL COMMENT '账单编号',
  `b_saler_company_id` bigint(20) NOT NULL,
  `b_saler_company_name` varchar(45) NOT NULL,
  `b_saler_id` bigint(20) NOT NULL COMMENT '卖家ID',
  `b_saler_name` varchar(45) NOT NULL COMMENT '卖家名称',
  `b_amount` decimal(10,2) NOT NULL COMMENT '账单金额',
  `b_payed_amount` decimal(10,2) NOT NULL COMMENT '已付金额',
  `b_brokerage` decimal(10,2) NOT NULL COMMENT '手续费',
  `b_deduction` decimal(10,2) DEFAULT NULL COMMENT '信用账单一次性销帐时可减免一定的费用',
  `b_cash_time` datetime DEFAULT NULL COMMENT '提现时间',
  `b_repayment_time` datetime DEFAULT NULL COMMENT '还款日期',
  `b_bill_type` tinyint(1) NOT NULL COMMENT '0:自动账单 1:手动账单',
  `b_type` int(1) NOT NULL COMMENT '账单类型 0:线上账单 1:信用账单',
  `b_status` int(1) NOT NULL DEFAULT '0' COMMENT '信用账单状态 0:未还款 1:未还完 2:已还完 3:已撤销\n在线账单状态 0:生成 1:处理中 2:已受理 3:已提现 4:失败',
  `b_remark` varchar(250) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='财务账单表';

-- ----------------------------
-- Table structure for fn_bill_detail
-- ----------------------------
DROP TABLE IF EXISTS `fn_bill_detail`;
CREATE TABLE `fn_bill_detail` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `db_bill_id` bigint(20) NOT NULL COMMENT '账单号',
  `db_order_pay_id` bigint(20) NOT NULL COMMENT '支付记录ID',
  `b_buyer_company_id` bigint(20) NOT NULL,
  `b_buyer_company_name` varchar(45) NOT NULL,
  `b_buyer_id` bigint(20) NOT NULL COMMENT '买家ID',
  `b_buyer_name` varchar(45) NOT NULL COMMENT '买家名称',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='账单详细表';

-- ----------------------------
-- Table structure for fn_bill_repayment
-- ----------------------------
DROP TABLE IF EXISTS `fn_bill_repayment`;
CREATE TABLE `fn_bill_repayment` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `br_amount` decimal(10,2) NOT NULL COMMENT '交易金额',
  `br_bill_id` bigint(20) NOT NULL COMMENT '账单id',
  `br_bill_no` varchar(45) DEFAULT NULL COMMENT '账单编号',
  `br_create_time` datetime DEFAULT NULL COMMENT '交易日期',
  `br_create_user` bigint(20) DEFAULT NULL COMMENT '操作者',
  `br_remark` varchar(300) DEFAULT NULL COMMENT '还款说明',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for fn_credit
-- ----------------------------
DROP TABLE IF EXISTS `fn_credit`;
CREATE TABLE `fn_credit` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `c_supplier_id` bigint(20) NOT NULL COMMENT '供应商ID',
  `c_supplier_name` varchar(45) NOT NULL COMMENT '供应商名称',
  `c_distributor_id` bigint(20) NOT NULL COMMENT '分销商ID',
  `c_distributor_name` varchar(45) NOT NULL COMMENT '分销商名称',
  `c_credit_quota` decimal(10,2) NOT NULL COMMENT '信用额度',
  `c_credit_balance` decimal(10,2) NOT NULL COMMENT '信用余额',
  `c_credit_used` decimal(10,2) NOT NULL COMMENT '使用额度',
  `c_settlement_cycle` int(1) NOT NULL COMMENT '结算周期 0:手动 1:日结(按付款日期) 2:周结(按出团日期,出境/邮轮按付款日期) 3:月结(按出团日期,出境/邮轮按付款日期)',
  `c_settlement_day` int(2) DEFAULT NULL COMMENT '周结:1:周一 2:周二 3:周三 4:周四 5:周五 6:周六 7:周日\n月结:1:1日 2:2日.....',
  `c_product_type` varchar(45) NOT NULL COMMENT '产品类型: \n"10": "周边短线",\n"11": "国内长线",\n"20": "出境旅游",\n"30": "邮轮",\n"40": "特色游",\n"50": "自助游"',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8 COMMENT='授信表';

-- ----------------------------
-- Table structure for fn_invoice
-- ----------------------------
DROP TABLE IF EXISTS `fn_invoice`;
CREATE TABLE `fn_invoice` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `i_supplier_id` bigint(20) NOT NULL,
  `i_supplier_name` varchar(45) NOT NULL COMMENT '供应商名称',
  `i_buyer_id` bigint(20) NOT NULL,
  `i_invoice_title` varchar(45) NOT NULL COMMENT '发票抬头',
  `i_amount` decimal(10,2) NOT NULL COMMENT '发票金额',
  `i_type` int(1) NOT NULL COMMENT '开票项目 0:国内旅游 1:旅游费 2:住宿费 3:车费',
  `i_invoice_no` varchar(45) DEFAULT NULL COMMENT '发票编号',
  `i_receive_method` int(1) NOT NULL COMMENT '收取方式 0:委托销售代送 1:前台自取 2:快递 3:挂号信',
  `i_address` varchar(250) DEFAULT NULL COMMENT '地址',
  `i_buy_contacts` varchar(45) DEFAULT NULL COMMENT '分销商联系人',
  `i_buy_phone` varchar(45) DEFAULT NULL COMMENT '分销商联系电话',
  `i_supplier_contacts` varchar(45) DEFAULT NULL COMMENT '供应商联系人',
  `i_supplier_phone` varchar(45) DEFAULT NULL COMMENT '供应商电话',
  `i_apply_remark` varchar(250) DEFAULT NULL COMMENT '申请备注',
  `i_handle_remark` varchar(250) DEFAULT NULL COMMENT '处理备注',
  `i_revoke_reason` varchar(255) DEFAULT NULL COMMENT '撤销原因',
  `i_express_company` varchar(45) DEFAULT NULL COMMENT '快递公司',
  `i_express_no` varchar(45) DEFAULT NULL COMMENT '快递单号',
  `i_express_method` int(1) DEFAULT NULL COMMENT '付费方式 0:现金 1:签单 2:快递卡 3:积分',
  `i_express_amount` decimal(10,2) DEFAULT NULL COMMENT '快递金额',
  `i_status` int(1) NOT NULL COMMENT '状态 0:未处理 1:已处理 2:已撤销',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `create_name` varchar(45) DEFAULT NULL COMMENT '申请人名称',
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  `update_name` varchar(45) DEFAULT NULL COMMENT '处理人名称',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='发票表';

-- ----------------------------
-- Table structure for fn_invoice_detail
-- ----------------------------
DROP TABLE IF EXISTS `fn_invoice_detail`;
CREATE TABLE `fn_invoice_detail` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `id_invoice_id` bigint(20) NOT NULL COMMENT '发票ID',
  `id_order_id` bigint(20) NOT NULL COMMENT '订单ID',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='发票订单详细表';

-- ----------------------------
-- Table structure for fn_order_refund
-- ----------------------------
DROP TABLE IF EXISTS `fn_order_refund`;
CREATE TABLE `fn_order_refund` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `or_order_no` varchar(45) NOT NULL COMMENT '订单编号',
  `or_product_id` bigint(20) NOT NULL COMMENT '产品ID',
  `or_product_name` varchar(50) NOT NULL COMMENT '产品名称',
  `or_product_no` varchar(45) NOT NULL COMMENT '产品编号',
  `or_saler_id` bigint(20) NOT NULL COMMENT '卖家ID',
  `or_saler_name` varchar(45) NOT NULL COMMENT '卖家名称',
  `or_buyer_id` bigint(20) NOT NULL COMMENT '买家ID',
  `or_buyer_name` varchar(45) NOT NULL COMMENT '买家名称',
  `or_refund` decimal(10,2) NOT NULL COMMENT '退款金额',
  `or_reason` varchar(250) DEFAULT NULL COMMENT '退款原因',
  `or_remark` varchar(250) DEFAULT NULL COMMENT '退款说明',
  `or_label_id` bigint(20) DEFAULT NULL COMMENT '标记标签',
  `or_stauts` tinyint(1) DEFAULT NULL COMMENT '0:未退款 1:已退款',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='线下退款';

-- ----------------------------
-- Table structure for fn_transfer
-- ----------------------------
DROP TABLE IF EXISTS `fn_transfer`;
CREATE TABLE `fn_transfer` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `t_out_account_id` bigint(20) NOT NULL COMMENT '转出单位ID',
  `t_out_account` varchar(45) NOT NULL COMMENT '转出单位',
  `t_in_account_id` bigint(20) NOT NULL COMMENT '转入单位ID',
  `t_in_account` varchar(45) NOT NULL COMMENT '转入单位',
  `t_transfer_type` int(1) NOT NULL COMMENT '类型 0:供应商实收 1:手续费 2:佣金 3:提现手续费',
  `t_transfer_no` varchar(45) NOT NULL COMMENT '转账编号',
  `t_transfer_amount` decimal(10,2) NOT NULL COMMENT '转账金额',
  `t_start_time` datetime NOT NULL COMMENT '转账开始时间',
  `t_transfer_time` datetime DEFAULT NULL COMMENT '转账发生时间',
  `t_fail_reason` varchar(255) DEFAULT NULL,
  `t_confrim_time` datetime DEFAULT NULL COMMENT '转账完成时间',
  `t_order_no` varchar(45) NOT NULL COMMENT '订单编号',
  `t_status` tinyint(1) NOT NULL COMMENT '状态 0:已失败 1:处理中 2:已转账 3:已撤销',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8 COMMENT='转账记录表';

-- ----------------------------
-- Table structure for fn_withdrawals
-- ----------------------------
DROP TABLE IF EXISTS `fn_withdrawals`;
CREATE TABLE `fn_withdrawals` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `w_bill_no` varchar(45) NOT NULL COMMENT '提现编号',
  `w_day` date NOT NULL COMMENT '账单日',
  `w_in_account_id` bigint(20) NOT NULL COMMENT '收款方单位ID',
  `w_in_account` varchar(45) NOT NULL COMMENT '收款方单位名称',
  `w_bill_amount` decimal(10,2) NOT NULL COMMENT '账单金额',
  `w_sevice_charge` decimal(10,2) NOT NULL COMMENT '手续费',
  `w_in_amount` decimal(10,2) NOT NULL COMMENT '实收金额',
  `w_bill_time` datetime NOT NULL COMMENT '账单时间',
  `w_remark` varchar(250) DEFAULT NULL COMMENT '备注',
  `w_withdrawals_time` datetime DEFAULT NULL COMMENT '请求提现时间',
  `w_status` int(1) NOT NULL COMMENT '状态 0:处理中 1:已受理 2:已提现 3:已失败 4:已合并 5:已撤销 ',
  `create_time` datetime DEFAULT NULL COMMENT '请求提现时间',
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8 COMMENT='提现记录表';

-- ----------------------------
-- Table structure for fx_virtual_group
-- ----------------------------
DROP TABLE IF EXISTS `fx_virtual_group`;
CREATE TABLE `fx_virtual_group` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `g_no` varchar(50) DEFAULT '' COMMENT '虚拟分组编号',
  `g_name` varchar(50) DEFAULT '' COMMENT '虚拟分组名称',
  `company_id` int(20) DEFAULT NULL COMMENT '公司编号',
  `g_status` int(1) DEFAULT '0' COMMENT '状态 0:有效 1:无效',
  `create_user` bigint(20) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8 COMMENT='虚拟分组表';

-- ----------------------------
-- Table structure for fz_calendar
-- ----------------------------
DROP TABLE IF EXISTS `fz_calendar`;
CREATE TABLE `fz_calendar` (
  `datelist` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for fz_hour
-- ----------------------------
DROP TABLE IF EXISTS `fz_hour`;
CREATE TABLE `fz_hour` (
  `hour` int(2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for sl_bank
-- ----------------------------
DROP TABLE IF EXISTS `sl_bank`;
CREATE TABLE `sl_bank` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `b_name` char(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '银行名称',
  `b_shortname` char(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '英文缩写',
  `b_sort` int(11) NOT NULL COMMENT '排序',
  `b_status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态 1:使用 2:关闭',
  `b_code` char(3) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '银行代码',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=153 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Table structure for sl_bank_branch
-- ----------------------------
DROP TABLE IF EXISTS `sl_bank_branch`;
CREATE TABLE `sl_bank_branch` (
  `bb_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '银行各分行ID',
  `bb_name` varchar(80) NOT NULL COMMENT '银行名称',
  `bb_number` varchar(80) DEFAULT NULL,
  `bb_ba_id` int(11) NOT NULL COMMENT '银行编号',
  `bb_p_id` int(11) NOT NULL COMMENT '省ID',
  `bb_c_id` int(11) NOT NULL COMMENT '市ID',
  `bb_co_id` int(11) NOT NULL COMMENT '县ID',
  PRIMARY KEY (`bb_id`),
  KEY `inx_st_bank_branch` (`bb_number`)
) ENGINE=InnoDB AUTO_INCREMENT=138845 DEFAULT CHARSET=utf8 COMMENT='银行各支行表';

-- ----------------------------
-- Table structure for sl_order
-- ----------------------------
DROP TABLE IF EXISTS `sl_order`;
CREATE TABLE `sl_order` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `o_order_no` varchar(45) NOT NULL COMMENT '订单编号',
  `o_product_id` bigint(20) NOT NULL COMMENT '产品ID',
  `o_schedule_id` bigint(20) NOT NULL COMMENT '班期ID',
  `o_confirm_time` datetime DEFAULT NULL COMMENT '行程时间',
  `o_group_order_no` varchar(100) DEFAULT NULL COMMENT '团号',
  `o_external_no` varchar(45) DEFAULT NULL COMMENT '外部订单号',
  `o_contract_no` varchar(45) DEFAULT NULL COMMENT '合同号',
  `o_contract_agreement` text COMMENT '合同补充约定',
  `o_remark` varchar(250) DEFAULT NULL COMMENT '备注',
  `o_saler_company_id` bigint(20) NOT NULL,
  `o_saler_company_name` varchar(45) NOT NULL,
  `o_saler_id` bigint(20) NOT NULL COMMENT '卖家ID',
  `o_saler_name` varchar(45) NOT NULL COMMENT '卖家名称',
  `o_buyer_company_id` bigint(20) NOT NULL,
  `o_buyer_company_name` varchar(45) NOT NULL,
  `o_buyer_id` bigint(20) NOT NULL COMMENT '买家ID',
  `o_buyer_name` varchar(45) NOT NULL COMMENT '买家名称',
  `o_servicer` varchar(45) NOT NULL COMMENT '客服名称',
  `o_servicer_phone` varchar(45) NOT NULL COMMENT '联系客服电话',
  `o_people_num` int(11) NOT NULL COMMENT '人数',
  `o_bed_num` int(2) NOT NULL COMMENT '床数',
  `o_room_adjust` decimal(10,2) NOT NULL COMMENT '房差金额',
  `o_market_price` decimal(10,2) NOT NULL COMMENT '门市价(销售总金额)',
  `o_preferential_amount` decimal(10,2) DEFAULT NULL COMMENT '优惠金额(手动输入,给游客的优惠)',
  `o_settlement_references` decimal(10,2) DEFAULT NULL COMMENT '结算优惠价(供应商替分销商报名时,手动输入给他的优惠价)',
  `o_total_price` decimal(10,2) NOT NULL COMMENT '结算价总额',
  `o_real_price` decimal(10,2) DEFAULT NULL COMMENT '实际结算金额',
  `o_real_pay` decimal(10,2) DEFAULT NULL COMMENT '实付金额',
  `o_pay_method` int(1) DEFAULT NULL COMMENT '支付方式 0:在线支付 1:信用支付 2:线下支付',
  `o_pay_time` datetime DEFAULT NULL COMMENT '支付时间，只记录第一次的时间。',
  `o_isMerge` tinyint(3) NOT NULL COMMENT '是否加入到账单 0:未加入 1:加入 2:部分加入',
  `o_plan` tinyint(1) NOT NULL DEFAULT '0' COMMENT '计划生成 0:未生成 1:生成',
  `o_status` int(11) NOT NULL COMMENT '状态 0:待确认 1:已预订 2:XXX 3:已订购 4:已取消',
  `o_sign` tinyint(1) DEFAULT '0' COMMENT '0:未签署 1:已签署',
  `o_invalid_time` datetime NOT NULL COMMENT '失效时间',
  `o_invoice_amount` decimal(10,2) DEFAULT NULL COMMENT '可开发票金额',
  `o_bus_seat` varchar(4000) DEFAULT NULL COMMENT '车座位json',
  `o_source` tinyint(3) unsigned NOT NULL DEFAULT '1' COMMENT '1:pc, 2:h5, 3:游客下单,4:首款支付',
  `o_synchro` tinyint(1) DEFAULT NULL COMMENT '同步状态 0:未同步 1:已同步',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  `o_to_pay` decimal(10,2) DEFAULT NULL COMMENT '待支付金额',
  `o_un_pay` decimal(10,2) DEFAULT '0.00' COMMENT '首款支付情况下，未支付的金额',
  `o_first_pay` decimal(10,2) DEFAULT NULL COMMENT '如果是首付款方式，这里存首付',
  `o_type` int(1) NOT NULL DEFAULT '1' COMMENT '订单类型：1-个人，2-企业',
  `offline_status` int(1) DEFAULT NULL COMMENT '线下支付凭证状态：0-待确认 1-驳回 2-已确认 3-二次支付待确认 4-二次支付驳回 5-二次支付已确认',
  `refund_amount` decimal(10,2) DEFAULT '0.00' COMMENT '退款金额',
  `refund_status` int(1) DEFAULT '0' COMMENT '0:没有发起退款\r\n1:申请退款中\r\n2:部分退款已通过\r\n3:全部退款已通过\r\n多次发起部分退款且审核通过、若累计退款金额不等于总金额，则状态不变，否则状态变为3',
  `alter_ticket_id` bigint(20) DEFAULT NULL COMMENT '改签记录id（非空表示该订单是改签生成的订单）',
  `order_neg_id` bigint(20) DEFAULT NULL COMMENT '负订单记录id（非空表示该订单是负订单）',
  `src_order_id` bigint(20) DEFAULT NULL COMMENT '源订单id',
  `o_system` tinyint(4) DEFAULT '1' COMMENT '下单系统来源:1.h5商城;2游客商城',
  PRIMARY KEY (`id`),
  KEY `index_order_no` (`o_order_no`) USING BTREE,
  KEY `index_product_id` (`o_product_id`) USING BTREE,
  KEY `index_external_no` (`o_external_no`) USING BTREE,
  KEY `index_saler_id` (`o_saler_id`) USING BTREE,
  KEY `index_buyer_id` (`o_buyer_id`) USING BTREE,
  KEY `index_create_user` (`create_user`) USING BTREE,
  KEY `sl_order_o_saler_company_index` (`o_saler_company_name`),
  KEY `sl_order_o_buyer_company_index` (`o_buyer_company_name`),
  KEY `index_saler_company_id` (`o_saler_company_id`) USING BTREE,
  KEY `index_buyer_company_id` (`o_buyer_company_id`) USING BTREE,
  KEY `sl_order_alter_ticket_id_index` (`alter_ticket_id`),
  KEY `sl_order_order_neg_id_index` (`order_neg_id`),
  KEY `sl_order_src_order_id_index` (`src_order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4265 DEFAULT CHARSET=utf8 COMMENT='订单表';

-- ----------------------------
-- Table structure for sl_order_alter_ticket_record
-- ----------------------------
DROP TABLE IF EXISTS `sl_order_alter_ticket_record`;
CREATE TABLE `sl_order_alter_ticket_record` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) NOT NULL COMMENT '订单id',
  `new_order_id` bigint(20) DEFAULT NULL COMMENT '确认改签后新生成的订单id',
  `new_order_no` varchar(45) DEFAULT NULL,
  `neg_order_id` bigint(20) DEFAULT NULL COMMENT '负订单id',
  `neg_order_no` varchar(45) DEFAULT NULL,
  `target_schedule_id` bigint(20) DEFAULT NULL COMMENT '改签目标班期',
  `target_group_no` varchar(100) DEFAULT NULL COMMENT '目标团号',
  `status` int(1) DEFAULT '0' COMMENT '改签状态 0待审核 1通过 2关闭',
  `loss_money` decimal(10,2) DEFAULT NULL COMMENT '核损金额',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sl_order_alter_ticket_record_order_id_index` (`order_id`),
  KEY `sl_order_alter_ticket_record_new_order_id_index` (`new_order_id`),
  KEY `sl_order_alter_ticket_record_neg_order_id_index` (`neg_order_id`),
  KEY `sl_order_alter_ticket_record_target_schedule_id_index` (`target_schedule_id`)
) ENGINE=InnoDB AUTO_INCREMENT=173 DEFAULT CHARSET=utf8 COMMENT='订单改签记录表';

-- ----------------------------
-- Table structure for sl_order_alter_ticket_tourist_record
-- ----------------------------
DROP TABLE IF EXISTS `sl_order_alter_ticket_tourist_record`;
CREATE TABLE `sl_order_alter_ticket_tourist_record` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `alter_ticket_id` bigint(20) NOT NULL COMMENT '改签记录id',
  `tourist_id` bigint(20) DEFAULT NULL COMMENT '游客表id',
  `tourist_name` varchar(45) DEFAULT NULL COMMENT '游客姓名',
  `tourist_lincese` varchar(45) DEFAULT NULL COMMENT '证件号',
  `ticket_id` bigint(20) DEFAULT NULL COMMENT '票id',
  `ticket_name` varchar(20) DEFAULT NULL COMMENT '票名',
  `old_price` decimal(10,2) DEFAULT NULL COMMENT '原票价',
  `now_price` decimal(10,2) DEFAULT NULL COMMENT '现票价',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=146 DEFAULT CHARSET=utf8 COMMENT='订单改签游客记录表';

-- ----------------------------
-- Table structure for sl_order_card
-- ----------------------------
DROP TABLE IF EXISTS `sl_order_card`;
CREATE TABLE `sl_order_card` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) NOT NULL,
  `card_no` varchar(50) NOT NULL,
  `card_pass` varchar(50) NOT NULL,
  `valid_time` varchar(10) NOT NULL COMMENT '截止有效时间',
  `user_uid` bigint(20) DEFAULT NULL COMMENT '代理人id',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  `marketing_price` decimal(10,2) DEFAULT NULL,
  `cost_price` decimal(10,2) DEFAULT NULL,
  `sale_price` decimal(10,2) DEFAULT NULL,
  `card_type` int(11) NOT NULL COMMENT '卡类型：1-名额卡，2-现金卡，3-折扣卡',
  `card_price` decimal(10,2) DEFAULT NULL COMMENT '卡面额',
  `card_person` int(11) DEFAULT NULL COMMENT '抵扣人数',
  `card_person_prior` int(11) DEFAULT NULL COMMENT '名额抵扣优先：1-成人，2-儿童',
  `card_discount_rate` decimal(4,2) DEFAULT NULL COMMENT '折扣抵扣率',
  `card_discount_max` decimal(10,2) DEFAULT NULL COMMENT '折扣卡抵扣最大面额',
  PRIMARY KEY (`id`),
  KEY `idx_order_id` (`order_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8 COMMENT='订单礼品卡关系表';

-- ----------------------------
-- Table structure for sl_order_logs
-- ----------------------------
DROP TABLE IF EXISTS `sl_order_logs`;
CREATE TABLE `sl_order_logs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `ol_order_id` bigint(20) NOT NULL COMMENT '对应订单ID',
  `ol_company_name` varchar(45) NOT NULL COMMENT '公司名称',
  `ol_status` tinyint(1) NOT NULL COMMENT '0:待处理 1:已处理',
  `ol_order_status` int(1) NOT NULL COMMENT ' 状态 0:待确认 1:待付款 2:收款中 3:已付款 4:已退票',
  `ol_operater` varchar(45) NOT NULL COMMENT '操作人',
  `ol_operate_detail` varchar(250) DEFAULT NULL COMMENT '操作明细',
  `ol_remark` varchar(250) DEFAULT NULL COMMENT '备注',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_order_id` (`ol_order_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=71055 DEFAULT CHARSET=utf8 COMMENT='订单日志表';

-- ----------------------------
-- Table structure for sl_order_neg
-- ----------------------------
DROP TABLE IF EXISTS `sl_order_neg`;
CREATE TABLE `sl_order_neg` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) NOT NULL COMMENT '原订单id',
  `neg_order_id` bigint(20) DEFAULT NULL COMMENT '负订单id',
  `neg_order_no` varchar(45) DEFAULT NULL COMMENT '负订单编号',
  `type` int(1) DEFAULT NULL COMMENT '类型：1-退票，2-改签',
  `create_user` bigint(20) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sl_order_neg_order_id_index` (`order_id`),
  KEY `sl_order_neg_neg_order_id_index` (`neg_order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=108 DEFAULT CHARSET=utf8 COMMENT='负订单记录';

-- ----------------------------
-- Table structure for sl_order_offline
-- ----------------------------
DROP TABLE IF EXISTS `sl_order_offline`;
CREATE TABLE `sl_order_offline` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) NOT NULL,
  `pay_id` bigint(20) DEFAULT NULL COMMENT '支付记录id',
  `url` varchar(200) DEFAULT NULL COMMENT '凭证地址',
  `f_status` int(1) DEFAULT NULL COMMENT '0-待确认 1-无效 2-已确认',
  `money` decimal(10,2) DEFAULT NULL COMMENT '金额',
  `upload_desc` varchar(100) DEFAULT NULL COMMENT '上传说明',
  `trans_no` varchar(50) DEFAULT NULL COMMENT '交易号',
  `type` int(1) NOT NULL COMMENT '0-全款 1-首款 2-尾款',
  `upload_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '支付时间',
  `create_user` bigint(20) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sl_order_offline_id_uindex` (`id`),
  KEY `idx_order_id` (`order_id`) USING BTREE,
  KEY `idx_pay_id` (`pay_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=392 DEFAULT CHARSET=utf8 COMMENT='线下支付凭证表';

-- ----------------------------
-- Table structure for sl_order_pay
-- ----------------------------
DROP TABLE IF EXISTS `sl_order_pay`;
CREATE TABLE `sl_order_pay` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `op_order_id` bigint(20) NOT NULL COMMENT '对应订单ID',
  `op_pay_no` varchar(1000) DEFAULT '' COMMENT '支付单号',
  `op_pay_amount` decimal(10,2) NOT NULL COMMENT '支付金额',
  `op_pay_method` int(1) NOT NULL COMMENT '支付方式 0:在线支付 1:信用支付 2:线下支付 3:微信支付',
  `op_comments` varchar(45) DEFAULT NULL COMMENT '操作说明',
  `op_oprater` varchar(45) NOT NULL COMMENT '操作人',
  `op_pay_time` datetime DEFAULT NULL COMMENT '线下支付日期设置',
  `o_isMerge` tinyint(1) NOT NULL COMMENT '是否加入到账单 0:未加入 1:加入',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_order_id` (`op_order_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3567 DEFAULT CHARSET=utf8 COMMENT='订单支付记录表';

-- ----------------------------
-- Table structure for sl_order_price_detail
-- ----------------------------
DROP TABLE IF EXISTS `sl_order_price_detail`;
CREATE TABLE `sl_order_price_detail` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `op_order_id` bigint(20) NOT NULL COMMENT '订单ID',
  `op_ticket_id` bigint(20) DEFAULT NULL,
  `op_price_name` varchar(45) NOT NULL COMMENT '价格名称',
  `op_num` int(11) NOT NULL COMMENT '个数',
  `op_price` decimal(10,2) NOT NULL COMMENT '单价',
  `op_total_price` decimal(10,2) NOT NULL COMMENT '总价',
  `op_remark` varchar(250) DEFAULT NULL COMMENT '备注',
  `op_type` int(1) NOT NULL COMMENT '类型 0:票价 1:房差 2:调整 3:活动 4:违约金',
  `op_activity_id` bigint(20) DEFAULT NULL COMMENT '活动ID',
  `op_status` tinyint(3) DEFAULT '0' COMMENT '0:正常 1:删除',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  `op_adult_num` int(6) DEFAULT '0',
  `op_child_num` int(6) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `index_order_id` (`op_order_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5212 DEFAULT CHARSET=utf8 COMMENT='订单价格明细表';

-- ----------------------------
-- Table structure for sl_order_price_detail20180525001
-- ----------------------------
DROP TABLE IF EXISTS `sl_order_price_detail20180525001`;
CREATE TABLE `sl_order_price_detail20180525001` (
  `id` bigint(20) NOT NULL DEFAULT '0',
  `op_order_id` bigint(20) NOT NULL COMMENT '订单ID',
  `op_ticket_id` bigint(20) DEFAULT NULL,
  `op_price_name` varchar(45) NOT NULL COMMENT '价格名称',
  `op_num` int(11) NOT NULL COMMENT '个数',
  `op_price` decimal(10,2) NOT NULL COMMENT '单价',
  `op_total_price` decimal(10,2) NOT NULL COMMENT '总价',
  `op_remark` varchar(250) DEFAULT NULL COMMENT '备注',
  `op_type` int(1) NOT NULL COMMENT '类型 0:票价 1:房差 2:调整 3:活动 4:违约金',
  `op_activity_id` bigint(20) DEFAULT NULL COMMENT '活动ID',
  `op_status` tinyint(3) DEFAULT '0' COMMENT '0:正常 1:删除',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  `op_adult_num` int(6) DEFAULT '0',
  `op_child_num` int(6) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for sl_order_refunds_record
-- ----------------------------
DROP TABLE IF EXISTS `sl_order_refunds_record`;
CREATE TABLE `sl_order_refunds_record` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) NOT NULL,
  `apply_refund_time` datetime DEFAULT NULL COMMENT '申请退款的时间',
  `refundable_time` datetime DEFAULT NULL COMMENT '确认退款的时间',
  `status` int(1) DEFAULT NULL COMMENT '退款状态 0关闭 1进行中 2成功确认',
  `type` int(1) DEFAULT NULL COMMENT '0退票形式 1其他形式',
  `refundable_buyer_id` bigint(20) DEFAULT NULL COMMENT '退款的买家，即申请退款的人',
  `refundable_buyer_name` varchar(20) DEFAULT NULL COMMENT '退款的买家，即申请退款的人',
  `refundable_saler_id` bigint(20) DEFAULT NULL COMMENT '卖家确认退款操作，即操作退款的人',
  `refundable_saler_name` varchar(20) DEFAULT NULL COMMENT '卖家确认退款操作，即操作退款的人',
  `apply_amount` decimal(10,2) DEFAULT NULL COMMENT '申请的退款金额',
  `refund_amount` decimal(10,2) DEFAULT NULL COMMENT '退款的金额',
  `tourists_id` varchar(500) DEFAULT NULL COMMENT '退款游客名单 id (ID1,ID2,ID3,ID4...格式)',
  `ticket_info` varchar(500) DEFAULT NULL COMMENT '游客A 票类目A-票名X 票价:￥mmm.mm\r\n游客B 票类目B-票名Y 票价:￥nnn.nn',
  `refund_explain` varchar(400) DEFAULT NULL COMMENT '退款说明',
  `neg_order_id` bigint(20) DEFAULT NULL,
  `neg_order_no` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_order_id` (`order_id`),
  KEY `sl_order_refunds_record_neg_order_id_index` (`neg_order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=284 DEFAULT CHARSET=utf8 COMMENT=' 订单退款记录';

-- ----------------------------
-- Table structure for sl_order_tourist
-- ----------------------------
DROP TABLE IF EXISTS `sl_order_tourist`;
CREATE TABLE `sl_order_tourist` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `ot_order_id` bigint(20) NOT NULL COMMENT '对应订单ID',
  `ot_ticket_id` bigint(20) DEFAULT NULL COMMENT '票种ID',
  `ot_ticket_type` int(1) NOT NULL COMMENT '票类型0:单票 1:套票',
  `ot_type` int(1) NOT NULL COMMENT '票价类型 0:成人票 1:儿童票',
  `ot_name` varchar(45) NOT NULL COMMENT '游客姓名',
  `ot_phone` varchar(45) DEFAULT NULL,
  `ot_licence_type` int(1) NOT NULL COMMENT '证件类型 0:身份证 1:护照 2:军官证 3:回乡证 4:台胞证 5:国际海员证 6:港澳通行证 7:赴台证 8:其他',
  `ot_lincese` varchar(45) DEFAULT NULL COMMENT '证件信息',
  `ot_rep` int(1) DEFAULT '0' COMMENT '是否游客代表:0-否，1-是',
  `ot_leave_id` bigint(20) NOT NULL COMMENT '出发站id（如果是始发站则指向departure，如果不是则指向shuttle_bus）',
  `ot_leave_type` tinyint(3) NOT NULL COMMENT '去程区分 类型 0:始发站 1:顺路站 2:班车站',
  `ot_leave_price` decimal(10,2) NOT NULL,
  `ot_return_id` bigint(20) NOT NULL COMMENT '返回站id（如果是始发站则指向departure，如果不是则指向shuttle_bus）',
  `ot_return_type` tinyint(3) NOT NULL COMMENT '返程区分 类型 0:始发站 1:顺路站 2:班车站',
  `ot_return_price` decimal(10,2) NOT NULL,
  `ot_status` int(1) DEFAULT '0' COMMENT '游客状态 0: 有效 1 :无效',
  `ot_ext_status` int(1) DEFAULT '0' COMMENT '0-正常，1-退票，2-改签',
  `ot_cancel_reason` varchar(20) DEFAULT NULL COMMENT '取消原因',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_order_id` (`ot_order_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=10947 DEFAULT CHARSET=utf8 COMMENT='游客信息表';

-- ----------------------------
-- Table structure for sl_order_tourist_confirm
-- ----------------------------
DROP TABLE IF EXISTS `sl_order_tourist_confirm`;
CREATE TABLE `sl_order_tourist_confirm` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `tourist_id` bigint(20) NOT NULL COMMENT '原游客id',
  `ot_order_id` bigint(20) NOT NULL COMMENT '对应订单ID',
  `ot_ticket_id` bigint(20) DEFAULT NULL COMMENT '票种ID',
  `ot_ticket_type` int(1) NOT NULL COMMENT '票类型0:单票 1:套票',
  `ot_type` int(1) NOT NULL COMMENT '票价类型 0:成人票 1:儿童票',
  `ot_name` varchar(45) NOT NULL COMMENT '游客姓名',
  `ot_phone` varchar(45) DEFAULT NULL,
  `ot_licence_type` int(1) NOT NULL COMMENT '证件类型 0:身份证 1:护照 2:军官证 3:回乡证 4:台胞证 5:国际海员证 6:港澳通行证 7:赴台证 8:其他',
  `ot_lincese` varchar(45) DEFAULT NULL COMMENT '证件信息',
  `ot_rep` int(1) DEFAULT '0' COMMENT '是否游客代表:0-否，1-是',
  `ot_leave_id` bigint(20) NOT NULL COMMENT '出发站id（如果是始发站则指向departure，如果不是则指向shuttle_bus）',
  `ot_leave_type` tinyint(3) NOT NULL COMMENT '去程区分 类型 0:始发站 1:顺路站 2:班车站',
  `ot_leave_price` decimal(10,2) NOT NULL,
  `ot_return_id` bigint(20) NOT NULL COMMENT '返回站id（如果是始发站则指向departure，如果不是则指向shuttle_bus）',
  `ot_return_type` tinyint(3) NOT NULL COMMENT '返程区分 类型 0:始发站 1:顺路站 2:班车站',
  `ot_return_price` decimal(10,2) NOT NULL,
  `ot_status` int(1) DEFAULT '0' COMMENT '游客状态 0: 有效 1 :无效',
  `ot_ext_status` int(1) DEFAULT '0' COMMENT '0-未确认，1-退票，2-改签 ，3- 已经确认',
  `ot_cancel_reason` varchar(20) DEFAULT NULL COMMENT '取消原因',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=250 DEFAULT CHARSET=utf8 COMMENT='游客确认表';

-- ----------------------------
-- Table structure for sl_orders_report
-- ----------------------------
DROP TABLE IF EXISTS `sl_orders_report`;
CREATE TABLE `sl_orders_report` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `company_id` bigint(20) DEFAULT NULL COMMENT '公司编号',
  `depart_name` varchar(255) DEFAULT '' COMMENT '部门名称',
  `depart_id` bigint(20) DEFAULT NULL COMMENT '部门编号',
  `user_name` varchar(100) DEFAULT NULL COMMENT '用户名称',
  `user_id` bigint(20) DEFAULT NULL COMMENT '用户id',
  `openid` varchar(50) DEFAULT '' COMMENT '用户微信编号',
  `pid` varchar(50) DEFAULT NULL COMMENT '用户上级',
  `ss_day` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '统计日期',
  `order_id` bigint(20) DEFAULT NULL COMMENT '订单id',
  `tourist_count` bigint(20) DEFAULT NULL COMMENT '订单游客数',
  `order_money` decimal(20,2) DEFAULT NULL COMMENT '订单金额',
  `product_id` bigint(20) DEFAULT '-1',
  `product_name` varchar(100) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2905 DEFAULT CHARSET=utf8 COMMENT='部门销售统计日报表';

-- ----------------------------
-- Table structure for sl_poster_settings
-- ----------------------------
DROP TABLE IF EXISTS `sl_poster_settings`;
CREATE TABLE `sl_poster_settings` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `poster_url` char(10) DEFAULT NULL COMMENT '海报地址（oss地址，全路径）',
  `group_no` varchar(64) DEFAULT NULL COMMENT '组no',
  `company_id` bigint(20) DEFAULT NULL COMMENT '公司id',
  `group_month_limit` decimal(10,2) DEFAULT NULL COMMENT '销售组每月额度',
  `group_num` bigint(10) DEFAULT NULL COMMENT '销售组每月计数器',
  `company_day_limit` decimal(10,2) DEFAULT NULL COMMENT '公司每日额度',
  `company_day_num` bigint(10) DEFAULT NULL COMMENT '公司每日计数器',
  `company_month_limit` decimal(10,2) DEFAULT NULL COMMENT '公司每月额度',
  `company_month_num` bigint(10) DEFAULT NULL COMMENT '公司每月计数器',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=133 DEFAULT CHARSET=utf8 COMMENT='喜报配置表';

-- ----------------------------
-- Table structure for sl_poster_user
-- ----------------------------
DROP TABLE IF EXISTS `sl_poster_user`;
CREATE TABLE `sl_poster_user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(64) DEFAULT NULL COMMENT '用户姓名',
  `phone` bigint(20) DEFAULT NULL COMMENT '手机号码',
  `wechat` varchar(64) DEFAULT NULL COMMENT '微信号',
  `open_id` varchar(64) DEFAULT NULL COMMENT 'openId',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8 COMMENT='喜报接收人员表';

-- ----------------------------
-- Table structure for sl_pre_pay
-- ----------------------------
DROP TABLE IF EXISTS `sl_pre_pay`;
CREATE TABLE `sl_pre_pay` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `pp_order_no` varchar(100) NOT NULL COMMENT '订单号',
  `pp_order_random` varchar(100) NOT NULL COMMENT '随机订单号',
  `pp_userid` bigint(20) NOT NULL COMMENT '购买者ID',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4013 DEFAULT CHARSET=utf8 COMMENT='订单预支付记录';

-- ----------------------------
-- Table structure for sl_sales_report_daliy
-- ----------------------------
DROP TABLE IF EXISTS `sl_sales_report_daliy`;
CREATE TABLE `sl_sales_report_daliy` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `ss_userid` bigint(20) DEFAULT NULL COMMENT '代理人用户ID',
  `ss_day` date DEFAULT NULL COMMENT '日期',
  `ss_num` int(10) DEFAULT NULL COMMENT '人数',
  `ss_orders` int(10) DEFAULT NULL COMMENT '订单数',
  `ss_amount` decimal(10,2) DEFAULT NULL COMMENT '订单总金额',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=256028 DEFAULT CHARSET=utf8 COMMENT='销售数据的日报';

-- ----------------------------
-- Table structure for sl_sms
-- ----------------------------
DROP TABLE IF EXISTS `sl_sms`;
CREATE TABLE `sl_sms` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `s_company_id` bigint(20) NOT NULL COMMENT '发送公司ID',
  `s_company_name` varchar(45) NOT NULL COMMENT '发送公司名称',
  `s_order_id` bigint(20) DEFAULT NULL COMMENT '订单号',
  `s_temp_id` bigint(20) DEFAULT NULL COMMENT '短信模板ID',
  `s_tel` varchar(45) NOT NULL COMMENT '手机号码',
  `s_sms` varchar(500) DEFAULT NULL COMMENT '发送内容',
  `s_reason` varchar(500) DEFAULT NULL COMMENT '失败原因',
  `s_status` int(1) NOT NULL COMMENT '状态 0:发送中 1:发送成功 2:发送失败',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8309 DEFAULT CHARSET=ucs2 COMMENT='短信表';

-- ----------------------------
-- Table structure for sm_adver_area
-- ----------------------------
DROP TABLE IF EXISTS `sm_adver_area`;
CREATE TABLE `sm_adver_area` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `aa_adver_id` bigint(20) NOT NULL,
  `ta_country` varchar(45) NOT NULL COMMENT '国家',
  `ta_province` varchar(45) NOT NULL COMMENT '省份',
  `ta_city` varchar(45) NOT NULL COMMENT '城市',
  `ta_area` varchar(45) DEFAULT NULL COMMENT '区域',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_name` (`aa_adver_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6359 DEFAULT CHARSET=utf8 COMMENT='广告投放范围表';

-- ----------------------------
-- Table structure for sm_advertisement
-- ----------------------------
DROP TABLE IF EXISTS `sm_advertisement`;
CREATE TABLE `sm_advertisement` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `company_id` bigint(20) DEFAULT NULL COMMENT '分公司id',
  `a_place` int(1) NOT NULL COMMENT '广告位位置',
  `a_start_time` datetime NOT NULL COMMENT '开始时间',
  `a_end_time` datetime NOT NULL COMMENT '结束时间',
  `a_title` varchar(100) DEFAULT NULL COMMENT '广告内容',
  `a_link` varchar(255) DEFAULT NULL COMMENT '广告链接',
  `a_other` varchar(100) DEFAULT NULL COMMENT '其他内容',
  `a_comment` varchar(200) DEFAULT NULL COMMENT '广告说明',
  `a_open_type` int(1) DEFAULT NULL COMMENT '打开方式0:本窗口 1:新窗口',
  `a_sort` int(11) DEFAULT NULL COMMENT '排序',
  `a_show` tinyint(1) NOT NULL COMMENT '前台显示0:显示 1:不显示',
  `a_status` int(1) NOT NULL COMMENT '状态 0:有效 1:无效',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COMMENT='广告位管理表';

-- ----------------------------
-- Table structure for sm_brand
-- ----------------------------
DROP TABLE IF EXISTS `sm_brand`;
CREATE TABLE `sm_brand` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `b_company_id` bigint(20) NOT NULL COMMENT '所属单位',
  `b_name` varchar(10) NOT NULL COMMENT '品牌名称',
  `b_introduction` varchar(40) NOT NULL COMMENT '品牌简介',
  `b_sort` int(11) DEFAULT NULL COMMENT '排序',
  `b_del` tinyint(1) DEFAULT NULL COMMENT '是否删除0未删除 1删除',
  `b_status` tinyint(1) NOT NULL COMMENT '是否显示 0:显示 1:不显示',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_name` (`b_company_id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8 COMMENT='品牌管理表';

-- ----------------------------
-- Table structure for sm_busi_logs
-- ----------------------------
DROP TABLE IF EXISTS `sm_busi_logs`;
CREATE TABLE `sm_busi_logs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `bl_company` varchar(45) NOT NULL,
  `bl_username` varchar(45) NOT NULL,
  `bl_account` varchar(45) NOT NULL,
  `bl_description` varchar(200) NOT NULL,
  `bl_module` varchar(45) NOT NULL,
  `bl_pid` bigint(20) NOT NULL COMMENT '对应所属ID',
  `bl_method` varchar(45) NOT NULL,
  `bl_domain` varchar(200) NOT NULL,
  `bl_ip` varchar(100) NOT NULL,
  `bl_browser` varchar(100) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_company` (`bl_company`) USING BTREE,
  KEY `index_module` (`bl_module`) USING BTREE,
  KEY `index_pid` (`bl_pid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=23629 DEFAULT CHARSET=utf8 COMMENT='业务日志';

-- ----------------------------
-- Table structure for sm_company
-- ----------------------------
DROP TABLE IF EXISTS `sm_company`;
CREATE TABLE `sm_company` (
  `id` bigint(20) NOT NULL,
  `oa_id` bigint(20) DEFAULT NULL,
  `c_pid` bigint(20) DEFAULT NULL COMMENT '上级单位',
  `c_name` varchar(20) NOT NULL COMMENT '单位名称',
  `c_type` int(1) NOT NULL COMMENT '类型 0:供应商 1:分销商 2:管理公司 3:分销系统公司',
  `c_address` varchar(50) NOT NULL COMMENT '地址',
  `c_no` varchar(20) NOT NULL COMMENT '编号',
  `c_fax` varchar(45) DEFAULT NULL COMMENT '传真',
  `c_country` varchar(45) DEFAULT NULL COMMENT '国家',
  `c_group` varchar(45) DEFAULT NULL COMMENT '大区',
  `c_province` varchar(45) NOT NULL COMMENT '省份',
  `c_city` varchar(45) NOT NULL COMMENT '城市',
  `c_area` varchar(45) NOT NULL COMMENT '区域',
  `c_settlement` tinyint(1) NOT NULL COMMENT '独立结算方式 0:是 1:否',
  `c_product_type` varchar(45) DEFAULT NULL COMMENT '产品类型',
  `c_charge_name` varchar(45) NOT NULL COMMENT '负责人姓名',
  `c_sevice_phone` varchar(45) DEFAULT NULL COMMENT '页面上的  应急电话',
  `c_tel` varchar(45) NOT NULL COMMENT '手机号码',
  `c_phone` varchar(45) DEFAULT NULL COMMENT '电话号码',
  `c_introduce` varchar(2000) DEFAULT NULL COMMENT '单位简介',
  `c_logo` varchar(255) DEFAULT NULL COMMENT 'logo图片地址',
  `c_seal` varchar(255) DEFAULT NULL COMMENT '电子印章图片地址',
  `c_idcard` varchar(45) DEFAULT NULL,
  `c_idcard_front` varchar(255) DEFAULT NULL,
  `c_idcard_back` varchar(255) DEFAULT NULL,
  `c_license_code` varchar(50) DEFAULT NULL COMMENT '营业执照号码',
  `c_license` varchar(255) DEFAULT NULL,
  `c_open_account` tinyint(1) DEFAULT NULL COMMENT '是否开户 0:开户 1:未开户',
  `c_reason` varchar(500) DEFAULT NULL COMMENT '原因',
  `c_status` int(1) NOT NULL COMMENT '状态 0:待审核 1:审核通过 2:审核不通过',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  `c_pids` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_name` (`c_pid`,`c_type`),
  KEY `sm_company_d_pids_index` (`c_pids`(20)),
  KEY `sm_company_oa_id_index` (`oa_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='供应商/分销商单位表';

-- ----------------------------
-- Table structure for sm_company_setting
-- ----------------------------
DROP TABLE IF EXISTS `sm_company_setting`;
CREATE TABLE `sm_company_setting` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `cs_company_id` bigint(20) NOT NULL COMMENT '单位ID',
  `cs_bank_rate` decimal(5,2) DEFAULT NULL COMMENT '网银支付手续费（%）',
  `cs_qr_rate` decimal(5,2) DEFAULT NULL COMMENT '二维码支付手续费（%）',
  `cs_settlement` int(1) DEFAULT NULL COMMENT '结算类型0:按付款日 1:按出团日',
  `cs_settlement_rate` decimal(5,2) DEFAULT NULL COMMENT '结算费率',
  `cs_cycle` int(2) DEFAULT NULL COMMENT '结算周期 0,1,3,5,7,15,30',
  `cs_invoice_edit` tinyint(1) DEFAULT NULL COMMENT '是否允许分销商编辑发票抬头0:可以 1:不可以',
  `cs_qr` tinyint(1) DEFAULT NULL COMMENT '是否开启二维码支付 0:开启 1:不开启',
  `cs_amount` int(11) DEFAULT NULL COMMENT '合并金额数量 500,3000,5000,10000,20000,30000,50000,100000',
  `cs_sort_by` tinyint(1) DEFAULT NULL COMMENT '出团计划排序 0:订单排序 1:座位号排序',
  `cs_stop_day` int(11) DEFAULT NULL COMMENT '班车停售设置 出发前N天',
  `cs_stop_time` time DEFAULT NULL COMMENT '班车停售设置 停售时分',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_name` (`cs_company_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='单位设置表';

-- ----------------------------
-- Table structure for sm_contract_template_info
-- ----------------------------
DROP TABLE IF EXISTS `sm_contract_template_info`;
CREATE TABLE `sm_contract_template_info` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `template_title` varchar(255) NOT NULL COMMENT '模板标题',
  `template_no` char(32) NOT NULL COMMENT '模板编号',
  `company_id` bigint(20) DEFAULT NULL COMMENT '公司id',
  `create_user` bigint(20) DEFAULT NULL COMMENT '创建人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8 COMMENT='生成合同的模板信息表';

-- ----------------------------
-- Table structure for sm_department
-- ----------------------------
DROP TABLE IF EXISTS `sm_department`;
CREATE TABLE `sm_department` (
  `id` bigint(20) NOT NULL,
  `oa_id` bigint(20) DEFAULT NULL,
  `company_id` bigint(20) NOT NULL,
  `d_pid` bigint(20) DEFAULT '0' COMMENT '父部门',
  `d_no` varchar(50) NOT NULL COMMENT '编号',
  `d_nick_name` varchar(50) DEFAULT NULL COMMENT '部门昵称',
  `d_name` varchar(50) DEFAULT NULL COMMENT '部门名称',
  `d_phone` varchar(45) DEFAULT NULL COMMENT '电话',
  `d_fax` varchar(45) DEFAULT NULL COMMENT '传真',
  `d_introduce` varchar(1000) DEFAULT NULL COMMENT '简介',
  `d_level` int(1) DEFAULT NULL COMMENT '层级1:一级 2:二级 3：三级 4:四级 5:五级',
  `d_status` int(1) NOT NULL COMMENT '状态 0:有效 1:无效',
  `d_type` tinyint(4) NOT NULL DEFAULT '0' COMMENT '0:销售部， 1：非销售',
  `d_leader` bigint(20) DEFAULT NULL COMMENT '部门指导员',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  `d_pids` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_name` (`company_id`),
  KEY `sm_department_d_pids_index` (`d_pids`(20)),
  KEY `sm_department_oa_id_index` (`oa_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='部门表';

-- ----------------------------
-- Table structure for sm_dictionaries
-- ----------------------------
DROP TABLE IF EXISTS `sm_dictionaries`;
CREATE TABLE `sm_dictionaries` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `company_id` bigint(20) NOT NULL,
  `d_name` varchar(50) NOT NULL COMMENT '名称',
  `d_group_id` bigint(20) NOT NULL COMMENT '分组ID',
  `d_pid` bigint(20) DEFAULT NULL COMMENT '上级项目',
  `d_sort` int(11) DEFAULT NULL COMMENT '排序',
  `d_status` int(1) NOT NULL COMMENT '状态 0:有效 1:无效',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index` (`company_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=243 DEFAULT CHARSET=utf8 COMMENT='字典表';

-- ----------------------------
-- Table structure for sm_dictionaries_group
-- ----------------------------
DROP TABLE IF EXISTS `sm_dictionaries_group`;
CREATE TABLE `sm_dictionaries_group` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `dg_name` varchar(50) NOT NULL COMMENT '分组名称',
  `dg_level` int(1) NOT NULL COMMENT '级别等级0:非系统级 1:系统级',
  `dg_sort` int(11) DEFAULT NULL,
  `dg_status` int(1) NOT NULL COMMENT '状态 0:有效 1:无效',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=251 DEFAULT CHARSET=utf8 COMMENT='字典分组';

-- ----------------------------
-- Table structure for sm_keys
-- ----------------------------
DROP TABLE IF EXISTS `sm_keys`;
CREATE TABLE `sm_keys` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `company_id` bigint(20) NOT NULL COMMENT '所属公司ID',
  `k_name` varchar(45) NOT NULL COMMENT '关键词名称',
  `k_color` varchar(45) NOT NULL COMMENT '颜色',
  `l_sort` int(11) DEFAULT NULL COMMENT '排序',
  `k_status` int(1) NOT NULL COMMENT '状态 0:有效 1:无效',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_name` (`company_id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8 COMMENT='产品关键词表';

-- ----------------------------
-- Table structure for sm_label
-- ----------------------------
DROP TABLE IF EXISTS `sm_label`;
CREATE TABLE `sm_label` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `company_id` bigint(20) NOT NULL,
  `l_name` varchar(45) DEFAULT NULL COMMENT '标签名称',
  `l_module_id` bigint(20) DEFAULT NULL COMMENT '所属模块ID',
  `l_group_id` bigint(20) DEFAULT NULL COMMENT '分组ID',
  `l_sort` int(11) DEFAULT NULL COMMENT '排序',
  `l_color` varchar(45) NOT NULL COMMENT '颜色',
  `l_status` int(1) NOT NULL COMMENT '状态 0:有效 1:无效',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_name` (`l_group_id`,`l_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='标签管理';

-- ----------------------------
-- Table structure for sm_label_group
-- ----------------------------
DROP TABLE IF EXISTS `sm_label_group`;
CREATE TABLE `sm_label_group` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `company_id` bigint(20) NOT NULL,
  `lg_name` varchar(45) NOT NULL COMMENT '分组名',
  `lg_pid` bigint(20) NOT NULL COMMENT '父ID',
  `lg_status` int(1) NOT NULL COMMENT '状态 0:有效 1:无效',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COMMENT='标签组管理';

-- ----------------------------
-- Table structure for sm_market_area
-- ----------------------------
DROP TABLE IF EXISTS `sm_market_area`;
CREATE TABLE `sm_market_area` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `ma_company_id` bigint(20) NOT NULL,
  `ma_province` varchar(45) DEFAULT NULL,
  `ma_city` varchar(45) NOT NULL,
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_name` (`ma_company_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6123 DEFAULT CHARSET=utf8 COMMENT='投放市场表';

-- ----------------------------
-- Table structure for sm_module
-- ----------------------------
DROP TABLE IF EXISTS `sm_module`;
CREATE TABLE `sm_module` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `m_name` varchar(45) NOT NULL COMMENT '模块名称',
  `m_img` varchar(250) DEFAULT NULL COMMENT '图片地址',
  `m_en_name` varchar(45) NOT NULL COMMENT '模块英文名称',
  `m_operation` varchar(45) DEFAULT NULL,
  `m_type` int(1) NOT NULL COMMENT '类型 0:一级菜单 1:二级菜单 2:三级菜单 3:选项卡 4:按钮 5:链接',
  `m_pid` int(11) NOT NULL COMMENT '上一级ID',
  `m_url` varchar(250) NOT NULL COMMENT '请求地址',
  `m_mode` int(1) NOT NULL COMMENT '0:post 1:get',
  `m_sort` int(11) DEFAULT NULL,
  `m_status` int(1) NOT NULL COMMENT '状态 0:有效 1:无效',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_name` (`m_type`,`m_pid`,`m_status`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8 COMMENT='系统模块管理';

-- ----------------------------
-- Table structure for sm_news
-- ----------------------------
DROP TABLE IF EXISTS `sm_news`;
CREATE TABLE `sm_news` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `n_title` varchar(50) NOT NULL COMMENT '文章标题',
  `n_type` int(1) NOT NULL COMMENT '类型1:资讯 2:公告',
  `n_recommend` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否推荐0:否 1:是',
  `n_status` int(1) NOT NULL COMMENT '状态 0:发布 1:隐藏 2:删除',
  `n_keys` varchar(100) DEFAULT NULL COMMENT '关键词',
  `n_content` longtext COMMENT '内容',
  `n_sort` int(11) DEFAULT NULL COMMENT '排序',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_title` (`n_title`) USING BTREE,
  KEY `index_keys` (`n_keys`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='资讯表';

-- ----------------------------
-- Table structure for sm_product_keys
-- ----------------------------
DROP TABLE IF EXISTS `sm_product_keys`;
CREATE TABLE `sm_product_keys` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `pk_key_id` bigint(20) DEFAULT NULL,
  `pk_product_id` bigint(20) NOT NULL,
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_product_id` (`pk_product_id`) USING BTREE,
  KEY `index_key_id` (`pk_key_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for sm_role_module
-- ----------------------------
DROP TABLE IF EXISTS `sm_role_module`;
CREATE TABLE `sm_role_module` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `rm_role_id` bigint(20) NOT NULL COMMENT '角色ID',
  `rm_module_id` bigint(20) NOT NULL COMMENT '模块ID',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5399 DEFAULT CHARSET=utf8 COMMENT='角色权限';

-- ----------------------------
-- Table structure for sm_roles
-- ----------------------------
DROP TABLE IF EXISTS `sm_roles`;
CREATE TABLE `sm_roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `r_role_name` varchar(45) NOT NULL COMMENT '角色名称',
  `r_remark` varchar(200) DEFAULT NULL COMMENT '备注',
  `r_type` int(1) NOT NULL COMMENT '类型 0:普通类型 1:系统固定类型（管理员）2:超级管理员',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=90 DEFAULT CHARSET=utf8 COMMENT='角色表';

-- ----------------------------
-- Table structure for sm_sign_contract_info
-- ----------------------------
DROP TABLE IF EXISTS `sm_sign_contract_info`;
CREATE TABLE `sm_sign_contract_info` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `order_no` char(22) DEFAULT NULL COMMENT '订单编号',
  `contract_no` char(32) DEFAULT NULL COMMENT '合同编号',
  `template_no` char(32) DEFAULT NULL COMMENT '模板编号',
  `view_pdf_url` varchar(255) DEFAULT NULL COMMENT '合同查看地址',
  `download_url` varchar(255) DEFAULT NULL COMMENT '合同下载地址',
  `is_company_sigin` tinyint(4) DEFAULT '0' COMMENT '公司是否签署(0:否;1:是)',
  `company_sign_contract_time` datetime DEFAULT NULL COMMENT '公司签署合同时间',
  `company_sign_contract_transition_no` char(30) DEFAULT NULL COMMENT '公司签署合同交易号',
  `is_customer_sign` tinyint(4) DEFAULT '0' COMMENT '游客是否签署(0:否;1:是)',
  `customer_sign_contract_time` datetime DEFAULT NULL COMMENT '游客签署合同时间',
  `customer_sign_contract_transition_no` char(30) DEFAULT NULL COMMENT '游客签署合同交易号',
  `customer_ca_no` char(32) DEFAULT NULL COMMENT '游客CA编号',
  `status` tinyint(4) DEFAULT '0' COMMENT '合同状态(0:待审核;1:未通过审核;2通过审核;3:合同已归档）',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `sm_sign_contract_info_order_no_id_pk` (`order_no`,`id`)
) ENGINE=InnoDB AUTO_INCREMENT=353 DEFAULT CHARSET=utf8 COMMENT='合同签署信息表';

-- ----------------------------
-- Table structure for sm_user
-- ----------------------------
DROP TABLE IF EXISTS `sm_user`;
CREATE TABLE `sm_user` (
  `id` bigint(20) NOT NULL,
  `oa_id` bigint(20) DEFAULT NULL,
  `u_account` varchar(100) NOT NULL COMMENT '用户名',
  `u_password` varchar(45) NOT NULL COMMENT '密码',
  `u_wx_openid` varchar(100) DEFAULT NULL COMMENT '微信openid',
  `u_wx_name` varchar(100) DEFAULT NULL COMMENT '微信昵称',
  `u_no` varchar(100) DEFAULT NULL COMMENT '员工编号',
  `u_level` int(1) DEFAULT NULL COMMENT '分佣等级1:一级 2:二级 3:三级',
  `u_pid` varchar(100) DEFAULT NULL COMMENT '上级的微信openid',
  `u_uid` varchar(50) DEFAULT NULL COMMENT '分销系统用户ID',
  `u_puserid` bigint(20) DEFAULT NULL COMMENT '尚品销售上级用户ID',
  `u_real_name` varchar(45) NOT NULL COMMENT '真实名称',
  `u_pym` varchar(45) DEFAULT NULL COMMENT '拼音码',
  `company_id` bigint(20) NOT NULL COMMENT '所属单位',
  `u_department_id` bigint(20) DEFAULT NULL COMMENT '所属部门',
  `u_charge_type` int(1) NOT NULL DEFAULT '0' COMMENT '负责人标识，0：不是负责人，1：是负责人',
  `u_dtype` int(1) DEFAULT '0' COMMENT '部门内类型0:普通代理人 2:法人\n 3:法人+部门领导\n 4:部门领导',
  `u_data_limit` int(1) NOT NULL COMMENT '数据级别0:用户级 1:部门级2:单位级3:系统级',
  `u_role_id` bigint(20) NOT NULL COMMENT '角色ID',
  `u_type` int(1) NOT NULL COMMENT '用户区分0:非销售类员工1:销售类员工',
  `u_stype` int(1) NOT NULL COMMENT '用户销售类型 0:非销售类 1:销售类 2:签约人员 3:路人甲',
  `u_position_id` bigint(20) DEFAULT NULL COMMENT '员工岗位ID',
  `u_post` varchar(45) DEFAULT NULL COMMENT '岗位职务',
  `u_address` varchar(200) DEFAULT NULL COMMENT '地址',
  `u_tel` varchar(45) NOT NULL COMMENT '手机号码',
  `u_idcard` varchar(45) DEFAULT NULL COMMENT '身份证号码',
  `u_sex` tinyint(1) DEFAULT NULL COMMENT '性别0:男 1:女',
  `u_birthday` datetime DEFAULT NULL COMMENT '生日',
  `u_degree` int(1) DEFAULT NULL COMMENT '文化程度',
  `u_political` int(1) DEFAULT NULL COMMENT '政治面貌',
  `u_phone` varchar(45) DEFAULT NULL COMMENT '电话',
  `u_fax` varchar(45) DEFAULT NULL COMMENT '传真',
  `u_qq` varchar(45) DEFAULT NULL,
  `u_email` varchar(45) DEFAULT NULL,
  `u_contacts` varchar(45) DEFAULT NULL COMMENT '联系人',
  `u_contacts_phone` varchar(45) DEFAULT NULL COMMENT '联系电话',
  `u_remark` varchar(200) DEFAULT NULL COMMENT '备注',
  `u_last_login` datetime DEFAULT NULL COMMENT '最后登录时间',
  `u_pic` varchar(255) DEFAULT NULL COMMENT '头像地址',
  `u_status` int(1) NOT NULL COMMENT '状态 0:有效 1:无效 2:锁定',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_company_id` (`company_id`) USING BTREE,
  KEY `index_department_id` (`u_department_id`) USING BTREE,
  KEY `index_account` (`u_account`) USING BTREE,
  KEY `index_tel` (`u_tel`) USING BTREE,
  KEY `index_idcard` (`u_idcard`) USING BTREE,
  KEY `sm_user_oa_id_index` (`oa_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户表';

-- ----------------------------
-- Table structure for sm_user_group
-- ----------------------------
DROP TABLE IF EXISTS `sm_user_group`;
CREATE TABLE `sm_user_group` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `u_account` varchar(100) DEFAULT NULL COMMENT '用户账号',
  `g_no` varchar(50) DEFAULT '' COMMENT '虚拟分组编号',
  `create_user` bigint(20) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3885 DEFAULT CHARSET=utf8 COMMENT='用户-虚拟分组表';

-- ----------------------------
-- Table structure for sm_user_role
-- ----------------------------
DROP TABLE IF EXISTS `sm_user_role`;
CREATE TABLE `sm_user_role` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `ur_role_id` bigint(20) NOT NULL COMMENT '关联的角色ID',
  `ur_user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `ur_role_name` varchar(45) NOT NULL COMMENT '角色名称',
  `ur_remark` varchar(200) DEFAULT NULL COMMENT '角色说明',
  `ur_role_content` longtext NOT NULL COMMENT '角色内容JSON串',
  `ur_role_content_array` longtext NOT NULL COMMENT '权限字符串逗号隔开',
  `ur_sort` int(11) DEFAULT NULL COMMENT '排序',
  `ur_status` int(1) NOT NULL COMMENT '状态 0:有效 1:无效',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=904 DEFAULT CHARSET=utf8 COMMENT='用户角色表';

-- ----------------------------
-- Table structure for sr_activity
-- ----------------------------
DROP TABLE IF EXISTS `sr_activity`;
CREATE TABLE `sr_activity` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `a_company_id` bigint(20) NOT NULL COMMENT '公司ID',
  `a_activity_name` varchar(45) NOT NULL COMMENT '活动名称',
  `a_brand_name` varchar(45) NOT NULL COMMENT '品牌名称',
  `a_activity_type` int(1) NOT NULL COMMENT '活动类型 0:百分比 1:定额（每单）2:定额（每人）',
  `a_amount` decimal(10,2) NOT NULL COMMENT '活动金额',
  `a_limit_amount` decimal(10,2) DEFAULT NULL COMMENT '最大限制金额',
  `a_pay_method` int(1) NOT NULL COMMENT '支付方式 0:在线支付 1:信用支付 2:线下支付',
  `a_ticket_type` int(1) NOT NULL COMMENT '票价类型 0:成人票 1:儿童票 2:套票',
  `a_start_time` date NOT NULL COMMENT '活动开始时间',
  `a_end_time` date NOT NULL COMMENT '活动结束时间',
  `a_schedule_start` date NOT NULL COMMENT '班期开始时间',
  `a_schedule_end` date NOT NULL COMMENT '班期截止时间',
  `a_status` int(1) NOT NULL COMMENT '状态 0:有效 1:无效',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=ucs2 COMMENT='活动表';

-- ----------------------------
-- Table structure for sr_activity_area
-- ----------------------------
DROP TABLE IF EXISTS `sr_activity_area`;
CREATE TABLE `sr_activity_area` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `aa_activity_id` bigint(20) NOT NULL,
  `aa_country` varchar(45) NOT NULL COMMENT '国家',
  `aa_province` varchar(45) NOT NULL COMMENT '省份',
  `aa_city` varchar(45) NOT NULL COMMENT '城市',
  `aa_area` varchar(45) DEFAULT NULL COMMENT '区域',
  `aa_recommend` tinyint(1) NOT NULL COMMENT '主推',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=ucs2 COMMENT='投放范围表';

-- ----------------------------
-- Table structure for sr_activity_product
-- ----------------------------
DROP TABLE IF EXISTS `sr_activity_product`;
CREATE TABLE `sr_activity_product` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `ap_activity_id` bigint(20) NOT NULL COMMENT '活动ID',
  `ap_product_id` bigint(20) NOT NULL COMMENT '产品ID',
  `ap_recommend` tinyint(1) NOT NULL COMMENT '推荐',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=ucs2 COMMENT='活动产品表';

-- ----------------------------
-- Table structure for sr_album
-- ----------------------------
DROP TABLE IF EXISTS `sr_album`;
CREATE TABLE `sr_album` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `company_id` bigint(20) NOT NULL COMMENT '公司',
  `a_city` varchar(45) NOT NULL COMMENT '所属城市',
  `a_type` int(1) NOT NULL COMMENT '类型 0:酒店 1:景点',
  `a_pid` bigint(20) NOT NULL COMMENT '酒店ID景点ID',
  `a_name` varchar(45) NOT NULL COMMENT '相册名称 默认为景点名称',
  `a_status` int(1) NOT NULL COMMENT '状态 0:有效 1:无效',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_name` (`company_id`,`a_type`),
  KEY `index_pid` (`a_pid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=249 DEFAULT CHARSET=utf8 COMMENT='相册管理表';

-- ----------------------------
-- Table structure for sr_departure
-- ----------------------------
DROP TABLE IF EXISTS `sr_departure`;
CREATE TABLE `sr_departure` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `company_id` bigint(20) NOT NULL COMMENT '所属公司ID',
  `d_name` varchar(20) NOT NULL COMMENT '站点名称',
  `d_type` int(1) NOT NULL COMMENT '类型 0:始发站 1:顺路站 2:班车站',
  `d_traffic` int(1) NOT NULL COMMENT '交通类别 0:飞机 1:火车 2:汽车 3:邮轮',
  `d_pym` varchar(20) DEFAULT NULL,
  `d_three` varchar(3) DEFAULT NULL COMMENT '三字码',
  `d_country` varchar(45) NOT NULL COMMENT '国家',
  `d_province` varchar(45) NOT NULL COMMENT '省份',
  `d_city` varchar(45) NOT NULL COMMENT '城市',
  `d_area` varchar(45) NOT NULL COMMENT '区域',
  `d_mapx` varchar(20) DEFAULT NULL COMMENT '百度维度',
  `d_mapy` varchar(20) DEFAULT NULL COMMENT '百度精度',
  `d_status` int(1) NOT NULL COMMENT '状态 0:有效 1:无效',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_name` (`company_id`,`d_type`)
) ENGINE=InnoDB AUTO_INCREMENT=182 DEFAULT CHARSET=utf8 COMMENT='始发站/出发地管理';

-- ----------------------------
-- Table structure for sr_hotel
-- ----------------------------
DROP TABLE IF EXISTS `sr_hotel`;
CREATE TABLE `sr_hotel` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `company_id` bigint(20) NOT NULL COMMENT '所属公司ID',
  `h_name` varchar(20) NOT NULL COMMENT '酒店名称',
  `h_short_name` varchar(10) DEFAULT NULL COMMENT '酒店简称',
  `h_pym` varchar(45) DEFAULT NULL COMMENT '拼音码',
  `h_country` varchar(45) NOT NULL COMMENT '国家',
  `h_province` varchar(45) NOT NULL COMMENT '省份',
  `h_city` varchar(45) NOT NULL COMMENT '城市',
  `h_area` varchar(45) NOT NULL COMMENT '区域',
  `h_adress` varchar(255) DEFAULT NULL COMMENT '详细地址',
  `h_additional` varchar(255) DEFAULT NULL COMMENT '附加属性',
  `h_level` varchar(45) NOT NULL COMMENT '等级',
  `h_introduce` varchar(255) DEFAULT NULL COMMENT '简介',
  `h_mapx` varchar(20) DEFAULT NULL COMMENT '百度维度',
  `h_mapy` varchar(20) DEFAULT NULL COMMENT '百度精度',
  `h_status` int(1) NOT NULL COMMENT '状态 0:有效 1:无效',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_name` (`company_id`,`h_status`)
) ENGINE=InnoDB AUTO_INCREMENT=106 DEFAULT CHARSET=utf8 COMMENT='酒店表';

-- ----------------------------
-- Table structure for sr_scenic_spot
-- ----------------------------
DROP TABLE IF EXISTS `sr_scenic_spot`;
CREATE TABLE `sr_scenic_spot` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `company_id` bigint(20) NOT NULL COMMENT '所属公司ID',
  `s_name` varchar(20) NOT NULL COMMENT '景点名称',
  `s_sort_name` varchar(10) DEFAULT NULL COMMENT '简称',
  `s_pym` varchar(45) DEFAULT NULL COMMENT '拼音码',
  `s_sort` bigint(20) DEFAULT NULL COMMENT '排序',
  `s_phone` varchar(45) DEFAULT NULL,
  `s_attribute` int(1) NOT NULL COMMENT '景区属性 0:热门景区1:常去景区2:其他景区3:特色表演',
  `s_country` varchar(45) NOT NULL COMMENT '国家',
  `s_province` varchar(45) NOT NULL COMMENT '省份',
  `s_city` varchar(45) NOT NULL COMMENT '城市',
  `s_area` varchar(45) NOT NULL COMMENT '区域',
  `s_adress` varchar(255) DEFAULT NULL COMMENT '详细地址',
  `s_additional` varchar(255) DEFAULT NULL COMMENT '附加属性',
  `s_start_time` time DEFAULT NULL,
  `s_end_time` time DEFAULT NULL,
  `s_level` varchar(45) NOT NULL COMMENT '景点等级',
  `s_introduce` varchar(600) DEFAULT NULL,
  `s_detail` longtext,
  `s_mapx` varchar(20) DEFAULT NULL COMMENT '百度维度',
  `s_mapy` varchar(20) DEFAULT NULL COMMENT '百度精度',
  `s_custom_place` varchar(45) NOT NULL COMMENT '自定义目的地',
  `s_status` int(1) NOT NULL COMMENT '状态 0:有效 1:无效',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_name` (`company_id`,`s_status`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8 COMMENT='景点管理表';

-- ----------------------------
-- Table structure for sr_shuttle_bus
-- ----------------------------
DROP TABLE IF EXISTS `sr_shuttle_bus`;
CREATE TABLE `sr_shuttle_bus` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `sb_shuttle_stop_id` bigint(20) DEFAULT NULL COMMENT '班车站ID/顺路站ID',
  `sb_departure_id` bigint(20) DEFAULT NULL COMMENT '始发站',
  `sb_time` time DEFAULT NULL COMMENT '发车时间',
  `sb_traffic` int(1) NOT NULL COMMENT '交通类别 0:飞机 1:火车 2:汽车 3:邮轮',
  `sb_return` tinyint(1) DEFAULT NULL COMMENT '往返0去程 1返程',
  `sb_time_length` int(2) DEFAULT NULL COMMENT '时差(分钟)',
  `sb_price` decimal(5,2) DEFAULT NULL COMMENT '接送价格',
  `sb_start_point` varchar(45) DEFAULT NULL COMMENT '起(终)点站',
  `sb_start_time` datetime DEFAULT NULL,
  `sb_end_time` datetime DEFAULT NULL,
  `sb_effect_week` varchar(7) DEFAULT NULL COMMENT '生效周几',
  `sb_status` int(1) NOT NULL DEFAULT '0' COMMENT '状态 0:有效 1:无效',
  `create_time` datetime DEFAULT NULL,
  `create_user` bigint(20) DEFAULT NULL,
  `update_time` datetime DEFAULT NULL,
  `update_user` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_name` (`sb_shuttle_stop_id`,`sb_status`),
  KEY `index_departure_id` (`sb_departure_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8 COMMENT='班车管理表';

-- ----------------------------
-- Table structure for t_oa_company_cache
-- ----------------------------
DROP TABLE IF EXISTS `t_oa_company_cache`;
CREATE TABLE `t_oa_company_cache` (
  `id` bigint(20) NOT NULL DEFAULT '0',
  `name` varchar(255) DEFAULT NULL COMMENT '名称',
  `code` varchar(50) DEFAULT NULL COMMENT '编码',
  `short_name` varchar(100) DEFAULT NULL COMMENT '简称',
  `parent_id` bigint(20) DEFAULT NULL COMMENT '父ID',
  `action` varchar(50) DEFAULT NULL,
  `company_id` bigint(20) DEFAULT NULL,
  `last_change_date` varchar(50) DEFAULT NULL,
  `canceled` varchar(50) DEFAULT NULL,
  `action_status` tinyint(1) DEFAULT '0' COMMENT '是否有修改, 0无变化，1、新增 2、修改 、3删除',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='OA组织缓存表';

-- ----------------------------
-- Table structure for t_oa_dept_cache
-- ----------------------------
DROP TABLE IF EXISTS `t_oa_dept_cache`;
CREATE TABLE `t_oa_dept_cache` (
  `id` bigint(20) NOT NULL DEFAULT '0',
  `name` varchar(255) DEFAULT NULL COMMENT '名称',
  `code` varchar(50) DEFAULT NULL COMMENT '编码',
  `short_name` varchar(100) DEFAULT NULL COMMENT '简称',
  `parent_id` bigint(20) DEFAULT NULL COMMENT '父ID',
  `action` varchar(50) DEFAULT NULL,
  `company_id` bigint(20) DEFAULT NULL,
  `last_change_date` varchar(50) DEFAULT NULL,
  `canceled` varchar(50) DEFAULT NULL,
  `action_status` tinyint(1) DEFAULT '0' COMMENT '是否有修改, 0无变化，1、新增 2、修改 、3删除',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='OA部门缓存表';

-- ----------------------------
-- Table structure for t_oa_position_cache
-- ----------------------------
DROP TABLE IF EXISTS `t_oa_position_cache`;
CREATE TABLE `t_oa_position_cache` (
  `id` bigint(20) NOT NULL DEFAULT '0',
  `name` varchar(255) DEFAULT NULL COMMENT '名称',
  `code` varchar(50) DEFAULT NULL COMMENT '编码',
  `short_name` varchar(100) DEFAULT NULL COMMENT '简称',
  `parent_id` bigint(20) DEFAULT NULL COMMENT '父ID',
  `company_id` bigint(20) DEFAULT NULL COMMENT '公司ID',
  `department_id` bigint(20) DEFAULT NULL COMMENT '部门ID',
  `action` varchar(50) DEFAULT NULL,
  `last_change_date` varchar(50) DEFAULT NULL,
  `canceled` varchar(50) DEFAULT NULL,
  `action_status` tinyint(1) DEFAULT '0' COMMENT '是否有修改, 0无变化，1、新增 2、修改 、3删除',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `native_position_id` bigint(20) DEFAULT NULL COMMENT 'OA职位ID',
  `native_position_name` varchar(50) DEFAULT NULL COMMENT 'OA职位名称',
  `data_limit` tinyint(1) NOT NULL DEFAULT '2',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='OA职位缓存表';

-- ----------------------------
-- Table structure for t_oa_user_cache
-- ----------------------------
DROP TABLE IF EXISTS `t_oa_user_cache`;
CREATE TABLE `t_oa_user_cache` (
  `id` bigint(20) NOT NULL DEFAULT '0',
  `name` varchar(255) DEFAULT NULL COMMENT '名称',
  `code` varchar(50) DEFAULT NULL COMMENT '编码',
  `short_name` varchar(100) DEFAULT NULL COMMENT '简称',
  `parent_id` bigint(20) DEFAULT NULL COMMENT '父ID',
  `company_id` bigint(20) DEFAULT NULL COMMENT '公司ID',
  `position_id` bigint(20) DEFAULT NULL,
  `department_id` bigint(20) DEFAULT NULL COMMENT '部门ID',
  `org_position_id` bigint(20) DEFAULT NULL COMMENT '虚拟的岗位ID',
  `mobile` varchar(50) DEFAULT NULL COMMENT '手机号',
  `login_password` varchar(50) DEFAULT NULL COMMENT '密码',
  `status` tinyint(1) DEFAULT '0' COMMENT '员工状态',
  `action` varchar(50) DEFAULT NULL,
  `last_change_date` varchar(50) DEFAULT NULL,
  `canceled` varchar(50) DEFAULT NULL,
  `action_status` tinyint(1) DEFAULT '0' COMMENT '是否有修改, 0无变化，1、新增 2、修改 、3删除',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='OA用户缓存表';

-- ----------------------------
-- View structure for shangpinSum
-- ----------------------------
DROP VIEW IF EXISTS `shangpinSum`;
CREATE ALGORITHM=UNDEFINED DEFINER=`sp_user`@`%` SQL SECURITY DEFINER VIEW `shangpinSum` AS select `sp_db`.`shang_pin`.`id` AS `id`,`sp_db`.`shang_pin`.`product_mingcheng` AS `migncheng`,`sp_db`.`shang_pin`.`product_fenlei` AS `fenlei`,`sp_db`.`shang_pin`.`product_maijia` AS `maijia`,`sp_db`.`shang_pin`.`product_jinjia` AS `jinjia`,`sp_db`.`shang_pin`.`creat_date` AS `date` from `shang_pin` ;

-- ----------------------------
-- Function structure for getChildList
-- ----------------------------
DROP FUNCTION IF EXISTS `getChildList`;
DELIMITER ;;
CREATE DEFINER=`sp_user`@`%` FUNCTION `getChildList`(rootId INT) RETURNS varchar(1000) CHARSET utf8
BEGIN
	DECLARE sTemp VARCHAR(1000);
    DECLARE sTempChd VARCHAR(1000);

    SET sTemp = '$';
    SET sTempChd =cast(rootId as CHAR);

    WHILE sTempChd is not null DO
    	SET sTemp = concat(sTemp,',',sTempChd);
        SELECT group_concat(id) INTO sTempChd FROM  sm_department where FIND_IN_SET(d_pid,sTempChd)>0;
   	END WHILE;
    RETURN sTemp; 
END
;;
DELIMITER ;

-- ----------------------------
-- Function structure for getCompanyChildList
-- ----------------------------
DROP FUNCTION IF EXISTS `getCompanyChildList`;
DELIMITER ;;
CREATE DEFINER=`sp_user`@`%` FUNCTION `getCompanyChildList`(rootId VARCHAR(100)) RETURNS varchar(1000) CHARSET utf8
BEGIN
    DECLARE sTemp VARCHAR(1000);
    DECLARE sTempChd VARCHAR(1000);

    SET sTemp = '$';
    SET sTempChd =cast(rootId as CHAR);

    WHILE sTempChd is not null DO
      SET sTemp = concat(sTemp,',',sTempChd);
      SELECT group_concat(id) INTO sTempChd FROM  sm_company where FIND_IN_SET(c_pid,sTempChd)>0 ;
    END WHILE;
    RETURN sTemp;
  END
;;
DELIMITER ;

-- ----------------------------
-- Function structure for getCompanyLevelIds
-- ----------------------------
DROP FUNCTION IF EXISTS `getCompanyLevelIds`;
DELIMITER ;;
CREATE DEFINER=`sp_user`@`%` FUNCTION `getCompanyLevelIds`(ids BIGINT(20), max_level TINYINT) RETURNS varchar(100) CHARSET utf8
BEGIN
    DECLARE result VARCHAR(200) DEFAULT concat(ids,'-');
    DECLARE pid BIGINT(20);
    DECLARE num INT DEFAULT 0;
    DECLARE newId BIGINT(20) DEFAULT NULL;


    SELECT c_pid
    INTO pid
    FROM sm_company
    WHERE id = ids;
    IF pid = 0 OR pid IS NULL
    THEN
      RETURN result;
    END IF;

    getpid: LOOP
      SELECT
        c_pid,
        id
      INTO pid, newId
      FROM sm_company
      WHERE id = pid;
      IF newId IS NULL
      THEN
        RETURN concat('id=', pid, '的单位不存在~');
      END IF;

      SET result = concat(newId, '-', result);

      IF pid = 0 OR pid IS NULL
      THEN
        LEAVE getpid;
      END IF;

      IF num = max_level
      THEN
        LEAVE getpid;
      END IF;
      SET num = num + 1;
      SET ids = newId;
      SET newId = NULL;

    END LOOP getpid;
    RETURN result;
  END
;;
DELIMITER ;

-- ----------------------------
-- Function structure for getDepartmentLevelIds
-- ----------------------------
DROP FUNCTION IF EXISTS `getDepartmentLevelIds`;
DELIMITER ;;
CREATE DEFINER=`sp_user`@`%` FUNCTION `getDepartmentLevelIds`(ids BIGINT, max_level TINYINT) RETURNS varchar(100) CHARSET utf8
BEGIN
    DECLARE result VARCHAR(200) DEFAULT concat(ids,'-');
    DECLARE pid BIGINT(20);
    DECLARE num INT DEFAULT 0;
    DECLARE newId BIGINT(20) DEFAULT NULL;


    SELECT d_pid INTO pid from sm_department WHERE id = ids;
    IF pid = 0 OR pid IS NULL THEN
      RETURN result;
    END IF;

    getpid: LOOP
      SELECT d_pid,id INTO pid,newId from sm_department WHERE id = pid;
      IF newId IS NULL THEN
        RETURN concat('id=',pid,'的部门不存在~');
      END IF ;

      SET result = concat(newId,'-',result);

      IF pid = 0 OR pid IS NULL THEN
        LEAVE getpid;
      END IF ;

      IF num = max_level THEN
        LEAVE getpid;
      END IF ;
      SET num = num+1;
      SET ids = newId;
      SET newId = NULL;

    END LOOP getpid;
    RETURN result;
  END
;;
DELIMITER ;

-- ----------------------------
-- Function structure for getFirstAgent
-- ----------------------------
DROP FUNCTION IF EXISTS `getFirstAgent`;
DELIMITER ;;
CREATE DEFINER=`sp_user`@`%` FUNCTION `getFirstAgent`(wxid VARCHAR(32)) RETURNS varchar(100) CHARSET utf8
BEGIN
    DECLARE result VARCHAR(200) DEFAULT '';
    DECLARE pid VARCHAR(32);
    DECLARE num INT DEFAULT 0;

    getpid: LOOP
      SELECT u_pid,u_wx_openid INTO pid,wxid FROM sm_user WHERE u_wx_openid = wxid ;
      IF pid is NULL THEN
        LEAVE getpid;
      END IF ;
      set result = pid;
      IF wxid = pid THEN
        LEAVE getpid;
      END IF ;
      IF num = 10 THEN
        LEAVE getpid;
      END IF ;
      SET num = num+1;
      set wxid = pid;
    END LOOP getpid;
    RETURN result;
  END
;;
DELIMITER ;

-- ----------------------------
-- Function structure for getFirstLevelAgent
-- ----------------------------
DROP FUNCTION IF EXISTS `getFirstLevelAgent`;
DELIMITER ;;
CREATE DEFINER=`sp_user`@`%` FUNCTION `getFirstLevelAgent`(wxid VARCHAR(32)) RETURNS bigint(20)
BEGIN
    DECLARE result BIGINT(20) DEFAULT NULL;
    DECLARE pid VARCHAR(32);
    DECLARE num INT DEFAULT 0;
    DECLARE ids VARCHAR(32);

    getpid: LOOP
      SELECT u_pid,u_wx_openid,id INTO pid,wxid,ids FROM sm_user WHERE u_wx_openid = wxid ;
      IF pid is NULL THEN
        LEAVE getpid;
      END IF ;
      set result = ids;
      IF wxid = pid THEN
        LEAVE getpid;
      END IF ;
      IF num = 10 THEN
        LEAVE getpid;
      END IF ;
      SET num = num+1;
      set wxid = pid;
    END LOOP getpid;
    RETURN result;
  END
;;
DELIMITER ;

-- ----------------------------
-- Function structure for getFirstLevelAgentById
-- ----------------------------
DROP FUNCTION IF EXISTS `getFirstLevelAgentById`;
DELIMITER ;;
CREATE DEFINER=`sp_user`@`%` FUNCTION `getFirstLevelAgentById`(ids BIGINT) RETURNS bigint(20)
BEGIN
    DECLARE result BIGINT(20) DEFAULT NULL;
    DECLARE pid VARCHAR(32);
    DECLARE num INT DEFAULT 0;
    DECLARE wxid VARCHAR(32);
    SELECT u_wx_openid,u_pid INTO wxid,pid FROM sm_user WHERE id = ids limit 1;
    IF wxid is NULL THEN
      RETURN result;
    END IF ;
    IF wxid = pid THEN
      set result = ids;
      RETURN result;
    END IF ;
    getpid: LOOP
      SELECT u_pid,u_wx_openid,id INTO pid,wxid,ids FROM sm_user WHERE u_wx_openid = wxid and u_stype != 3 limit 1;
      IF pid is NULL THEN
        LEAVE getpid;
      END IF ;
      set result = ids;
      IF wxid = pid THEN
        LEAVE getpid;
      END IF ;
      IF num = 10 THEN
        LEAVE getpid;
      END IF ;
      SET num = num+1;
      set wxid = pid;
    END LOOP getpid;
    RETURN result;

  END
;;
DELIMITER ;

-- ----------------------------
-- Function structure for getModuleChildList
-- ----------------------------
DROP FUNCTION IF EXISTS `getModuleChildList`;
DELIMITER ;;
CREATE DEFINER=`sp_user`@`%` FUNCTION `getModuleChildList`(rootId VARCHAR(100)) RETURNS varchar(1000) CHARSET utf8
BEGIN
    DECLARE sTemp VARCHAR(1000);
    DECLARE sTempChd VARCHAR(1000);

    SET sTemp = '$';
    SET sTempChd =cast(rootId as CHAR);

    WHILE sTempChd is not null DO
      SET sTemp = concat(sTemp,',',sTempChd);
      SELECT group_concat(id) INTO sTempChd FROM  sm_module where FIND_IN_SET(m_pid,sTempChd)>0 ;
    END WHILE;
    RETURN sTemp;
  END
;;
DELIMITER ;

-- ----------------------------
-- Function structure for getParentList
-- ----------------------------
DROP FUNCTION IF EXISTS `getParentList`;
DELIMITER ;;
CREATE DEFINER=`sp_user`@`%` FUNCTION `getParentList`(rootId INT) RETURNS varchar(1000) CHARSET utf8
BEGIN
	DECLARE sTemp VARCHAR(1000);
	DECLARE sTempPar VARCHAR(1000); 
	SET sTemp = ''; 
	SET sTempPar =rootId; 
	
	#循环递归
	WHILE sTempPar is not null DO 
		#判断是否是第一个，不加的话第一个会为空
		IF sTemp != '' THEN
			SET sTemp = concat(sTemp,',',sTempPar);
		ELSE
			SET sTemp = sTempPar;
		END IF;

		SET sTemp = concat(sTemp,',',sTempPar); 
		SELECT group_concat(d_pid) INTO sTempPar FROM sm_department where d_pid<>id and FIND_IN_SET(id,sTempPar)>0; 
	END WHILE; 
	
RETURN sTemp; 
END
;;
DELIMITER ;

-- ----------------------------
-- Function structure for getPidList
-- ----------------------------
DROP FUNCTION IF EXISTS `getPidList`;
DELIMITER ;;
CREATE DEFINER=`sp_user`@`%` FUNCTION `getPidList`(wxid VARCHAR(32)) RETURNS varchar(100) CHARSET utf8
BEGIN
    DECLARE result VARCHAR(200) DEFAULT '';
    DECLARE pid VARCHAR(32);
    DECLARE ids VARCHAR(32);
    DECLARE num INT DEFAULT 0;
    getpid: LOOP
      SELECT id,u_pid,u_wx_openid INTO ids,pid,wxid FROM sm_user WHERE u_wx_openid = wxid ;
      IF ids is NULL OR wxid IS NULL OR pid IS NULL THEN
        LEAVE getpid;
      END IF ;
      set result = CONCAT(ids,'-',result);
      IF wxid = pid THEN
        LEAVE getpid;
      END IF ;
      IF num = 10 THEN
        LEAVE getpid;
      END IF ;
      SET num = num+1;
    set wxid = pid;
  END LOOP getpid;
    RETURN result;
  END
;;
DELIMITER ;

-- ----------------------------
-- Function structure for getProductMinTicket
-- ----------------------------
DROP FUNCTION IF EXISTS `getProductMinTicket`;
DELIMITER ;;
CREATE DEFINER=`sp_user`@`%` FUNCTION `getProductMinTicket`(pid BIGINT) RETURNS decimal(10,2)
BEGIN

	DECLARE ticketPrice decimal(10,2);
	SET ticketPrice=0.00;

	SELECT MIN(t.t_market_price) price INTO ticketPrice
	FROM ct_ticket t
	WHERE 
			t.t_product_id= pid 
	AND t.t_status = 0
	AND t.t_category=6
	AND t.t_type =0;

  IF ticketPrice IS NOT NULL THEN
		RETURN ticketPrice;
 	END IF;

	SELECT MIN(t.t_market_price) price INTO ticketPrice
		FROM ct_ticket t
		WHERE 
				t.t_product_id= pid 
		AND t.t_status = 0
		AND t.t_type =0;

  IF ticketPrice IS NOT null THEN
		RETURN ticketPrice;
 	END IF;

	SELECT MIN(t.t_market_price) price INTO ticketPrice
	FROM ct_ticket t
	WHERE 
			t.t_product_id= pid 
	AND t.t_status = 0
	AND t.t_type =1;	

  RETURN ticketPrice;
END
;;
DELIMITER ;

-- ----------------------------
-- Function structure for getProductMinTicketBycompany
-- ----------------------------
DROP FUNCTION IF EXISTS `getProductMinTicketBycompany`;
DELIMITER ;;
CREATE DEFINER=`sp_user`@`%` FUNCTION `getProductMinTicketBycompany`(  pid  BIGINT,companyId  BIGINT) RETURNS decimal(10,2)
BEGIN

DECLARE  ticketPrice  decimal(10,2);
SET  ticketPrice=0.00;

IF companyId IS NULL THEN

	SELECT  MIN(t.t_market_price)  price  INTO  ticketPrice
	FROM  ct_ticket  t
	WHERE  
	t.t_product_id=  pid  
	AND  t.t_status  =  0
	AND  t.t_category=6
	AND  t.t_type  =0;

			IF  ticketPrice  IS  NOT  NULL  THEN
	RETURN  ticketPrice;
		END  IF;

	SELECT  MIN(t.t_market_price)  price  INTO  ticketPrice
	FROM  ct_ticket  t
	WHERE  
	t.t_product_id=  pid  
	AND  t.t_status  =  0
	AND  t.t_type  =0;

			IF  ticketPrice  IS  NOT  null  THEN
	RETURN  ticketPrice;
		END  IF;

	SELECT  MIN(t.t_market_price)  price  INTO  ticketPrice
	FROM  ct_ticket  t
	WHERE  
	t.t_product_id=  pid  
	AND  t.t_status  =  0
	AND  t.t_type  =1;
 
ELSE
	SELECT  MIN(t.t_market_price)  price  INTO  ticketPrice
	FROM  ct_ticket  t
	WHERE  
	t.t_product_id=  pid 
	AND  t.t_company_id = companyId
	AND  t.t_status  =  0
	AND  t.t_category=6
	AND  t.t_type  =0;

			IF  ticketPrice  IS  NOT  NULL  THEN
	RETURN  ticketPrice;
		END  IF;

	SELECT  MIN(t.t_market_price)  price  INTO  ticketPrice
	FROM  ct_ticket  t
	WHERE  
	t.t_product_id=  pid  
	AND  t.t_company_id = companyId
	AND  t.t_status  =  0
	AND  t.t_type  =0;

			IF  ticketPrice  IS  NOT  null  THEN
	RETURN  ticketPrice;
		END  IF;

	SELECT  MIN(t.t_market_price)  price  INTO  ticketPrice
	FROM  ct_ticket  t
	WHERE  
	t.t_product_id=  pid  
	AND  t.t_company_id = companyId
	AND  t.t_status  =  0
	AND  t.t_type  =1;
END IF;	

    RETURN  ticketPrice;
END
;;
DELIMITER ;

-- ----------------------------
-- Function structure for getUserChildList
-- ----------------------------
DROP FUNCTION IF EXISTS `getUserChildList`;
DELIMITER ;;
CREATE DEFINER=`sp_user`@`%` FUNCTION `getUserChildList`(rootId VARCHAR(100)) RETURNS varchar(3000) CHARSET utf8
BEGIN
    DECLARE sTemp VARCHAR(3000);
    DECLARE sTempChd VARCHAR(3000);

    SET sTemp = '$';
    SET sTempChd =cast(rootId as CHAR);

    WHILE sTempChd is not null DO
      SET sTemp = concat(sTemp,',',sTempChd);
      SELECT group_concat(u_wx_openid) INTO sTempChd FROM  sm_user where FIND_IN_SET(u_pid,sTempChd)>0 and u_wx_openid != rootId;
    END WHILE;
    RETURN sTemp;
  END
;;
DELIMITER ;
