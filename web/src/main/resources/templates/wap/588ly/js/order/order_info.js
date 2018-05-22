var date = new Date();
var _TimeStamp = String(date.getFullYear()) + (date.getMonth()+1) + date.getDate() + date.getHours();
$("#footer").load("index_footer.html?t="+_TimeStamp);
$("#batch_fill").load("batch_fill.html?t="+_TimeStamp);
$("#select_site").load("select_siteModal.html?t="+_TimeStamp);
$("#select_rebackSite").load("select_rebackSiteModal.html?t="+_TimeStamp);
$("#select_confirmSite").load("select_confirmSiteModal.html?t="+_TimeStamp);


var p_id = GetQueryString('p_id')
var bl_id = GetQueryString('bl_id')
var  user_id = 1;
if(user_id){

if(p_id&&bl_id){
	
	getShopinfoData(p_id,bl_id)
	
	}else{
		
		window.location.href = 'product_list.html'
	 }
	 
}else{
	
	window.location.href = 'index.html?ation=login'
	}
	
$('select').comboSelect();



var all_money=0;
var all_house_money=0;
var all_bus_money=0;
var people = 0;
