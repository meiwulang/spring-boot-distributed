$.fn.showprice = function(data,right,top,direc){
	var createHtml = function(){
		var html = 	'<div class="price-table" style="right:'+(right - 125)+'px; top:'+top+'px;"><div class="price-wrap">';
				if (direc) {
					html += '<i class="fa fa-caret-left"></i>';
				} else{
					html += '<i class="fa fa-caret-up"></i>';
				}
				
				html += '<table>'+
							'<thead>'+
								'<tr>'+
									'<th>&nbsp&nbsp票价名称</th>'+
									'<th>门市价</th>';
			if( _uinfo && _uinfo.u_id ){
				html +=				'<th class="t_price" style="display:none">同行价</th>'+
									'<th class="t_price" style="display:none">佣金</th>';
			}

			html +=					'<th>退房差</th>'+
									'<th>补房差</th>';
			
			html +=				'</tr>'+
							'</thead>'+
							'<tbody>';
		for(var i in data){
			if(data[i].t_out_room_price == null || data[i].t_spread_price == null){
				html += '<tr>'+
						'<td class="clearfloat">';
					if (data[i].t_preset_type == '成人票') {
						html += '<div class="adult" title="'+data[i].t_preset_type+'"></div>';
					} else if (data[i].t_preset_type == '儿童票') {
						html += '<div class="children" title="'+data[i].t_preset_type+'"></div>';
					} else if (data[i].t_preset_type == '套票') {
						html += '<div class="family" title="'+data[i].t_preset_type+'"></div>';
					}
						

						html += '<div title="'+data[i].t_standards_name+'">'+ data[i].t_standards_name +'</div></td>'+
						'<td>￥'+ data[i].t_price +'&nbsp</td>';
				if( _uinfo && _uinfo.u_id ){
					html +=	'<td class="t_price" style="display:none">￥'+ data[i].t_trade_price +'</td>'+
							'<td class="color-green t_price" style="display:none">￥'+ (data[i].t_price - data[i].t_trade_price).toFixed(2) +'</td>';
				};
				html +=	'<td>— —</td>'+
						'<td>— —</td>';
			}else{
			
			html += '<tr>'+
						'<td class="clearfloat">';

						if (data[i].t_preset_type == '成人票') {
							html += '<div class="adult" title="'+data[i].t_preset_type+'"></div>';
						} else if (data[i].t_preset_type == '儿童票') {
							html += '<div class="children" title="'+data[i].t_preset_type+'"></div>';
						} else if (data[i].t_preset_type == '套票') {
							html += '<div class="family" title="'+data[i].t_preset_type+'"></div>';
						}

						html += '<div title="'+data[i].t_standards_name+'">'+ data[i].t_standards_name +'</div></td>'+
						'<td>￥'+ data[i].t_price +'</td>';
			if( _uinfo && _uinfo.u_id ){
				html +=	'<td class="t_price" style="display:none">￥'+ data[i].t_trade_price +'</td>'+
						'<td class="color-green t_price" style="display:none">￥'+ (data[i].t_price - data[i].t_trade_price).toFixed(2) +'</td>';
			};			
				html +=	'<td>￥'+ data[i].t_out_room_price +'</td>'+
						'<td>￥'+ data[i].t_spread_price +'&nbsp</td>';
			}
			
			html +=	'</tr>';
		}

		html += '</tbody></table></div></div>';
		return html;
	}
	if( data ){
		var html = createHtml();
		$(this).append(html);
		$(".price-table table").each(function(){
			if($(this).find("tbody tr").length < 1){
				$(this).parent().remove();
			}
		})
	}
}