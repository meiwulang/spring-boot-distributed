package com.jdy.b2b.api.common;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by pengmd on 2016/7/29.
 */
public class Page<T> implements Serializable {
	private static final long serialVersionUID = 4074681918722882686L;
	private Integer pageSize;
	private Integer currPage;
	private Integer totalPage;
	private Integer rowNum;
	private Integer pageCount;

	private List<T> list = new ArrayList<T>();

	public List<T> getList() {
		return list;
	}

	public void setList(List<T> list) {
		this.list = list;
	}

	public Integer getPageSize() {
		return null == pageSize ? 10 : pageSize;
	}

	public void setPageSize(Integer pageSize) {
		this.pageSize = pageSize;
	}

	public Integer getCurrPage() {
		return null == currPage ? 0 : currPage;
	}

	public void setCurrPage(Integer currPage) {
		this.currPage = currPage;
	}

	public Integer getTotalPage() {
		return totalPage;
	}

	public void setTotalPage(Integer totalPage) {
		this.totalPage = totalPage;
	}

	public Integer getRowNum() {
		return rowNum;
	}

	public void setRowNum(Integer rowNum) {
		this.rowNum = rowNum;
	}

	public Integer getPageCount() {
		return pageCount;
	}

	public void setPageCount(Integer pageCount) {
		this.pageCount = pageCount;
	}

	@Override
	public String toString() {
		return String.format(
				"Page {pageSize=%s, currPage=%s, totalPage=%s, rowNum=%s, pageCount=%s}",
				pageSize, currPage, totalPage, rowNum, pageCount);
	}

}
