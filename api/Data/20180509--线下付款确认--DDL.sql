ALTER TABLE `sl_order_offline`
ADD COLUMN `upload_time`  datetime NOT NULL DEFAULT now() COMMENT '支付时间' AFTER `type`;