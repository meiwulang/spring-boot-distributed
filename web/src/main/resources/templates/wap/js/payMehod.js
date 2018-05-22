 var date = new Date();
 var _TimeStamp = String(date.getFullYear()) + (date.getMonth()+1) + date.getDate() + date.getHours();
 $("#footer").load("index_footer.html?t="+_TimeStamp);
 $("#payQuestion").load("pay_questionModal.html?t="+_TimeStamp);