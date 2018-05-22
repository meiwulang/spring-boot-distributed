#门票和合同模板关系表
CREATE TABLE `ct_admission_contract_template` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `pid` bigint(20) NOT NULL COMMENT '门票id',
  `t_id` bigint(20) NOT NULL COMMENT '合同模板id',
  `create_user` bigint(20) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_pid` (`pid`) USING BTREE,
  KEY `idx_tid` (`t_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8 COMMENT='门票和合同模板关系表';
#门票价格信息
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='门票价格信息';
#门票生产记录 (需求不要了)
-- CREATE TABLE `ct_admission_produce` (
--   `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
--   `produce_no` varchar(50) NOT NULL DEFAULT '' COMMENT '生产批次号:',
--   `produce_num` int(11) NOT NULL DEFAULT '0' COMMENT '数量',
--   `life_end_date` date DEFAULT NULL COMMENT '生效日期',
--   `life_start_date` date DEFAULT NULL COMMENT '失效日期',
--   `remark` varchar(30) NOT NULL DEFAULT '' COMMENT '说明',
--   `pid` bigint(20) NOT NULL COMMENT '门票id',
--   `a_status` int(1) NOT NULL DEFAULT '0' COMMENT '生产状态 0:正常 1:暂停 2:已删除',
--   `p_status` int(1) NOT NULL DEFAULT '0' COMMENT '销售状态 0:已上架 1:已下架',
--   `create_user` bigint(20) DEFAULT NULL COMMENT '创建者',
--   `create_time` datetime DEFAULT NULL COMMENT '创建时间',
--   `update_time` datetime DEFAULT NULL COMMENT '更新时间',
--   `update_user` bigint(20) DEFAULT NULL COMMENT '更新者',
--   PRIMARY KEY (`id`)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='门票生产记录';

#门票产品基本信息
DROP TABLE if EXISTS ct_admission_base;
CREATE TABLE ct_admission_base
(
    id BIGINT PRIMARY KEY COMMENT '门票产品id' AUTO_INCREMENT,
    ticket_product_code VARCHAR(20) COMMENT '编码',
    ticket_product_name VARCHAR(20) COMMENT '门票产品名称',
    ticket_product_type TINYINT(1) COMMENT '1:成人票 0：儿童票',
    picture VARCHAR(500) COMMENT '图片地址',
    product_manager BIGINT COMMENT '产品经理id',
    admissions TEXT COMMENT '入园须知',
    cost_include VARCHAR(300) COMMENT '费用包含',
    reservation_rule VARCHAR(300) COMMENT '预定规则',
    refund_rules VARCHAR(300) COMMENT '退票规则',
    explanation VARCHAR(300) COMMENT '补充说明',
    Attractions TEXT COMMENT '景点介绍',
    admission_status TINYINT NOT NULL DEFAULT 0 COMMENT '0:无效（未完成设置） 1：设置完成 2：申报 3：申报失败 4：申报成功  -1：删除',
    creater_time DATETIME,
    creater_user BIGINT
);
ALTER TABLE ct_admission_base COMMENT = '门票产品基本信息';
#门票价格信息
DROP TABLE IF EXISTS ct_admission_sale_price;
CREATE TABLE `ct_admission_sale_price` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `pid` bigint(20) NOT NULL COMMENT '门票id',
  `ap_name`varchar(30) NOT NULL DEFAULT '' COMMENT '票价名称',
  `ap_type` INT(1) DEFAULT '0' COMMENT '票价类型 0:单票,1:套票',
  `suit_region` VARCHAR(3) DEFAULT '100' COMMENT '用三位数字字符标识票价时段,每位可选值0,1，其中 0表示未选中，1表示选中;\n3位依次标识:平日,周末,节假日；例如 111表示三个都选中',
  `workday_cost_price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '平日成本价 ',
  `workday_sale_price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '平日出厂价 ',
  `weekend_cost_price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '周末成本价 ',
  `weekend_sale_price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '周末出厂价 ',
  `festival_cost_price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '节假日成本价 ',
  `festival_sale_price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '节假日出厂价 ',
  `ap_stock`INT(6) NOT NULL DEFAULT '-1' COMMENT '库存'; 
  `life_end_date` date DEFAULT NULL COMMENT '生效日期',
  `life_start_date` date DEFAULT NULL COMMENT '失效日期',
  `remark` varchar(30) NOT NULL DEFAULT '' COMMENT '说明',
  `supplier` varchar(30) NOT NULL DEFAULT '' COMMENT '供应商',
  `supplier_tel` varchar(30) NOT NULL DEFAULT '' COMMENT '供应商电话',
  `create_user` bigint(20) DEFAULT NULL COMMENT '创建者',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `update_user` bigint(20) DEFAULT NULL COMMENT '更新者',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='门票销售价格信息';
#修改门价表字段
ALTER TABLE ct_admission_sale_price 
MODIFY COLUMN `remark` varchar(120) NOT NULL DEFAULT '' COMMENT '说明';
ALTER TABLE ct_admission_sale_price
add COLUMN ad_status int(1) DEFAULT '0' COMMENT '0:有效,1:无效' AFTER supplier_tel;
ALTER TABLE ct_admission_sale_price 
 ADD COLUMN `workday_factory_price` DECIMAL (10, 2) NOT NULL DEFAULT '0.00' COMMENT '平日出厂价 ',
 ADD COLUMN `weekend_factory_price` DECIMAL (10, 2) NOT NULL DEFAULT '0.00' COMMENT '周末出厂价 ',
 ADD COLUMN `festival_factory_price` DECIMAL (10, 2) NOT NULL DEFAULT '0.00' COMMENT '节假日出厂价 ';
ALTER TABLE `ct_admission_sale_price`
MODIFY COLUMN `workday_sale_price`  decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT '平日销售价 ' AFTER `workday_cost_price`,
MODIFY COLUMN `weekend_sale_price`  decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT '周末销售价 ' AFTER `weekend_cost_price`,
MODIFY COLUMN `festival_sale_price`  decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT '节假日销售价 ' AFTER `festival_cost_price`;