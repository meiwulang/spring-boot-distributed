/*
 * Powered By [dchy-framework]
 * Web Site: http://www.fingercrm.cn
 * Since 2006 - 2016
 */

package com.jdy.b2b.api.util;

import java.io.Serializable;

/**
 * 分页工具类
 * 
 * @author zb
 * @version 1.0
 * @since 1.0
 */
@SuppressWarnings("rawtypes")
public class PageUtil implements Serializable {

	/** */
	private static final long serialVersionUID = -300539478247331106L;

	public static final int DEFAULT_PAGE_SIZE = 10;
	public static final int DEFAULT_CUR_PAGE = 1;

	/** *最精简参数*** */
	private int curPage = DEFAULT_CUR_PAGE;
	private int pageSize = DEFAULT_PAGE_SIZE;
	private int rowsCount;
	private int pageCount;

	public int getPageSize() {
		return pageSize;
	}

	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}

	public int getCurPage() {
		return curPage;
	}

	public void setCurPage(int curPage) {
		this.curPage = curPage;
	}

	public int getRowsCount() {
		return rowsCount;
	}

	public void setRowsCount(int rowsCount) {
		this.rowsCount = rowsCount;
	}

	public int getPageCount() {
		return pageCount;
	}

	public void setPageCount(int pageCount) {
		this.pageCount = pageCount;
	}

	/**
	 * 取得起始显示记录号
	 * 
	 * @return 起始显示记录号
	 */
	public int getStartNo() {
		return ((getCurPage() - 1) * getPageSize() + 1);
	}

}
