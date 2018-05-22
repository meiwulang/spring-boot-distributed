ALTER TABLE `ct_product`
ADD COLUMN `p_contacts_en`  varchar(20) NOT NULL DEFAULT '' COMMENT '产品经理英文' AFTER `p_type`,
ADD COLUMN `p_creative_officer_cn`  varchar(20) NOT NULL DEFAULT '' COMMENT '创意总监中文' AFTER `p_contacts`,
ADD COLUMN `p_creative_officer_en`  varchar(20) NOT NULL DEFAULT '' COMMENT '创意总监英文' AFTER `p_creative_officer_cn`,
ADD COLUMN `p_topic_cn`  varchar(100) NOT NULL DEFAULT '' COMMENT '主题中文' AFTER `p_creative_officer_en`,
ADD COLUMN `p_topic_en`  varchar(100) NOT NULL DEFAULT '' COMMENT '主题英文' AFTER `p_topic_cn`;