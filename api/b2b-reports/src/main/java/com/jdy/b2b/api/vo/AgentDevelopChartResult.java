package com.jdy.b2b.api.vo;


import java.util.List;

public class AgentDevelopChartResult {
	private List<String> dateStringList;
	private List<Integer> todayAgentList;
	private List<Integer> allAgentList;

	public List<String> getDateStringList() {
		return dateStringList;
	}

	public void setDateStringList(List<String> dateStringList) {
		this.dateStringList = dateStringList;
	}

	public List<Integer> getTodayAgentList() {
		return todayAgentList;
	}

	public void setTodayAgentList(List<Integer> todayAgentList) {
		this.todayAgentList = todayAgentList;
	}

	public List<Integer> getAllAgentList() {
		return allAgentList;
	}

	public void setAllAgentList(List<Integer> allAgentList) {
		this.allAgentList = allAgentList;
	}
}
