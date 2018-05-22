create table sl_order_neg
(
	id bigint not null
		primary key,
	order_id bigint not null comment '原订单id',
	neg_order_id bigint null comment '负订单id',
	type int(1) null comment '类型：1-退票，2-改签',
	create_user bigint null,
	create_time datetime null
)
comment '负订单记录'
;
create index sl_order_neg_neg_order_id_index
	on sl_order_neg (neg_order_id)
;
create index sl_order_neg_order_id_index
	on sl_order_neg (order_id)
;
ALTER TABLE sl_order_neg MODIFY id BIGINT(20) NOT NULL AUTO_INCREMENT;

ALTER TABLE sl_order ADD order_neg_id BIGINT NULL COMMENT '负订单记录id（非空表示该订单是负订单）';
ALTER TABLE sl_order MODIFY alter_ticket_id BIGINT(20) COMMENT '改签记录id（非空表示该订单是改签生成的订单）';
ALTER TABLE sl_order ADD src_order_id BIGINT NULL COMMENT '源订单id';
ALTER TABLE sl_order_tourist ADD ot_ext_status INT(1) DEFAULT 0 NULL COMMENT '0-正常，1-退票，2-改签';
ALTER TABLE sl_order_tourist
  MODIFY COLUMN ot_ext_status INT(1) DEFAULT 0 COMMENT '0-正常，1-退票，2-改签' AFTER ot_status;


ALTER TABLE sl_order_alter_ticket_record ADD neg_order_id BIGINT NULL COMMENT '负订单id';
ALTER TABLE sl_order_alter_ticket_record
  MODIFY COLUMN neg_order_id BIGINT COMMENT '负订单id' AFTER new_order_id;

CREATE INDEX sl_order_alter_ticket_record_order_id_index ON sl_order_alter_ticket_record (order_id);
CREATE INDEX sl_order_alter_ticket_record_new_order_id_index ON sl_order_alter_ticket_record (new_order_id);
CREATE INDEX sl_order_alter_ticket_record_neg_order_id_index ON sl_order_alter_ticket_record (neg_order_id);
CREATE INDEX sl_order_alter_ticket_record_target_schedule_id_index ON sl_order_alter_ticket_record (target_schedule_id);

CREATE INDEX sl_order_alter_ticket_id_index ON sl_order (alter_ticket_id);
CREATE INDEX sl_order_order_neg_id_index ON sl_order (order_neg_id);
CREATE INDEX sl_order_src_order_id_index ON sl_order (src_order_id);

ALTER TABLE sl_order_neg ADD neg_order_no VARCHAR(45) NOT NULL COMMENT '负订单编号';
ALTER TABLE sl_order_neg
  MODIFY COLUMN neg_order_no VARCHAR(45) NOT NULL COMMENT '负订单编号' AFTER neg_order_id;

 ALTER TABLE sl_order_neg MODIFY neg_order_no VARCHAR(45) COMMENT '负订单编号';
 ALTER TABLE sl_order_alter_ticket_record MODIFY new_order_no VARCHAR(45);
ALTER TABLE sl_order_alter_ticket_record MODIFY neg_order_no VARCHAR(45);