#产品线路配置表加字段
ALTER TABLE ct_product_extends 
ADD COLUMN `pe_retiree` LONGTEXT COMMENT '退休人员' AFTER pe_visa,
 ADD COLUMN `pe_professional` LONGTEXT COMMENT '自由职业者',
 ADD COLUMN `pe_preschool` LONGTEXT COMMENT '学前儿童',
 ADD COLUMN `pe_student` LONGTEXT COMMENT '在校学生',
 ADD COLUMN `pe_jobless` LONGTEXT COMMENT '无业人员',
 ADD COLUMN `pe_staff` LONGTEXT COMMENT '在职员工',
 ADD COLUMN `pe_cost_remark` LONGTEXT COMMENT '费用说明'
;
ALTER TABLE `ct_product`
ADD COLUMN `p_destination_location`  int(1) NOT NULL DEFAULT 0 COMMENT '0:国内，1国外' AFTER `p_destination_pym`,
ADD COLUMN `p_destination_region`  varchar(30) NULL DEFAULT NULL COMMENT '省/洲' AFTER `p_destination_location`,
ADD COLUMN `p_destination_area`  varchar(30) NULL DEFAULT NULL COMMENT '市/国家' AFTER `p_destination_region`;


ALTER TABLE ct_schedule_setting MODIFY departure_status TINYINT(4) DEFAULT -1 COMMENT '出发状态：-1：待确认出行 0:待发团 1：发团中 2：已结团 3：已回团 4：已取消';
create table sl_order_tourist_confirm
(
  id bigint auto_increment
    primary key,
  tourist_id BIGINT NOT NULL COMMENT '原游客id',
  ot_order_id bigint not null comment '对应订单ID',
  ot_ticket_id bigint null comment '票种ID',
  ot_ticket_type int(1) not null comment '票类型0:单票 1:套票',
  ot_type int(1) not null comment '票价类型 0:成人票 1:儿童票',
  ot_name varchar(45) not null comment '游客姓名',
  ot_phone varchar(45) null,
  ot_licence_type int(1) not null comment '证件类型 0:身份证 1:护照 2:军官证 3:回乡证 4:台胞证 5:国际海员证 6:港澳通行证 7:赴台证 8:其他',
  ot_lincese varchar(45) null comment '证件信息',
  ot_rep int(1) default '0' null comment '是否游客代表:0-否，1-是',
  ot_leave_id bigint not null comment '出发站id（如果是始发站则指向departure，如果不是则指向shuttle_bus）',
  ot_leave_type tinyint(3) not null comment '去程区分 类型 0:始发站 1:顺路站 2:班车站',
  ot_leave_price decimal(10,2) not null,
  ot_return_id bigint not null comment '返回站id（如果是始发站则指向departure，如果不是则指向shuttle_bus）',
  ot_return_type tinyint(3) not null comment '返程区分 类型 0:始发站 1:顺路站 2:班车站',
  ot_return_price decimal(10,2) not null,
  ot_status int(1) default '0' null comment '游客状态 0: 有效 1 :无效',
  ot_ext_status int(1) default '0' null comment '0-未确认，1-退票，2-改签 ，3- 已经确认',
  ot_cancel_reason varchar(20) null comment '取消原因',
  create_time datetime null,
  create_user bigint null,
  update_time datetime null,
  update_user bigint null
)
  comment '游客确认表'
;

ALTER TABLE ct_schedule_setting ADD confirm_time DATETIME NULL;
ALTER TABLE ct_schedule_setting
  MODIFY COLUMN confirm_time DATETIME AFTER cancel_time;
