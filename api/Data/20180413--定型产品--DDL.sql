#创建 出厂价表
drop TABLE IF EXISTS ct_factory_ticket;
CREATE TABLE ct_factory_ticket
(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT,
    type TINYINT(1) COMMENT '票价类型 0:成人票 1:儿童票',
    ticket_name VARCHAR(20) COMMENT '票价名称',
    suitable_start_time DATE COMMENT '适用开始日期',
    suitable_end_time DATE COMMENT '适用结束日期',
    price DECIMAL(10,2) COMMENT '出厂价',
    introduction VARCHAR(500) COMMENT '票价简介',
    ticket_status TINYINT(1) DEFAULT 1 NOT NULL COMMENT '0:无效 1：正常 2：最新修改',
    create_time DATETIME COMMENT '创建时间',
    create_user BIGINT
);
CREATE INDEX ct_factory_ticket_product_id_index ON ct_factory_ticket (product_id);
ALTER TABLE ct_factory_ticket COMMENT = '出厂价';


#创建 出厂价和始发站关系表
drop TABLE IF EXISTS ct_factory_ticket_departure;
CREATE TABLE ct_factory_ticket_departure
(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    factory_ticket_id BIGINT COMMENT '出厂票价id',
    departure_id BIGINT COMMENT '始发站id',
    create_time DATETIME,
    create_user BIGINT
);
CREATE INDEX ct_factory_ticket_departure_factory_ticket_id_index ON ct_factory_ticket_departure (factory_ticket_id);
ALTER TABLE ct_factory_ticket_departure COMMENT = '出厂价绑定始发站';


#出厂价票和售卖票关联关系
drop TABLE IF EXISTS ct_ticket_factory_ticket;
CREATE TABLE ct_ticket_factory_ticket
(
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    ticket_id BIGINT COMMENT '票id',
    factory_ticket_id BIGINT COMMENT '出厂价票id'
);
CREATE INDEX ct_ticket_factory_ticket_ticket_id_index ON ct_ticket_factory_ticket (ticket_id);
ALTER TABLE ct_ticket_factory_ticket COMMENT = '出厂价票和售卖票关联关系';

#票表添加出厂价
ALTER TABLE ct_ticket ADD factory_price DECIMAL(10,2) NULL COMMENT '出厂价';
ALTER TABLE ct_ticket
  MODIFY COLUMN factory_price DECIMAL(10,2) COMMENT '出厂价' AFTER t_gather_price;

  #票表添加适用时间
ALTER TABLE ct_ticket ADD suitable_end_time DATE NULL;
ALTER TABLE ct_ticket ADD suitable_start_time DATE NULL;
ALTER TABLE ct_ticket
  MODIFY COLUMN suitable_start_time DATE COMMENT '适用开始时间' AFTER t_status,
  MODIFY COLUMN suitable_end_time DATE COMMENT '适用结束时间' AFTER suitable_start_time;
#修改产品表
ALTER TABLE `ct_product`
MODIFY COLUMN `p_status`  int(1) NOT NULL DEFAULT 0 COMMENT '状态 0:发布 1:无效 2:待入库（已提交） 3:入库 4:待提交' AFTER `p_from_name`;
ALTER TABLE `ct_product`
ADD COLUMN `life_start_date`  date NULL COMMENT '产品生命开始日期' AFTER `offline_sign_status`,
ADD COLUMN `life_end_date`  date NULL COMMENT '产品生命结束日期' AFTER `life_start_date`;
#修改班期票价表
ALTER TABLE `ct_schedule_ticket`
ADD COLUMN `t_market_price`  decimal(10,2) NULL COMMENT '门市价' AFTER `st_ticket_id`,
ADD COLUMN `t_stock`  int(4) NULL COMMENT '库存' AFTER `t_market_price`;
  