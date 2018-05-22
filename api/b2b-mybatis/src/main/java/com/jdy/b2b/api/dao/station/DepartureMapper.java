package com.jdy.b2b.api.dao.station;

import java.util.List;
import java.util.Set;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.jdy.b2b.api.model.station.Departure;

@Mapper
public interface DepartureMapper {
	int deleteByPrimaryKey(Long id);

	int insert(Departure record);

	int insertSelective(Departure record);

	Departure selectByPrimaryKey(Long id);

	int updateByPrimaryKeySelective(Departure record);

	int updateByPrimaryKey(Departure record);

	/**
	 * @Description: 查询列表
	 * @author 王斌
	 * @date 2017年7月13日 上午10:39:09
	 * @param sp
	 * @return
	 */
	List<Departure> queryList(@Param("departure") Departure record,
			@Param("companyIds") List<Long> companyIds);

	/**
	 * @Description: 查询始发站列表
	 * @author 王斌
	 * @date 2017年7月13日 上午10:39:09
	 * @param sp
	 * @return
	 */
	List<Departure> queryListForBegin(
			@Param("companyIds") List<Long> companyIds,
			@Param("departure") Departure departure);

	/**
	 * @Description: 查询列表总数
	 * @author 王斌
	 * @date 2017年7月13日 上午10:39:34
	 * @param sp
	 * @return
	 */
	int queryListCount(@Param("companyIds") List<Long> companyIds,
			@Param("departure") Departure departure);

	/**
	 * @Description: 精确查询
	 * @author 王斌
	 * @date 2017年7月17日 上午11:58:16
	 * @param departure
	 */
	List<Departure> queryDeparture(Departure departure);

	/**
	 * @Description: 列表
	 * @author 王斌
	 * @date 2017年7月17日 下午8:30:04
	 * @param vo
	 */
	List<Departure> queryListForTicket(@Param("departure") Departure departure,
			@Param("citys") List<String> citys,
			@Param("companyIds") List<Long> companyIds);

	/**
	 * @Description: 总数
	 * @author 王斌
	 * @date 2017年7月17日 下午8:30:04
	 * @param vo
	 */
	int queryListForTicketCount(@Param("departure") Departure departure,
			@Param("citys") List<String> citys,
			@Param("companyIds") List<Long> companyIds);

	List<Long> queryManagerConpanyIds();

    List<Long> selectOldDepartureList(List<Long> list);

	List<Departure> selectNowDepartureList(Long id);

	List<Departure> selectListByIdList(List<Long> oldDepartureIdList);

    Departure selectByEntity(Departure d);
}