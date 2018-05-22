#刷票的库存、门市价数据
UPDATE ct_schedule s
INNER JOIN ct_schedule_ticket st ON st.st_schedule_id = s.id
INNER JOIN ct_ticket t ON t.id = st.st_ticket_id
SET st.t_stock = t.t_stock,
 st.t_market_price = t.t_market_price;