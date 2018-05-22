package com.jdy.b2b.web.pojo.order;

import java.beans.BeanInfo;
import java.beans.Introspector;
import java.beans.PropertyDescriptor;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * @Description 数据库实体基类
 * @author 王斌
 * @date 2017年7月3日 下午12:56:23
 * @version V1.0
 */
public class BaseDO {
	private Long userId;// 用户编号
	private Integer startNum = 0;
	private Integer currPage = 0;
	private Integer pageSize = 20;
	private List<Map<String, String>> orderFields;// 排序字段集合
	protected Date createTime;
	protected Date updateTime;
	protected Long companyId;
	protected Long updateUser;
	protected Long createUser;

	public void calc() {
		currPage = currPage > 0 ? currPage - 1 : 0;
		startNum = currPage * pageSize;
		if (startNum < 0) {
			startNum = 0;
		}
	}

	public Integer getCurrPage() {
		return currPage;
	}

	public void setCurrPage(Integer currPage) {
		this.currPage = currPage;
	}

	public Integer getStartNum() {
		return startNum;
	}

	public void setStartNum(Integer startNum) {
		this.startNum = startNum;
	}

	public Integer getPageSize() {
		return pageSize;
	}

	public void setPageSize(Integer pageSize) {
		this.pageSize = pageSize;
	}

	/**
	 * @Description: 将null属性给个默认值
	 * @date 2017年7月4日 下午4:29:46
	 */
	/**
	 * @Description: TODO
	 * @author 王斌
	 * @date 2017年7月17日 上午11:17:23
	 */
	public void initForClearNull() {
		// 获取当前类
		Class<?> clazz = getClass();
		try {
			// 获取bean描述
			BeanInfo beanInfo = Introspector.getBeanInfo(clazz);
			// 获取所有属性
			PropertyDescriptor[] propertyDescriptors = beanInfo
					.getPropertyDescriptors();
			// 遍历属性
			for (PropertyDescriptor propertyDescriptor : propertyDescriptors) {
				// 如果属性值为null则处理
				if (null == propertyDescriptor.getReadMethod().invoke(this)) {
					Class<?> propertyType = propertyDescriptor
							.getPropertyType();
					// 如果属性类别为数字，则初始化为0
					if (Integer.class.isAssignableFrom(propertyType)) {
						propertyDescriptor.getWriteMethod().invoke(this, 0);
					} else if (Long.class.isAssignableFrom(propertyType)) {
						propertyDescriptor.getWriteMethod().invoke(this, 0L);
					} else if (Float.class.isAssignableFrom(propertyType)) {
						propertyDescriptor.getWriteMethod().invoke(this, 0f);
					} else if (Double.class.isAssignableFrom(propertyType)) {
						propertyDescriptor.getWriteMethod().invoke(this, 0d);
					} else if (BigDecimal.class
							.isAssignableFrom(propertyType)) {
						propertyDescriptor.getWriteMethod().invoke(this,
								new BigDecimal("0.0"));
					} else if (String.class.isAssignableFrom(propertyType)) {
						// 如果属性类别为字符串，则初始化为空格
						propertyDescriptor.getWriteMethod().invoke(this, "");
					} else if (Boolean.class.isAssignableFrom(propertyType)) {
						// 如果属性类别为boolean，则初始化为false
						propertyDescriptor.getWriteMethod().invoke(this, false);
					} else if (Byte.class.isAssignableFrom(propertyType)) {
						// 如果属性类别为Byte，则初始化为0
						propertyDescriptor.getWriteMethod().invoke(this,
								(byte) 0);
					} else if (Date.class.isAssignableFrom(propertyType)) {
						// 如果属性类别为Byte，则初始化为0
						propertyDescriptor.getWriteMethod().invoke(this,
								new Date());
					}
					// 其他类型不处理
				}
			}
		} catch (Exception e) {
			throw new RuntimeException("initForClearNull failed", e);
		}
	}

	public List<Map<String, String>> getOrderFields() {
		return orderFields;
	}

	public void setOrderFields(List<Map<String, String>> orderFields) {
		this.orderFields = orderFields;
	}

	protected Date getCreateTime() {
		return createTime;
	}

	protected void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	protected Date getUpdateTime() {
		return updateTime;
	}

	protected void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}

	public Long getUpdateUser() {
		return updateUser;
	}

	public void setUpdateUser(Long updateUser) {
		this.updateUser = updateUser;
	}

	public Long getCreateUser() {
		return createUser;
	}

	public void setCreateUser(Long createUser) {
		this.createUser = createUser;
	}

	public Long getCompanyId() {
		return companyId;
	}

	public void setCompanyId(Long companyId) {
		this.companyId = companyId;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
	}

	@Override
	public String toString() {
		return "BaseDO [startNum=" + startNum + ", currPage=" + currPage
				+ ", pageSize=" + pageSize + ", orderFields=" + orderFields
				+ "]";
	}

}
