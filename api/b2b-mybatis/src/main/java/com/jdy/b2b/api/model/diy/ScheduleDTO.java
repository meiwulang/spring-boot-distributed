package com.jdy.b2b.api.model.diy;

import com.jdy.b2b.api.model.Schedule;

/**
 * @Description
 * @Author yyf
 * @DateTime 2017/8/10 10:03
 */
public class ScheduleDTO extends Schedule {

    private Integer sSeatLeft;
    private Integer tStock;
    

    public Integer gettStock() {
		return tStock;
	}


	public void settStock(Integer tStock) {
		this.tStock = tStock;
	}


	/*余座=总数-已售*/
    public Integer getsSeatLeft() {
        Integer sold = this.getsSeatSold() == null ? Integer.valueOf(0) : this.getsSeatSold();
        Integer total = this.getsSeatTotal();
        return total == null ? null : (total - sold);
    }

}
